// Simple Shiki wrapper for code highlighting.
// Creating a Shiki highlighter is slow, so we create ONE for the whole app
// and every call reuses it.

import { createHighlighter } from "shiki";

// The languages our app displays and the dark theme (matches the site).
const highlighterPromise = createHighlighter({
  themes: ["github-dark"],
  langs: ["typescript", "tsx", "javascript", "json", "css", "bash"],
});

export interface Highlighter {
  /** Turn code into a styled <pre> block (HTML string). */
  highlight: (code: string) => string;
}

export async function loadHighlighter(language: string): Promise<Highlighter> {
  const highlighter = await highlighterPromise;

  return {
    highlight(code: string) {
      return highlighter.codeToHtml(code, {
        lang: language,
        theme: "github-dark",
      });
    },
  };
}
