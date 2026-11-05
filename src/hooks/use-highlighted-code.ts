import * as React from "react"

import { loadHighlighter } from "@/lib/highlighter"

/**
 * Highlight code with Shiki.
 * Returns the highlighted HTML string, or the plain code while Shiki
 * is still loading or if highlighting fails.
 */
export function useHighlightedCode(code: string, language: string): string {
  const [html, setHtml] = React.useState("")

  React.useEffect(() => {
    let cancelled = false

    loadHighlighter(language)
      .then((highlighter) => {
        if (!cancelled) {
          setHtml(highlighter.highlight(code))
        }
      })
      .catch((err) => {
        console.error("Code highlighting failed:", err)
      })

    return () => {
      cancelled = true
    }
  }, [code, language])

  // Plain text until the highlighter is ready.
  return html || code
}
