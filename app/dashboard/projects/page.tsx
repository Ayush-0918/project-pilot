'use client';

import {
  type ProjectSort,
  type ProjectStatusFilter,
  type ProjectView
} from '@/components/projects/ProjectControls';
import RecommendedProjectsSkeleton from '@/components/skeletons/RecommendedProjectsSkeleton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardFooter } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { TiltWrapper } from '@/components/ui/TiltWrapper';
import Tooltip from '@/components/ui/Tooltip';
import { useAppStore } from '@/store/useAppStore';
import type { Project } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock,
  FolderGit2,
  Info,
  Plus,
  Search,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_STATUS: ProjectStatusFilter = 'All';
const DEFAULT_SORT: ProjectSort = 'recent';
const DEFAULT_VIEW: ProjectView = 'grid';
const VIEW_STORAGE_KEY = 'project-pilot-project-view';

function getProjectStatus(project: Project): Exclude<ProjectStatusFilter, 'All'> {
  if (project.status === 'Archived') return 'Archived';
  if (project.status === 'Completed' || (project.progress ?? 0) >= 100) return 'Completed';
  if (project.status === 'In Progress' || (project.progress ?? 0) > 0) return 'In Progress';
  return 'Planned';
}

function getUpdatedTimestamp(project: Project, fallbackIndex: number) {
  const parsed = project.updatedAt ? new Date(project.updatedAt).getTime() : Number.NaN;
  return Number.isFinite(parsed) ? parsed : fallbackIndex;
}

function setUrlFilters(searchQuery: string, status: ProjectStatusFilter, sortBy: ProjectSort) {
  const params = new URLSearchParams(window.location.search);

  if (searchQuery.trim()) params.set('q', searchQuery.trim());
  else params.delete('q');

  if (status !== DEFAULT_STATUS) params.set('status', status);
  else params.delete('status');

  if (sortBy !== DEFAULT_SORT) params.set('sort', sortBy);
  else params.delete('sort');

  const query = params.toString();
  window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
}

