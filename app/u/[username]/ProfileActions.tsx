'use client';

import React from 'react';

interface ProfileActionsProps {
  profileData: any;
}

export default function ProfileActions({ profileData }: ProfileActionsProps) {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Profile link copied to clipboard!');
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleToggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="flex gap-3 mt-4">
      <button onClick={handleExportPDF} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
        Export to PDF
      </button>
      <button onClick={handleToggleTheme} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700">
        Toggle Theme
      </button>
      <button onClick={handleShare} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
        Share
      </button>
    </div>
  );
}
