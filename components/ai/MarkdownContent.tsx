'use client';

import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import CodeBlock from './CodeBlock';

/**
 * Shared Markdown renderer for the AI Mentor surfaces.
 *
 * Wraps `react-markdown` with a custom `code` component override that
 * routes every fenced code block through the reusable {@link CodeBlock}
 * component. This is the single integration point: any future AI Mentor
 * surface that wants Markdown + copy buttons imports this component
 * instead of `ReactMarkdown` directly, so the copy logic is never
 * duplicated.
 *
 * Behavior:
 *  - Fenced code blocks (`` ```lang\ncode\n``` ``) → `<CodeBlock>` with
 *    the language and code extracted.
 *  - Inline code (`` `code` ``) → rendered as a plain `<code>` element
 *    with the project's token-based styling, no copy button.
 *  - All other Markdown nodes pass through unchanged.
 *
 * React-markdown v10 passes the language as `className="language-xxx"` on
 * the `<code>` element of fenced blocks; we extract it from there for
 * compatibility with both v9 and v10 (the `inline` prop was removed in
 * v10 but is still safely read when present).
 */
function extractLanguage(className: unknown): string | undefined {
  if (typeof className !== 'string') return undefined;
  const match = /language-(\w+)/.exec(className);
  return match ? match[1] : undefined;
}

function extractText(children: React.ReactNode): string {
  if (children == null) return '';
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) {
    return children.map(extractText).join('');
  }
  // React elements: recurse into their children. Avoids stringifying
  // element objects which would produce "[object Object]".
  if (React.isValidElement(children)) {
    return extractText((children.props as { children?: React.ReactNode }).children);
  }
  return '';
}

const markdownComponents: Components = {
  code(props) {
    const { children, className, node, ...rest } = props as {
      children?: React.ReactNode;
      className?: string;
      node?: unknown;
      // Allow extra props react-markdown may forward (e.g. style).
      [key: string]: unknown;
    };

    const language = extractLanguage(className);
    const rawText = extractText(children).replace(/\n$/, '');

    // Heuristic: a fenced block (multi-line, or has a language- class)
    // renders as a CodeBlock. Inline code renders inline.
    const looksFenced =
      typeof className === 'string' && className.includes('language-');
    const isMultiline = rawText.includes('\n');

    if (looksFenced || isMultiline) {
      return <CodeBlock code={rawText} language={language} />;
    }

    // Inline code: minimal styling, no copy button, no badge.
    return (
      <code
        className="rounded px-1 py-0.5 text-[0.85em]"
        style={{
          backgroundColor: 'var(--hover-bg)',
          color: 'var(--text-primary)',
          border: '1px solid var(--code-border)',
        }}
        {...rest}
      >
        {children}
      </code>
    );
  },
};

export interface MarkdownContentProps {
  /** The Markdown source string to render. */
  children: string;
  /** Optional CSS class on the wrapper. */
  className?: string;
}

/**
 * Render Markdown content with the AI Mentor's code-block conventions.
 *
 * Drop-in replacement for `<ReactMarkdown>{content}</ReactMarkdown>`:
 *
 * ```tsx
 * <MarkdownContent>{message.content}</MarkdownContent>
 * ```
 *
 * Every fenced code block automatically gets a Copy button, language
 * badge, theme-aware surface, and accessibility wiring.
 */
export default function MarkdownContent({
  children,
  className,
}: MarkdownContentProps) {
  return (
    <div className={`markdown-content ${className ?? ''}`}>
      <ReactMarkdown components={markdownComponents}>{children}</ReactMarkdown>
    </div>
  );
}
