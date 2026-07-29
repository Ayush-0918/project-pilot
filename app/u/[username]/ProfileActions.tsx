'use client';

import React, { useState } from 'react';
import { Sun, Moon, Printer, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/lib/ThemeProvider';

interface ProfileActionsProps {
  profileData: any;
  username: string;
}

export default function ProfileActions({ profileData, username }: ProfileActionsProps) {
  const { theme, setTheme } = useTheme();
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleExportPDF = () => {
    if (typeof window !== 'undefined') {
      const originalTitle = document.title;
      document.title = `${username}_projectpilot_resume`;
      window.print();
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Button
        variant="default"
        size="sm"
        onClick={handleExportPDF}
        className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm flex items-center gap-1.5"
      >
        <Printer className="w-3.5 h-3.5" />
        Export to PDF
      </Button>

      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition no-print"
        title="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
      </button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="h-8 text-xs border-white/10 text-slate-200 hover:text-white no-print"
      >
        {copiedLink ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
        {copiedLink ? 'Copied' : 'Share'}
      </Button>
    </div>
  );
}
