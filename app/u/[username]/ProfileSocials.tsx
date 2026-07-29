'use client';

import React from 'react';
import { Share2, ExternalLink } from 'lucide-react';
import { Github, Linkedin } from '@/components/ui/BrandIcons';

interface ProfileSocialsProps {
  name: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
}

export default function ProfileSocials({ name, githubUrl, linkedinUrl }: ProfileSocialsProps) {
  const handleShareLinkedin = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== 'undefined') {
      const text = encodeURIComponent(`Check out ${name}'s developer portfolio on ProjectPilot! 🚀`);
      const url = encodeURIComponent(window.location.href);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 no-print">
      {githubUrl && (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-200 hover:text-white hover:border-indigo-500/50 transition"
        >
          <Github className="w-4 h-4" />
          <span>GitHub</span>
          <ExternalLink className="w-3 h-3 text-slate-400 ml-1" />
        </a>
      )}

      {linkedinUrl && (
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-200 hover:text-white hover:border-indigo-500/50 transition"
        >
          <Linkedin className="w-4 h-4 text-sky-400" />
          <span>LinkedIn</span>
          <ExternalLink className="w-3 h-3 text-slate-400 ml-1" />
        </a>
      )}

      <button
        onClick={handleShareLinkedin}
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-200 hover:text-white hover:border-indigo-500/50 transition"
      >
        <Linkedin className="w-4 h-4 text-sky-400" />
        <span>Share LinkedIn</span>
      </button>

      <button
        onClick={handleShareTwitter}
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-200 hover:text-white hover:border-indigo-500/50 transition"
      >
        <Share2 className="w-4 h-4 text-indigo-400" />
        <span>Share X</span>
      </button>
    </div>
  );
}
