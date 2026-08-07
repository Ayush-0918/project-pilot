'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Loader2, Trash2, Send, Bot, User, Brain } from 'lucide-react';
import TypingIndicator from '../ai/TypingIndicator';
import MarkdownContent from '../ai/MarkdownContent';
import MarkdownRenderer from '../ai/MarkdownRenderer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AiMentorChatProps {
  userContext?: {
    name?: string;
    careerGoal?: string;
    skills?: string[];
  };
}

export function AiMentorChat({ userContext }: AiMentorChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch previous conversation history on mount (Session Restoration)
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch('/api/chat');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.messages)) {
            setMessages(data.messages);
          }
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const sendMessageText = async (text: string) => {
    if (!text.trim() || isSending) return;

    const userMsg = text.trim();
    const updatedMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(updatedMessages);
    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          userContext,
        }),
      });

      if (!res.body) throw new Error('No response stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantReply = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantReply += decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { role: 'assistant', content: assistantReply };
          return newMsgs;
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    const currentInput = input;
    setInput('');
    await sendMessageText(currentInput);
  };

  // 2. Clear Chat History handler
  const handleClearHistory = async () => {
    try {
      const res = await fetch('/api/chat', { method: 'DELETE' });
      if (res.ok) {
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to clear chat history:', err);
    }
  };

  if (isLoading) {
    return (
      <div
  className="flex h-96 items-center justify-center rounded-2xl border"
  style={{
    backgroundColor: "var(--surface-primary)",
    borderColor: "var(--border-subtle)",
  }}
>
        <Loader2
  className="h-6 w-6 animate-spin"
  style={{ color: "var(--color-primary)" }}
/>
      </div>
    );
  }

  return (
    <div
  className="flex flex-col h-[650px] rounded-2xl border shadow-2xl overflow-hidden"
  style={{
    backgroundColor: "var(--surface-primary)",
    borderColor: "var(--border-subtle)",
  }}
>
      {/* Header */}
      <div
  className="flex items-center justify-between border-b px-6 py-4"
  style={{
    borderColor: "var(--border-subtle)",
    backgroundColor: "var(--surface-secondary)",
  }}
>
        <div className="flex items-center gap-3">
          <div
  className="rounded-xl p-2"
  style={{
    backgroundColor: "rgba(var(--color-primary-rgb),0.15)",
    color: "var(--color-primary)",
  }}
>
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2
  className="text-sm font-semibold"
  style={{ color: "var(--text-primary)" }}
>AI Mentor Workspace</h2>
            <p
  className="text-xs"
  style={{ color: "var(--text-secondary)" }}
>Context-aware career & code guidance</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClearHistory}
          className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear History
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div
  className="rounded-2xl p-4 mb-3"
  style={{
    backgroundColor: "var(--hover-bg)",
  }}
>
              <Bot
  className="h-8 w-8"
  style={{ color: "var(--color-primary)" }}
/>
            </div>
            <p
  className="text-sm font-semibold"
  style={{
    color: "var(--text-primary)",
  }}
>Start a conversation with your AI Mentor</p>
            <p
  className="text-xs mt-1 max-w-sm"
  style={{
    color: "var(--text-secondary)",
  }}
>
              Ask for architectural feedback, debugging assistance, or a custom study roadmap. Your history is securely saved across sessions.
            </p>
          </div>
        ) : (
          messages.map((m, index) => {
            if (m.role !== 'user' && !m.content.trim()) {
              const isLastMessage = messages[messages.length - 1] === m;
              if (isSending && isLastMessage) {
                return (
                  <div key={index} className="flex items-start gap-3 max-w-[85%] mr-auto">
                    <TypingIndicator />
                  </div>
                );
              }
              return null;
            }
            return (
              <div
                key={index}
                className={`flex items-start gap-3 max-w-[85%] ${
                  m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
              <div
                className={`rounded-xl p-2 shrink-0 ${
                  m.role === 'user'
                    ? ''
                    : 'bg-white/10 text-indigo-300'

                }`}
                style={
  m.role === "user"
    ? {
        backgroundColor: "var(--color-primary)",
        color: "#fff",
      }
    : {
        backgroundColor: "var(--hover-bg)",
        color: "var(--color-primary)",
      }
}
              >
                {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'whitespace-pre-wrap rounded-tr-none'
                    : 'border border-white/10 text-slate-200 rounded-tl-none flex flex-col gap-2'
                }`}
                style={
  m.role === "user"
    ? {
        backgroundColor: "var(--color-primary)",
        color: "#fff",
      }
    : {
        backgroundColor: "var(--hover-bg)",
      }
}
              >
                <div>
                  {m.role === 'user' ? (
                    m.content
                  ) : (
                    <MarkdownContent>{m.content}</MarkdownContent>
                  )}
                </div>
                {m.role === 'user' ? (
                  <div>{m.content}</div>
                ) : (
                  <MarkdownRenderer content={m.content} />
                )}
                {m.role !== 'user' && (
                  <div className="pt-2 flex justify-start border-t border-white/5 mt-1">
                    <button
                      type="button"
                      onClick={() => sendMessageText("Rewrite your previous response in extremely simple terms, using analogies suitable for a 15-year-old beginner.")}
                      className="flex items-center gap-1.5 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors font-semibold cursor-pointer"
                      title="Explain Like I'm 15"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>Explain Like I'm 15</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            )
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Form */}
      <form
  onSubmit={handleSendMessage}
  className="border-t p-4 flex gap-2"
  style={{
    borderColor: "var(--border-subtle)",
    backgroundColor: "var(--surface-secondary)",
  }}
>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your AI mentor anything..."
          disabled={isSending}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:ring-1 disabled:opacity-50"
          style={{
  backgroundColor: "var(--input-bg)",
  color: "var(--text-primary)",
  border: "1px solid var(--input-border)",
}}
onFocus={(e) => {
  e.currentTarget.style.borderColor = "rgba(var(--color-primary-rgb),0.5)";
  e.currentTarget.style.boxShadow =
    "0 0 0 1px rgba(var(--color-primary-rgb),0.4)";
}}

onBlur={(e) => {
  e.currentTarget.style.borderColor = "var(--input-border)";
  e.currentTarget.style.boxShadow = "none";
}}
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
style={{
  backgroundColor: "var(--color-primary)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.filter = "brightness(1.08)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.filter = "brightness(1)";
}}
        >
          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}
