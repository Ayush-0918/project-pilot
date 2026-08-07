'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Props for the {@link CodeBlock} component.
 */
export interface CodeBlockProps {
  /**
   * The raw code text to render and copy.
   *
   * The copy handler always copies this exact string, so any leading or
   * trailing whitespace, language fences, or UI elements (badges, line
   * numbers) are excluded from the clipboard payload.
   */
  code: string;
  /**
   * The programming language identifier for the badge (e.g. `"typescript"`,
   * `"bash"`, `"python"`). Falls back to `"text"` when unknown.
   */
  language?: string;
  /**
   * Optional CSS class name applied to the outer wrapper.
   */
  className?: string;
  /**
   * Auto-reset delay (in milliseconds) for the "Copied" success state.
   * Defaults to 2000ms per the issue spec.
   */
  resetDelayMs?: number;
}

/**
 * Title-case a language identifier for the badge label.
 *
 * `"typescript"` → `"TypeScript"`, `"bash"` → `"Bash"`. Keeps common
 * multi-word names readable.
 */
function formatLanguageLabel(language?: string): string {
  if (!language || !language.trim()) return 'Text';
  const trimmed = language.trim().toLowerCase();
  const KNOWN: Record<string, string> = {
    ts: 'TypeScript',
    tsx: 'TSX',
    js: 'JavaScript',
    jsx: 'JSX',
    py: 'Python',
    python: 'Python',
    rb: 'Ruby',
    ruby: 'Ruby',
    go: 'Go',
    rs: 'Rust',
    rust: 'Rust',
    java: 'Java',
    kt: 'Kotlin',
    kotlin: 'Kotlin',
    sh: 'Shell',
    bash: 'Bash',
    shell: 'Shell',
    zsh: 'Zsh',
    sql: 'SQL',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    toml: 'TOML',
    xml: 'XML',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    dockerfile: 'Dockerfile',
    docker: 'Dockerfile',
    md: 'Markdown',
    markdown: 'Markdown',
    text: 'Text',
    plaintext: 'Text',
  };
  if (KNOWN[trimmed]) return KNOWN[trimmed];
  // Capitalize first letter only for unknown languages.
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Reusable code block with a one-click Copy button.
 *
 * Renders code with a language badge in the top-left and a Copy button in
 * the top-right corner. Clicking Copy writes the raw code text to the
 * system clipboard via the async Clipboard API, swaps the button label
 * to "Copied ✓" with an emerald accent for visual feedback, fires a
 * `sonner` toast confirming success, and auto-resets after a few seconds.
 *
 * Designed for use inside the AI Mentor chat, but fully reusable for any
 * Markdown-rendered code block (pass it as the `code` component override
 * to `react-markdown` via {@link MarkdownContent}).
 *
 * Behavior:
 *  - Uses `navigator.clipboard.writeText()` (Clipboard API).
 *  - Falls back to a hidden `<textarea>` + `document.execCommand('copy')`
 *    for environments where the async Clipboard API is unavailable
 *    (older browsers, insecure HTTP contexts).
 *  - On copy failure: shows an error toast and reverts the button.
 *  - On success: shows "Copied ✓" for `resetDelayMs`, then reverts.
 *  - Keyboard accessible: the copy button is a real `<button>` with
 *    `aria-label`, focusable by Tab, and triggers on Enter/Space.
 *
 * Theming:
 *  - Uses the project's CSS custom properties (`--code-bg`, `--code-border`,
 *    `--text-primary`, `--text-secondary`, `--color-primary`,
 *    `--hover-bg`, `--border-subtle`) so it automatically adapts to the
 *    light/dark theme already toggled by `ThemeProvider`.
 *
 * Accessibility:
 *  - The copy button exposes `aria-label="Copy code to clipboard"` and,
 *    after a successful copy, `aria-label="Code copied to clipboard"`.
 *  - The `<pre>` region exposes `role="region"` with an `aria-label`
 *    identifying the language so screen-reader users can navigate to it.
 *  - Visible focus ring on the copy button (Tailwind `focus:ring-2`).
 */
export default function CodeBlock({
  code,
  language,
  className,
  resetDelayMs = 2000,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up the pending reset timer on unmount to avoid setState on an
  // unmounted component (which React would warn about).
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    // Clear any previously scheduled reset so a rapid second click on the
    // same button doesn't revert to "Copy" mid-copy.
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    const textToCopy = code;

    try {
      // Preferred path: async Clipboard API. Requires a secure context
      // (HTTPS or localhost); throws a TypeError otherwise.
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
      ) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Legacy fallback for non-secure contexts or older browsers.
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        // Position off-screen so it doesn't visually disrupt the page.
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        textarea.style.left = '-9999px';
        textarea.setAttribute('aria-hidden', 'true');
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (!ok) {
          throw new Error('execCommand copy returned false');
        }
      }

      setCopied(true);
      toast.success('Code copied to clipboard');

      resetTimerRef.current = setTimeout(() => {
        setCopied(false);
        resetTimerRef.current = null;
      }, resetDelayMs);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('CodeBlock: failed to copy code', err);
      toast.error('Could not copy code. Please copy manually.');
      setCopied(false);
    }
  }, [code, resetDelayMs]);

  const label = formatLanguageLabel(language);
  const buttonLabel = copied ? 'Copied' : 'Copy';

  return (
    <div
      className={`group relative my-3 overflow-hidden rounded-xl border ${
        className ?? ''
      }`}
      style={{
        backgroundColor: 'var(--code-bg)',
        borderColor: 'var(--code-border)',
      }}
    >
      {/* Header row: language badge (left) + copy button (right) */}
      <div
        className="flex items-center justify-between border-b px-3 py-1.5"
        style={{
          borderColor: 'var(--code-border)',
          backgroundColor: 'var(--hover-bg)',
        }}
      >
        <span
          className="select-none text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={
            copied
              ? 'Code copied to clipboard'
              : 'Copy code to clipboard'
          }
          aria-pressed={copied}
          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
            copied
              ? 'text-emerald-400 hover:text-emerald-300 focus-visible:ring-emerald-400'
              : 'text-slate-300 hover:text-white focus-visible:ring-indigo-400'
          }`}
          style={{
            // Let Tailwind's text color classes win for the foreground,
            // but keep the surface in sync with the theme tokens.
            backgroundColor: copied
              ? 'rgba(16, 185, 129, 0.12)'
              : 'transparent',
          }}
          // Title attribute gives native browser tooltip on hover for
          // users who haven't yet triggered the Sonner toast.
          title={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>{buttonLabel}</span>
        </button>
      </div>

      {/* Code body: horizontally scrollable on small screens */}
      <pre
        role="region"
        aria-label={`${label} code block`}
        className="overflow-x-auto p-3 text-xs leading-relaxed"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: 0,
          color: 'var(--text-primary)',
          fontFamily:
            'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
