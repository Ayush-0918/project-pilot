'use client';

import Tooltip from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useClerk, useUser } from '@clerk/nextjs';
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Compass,
  FolderGit2,
  GitMerge,
  LayoutDashboard,
  LogOut,
  Map,
  MessageSquareCode,
  Settings,
  User as UserIcon
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const { user: storeUser, logout } = useAppStore();

  const displayUser = {
    name: storeUser?.name || clerkUser?.fullName || 'User',
    email: storeUser?.email || clerkUser?.primaryEmailAddress?.emailAddress || '',
    avatarUrl: storeUser?.avatarUrl || clerkUser?.imageUrl || ''
  };

  const handleSignOut = async () => {
    logout();
<<<<<<< HEAD
    try {
  await signOut();
} catch {
  // ignore Clerk sign-out errors
}
=======
    try { await signOut(); } catch (e) { }
>>>>>>> main
    router.push('/');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Projects', icon: FolderGit2, href: '/dashboard/projects' },
    { name: 'Roadmaps', icon: Map, href: '/dashboard/roadmaps' },
    { name: 'AI Mentor', icon: MessageSquareCode, href: '/dashboard/mentor' },
    { name: 'GitHub Analytics', icon: GitMerge, href: '/dashboard/github' },
    { name: 'Career Score', icon: Award, href: '/dashboard/career' },
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' }
  ];

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen sticky top-0 border-r transition-all duration-300 z-30',
        collapsed ? 'w-20' : 'w-64'
      )}
      style={{
        backgroundColor: 'var(--surface-primary)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Brand Header */}
      <div
        className="flex items-center justify-between min-h-[88px] py-4 px-6 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <Link href="/dashboard" className="flex items-center space-x-3 group overflow-hidden">
          <div className="p-2 accent-bg-hover rounded-xl accent-text shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          {!collapsed && (
            <span
              className="text-lg font-bold tracking-wider select-none transition-opacity duration-300"
              style={{ color: 'var(--text-primary)' }}
            >
              Pilot<span className="accent-text">AI</span>
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          className="p-1.5 rounded-lg border transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          style={{
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" aria-hidden="true" /> : <ChevronLeft className="w-4 h-4" aria-hidden="true" />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto" aria-label="Main Navigation">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          const link = (
            <Link
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
                isActive
                  ? 'border accent-border accent-text accent-shadow'
                  : 'border border-transparent'
              )}
              style={
                !isActive
                 ? { 
                   backgroundColor: "rgba(var(--color-primary-rgb),0.15)",
      }
    : {
                  color: 'var(--text-secondary)' } }
            >
              <Icon
                aria-hidden="true"
                className={cn(
                  'w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105',
                  isActive ? 'accent-text' : ''
                )}
                style={!isActive ? { color: 'var(--text-muted)' } : {}}
              />
              {!collapsed && (
                <span className="truncate transition-opacity duration-300">
                  {item.name}
                </span>
              )}
            </Link>
          );

          // Only wrap with the Radix tooltip while collapsed — when expanded,
          // the label is already visible next to the icon so no tooltip is needed.
          return collapsed ? (
            <Tooltip key={item.name} content={item.name} side="right">
              {link}
            </Tooltip>
          ) : (
            <React.Fragment key={item.name}>{link}</React.Fragment>
          );
        })}
      </nav>

      {/* User Session Info & Action */}
      <div
        className="p-4 border-t"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div
          className={cn('flex items-center space-x-3 p-2 rounded-xl mb-3')}
          style={!collapsed ? { backgroundColor: 'var(--hover-bg)' } : {}}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border accent-border flex items-center justify-center accent-bg-hover shrink-0">
            {displayUser.avatarUrl ? (
              <Image
                src={displayUser.avatarUrl}
                alt={`${displayUser.name}'s profile avatar`}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized={displayUser.avatarUrl.startsWith('data:') || displayUser.avatarUrl.startsWith('blob:')}
              />
            ) : (
              <UserIcon className="w-5 h-5 accent-text" aria-hidden="true" />
            )}
          </div>
          {!collapsed && (
            <div className="truncate flex-1">
              <h4
                className="text-sm font-semibold truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {displayUser.name}
              </h4>
              <p
                className="text-xs truncate"
                style={{ color: 'var(--text-muted)' }}
              >
                {displayUser.email}
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Sign out of account"
          title="Sign out of account"
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium hover:text-rose-300 hover:bg-rose-500/5 transition-all duration-200 w-full group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          style={{ color: 'var(--text-secondary)' }}
        >
          <LogOut className="w-5 h-5 shrink-0" aria-hidden="true" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};