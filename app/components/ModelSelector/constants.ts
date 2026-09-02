import type { ChatMode, SelectedModel } from "@/types/chat";
import { isAgentMode } from "@/lib/utils/mode-helpers";

export interface ModelOption {
  id: SelectedModel;
  label: string;
  /** Short tagline shown in the hover popup (e.g. "Maximum intelligence for complex work") */
  description?: string;
  /** "Powered by …" line shown beneath the description in the hover popup */
  poweredBy?: string;
  thinking?: boolean;
}

export const ASK_MODEL_OPTIONS: ModelOption[] = [
  {
    id: "hackerai-standard",
    label: "Prozync Standard",
    description: "Reliable performance for everyday tasks",
    poweredBy: "DeepSeek Chat",
  },
  {
    id: "hackerai-pro",
    label: "Prozync Pro",
    description: "Superior performance for most assignments",
    poweredBy: "GPT-4o",
  },
  {
    id: "hackerai-max",
    label: "Prozync Max",
    description: "Maximum intelligence for complex work",
    poweredBy: "GPT-4o",
  },
];

export const AGENT_MODEL_OPTIONS: ModelOption[] = [
  {
    id: "hackerai-standard",
    label: "Prozync Standard",
    description: "Reliable agent for everyday automation",
    poweredBy: "DeepSeek Chat",
    thinking: true,
  },
  {
    id: "hackerai-pro",
    label: "Prozync Pro",
    description: "Superior performance for most assignments",
    poweredBy: "GPT-4o",
    thinking: true,
  },
  {
    id: "hackerai-max",
    label: "Prozync Max",
    description: "Maximum intelligence for complex work",
    poweredBy: "GPT-4o",
    thinking: true,
  },
];

export const getDefaultModelForMode = (mode: ChatMode): SelectedModel => {
  const options = isAgentMode(mode) ? AGENT_MODEL_OPTIONS : ASK_MODEL_OPTIONS;
  return options[0].id;
};
