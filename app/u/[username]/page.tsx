import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CustomCursor } from '@/components/ui/CustomCursor';
import {
  User as UserIcon,
  Globe,
  Award,
  CheckCircle,
  ExternalLink,
  Lock,
  Sparkles,
  Code2,
  GitBranch,
  Star,
  ArrowLeft,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import ProfileActions from './ProfileActions'; // Import the client actions component

// Enable Incremental Static Regeneration (ISR) - revalidate every 60 seconds
export const revalidate = 60;

interface PublicPortfolioProps {
  params: Promise<{ username: string }>;
}

async function getPortfolioData(username: string) {
  try {
    // Query the User model directly and include projects
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        projects: true,
      },
    });

    if (!user) return null;

    return {
      fullName: user.fullName || 'Yogender Verma',
      imageUrl: user.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80',
      dreamRole: user.dreamRole || 'AI Engineer',
      skills: user.skills || [],
      projects: user.projects || [],
      careerScore: { overallScore: 60 },
    };
  } catch (error) {
    console.error('Error querying database for public portfolio:', error);
    return null;
  }
}

export default async function PublicPortfolioPage({ params }: PublicPortfolioProps) {
  const resolvedParams = await params;
  const rawUsername = resolvedParams.username;

  const dbProfile = await getPortfolioData(rawUsername);

  // If no profile found, render private / not found lock screen
  if (!dbProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#070514] text-slate-200">
        <div className="max-w-md w-full p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">This Portfolio is Private</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The owner of <span className="font-mono text-indigo-300">@{rawUsername}</span> has disabled public access or this portfolio does not exist.
          </p>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button variant="premium" className="w-full h-10 text-xs font-semibold">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // User details from server payload
  const name = dbProfile?.fullName || 'Yogender Verma';
  const avatarUrl = dbProfile?.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80';
  const careerGoal = dbProfile?.dreamRole || 'AI Engineer';
  const userSkills = dbProfile?.skills || ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'Python'];
  const userProjects = dbProfile?.projects || [];
  const careerScore = dbProfile?.careerScore;

  return (
    <div className="min-h-screen bg-[#070514] text-slate-100 selection:bg-indigo-500 selection:text-white print:bg-white print:text-slate-900">
      <CustomCursor />

      {/* Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070514]/80 border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
            P
          </div>
          <span className="font-bold text-sm tracking-wide text-white">ProjectPilot</span>
          <Badge variant="glow" className="text-[10px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
            Public Portfolio
          </Badge>
        </Link>

      {/* Render interactive buttons via Client Component */}
<ProfileActions profileData={dbProfile} />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-10">
        {/* HERO PROFILE SECTION */}
        <section className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-transparent p-6 sm:p-10 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            <div className="relative w-28 h-28 rounded-full border-2 border-indigo-500/50 shadow-xl overflow-hidden shrink-0">
              <Image src={avatarUrl} alt={name} fill className="object-cover" unoptimized />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{name}</h1>
                <Badge variant="glow" className="text-xs px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-mono">
                  @{rawUsername}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Target: {careerGoal}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Portfolio Verified
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Building scalable web applications, agentic AI systems, and interactive developer tools. Currently showcasing blueprints, GitHub statistics, and technical skill metrics on ProjectPilot.
              </p>
            </div>

            {/* Career Score Badge Box */}
            <div className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/40 backdrop-blur-xl text-center shrink-0 w-full sm:w-44 space-y-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-300">Career Score</span>
              <div className="text-3xl font-black text-white flex items-center justify-center gap-1">
                <span>{careerScore?.overallScore || 60}%</span>
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                  style={{ width: `${careerScore?.overallScore || 60}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400">Project & Skill Readiness</p>
            </div>
          </div>
        </section>

        {/* SKILLS OVERVIEW */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Skills & Tech Stack</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {userSkills.map((skill: string, idx: number) => (
              <span key={idx} className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-slate-200 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* FEATURED PROJECTS GRID */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Featured Projects ({userProjects.length})</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Read-Only Showcase</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userProjects.map((project: any) => (
              <Card key={project.id} className="border-white/10 bg-white/5 flex flex-col justify-between break-inside-avoid">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-bold text-white">{project.title}</CardTitle>
                    <Badge variant={project.status === 'Completed' ? 'glow' : 'outline'} className="text-[10px] shrink-0">
                      {project.status || 'In Progress'}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {project.description || 'Interactive project blueprint with modern architecture.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="flex flex-wrap gap-1.5">
                    {(project.technologies || project.tags || ['React', 'Next.js', 'TypeScript']).map((tech: string, tIdx: number) => (
                      <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500 no-print">
        <p>Powered by <strong className="text-slate-400">ProjectPilot</strong> — Shareable Developer Portfolios</p>
      </footer>
    </div>
  );
}
