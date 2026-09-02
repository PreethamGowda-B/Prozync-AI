import { tool } from "ai";
import type { ToolContext } from "@/types";
import { stringifyRedactedError } from "@/lib/utils/error-redaction";
import {
  PerplexityApiError,
  PerplexitySearchResult,
  PerplexitySearchResponse,
  RECENCY_MAP,
  buildPerplexitySearchBody,
  formatSearchResults,
  isRetryablePerplexityStatus,
  summarizePerplexityErrorBody,
  type FormattedSearchResult,
} from "./utils/perplexity";
import { reportToolFailure } from "./tool-failure";
import {
  PERPLEXITY_QUERY_MAX_LENGTH,
  createWebSearchToolSchema,
  webSearchTool,
  type WebSearchToolInput,
} from "./schemas";

const WEB_SEARCH_MAX_ATTEMPTS = 3;
const WEB_SEARCH_RETRY_BASE_DELAY_MS = 300;
const WEB_SEARCH_RETRY_JITTER_MS = 75;
const EMPTY_QUERY_TOOL_ERROR =
  "Error performing web search: Provide at least one non-empty query.";
const QUERY_TOO_LONG_TOOL_ERROR = `Error performing web search: Each query must be ${PERPLEXITY_QUERY_MAX_LENGTH} characters or fewer.`;

const sleep = (delayMs: number, signal?: AbortSignal): Promise<void> => {
  if (delayMs <= 0) return Promise.resolve();
  if (signal?.aborted) {
    return Promise.reject(new DOMException("Operation aborted", "AbortError"));
  }

  return new Promise((resolve, reject) => {
    const cleanup = () => signal?.removeEventListener("abort", onAbort);
    const onAbort = () => {
      clearTimeout(timeout);
      cleanup();
      reject(new DOMException("Operation aborted", "AbortError"));
    };
    const timeout = setTimeout(() => {
      cleanup();
      resolve();
    }, delayMs);

    signal?.addEventListener("abort", onAbort, { once: true });
  });
};

const getRetryDelayMs = (attemptIndex: number): number => {
  const exponentialDelay =
    WEB_SEARCH_RETRY_BASE_DELAY_MS * Math.pow(2, attemptIndex);
  const jitter = Math.random() * WEB_SEARCH_RETRY_JITTER_MS;
  return Math.round(exponentialDelay + jitter);
};

/**
 * Perform web search using Jina Search API (https://s.jina.ai)
 */
async function searchWithJina(
  query: string,
  abortSignal?: AbortSignal,
): Promise<FormattedSearchResult[]> {
  const url = `https://s.jina.ai/${encodeURIComponent(query)}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Retain-Images": "none",
  };

  if (process.env.JINA_API_KEY) {
    headers["Authorization"] = `Bearer ${process.env.JINA_API_KEY}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
    signal: abortSignal,
  });

  if (!response.ok) {
    throw new Error(
      `Jina Search error: HTTP ${response.status} ${response.statusText}`,
    );
  }

  const json = await response.json();
  const data = json.data || (Array.isArray(json) ? json : []);

  return data.map((item: any) => ({
    title: item.title || item.url || "Untitled",
    url: item.url || "",
    content:
      item.description ||
      (typeof item.content === "string" ? item.content.slice(0, 1000) : ""),
    date: item.publishedTime || null,
    lastUpdated: null,
  }));
}

const normalizeSearchQueries = (
  rawQueries: string[],
): { queries: string[]; error?: string } => {
  const queries = rawQueries.map((query) => query.trim()).filter(Boolean);

  if (queries.length === 0) {
    return { queries, error: EMPTY_QUERY_TOOL_ERROR };
  }

  if (queries.some((query) => query.length > PERPLEXITY_QUERY_MAX_LENGTH)) {
    return { queries, error: QUERY_TOO_LONG_TOOL_ERROR };
  }

  return { queries: queries.slice(0, 3) };
};

export const createWebSearch = (context: ToolContext) => {
  return tool({
    ...webSearchTool,
    inputSchema: createWebSearchToolSchema({
      modelName: context.getCurrentModelName?.() ?? context.modelName,
    }).inputSchema,
    execute: async (
      { queries: rawQueries, time }: WebSearchToolInput,
      { abortSignal },
    ) => {
      try {
        const { queries, error } = normalizeSearchQueries(rawQueries);
        if (error) {
          return error;
        }

        // Use Jina Search when JINA_API_KEY is available or as primary search provider
        if (process.env.JINA_API_KEY || !process.env.PERPLEXITY_API_KEY) {
          const resultsNested = await Promise.all(
            queries.map((q) => searchWithJina(q, abortSignal)),
          );
          const allResults = resultsNested.flat();

          if (allResults.length === 0) {
            return "No web search results found for the given queries.";
          }

          return allResults;
        }

        // Fallback: Perplexity Search if PERPLEXITY_API_KEY is explicitly set
        const searchBody = buildPerplexitySearchBody(
          queries.length === 1 ? queries[0] : queries,
          {
            country: context.userLocation?.country,
            recency: time && time !== "all" ? RECENCY_MAP[time] : undefined,
          },
        );

        const response = await fetch("https://api.perplexity.ai/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY || ""}`,
          },
          body: JSON.stringify(searchBody),
          signal: abortSignal,
        });

        if (!response.ok) {
          throw new Error(
            `Perplexity API error: HTTP ${response.status} ${response.statusText}`,
          );
        }

        const searchResponse: PerplexitySearchResponse = await response.json();
        let allResults: PerplexitySearchResult[];

        if (queries.length > 1 && Array.isArray(searchResponse.results[0])) {
          allResults = (
            searchResponse.results as PerplexitySearchResult[][]
          ).flat();
        } else {
          allResults = searchResponse.results as PerplexitySearchResult[];
        }

        return formatSearchResults(allResults);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return "Error: Operation aborted";
        }

        const errorMessage = stringifyRedactedError(error);
        reportToolFailure(context.onToolFailure, {
          event: "web_search_tool_failed",
          tool_name: "web_search",
          provider: "jina",
          error_name: error instanceof Error ? error.name : "UnknownError",
          error_message: errorMessage,
        });
        console.error("Web search tool error:", errorMessage);
        return `Error performing web search: ${errorMessage}`;
      }
    },
  });
};
