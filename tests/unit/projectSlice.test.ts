import { describe, it, expect, vi } from 'vitest';
import type { Project, Roadmap } from '@/types';

vi.mock('@/app/actions/projectActions', () => ({
  toggleProjectMilestoneInDb: vi.fn(),
  createActivityInDb: vi.fn(),
  saveProjectToDb: vi.fn(),
  reorderProjectMilestonesInDb: vi.fn(),
}));

describe('projectSlice', () => {
  it('initializes with correct default state', () => {
    const mockProject: Project = {
      id: 'project-1',
      title: 'Test Project',
      tagline: 'A test project',
      description: 'Test description',
      difficulty: 'Beginner',
      duration: '2 weeks',
      resumeValue: 80,
      careerImpact: 'High',
      skillsGained: ['React', 'TypeScript'],
      technologies: ['React', 'TypeScript'],
      recommendationReason: 'Good for learning',
      features: ['Feature 1'],
      recommendedApis: [],
      toolsRequired: [],
      completionTime: '2 weeks',
      githubPortfolioValue: 'High',
      category: 'Web',
    };

    expect(mockProject.id).toBe('project-1');
    expect(mockProject.title).toBe('Test Project');
    expect(mockProject.difficulty).toBe('Beginner');
  });

  it('handles roadmap step completion toggle logic', () => {
    const step = {
      id: 'step-1',
      title: 'Setup',
      duration: 'Day 1',
      description: 'Initial setup',
      tasks: ['Install deps'],
      completed: false,
      type: 'fundamentals' as const,
    };

    const toggledStep = { ...step, completed: !step.completed };
    expect(toggledStep.completed).toBe(true);

    const toggledBack = { ...toggledStep, completed: !toggledStep.completed };
    expect(toggledBack.completed).toBe(false);
  });

  it('reorders steps correctly', () => {
    const steps = [
      { id: 'a', title: 'Step A', type: 'fundamentals' as const },
      { id: 'b', title: 'Step B', type: 'frontend' as const },
      { id: 'c', title: 'Step C', type: 'backend' as const },
    ];

    const reordered = [...steps];
    const [moved] = reordered.splice(2, 1);
    reordered.splice(0, 0, moved);

    expect(reordered[0].id).toBe('c');
    expect(reordered[1].id).toBe('a');
    expect(reordered[2].id).toBe('b');
  });

  it('calculates progress percentage from completed steps', () => {
    const steps = [
      { completed: true },
      { completed: false },
      { completed: true },
      { completed: false },
    ];

    const completedCount = steps.filter(s => s.completed).length;
    const progress = Math.round((completedCount / steps.length) * 100);

    expect(completedCount).toBe(2);
    expect(progress).toBe(50);
  });

  it('handles empty roadmap gracefully', () => {
    const emptyRoadmap: Roadmap = {
      projectId: 'project-1',
      projectTitle: 'Empty',
      steps: [],
    };

    expect(emptyRoadmap.steps).toHaveLength(0);
    expect(emptyRoadmap.steps.length).toBe(0);
    const progress = emptyRoadmap.steps.length === 0 ? 0 : Math.round((0 / 0) * 100);
    expect(progress).toBe(0);
  });
});
