'use client';

import AiMentorChatSkeleton from '@/components/skeletons/AiMentorChatSkeleton';
import TypingIndicator from '@/components/ai/TypingIndicator';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { notify } from '@/lib/toast';
import { useSpeechRecognition } from '@/lib/useSpeechRecognition';
import { useAppStore } from '@/store/useAppStore';
import {
  CheckCircle,
  ChevronDown,
  Compass,
  Copy,
  FileText,
  Flame,
  Languages,
  Maximize2,
  Menu,
  MessageSquareCode,
  Mic,
  MicOff,
  Minimize2,
  Paperclip,
  Plus,
  Send,
  Trash2,
  User as UserIcon,
  X
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export default function AiMentorChatPage() {
  const { 
    conversations, 
    activeConversationId, 
    sendMessage, 
    createNewConversation, 
    selectConversation, 
    deleteConversation,
    isReadingMode,
    activeReadingMessageId,
    setReadingMode,
    isRoastMode,
    toggleRoastMode,
    isMockInterview,
    toggleMockInterview,
    translateLanguage,
    setTranslateLanguage,
    isGenerating
  } = useAppStore();
  
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<{ name: string; size: string } | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    setMounted(true);
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Voice input via Web Speech API
  const {
    isListening,
    isSupported: speechSupported,
    start: startListening,
    stop: stopListening,
  } = useSpeechRecognition({
    onResult: (text, isFinal) => {
      setInputMessage((prev) => {
        const base = prev.trimEnd();
        if (isFinal) {
          return base ? `${base} ${text}` : text;
        }
        return text;
      });
    },
    onError: (msg) => {
      notify.error(msg);
    },
  });

  // Retrieve active conversation
  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];

  // Auto scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  if (isLoading || !mounted) {
    return <AiMentorChatSkeleton />;
  }

  // Early return for distraction-free Reading Mode
  if (isReadingMode && activeReadingMessageId) {
    const readingMsg = activeConv?.messages.find((m) => m.id === activeReadingMessageId);
    if (readingMsg) {
      return (
        <div className="flex flex-col min-h-screen w-full px-6 sm:px-4 relative bg-[#030014] text-slate-100 overflow-y-auto">
          {/* Glowing Background Mesh */}
          <div className="absolute top-[10%] left-[10%] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full bg-indigo-600/5 blur-[100px] sm:blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[10%] right-[10%] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full bg-purple-600/5 blur-[100px] sm:blur-[120px] pointer-events-none" />

          {/* Top Control Bar */}
          <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-5 backdrop-blur-md border-b border-white/5 bg-[#030014]/80">
            <div className="flex items-center space-x-2.5 sm:space-x-3.5">
              <div className="p-2 sm:p-2.5 bg-indigo-500/15 rounded-xl sm:rounded-2xl text-indigo-400 border border-indigo-500/20 shadow-md">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-extrabold tracking-tight text-white">AI Mentor Reading Focus</h2>
                <p className="text-[9px] sm:text-[10px] text-slate-400">Distraction-free deep study mode</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl text-xs font-semibold cursor-pointer border-white/10 hover:border-indigo-500/30"
              onClick={() => setReadingMode(false, null)}
              leftIcon={<Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            >
              <span className="hidden sm:inline">Exit Reading Mode</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </header>

          {/* Centered Scrollable Reading Canvas */}
          <main className="flex-grow max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-16 relative z-10">
            <div className="space-y-6 sm:space-y-8">
              {/* Metadata Badge Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pb-4 border-b border-white/5">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono font-semibold text-[10px] sm:text-xs">
                    AI Assistant
                  </span>
                  <span>•</span>
                  <span className="text-[11px] sm:text-xs">Roadmap & Advice</span>
                </div>
                <button
                  onClick={() => handleCopyCode(readingMsg.content, readingMsg.id)}
                  className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer text-[11px]"
                >
                  {copiedCodeIdx === readingMsg.id ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Text</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Content</span>
                    </>
                  )}
                </button>
              </div>

              {/* Main long-form body content */}
              <article className="max-w-none text-xs sm:text-base leading-relaxed text-slate-200 whitespace-pre-line tracking-wide break-words">
                {readingMsg.content}
              </article>

              {/* Attachments */}
              {readingMsg.attachments && readingMsg.attachments.length > 0 && (
                <div className="space-y-2 pt-4">
                  <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Attached References</h3>
                  {readingMsg.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-3 bg-white/5 border border-white/5 rounded-xl text-xs max-w-md">
                      <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="font-semibold text-slate-300 truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-500 shrink-0">({file.size})</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Code Snippet */}
              {readingMsg.codeSnippet && (
                <div className="space-y-3 pt-4 sm:pt-6">
                  <div className="flex justify-between items-center bg-[#050214] border border-white/5 border-b-0 px-4 py-3 rounded-t-xl font-mono text-[10px] text-slate-400">
                    <span>{readingMsg.codeSnippet.language.toUpperCase()} ATTACHED CODE</span>
                    <button
                      onClick={() => handleCopyCode(readingMsg.codeSnippet!.code, readingMsg.id + '-code')}
                      className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedCodeIdx === readingMsg.id + '-code' ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied Code</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="font-mono text-xs text-indigo-300 border border-white/5 bg-[#050214]/50 overflow-x-auto p-4 sm:p-5 rounded-b-xl rounded-t-none leading-relaxed">
                    {readingMsg.codeSnippet.code}
                  </pre>
                </div>
              )}
            </div>
          </main>

          {/* Floating Escape button at bottom center */}
          <div className="sticky bottom-4 sm:bottom-6 flex justify-center py-4 pointer-events-none z-20">
            <button
              onClick={() => setReadingMode(false, null)}
              className="pointer-events-auto flex items-center space-x-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Exit Reading Mode</span>
            </button>
          </div>
        </div>
      );
    }
  }

  // Handle message submission
  const handleSend = () => {
    const clean = inputMessage.trim();
    if (!clean && !attachment) return;

    sendMessage(
      clean || `Sent attachment: ${attachment?.name}`,
      undefined,
      attachment ? [{ name: attachment.name, size: attachment.size, type: 'file' }] : undefined
    );
    
    setInputMessage('');
    setAttachment(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachment({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`
      });
    }
  };

  const handleCopyCode = (code: string, msgId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(msgId);
    setTimeout(() => setCopiedCodeIdx(null), 1500);
  };

  const suggestedPrompts = [
    { label: 'Custom canvas with SVG', value: 'How can I build a custom whiteboard drawing canvas with SVG lines?' },
    { label: 'Docker-compose setup', value: 'Help me draft a docker-compose file for a Golang collector and Redis cache.' },
    { label: 'Vector database steps', value: 'How should I configure Pinecone to index and match vector action logs?' }
  ];

  const interviewTopics = ['Frontend Developer', 'Backend Developer', 'Full Stack', 'React', 'Node.js', 'System Design'];

  return (
    <div className="flex h-[calc(100vh-6rem)] min-h-[500px] border rounded-2xl sm:rounded-3xl overflow-x-hidden glass-panel relative" style={{ borderColor: 'var(--border-subtle)' }}>
      {/* Left Desktop Panel: Conversation History */}
      <div className="hidden md:flex flex-col w-64 border-r h-full shrink-0" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-secondary)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <Button 
            variant="glow" 
            className="w-full text-xs h-10 min-h-[40px] cursor-pointer" 
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => createNewConversation()}
          >
            New Session Guidance
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((c) => {
            const isActive = activeConversationId === c.id;
            return (
              <div
                key={c.id}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer group text-xs font-semibold transition-colors ${
                  isActive ? 'bg-indigo-600/15 text-indigo-400' : 'hover:bg-indigo-500/5'
                }`}
                style={!isActive ? { color: 'var(--text-secondary)' } : {}}
                onClick={() => selectConversation(c.id)}
              >
                <div className="flex items-center space-x-2 truncate pr-2">
                  <MessageSquareCode className="w-4 h-4 shrink-0" />
                  <span className="truncate">{c.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(c.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer / Sidebar */}
      {showMobileSidebar && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowMobileSidebar(false)} 
          />
          <div className="relative w-72 max-w-[80vw] h-full border-r flex flex-col shadow-2xl z-10" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-secondary)' }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
              <Button 
                variant="glow" 
                className="text-xs h-10 min-h-[40px] flex-1 mr-2 cursor-pointer" 
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => { createNewConversation(); setShowMobileSidebar(false); }}
              >
                New Session
              </Button>
              <button onClick={() => setShowMobileSidebar(false)} className="p-2 text-slate-400 hover:text-white rounded-lg bg-white/5 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {conversations.map((c) => {
                const isActive = activeConversationId === c.id;
                return (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer group text-xs font-semibold ${
                      isActive ? 'bg-indigo-600/15 text-indigo-400' : 'hover:bg-indigo-500/5'
                    }`}
                    style={!isActive ? { color: 'var(--text-secondary)' } : {}}
                    onClick={() => { selectConversation(c.id); setShowMobileSidebar(false); }}
                  >
                    <div className="flex items-center space-x-2 truncate pr-2">
                      <MessageSquareCode className="w-4 h-4 shrink-0" />
                      <span className="truncate">{c.title}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(c.id);
                      }}
                      className="p-1 hover:text-rose-400 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Right panel: Active Chat Window */}
      <div className="flex-1 flex flex-col justify-between h-full bg-gradient-to-b from-transparent to-[#0a0728]/10 relative min-w-0">
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Dynamic Top Header */}
        <div className="h-16 sm:h-18 border-b px-3 sm:px-6 flex items-center justify-between shrink-0 gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <button 
              className="md:hidden p-2 -ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer shrink-0"
              onClick={() => setShowMobileSidebar(true)}
              aria-label="Open sessions drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 items-center justify-center animate-pulse shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                {activeConv?.title || 'Mentor Guidance'}
              </h3>
              <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                {isMockInterview ? '🎤 Mock Interview Active' : isRoastMode ? '🔥 Roast Mode Active' : 'Context: Active Blueprint'}
              </p>
            </div>
          </div>

          {/* Controls Cluster */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            {isMockInterview && (
              <button
                type="button"
                onClick={() => sendMessage('End the interview and generate my final report.', undefined, undefined, { endInterview: true })}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                End
              </button>
            )}

            <button
              type="button"
              onClick={toggleRoastMode}
              title={isRoastMode ? "Disable Roast Mode" : "Enable AI Code Roast Mode"}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all border cursor-pointer ${
                isRoastMode
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-slate-300'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${isRoastMode ? 'text-rose-400 animate-bounce' : ''}`} />
              <span className="hidden sm:inline">{isRoastMode ? 'ROAST MODE ON' : 'ROAST MODE'}</span>
            </button>

            <button
              type="button"
              onClick={toggleMockInterview}
              title={isMockInterview ? 'Disable Mock Interview' : 'Enable AI Mock Interview'}
              className={`flex items-center space-x-1 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all border cursor-pointer ${
                isMockInterview
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.3)] animate-pulse'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-slate-300'
              }`}
            >
              <span>🎤</span>
              <span className="hidden sm:inline">{isMockInterview ? 'MOCK INTERVIEW ON' : 'MOCK INTERVIEW'}</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen((prev) => !prev)}
                title="Translate AI responses"
                className={`flex items-center space-x-1 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all border cursor-pointer ${
                  translateLanguage
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-slate-300'
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{translateLanguage ? translateLanguage.toUpperCase() : 'TRANSLATE'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isLangMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-36 sm:w-40 rounded-xl border border-white/10 bg-[#0a071a] shadow-2xl overflow-hidden z-30"
                  onMouseLeave={() => setIsLangMenuOpen(false)}
                >
                  {[
                    { label: 'English (Off)', value: null },
                    { label: 'Telugu', value: 'Telugu' },
                    { label: 'Hindi', value: 'Hindi' },
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => {
                        setTranslateLanguage(option.value);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs transition-colors cursor-pointer ${
                        translateLanguage === option.value
                          ? 'bg-emerald-500/10 text-emerald-300 font-semibold'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Badge variant="glow" className="hidden lg:inline-flex text-[10px] font-mono">
              ONLINE
            </Badge>
          </div>
        </div>

        {/* Scrollable Messages Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          {activeConv?.messages.map((msg) => {
            const isUser = msg.role === 'user';
            
            if (!isUser && !msg.content.trim()) {
              const isLastMessage = activeConv.messages[activeConv.messages.length - 1].id === msg.id;
              if (isGenerating && isLastMessage) {
                return (
                  <div key={msg.id} className="flex space-x-3 justify-start">
                    <TypingIndicator />
                  </div>
                );
              }
              return null;
            }

            const scoreMatch = !isUser ? msg.content.match(/(?:^|\n)\s*Score\s*:\s*(10|[0-9])\s*\/\s*10/i) : null;
            const score = scoreMatch ? Number(scoreMatch[1]) : null;
            const isFinalReport = !isUser && /Overall Score/i.test(msg.content) && /Strengths/i.test(msg.content) && /Weaknesses/i.test(msg.content);
            const isInterviewQuestion = !isUser && isMockInterview && !isFinalReport && /\?/.test(msg.content);
            const questionNumber = activeConv.messages.slice(0, activeConv.messages.indexOf(msg) + 1).filter((message) =>
              message.role === 'assistant' && /\?/.test(message.content)
            ).length;
            const difficulty = msg.content.match(/(?:Difficulty\s*:\s*|\b)(Easy|Medium|Hard)\b/i)?.[1] || 'Medium';

            return (
              <div 
                key={msg.id}
                className={`flex space-x-2 sm:space-x-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                )}

                <div 
                  className={`relative max-w-[85%] sm:max-w-xl space-y-3 p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed break-words ${
                    isUser
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20 rounded-tr-none ml-auto'
                      : 'border rounded-tl-none pr-9 sm:pr-10'
                  }`}
                  style={!isUser ? { backgroundColor: 'var(--hover-bg-strong)', borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' } : {}}
                >
                  {isInterviewQuestion && (
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1.5 text-[10px] font-bold text-indigo-300 mb-2">
                      <span>Question #{questionNumber}</span>
                      <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-indigo-200">{difficulty}</span>
                    </div>
                  )}

                  {!isUser && (
                    <button
                      onClick={() => setReadingMode(true, msg.id)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg border border-white/5 hover:border-indigo-500/30 bg-white/5 hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-400 transition-all cursor-pointer"
                      title="Open in distraction-free Reading Mode"
                    >
                      <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  )}
                  
                  <div className="whitespace-pre-line tracking-wide">
                    {msg.content}
                  </div>

                  {/* Message Code Block */}
                  {msg.codeSnippet && (
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between items-center bg-[#050214] border border-white/10 px-3 py-2 rounded-t-lg font-mono text-[10px] text-slate-400">
                        <span>{msg.codeSnippet.language.toUpperCase()}</span>
                        <button
                          onClick={() => handleCopyCode(msg.codeSnippet!.code, msg.id)}
                          className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedCodeIdx === msg.id ? (
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <pre className="font-mono text-[11px] sm:text-xs text-indigo-300 border border-white/10 bg-[#050214]/60 p-3 rounded-b-lg overflow-x-auto">
                        {msg.codeSnippet.code}
                      </pre>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0">
                    <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Dynamic Interactive Input Bar */}
        <div className="p-3 sm:p-2 border-t space-y-2 bg-[#050214]/60 backdrop-blur-md shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
          {/* Quick Prompts */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInputMessage(prompt.value)}
                className="text-[10px] sm:text-xxs whitespace-nowrap px-3 sm:px-1 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 transition-colors shrink-0 cursor-pointer min-h-[32px]"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Active File Attachment Pill */}
          {attachment && (
            <div className="flex items-center space-x-2 p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 w-fit">
              <FileText className="w-4 h-4" />
              <span className="font-semibold truncate max-w-[150px] sm:max-w-[200px]">{attachment.name}</span>
              <span className="text-[10px] text-slate-400">({attachment.size})</span>
              <button onClick={() => setAttachment(null)} className="p-0.5 hover:text-white cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="flex items-center space-x-2 bg-slate-900/80 border border-white/10 rounded-xl sm:rounded-2xl p-1.5 sm:p-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4 sm:w-3 sm:h-3" />
            </button>

            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening...' : 'Ask your AI Mentor...'}
              rows={1}
              className="flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none max-h-24 py-1.5 sm:p-1"
            />

            {speechSupported && (
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-lg transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center ${
                  isListening ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title={isListening ? 'Stop Listening' : 'Voice Input'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            <Button
              onClick={handleSend}
              variant="glow"
              disabled={!inputMessage.trim() && !attachment}
              className="h-9 sm:h-10 px-3 sm:px-2 text-xs font-semibold rounded-lg cursor-pointer min-h-[36px]"
            >
              <Send className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}