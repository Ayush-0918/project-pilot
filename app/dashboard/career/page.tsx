"use client";

import { RadarChartSkeleton } from "@/components/charts/ChartSkeleton";
import CareerSkeleton from "@/components/skeletons/CarrerSkeleton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import Tooltip from "@/components/ui/Tooltip";
import { useAppStore } from "@/store/useAppStore";
import {
  Activity,
  AlertTriangle,
  Award,
  CheckCircle,
  ChevronRight,
  Info,
  Sparkles,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useState } from "react";

const SkillRadarChart = dynamic(
  () => import("@/components/charts/SkillRadarChart"),
  {
    ssr: false,
    loading: () => <RadarChartSkeleton />,
  }
);

export default function CareerScorePage() {
  const { careerScore, recalculateCareerScore, user } = useAppStore();
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <CareerSkeleton />;
  }

  // Radar chart formatting
  const radarData = [
    { subject: "Frontend", A: careerScore.frontendReadiness, fullMark: 100 },
    { subject: "Backend", A: careerScore.backendReadiness, fullMark: 100 },
    { subject: "DevOps", A: careerScore.devOpsReadiness, fullMark: 100 },
    { subject: "AI Orchestration", A: 40, fullMark: 100 },
    { subject: "Databases", A: 60, fullMark: 100 },
    { subject: "Architecture", A: 70, fullMark: 100 },
  ];

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      recalculateCareerScore();
      setIsRecalculating(false);
    }, 1200);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12 min-w-0 overflow-x-hidden">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:px-4 sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 pt-6 sm:py-4 pb-6 px-6 md:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2 leading-tight">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 shrink-0" />
            <span className="truncate">AI Career readiness cockpit</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 break-words">
            Real-time scanner metrics analyzing credentials matching:{" "}
            <span className="text-indigo-300 font-bold break-all">
              {user?.careerGoal || "Target Role"}
            </span>
            .
          </p>
        </div>

        <Button
          variant="glow"
          className="h-11 w-full sm:w-auto self-stretch sm:self-center shrink-0 text-xs sm:text-sm"
          isLoading={isRecalculating}
          onClick={handleRecalculate}
          leftIcon={
            <Sparkles
              className="w-4 h-4 animate-spin shrink-0"
              style={{ animationDuration: "3s" }}
            />
          }
        >
          Recalculate Score
        </Button>
      </div>

      {/* Grid: Global overall score widget & Sub-readiness gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Overall Readiness Card */}
        <Card
          hoverEffect={true}
          glowColor="#8b5cf6"
          className="bg-[#08051e]/40 lg:col-span-2 flex flex-col justify-between overflow-hidden"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Activity className="w-4 h-4 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
                Aggregated matching rating
              </span>
            </div>
            <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2 flex-wrap">
              <span>Overall Career Readiness Score</span>
              <Tooltip content="Calculated from your resume keyword match, GitHub activity, and completed roadmap milestones, weighted against real-world requirements for your target role.">
                <Info
                  className="h-3.5 w-3.5 cursor-help text-slate-500 hover:text-indigo-400 transition-colors shrink-0"
                  aria-label="Career readiness score information"
                />
              </Tooltip>
            </CardTitle>
            <CardDescription className="text-xs leading-normal text-slate-400">
              Based on connected resume keyword matching, GitHub profile crawl,
              and active roadmaps milestones checked.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 sm:pt-4 items-center flex-1">
            {/* Massive Circular score indicator */}
            <div className="sm:col-span-1 flex flex-col items-center justify-center text-center p-5 bg-white/2 rounded-2xl border border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/5 blur-[20px] rounded-full" />
              <span className="text-4xl sm:text-5xl font-black text-white relative z-10">
                {careerScore.overallScore}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-1 relative z-10 uppercase tracking-widest flex items-center justify-center gap-1">
                Match rate
                <Tooltip content="The percentage overlap between your current profile and the skills, experience, and keywords typically required for your target role.">
                  <Info
                    className="h-3 w-3 cursor-help text-slate-500 hover:text-indigo-400 transition-colors shrink-0"
                    aria-label="Match rate information"
                  />
                </Tooltip>
              </span>
            </div>

            {/* Radar chart */}
            <div className="sm:col-span-2 h-[220px] sm:h-[240px] w-full flex items-center justify-center pt-2 min-w-0">
              <SkillRadarChart data={radarData} />
            </div>
          </CardContent>
          <CardFooter className="p-4 sm:p-6 pt-3 border-t border-white/5 text-xs text-slate-500 flex flex-col sm:flex-row gap-1 sm:gap-0 justify-between items-start sm:items-center">
            <span className="truncate max-w-full">
              Current target:{" "}
              <strong className="text-slate-400">{user?.careerGoal || "Developer"}</strong>
            </span>
            <span>Last scanned: Live</span>
          </CardFooter>
        </Card>

        {/* Sub-readiness metric bars */}
        <Card
          hoverEffect={true}
          className="bg-[#08051e]/40 flex flex-col justify-between overflow-hidden"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2 flex-wrap">
              <span>Category Readiness Gauges</span>
              <Tooltip content="Each gauge reflects how much of your detected skill set covers what's typically expected for that area of full-stack development.">
                <Info
                  className="h-3.5 w-3.5 cursor-help text-slate-500 hover:text-indigo-400 transition-colors shrink-0"
                  aria-label="Category readiness gauges information"
                />
              </Tooltip>
            </CardTitle>
            <CardDescription className="text-xs leading-normal text-slate-400">
              Individual matching rates across standard full-stack areas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1 flex-1 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-slate-400">Frontend Readiness</span>
                <span className="text-indigo-300 font-bold">
                  {careerScore.frontendReadiness}%
                </span>
              </div>
              <Progress
                value={careerScore.frontendReadiness}
                className="h-1.5 w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-slate-400">Backend Readiness</span>
                <span className="text-purple-300 font-bold">
                  {careerScore.backendReadiness}%
                </span>
              </div>
              <Progress
                value={careerScore.backendReadiness}
                barClassName="bg-gradient-to-r from-purple-500 to-indigo-500"
                className="h-1.5 w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-slate-400">DevOps Readiness</span>
                <span className="text-pink-300 font-bold">
                  {careerScore.devOpsReadiness}%
                </span>
              </div>
              <Progress
                value={careerScore.devOpsReadiness}
                barClassName="bg-gradient-to-r from-pink-500 to-purple-500"
                className="h-1.5 w-full"
              />
            </div>

            <div className="h-px bg-white/5 my-3" />

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              <span className="flex items-center gap-1">
                Resume score rating
                <Tooltip content="How closely your uploaded resume's keywords and structure match what recruiters and ATS systems look for in your target role.">
                  <Info
                    className="h-3 w-3 cursor-help text-slate-500 hover:text-indigo-400 transition-colors shrink-0"
                    aria-label="Resume score rating information"
                  />
                </Tooltip>
              </span>
              <span className="font-bold text-slate-300">
                {careerScore.resumeScore}% Matches
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Skill gaps lists & Actionable improvement blueprints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 ">
        {/* Detected missing skills list */}
        <Card hoverEffect={true} className="bg-[#08051e]/40 lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2 text-rose-400 mb-1">
              <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
                Profile scanning discrepancies
              </span>
              <Tooltip content="Skills flagged as missing by comparing your detected profile against the typical requirements for your target role.">
                <Info
                  className="h-3 w-3 cursor-help text-rose-400/70 hover:text-rose-300 transition-colors shrink-0"
                  aria-label="Profile scanning discrepancies information"
                />
              </Tooltip>
            </div>
            <CardTitle className="text-base sm:text-lg font-bold">
              Detected Missing Skills & Gaps
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Based on market comparison algorithms matching:{" "}
              <span className="text-slate-300 break-all">{user?.careerGoal || "Target Role"}</span>
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 flex-1 pt-1">
            {careerScore.missingSkills.map((gap, idx) => {
              const badgeColors = {
                High: "bg-rose-500/10 border-rose-500/20 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.15)]",
                Medium: "bg-amber-500/10 border-amber-500/20 text-amber-300",
                Low: "bg-indigo-500/10 border-indigo-500/20 text-indigo-300",
              };

              return (
                <div
                  key={idx}
                  className="p-2.5 bg-white/2 rounded-xl border border-white/5 flex items-center justify-between text-xs text-slate-300 gap-2"
                >
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-bold text-slate-200 truncate">
                      {gap.name}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-slate-400">{gap.category}</p>
                  </div>
                  <Badge variant="glow" className={`${badgeColors[gap.importance]} self-start sm:self-center shrink-0`}>
                    {gap.importance} Priority
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* AI Action recommendations */}
        <Card
          hoverEffect={true}
          className="bg-[#08051e]/40 flex flex-col justify-between overflow-hidden"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2 text-indigo-400 mb-1">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
                Action recommendation blueprint
              </span>
              <Tooltip content="Suggested next steps generated by comparing your detected skill gaps against your target role, prioritized by impact.">
                <Info
                  className="h-3 w-3 cursor-help text-indigo-400/70 hover:text-indigo-300 transition-colors shrink-0"
                  aria-label="Action recommendation blueprint information"
                />
              </Tooltip>
            </div>
            <CardTitle className="text-base sm:text-lg font-bold">
              AI Improvement Pathways
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Step-by-step guidance to raise matching score.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 pt-1 text-xs text-slate-400 leading-relaxed">
            {careerScore.improvements.map((imp, idx) => (
              <div key={idx} className="flex items-start space-x-2.5">
                <CheckCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0 mt-0.5" />
                <span className="break-words">{imp}</span>
              </div>
            ))}
          </CardContent>
          <CardFooter className="pt-2">
            <Link href="/dashboard/projects" className="w-full">
              <Button
                variant="premium"
                className="w-full sm:p-2 text-xs h-11"
                rightIcon={<ChevronRight className="w-4 h-4 shrink-0" />}
              >
                Build Project Recommended Gaps
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}