export default function RecommendedProjectsPage() {
  const router = useRouter();
  const { projects, selectedProjectId, selectProject, initializeRoadmap } = useAppStore();

  // Local filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [sortBy, setSortBy] = useState<'resumeValue' | 'duration'>('resumeValue');

  // Pagination states
  const [displayCount, setDisplayCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [view, setView] = useState<ProjectView>(DEFAULT_VIEW);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Trigger project selection & auto-generate roadmap if not already present
  const handleBuildProject = (projectId: string, title: string) => {
    selectProject(projectId);
    initializeRoadmap(projectId, title);
    router.push(`/dashboard/projects/${projectId}`);
  };

  // Filter logic
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === 'All' || project.difficulty === activeTab;

    return matchesSearch && matchesTab;
  }).sort((a, b) => {
    if (sortBy === 'resumeValue') {
      return b.resumeValue - a.resumeValue;
    }
    // Simple mock comparison for duration sorting
    return b.duration.localeCompare(a.duration);
  });

  const displayedProjects = filteredProjects.slice(0, displayCount);
  const hasMore = displayCount < filteredProjects.length;

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    // Simulate network delay for loading skeleton
    setTimeout(() => {
      setDisplayCount(prev => prev + 6);
      setIsLoadingMore(false);
    }, 400);
  }, [isLoadingMore, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [handleLoadMore, hasMore, isLoadingMore]);
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <RecommendedProjectsSkeleton />;
  }
  return (
    <div className="w-full px-4 md:px-6 space-y-6 py-12 sm:space-y-8 overflow-x-hidden">
      <div className="flex flex-col px-6 sm:px-4 gap-4 sm:flex-row sm:items-start sm:justify-between md:flex-row min-w-0">
        <div className="py-6 min-w-0 sm:items-start">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-start space-x-2">
            <FolderGit2 className="w-6 h-6 sm:w-5 sm:h-5 sm:items-start shrink-0 text-indigo-400" />
            <span>Recommended Project blue-prints</span>
          </h2>
          <p className="text-xs lg:pr-2 sm:text-sm text-slate-400 mt-1">
            Custom engineered portfolios created to shut down your structural skill gaps.
          </p>
        </div>

        <div className="flex flex-col w-full items-start gap-3 self-center sm:flex-row sm:w-auto sm:self-center">
          <Link href="/dashboard/projects/create" className="w-full sm:w-auto">
            <Button
              variant="premium"
              size="sm"
              className="h-10 w-full px-2 text-xs font-bold shadow-md shadow-indigo-500/20 sm:w-auto shrink-0"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create Project
            </Button>
          </Link>

          <Badge variant="glow" className="w-fit sm:w-fit px-2 py-1 font-mono font-bold">
            🛩 ACTIVE TARGET: {projects.length} OPTIONS LOADED 
          </Badge>
        </div>
      </div>

      {/* Filter and Search Action Box */}
      <div className="glass-panel p-4 sm:p-3 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 w-full min-w-0 bg-[#08051e]/40">

        {/* Search Field */}
        <div className="relative w-full md:w-80 md:shrink-0">
          <label htmlFor="project-search" className="sr-only">Search projects</label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
          <input
            id="project-search"
            type="search"
            placeholder="Search projects or technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-w-0 bg-[#0a071a]/50 text-xs rounded-xl border border-white/5 px-4 py-3 pl-11 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus:border-indigo-500/55 text-slate-200 placeholder-slate-500"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap min-w-0 items-center gap-1.5 w-full md:w-auto" role="group" aria-label="Filter projects by difficulty">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              aria-pressed={activeTab === tab}
              className={`min-h-10 px-4 sm:px-2 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${activeTab === tab
                ? 'bg-indigo-600/15 border-indigo-500/30 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.05)]'
                : 'bg-transparent border-white/5 text-slate-400 hover:text-white hover:bg-white/2'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sort Trigger */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-3 md:pt-0 justify-between">
          <label htmlFor="project-sort" className="text-xs text-slate-500 font-mono uppercase tracking-wider shrink-0">Sort By:</label>
          <select
            id="project-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold rounded-xl border px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus:border-indigo-500/55 cursor-pointer"
            style={{ backgroundColor: 'var(--surface-secondary)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            <option value="resumeValue">Resume Value Rank</option>
            <option value="duration">Completion Duration</option>
          </select>
        </div>

      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="popLayout">
        {projects.length === 0 ? (
          <EmptyState
            title="No Projects Yet"
            description="You don't have any project recommendations yet. Complete your onboarding to receive personalized AI-powered project suggestions."
            icon={<FolderGit2 className="h-10 w-10 sm:h-12 sm:w-12" />}
            ctaLabel="Complete Onboarding"
            ctaHref="/dashboard/settings"
            secondaryLabel="Ask AI Mentor"
            secondaryHref="/dashboard/mentor"
          />
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            title="No Matching Projects"
            description="No projects match your current search and difficulty filters. Clear the filters to view all available recommendations."
            icon={<Search className="h-10 w-10 sm:h-12 sm:w-12" />}
            ctaLabel="Clear Filters"
            onClick={() => {
              setSearchQuery('');
              setActiveTab('All');
            }}
          />
        ) : (
          <div className="w-full min-w-0 space-y-8 sm:gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full min-w-0">
              {displayedProjects.map((project) => {
                const isSelected = selectedProjectId === project.id;
                const projectStatus = getProjectStatus(project);
                const progress = project.progress ?? 0;
                const difficultyThemeColors = {
                  Beginner: '#10b981', // Emerald
                  Intermediate: '#8b5cf6', // Indigo/Violet
                  Advanced: '#ec4899', // Pink/Rose
                };

                const diffColors: Record<string, 'success' | 'warning' | 'danger'> = {
                  Beginner: 'success',
                  Intermediate: 'warning',
                  Advanced: 'danger',
                };

                const themeColor = difficultyThemeColors[project.difficulty] || '#8b5cf6';

                const borderStyles = {
                  Beginner: 'border-emerald-500/20 hover:border-emerald-500/40',
                  Intermediate: 'border-indigo-500/20 hover:border-indigo-500/40',
                  Advanced: 'border-pink-500/20 hover:border-pink-500/40',
                };

                return (
                  <motion.div
                    key={project.id}
                    layoutId={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <TiltWrapper className="h-full sm:p-2 min-w-0">
                      <Card
                        hoverEffect={false}
                        className={`relative flex flex-col min-w-0 sm:p-2 justify-between overflow-hidden border bg-[#070519]/95 rounded-2xl h-full transition-all duration-300 ${borderStyles[project.difficulty] || 'border-white/5'
                          } flex h-full flex-col justify-between`}
                        style={{
                          backgroundImage: `
                          radial-gradient(at 0% 64%, ${themeColor}12 0px, transparent 80%),
                          radial-gradient(at 100% 99%, ${themeColor}08 0px, transparent 80%)
                        `,
                          boxShadow: isSelected
                            ? `0 0 25px ${themeColor}20, inset 0 -12px 24px rgba(255, 255, 255, 0.05)`
                            : 'inset 0 -12px 24px rgba(255, 255, 255, 0.04)',
                        }}
                      >


                        <div className="space-y-4 min-w-0 w-full">
                          {/* Difficulty / Status / Active Target / Duration — single row */}
                          <div className="flex min-w-0 items-start justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant={diffColors[project.difficulty] || 'default'}>
                                {project.difficulty}
                              </Badge>
                              <Badge variant="default">{projectStatus}</Badge>
                              {isSelected && (
                                <Badge variant="success">
                                  <Check className="h-3 w-3 mr-1 inline" />
                                  Active Target
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-1 font-mono text-[10px] font-bold text-slate-400 shrink-0">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{project.duration}</span>
                            </div>
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-lg font-bold text-white">{project.title}</h3>
                            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-slate-400">
                              {project.category}
                            </p>
                          </div>

                          <div className="rounded-xl border border-white/5 bg-white/2 p-2.5">
                            <div className="mb-2 flex items-center justify-between text-[10px] font-semibold">
                              <span className="text-indigo-300">Project progress</span>
                              <span className="text-white">{progress}%</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${progress}%`,
                                  backgroundImage: `linear-gradient(90deg, ${themeColor}, ${themeColor}dd)`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex min-w-0 items-start justify-between space-x-2.5 rounded-xl border border-white/5 bg-white/2 p-2.5 text-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                            <div className="flex min-w-0 items-center gap-1.5">
                              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                              ★ Resume Score Boost: <span className="font-extrabold" style={{ color: themeColor }}>+{project.resumeValue}%</span>
                              </span>
                            </div>
                            <Tooltip content="Estimated increase to your resume's recruiter match rate if you complete this project, based on the skills and technologies it covers.">
                              <Info className="h-3 w-3 cursor-help text-slate-500 hover:text-indigo-400 transition-colors" aria-label="Resume score boost information" />
                            </Tooltip>
                          </div>

                          <p className="text-xs leading-relaxed text-slate-400 line-clamp-3">
                            {project.description}
                          </p>

                          {/* Dynamic checklist for project skills */}
                          <div className="space-y-2 pt-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Keys to Blueprint</span>
                            <ul className="space-y-2 pt-1">
                              {project.skillsGained.slice(0, 3).map((skill) => (
                                <li key={skill} className="flex items-center space-x-2 text-xs">
                                  <span
                                    className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                                    style={{ backgroundColor: themeColor, color: '#070519' }}
                                  >
                                    ✓
                                  </span>
                                  <span className="text-slate-200 font-medium">{skill}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <CardFooter
                          className="mt-6 border-t pt-2 w-full"
                          style={{ borderColor: 'var(--border-subtle)' }}
                        >
                          <Button
                            variant={isSelected ? 'glow' : 'outline'}
                            style={
                              isSelected
                                ? {
                                  backgroundImage: `linear-gradient(0deg, ${themeColor}, ${themeColor}dd)`,
                                  color: '#ffffff',
                                  boxShadow: `0 0 15px ${themeColor}40`,
                                  border: 'none',
                                }
                                : {
                                  borderColor: `${themeColor}40`,
                                  color: '#ffffff',
                                }
                            }
                            className="h-11 w-full text-xs transition-all hover:scale-[1.02] cursor-pointer font-bold rounded-xl"
                            onClick={() => handleBuildProject(project.id, project.title)}
                            rightIcon={
                              isSelected ? <Check className="h-4 w-4 text-white" /> : <ArrowUpRight className="h-4 w-4" />
                            }
                          >
                            {isSelected ? 'Configure Sandbox & Steps' : 'Build Custom Blueprint'}
                          </Button>
                        </CardFooter>
                      </Card>
                    </TiltWrapper>
                  </motion.div>
                );
              })}

              {/* Skeleton Loading State */}
              {isLoadingMore && Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="h-full"
                >
                  <Card className="bg-[#08051e]/40 h-full flex flex-col justify-between relative border border-white/5 p-6 animate-pulse">
                    <div className="space-y-4 w-full">
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-20 bg-white/10 rounded-full"></div>
                        <div className="h-4 w-16 bg-white/10 rounded"></div>
                      </div>
                      <div>
                        <div className="h-6 w-3/4 bg-white/10 rounded mb-2"></div>
                        <div className="h-3 w-1/4 bg-white/10 rounded"></div>
                      </div>
                      <div className="h-8 w-full bg-indigo-500/10 rounded-xl"></div>
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-white/10 rounded"></div>
                        <div className="h-3 w-5/6 bg-white/10 rounded"></div>
                        <div className="h-3 w-4/6 bg-white/10 rounded"></div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <div className="h-2 w-20 bg-white/10 rounded"></div>
                        <div className="flex gap-2">
                          <div className="h-4 w-12 bg-white/10 rounded"></div>
                          <div className="h-4 w-16 bg-white/10 rounded"></div>
                          <div className="h-4 w-14 bg-white/10 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-white/5 mt-6">
                      <div className="h-11 w-full bg-white/10 rounded-xl"></div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Infinite Scroll Target & Load More Action */}
            {hasMore && (
              <div ref={observerTarget} className="flex justify-center pt-4 pb-8 w-full min-h-[80px]">
                {!isLoadingMore && (
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    className="w-full sm:w-auto px-8"
                    leftIcon={<ChevronDown className="w-4 h-4" />}
                  >
                    Load More Projects
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
