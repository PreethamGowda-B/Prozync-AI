import type { Metadata } from "next";
import { DownloadPageContent } from "./DownloadPageContent";

export const metadata: Metadata = {
  title: "Download | Prozync AI",
  description:
    "Download Prozync AI for macOS, Windows, Linux, iOS, and Android. Intelligent autonomous AI workspace.",
  openGraph: {
    title: "Download Prozync AI",
    description:
      "Download Prozync AI for macOS, Windows, Linux, iOS, and Android. Intelligent autonomous AI workspace.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Download Prozync AI",
    description:
      "Download Prozync AI for macOS, Windows, Linux, iOS, and Android. Intelligent autonomous AI workspace.",
  },
};

export default function DownloadPage() {
  return <DownloadPageContent />;
}
