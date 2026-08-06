'use client';

/**
 * MarkdownRenderer
 * ----------------
 * Reusable Markdown + syntax-highlighting renderer for AI Mentor responses.
 *
 * - Renders GitHub-flavoured Markdown (headings, lists, tables, links,
 *   blockquotes, inline code, code blocks, horizontal rules, bold/italic).
 * - Applies syntax highlighting to fenced code blocks via react-syntax-highlighter
 *   (Prism). Language is auto-detected when not specified.
 * - Renders long code blocks inside a rounded, horizontally-scrollable container
 *   with a Copy button and the detected language label.
 * - Theme-aware: switches between dark/light Prism styles automatically.
 * - Memoised to avoid unnecessary re-renders during streaming.
 *
 * Used by:
 *   - components/dashboard/AiMentorChat.tsx
 *   - components/ai/ChatInterface.tsx
 */

import React, { memo, useCallback, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';

interface MarkdownRendererProps {
  /** Raw markdown content to render. */
  content: string;
  /** Optional className applied to the wrapper. */
  className?: string;
}

/**
 * Extract the human-friendly language label from a fenced code info string.
 * "ts x=1" -> "ts"; "" -> "text"; unknown -> "text".
 */
function detectLanguage(info: string | undefined): string {
  if (!info) return 'text';
  const first = info.trim().split(/\s+/)[0];
  return first || 'text';
}

/**
 * A single fenced code block with a header (language + copy button),
 * rounded container, padding, and horizontal scroll for long lines.
 */
function CodeBlock({
  language,
  value,
  isDark,
}: {
  language: string;
  value: string;
  isDark: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be unavailable (SSR, permissions, etc.) */
    }
  }, [value]);

  return (
    <div
      className="group relative my-3 overflow-hidden rounded-xl border"
      style={{
        backgroundColor: 'var(--code-bg)',
        borderColor: 'var(--code-border)',
      }}
    >
      {/* Header: language label + copy button */}
      <div
        className="flex items-center justify-between border-b px-3 py-1.5"
        style={{
          borderColor: 'var(--border-subtle)',
          backgroundColor: 'var(--surface-secondary)',
        }}
      >
        <span
          className="font-mono text-[10px] uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold transition-colors"
          style={{
            color: copied ? 'var(--color-primary)' : 'var(--text-secondary)',
            backgroundColor: 'transparent',
          }}
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Copy
            </>
          )}
        </button>
      </div>

      {/* Syntax-highlighted code body — horizontally scrollable */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={isDark ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            background: 'transparent',
            padding: '0.85rem 1rem',
            fontSize: '0.8rem',
            lineHeight: 1.55,
            fontFamily:
              'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace',
          }}
          codeTagProps={{
            style: {
              fontFamily:
                'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace',
            },
          }}
          showLineNumbers={false}
          wrapLongLines={false}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

/**
 * Detect the active theme by reading the data-theme attribute on <html>.
 * Falls back to dark (the app default).
 */
function useIsDarkTheme(): boolean {
  const [isDark, setIsDark] = useState(true);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const update = () => {
      setIsDark(root.getAttribute('data-theme') !== 'light');
    };
    update();

    // Observe theme changes (user toggling between dark / light).
    const observer = new MutationObserver(update);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

/**
 * react-markdown component overrides — wires each Markdown element to
 * the ProjectPilot design system tokens.
 */
function useMarkdownComponents(isDark: boolean): Components {
  return {
    h1: ({ children }) => (
      <h1
        className="mb-2 mt-4 text-lg font-bold leading-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className="mb-2 mt-4 text-base font-bold leading-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="mb-2 mt-3 text-sm font-bold leading-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        className="mb-1 mt-3 text-sm font-semibold"
        style={{ color: 'var(--text-primary)' }}
      >
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5
        className="mb-1 mt-2 text-xs font-semibold uppercase tracking-wide"
        style={{ color: 'var(--text-secondary)' }}
      >
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6
        className="mb-1 mt-2 text-xs font-semibold uppercase tracking-wide"
        style={{ color: 'var(--text-muted)' }}
      >
        {children}
      </h6>
    ),
    p: ({ children }) => (
      <p
        className="my-2 text-sm leading-relaxed"
        style={{ color: 'var(--text-primary)' }}
      >
        {children}
      </p>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium underline underline-offset-2 transition-colors"
        style={{ color: 'var(--color-primary)' }}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul
        className="my-2 list-disc space-y-1 pl-5 text-sm"
        style={{ color: 'var(--text-primary)' }}
      >
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol
        className="my-2 list-decimal space-y-1 pl-5 text-sm"
        style={{ color: 'var(--text-primary)' }}
      >
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote
        className="my-3 border-l-2 pl-3 text-sm italic"
        style={{
          borderColor: 'var(--color-primary)',
          color: 'var(--text-secondary)',
        }}
      >
        {children}
      </blockquote>
    ),
    hr: () => (
      <hr
        className="my-4 border-0"
        style={{
          borderTop: '1px solid var(--border-medium)',
        }}
      />
    ),
    strong: ({ children }) => (
      <strong
        className="font-semibold"
        style={{ color: 'var(--text-primary)' }}
      >
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic" style={{ color: 'var(--text-primary)' }}>
        {children}
      </em>
    ),
    del: ({ children }) => (
      <del className="line-through" style={{ color: 'var(--text-muted)' }}>
        {children}
      </del>
    ),
    table: ({ children }) => (
      <div className="my-3 overflow-x-auto">
        <table
          className="w-full border-collapse text-sm"
          style={{
            border: '1px solid var(--border-medium)',
            backgroundColor: 'var(--surface-card)',
          }}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead>{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th
        className="px-3 py-1.5 text-left text-xs font-semibold"
        style={{
          color: 'var(--text-primary)',
          backgroundColor: 'var(--surface-secondary)',
          borderBottom: '1px solid var(--border-medium)',
        }}
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td
        className="px-3 py-1.5 align-top"
        style={{ color: 'var(--text-primary)' }}
      >
        {children}
      </td>
    ),
    // Inline code (single backticks) — small rounded chip.
    code: (props) => {
      const { className, children, node, ...rest } = props as any;
      const match = /language-(\w+)/.exec(className || '');
      const isInline = !match && !String(children).includes('\n');

      if (isInline) {
        return (
          <code
            className="rounded-md px-1.5 py-0.5 font-mono text-[0.8em]"
            style={{
              backgroundColor: 'var(--hover-bg)',
              color: 'var(--color-primary)',
              border: '1px solid var(--border-subtle)',
            }}
            {...rest}
          >
            {children}
          </code>
        );
      }

      const language = match ? match[1] : detectLanguage();
      const value = String(children).replace(/\n$/, '');

      return (
        <CodeBlock
          language={language}
          value={value}
          isDark={isDark}
        />
      );
    },
    pre: ({ children }) => <>{children}</>,
  };
}

function MarkdownRendererImpl({
  content,
  className,
}: MarkdownRendererProps) {
  const isDark = useIsDarkTheme();
  const components = useMarkdownComponents(isDark);

  return (
    <div
      className={`markdown-body ${className ?? ''}`}
      style={{ color: 'var(--text-primary)' }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
        skipHtml={false}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Memoised so streaming appends (which only change the last message)
 * don't re-render already-finalised assistant turns.
 */
const MarkdownRenderer = memo(MarkdownRendererImpl);
export default MarkdownRenderer;
