import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAppStore } from '@/store/useAppStore';

// Mock server/database actions
vi.mock('@/app/actions/projectActions', () => ({
  toggleProjectMilestoneInDb: vi.fn(),
  createActivityInDb: vi.fn(),
  saveProjectToDb: vi.fn(() => Promise.resolve({ success: true, project: {} })),
  reorderProjectMilestonesInDb: vi.fn(),
}));

vi.mock('@/app/actions/chatActions', () => ({
  saveConversation: vi.fn(),
}));

vi.mock('@/app/actions/githubActions', () => ({
  fetchGithubOauthAnalytics: vi.fn(() => Promise.resolve({ success: false })),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('useAppStore (Zustand Global Store)', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test case
    useAppStore.setState({
      onboardingStep: 1,
      onboardingData: {
        fullName: "",
        email: "",
        experienceLevel: "intermediate",
        dreamRole: "AI Engineer",
        skills: [],
        resumeFile: null,
        resumeName: null,
        githubUrl: "",
        linkedinUrl: "",
        availableHoursPerWeek: 15,
      },
      user: {
        id: 'user-yogender',
        name: 'Yogender Verma',
        username: 'yogender-verma',
        email: 'yogendarverma0268@gmail.com',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80',
        careerGoal: 'AI Engineer',
        skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
        portfolioPublic: false,
        githubUrl: '',
        linkedinUrl: '',
        resumeUrl: '',
      },
      isAuthenticated: true,
      selectedProjectId: 'project-1',
      accentTheme: 'indigo',
      isRoastMode: false,
      isMockInterview: false,
      isReadingMode: false,
      activeReadingMessageId: null,
      translateLanguage: null,
      isGenerating: false,
    });
  });

  describe('Onboarding Actions', () => {
    it('should set onboarding fields correctly', () => {
      useAppStore.getState().setOnboardingField('fullName', 'John Doe');
      useAppStore.getState().setOnboardingField('availableHoursPerWeek', 25);
      
      const { onboardingData } = useAppStore.getState();
      expect(onboardingData.fullName).toBe('John Doe');
      expect(onboardingData.availableHoursPerWeek).toBe(25);
    });

    it('should set onboarding step correctly', () => {
      useAppStore.getState().setOnboardingStep(3);
      expect(useAppStore.getState().onboardingStep).toBe(3);
    });

    it('should reset onboarding data to default', () => {
      useAppStore.getState().setOnboardingField('fullName', 'John Doe');
      useAppStore.getState().setOnboardingStep(4);
      
      useAppStore.getState().resetOnboarding();
      
      const { onboardingData, onboardingStep } = useAppStore.getState();
      expect(onboardingStep).toBe(1);
      expect(onboardingData.fullName).toBe('');
    });
  });

  describe('Auth & Profile Actions', () => {
    it('should login correctly and set authenticated state', () => {
      useAppStore.getState().login('alice@example.com', 'Alice');
      const { isAuthenticated, user } = useAppStore.getState();
      expect(isAuthenticated).toBe(true);
      expect(user?.email).toBe('alice@example.com');
      expect(user?.name).toBe('Alice');
    });

    it('should logout and clear user state', () => {
      useAppStore.getState().logout();
      const { isAuthenticated, user } = useAppStore.getState();
      expect(isAuthenticated).toBe(false);
      expect(user).toBeNull();
    });

    it('should update user profile information', () => {
      useAppStore.getState().updateProfile('Bob', 'bob@example.com', 'DevOps');
      const { user } = useAppStore.getState();
      expect(user?.name).toBe('Bob');
      expect(user?.email).toBe('bob@example.com');
      expect(user?.careerGoal).toBe('DevOps');
    });

    it('should update user skills set', () => {
      useAppStore.getState().updateUserSkills(['Rust', 'Go']);
      const { user } = useAppStore.getState();
      expect(user?.skills).toEqual(['Rust', 'Go']);
    });

    it('should update portfolio visibility and username', () => {
      useAppStore.getState().updatePortfolioVisibility(true, 'bob-dev');
      const { user } = useAppStore.getState();
      expect(user?.portfolioPublic).toBe(true);
      expect(user?.username).toBe('bob-dev');
    });
  });

  describe('Project Slice Actions', () => {
    it('should select project correctly', () => {
      useAppStore.getState().selectProject('project-99');
      expect(useAppStore.getState().selectedProjectId).toBe('project-99');
    });

    it('should add a custom project correctly', async () => {
      const { projects: initialProjects } = useAppStore.getState();
      const initialProjectsCount = initialProjects.length;

      const customProject = {
        id: 'custom-proj-1',
        title: 'Custom Test Project',
        tagline: 'Custom test',
        description: 'Test description',
        difficulty: 'Intermediate' as const,
        duration: '3 weeks',
        resumeValue: 90,
        careerImpact: 'High',
        skillsGained: ['Next.js'],
        technologies: ['Next.js'],
        recommendationReason: 'Mock test',
        features: [],
        recommendedApis: [],
        toolsRequired: [],
        completionTime: '3 weeks',
        githubPortfolioValue: 'High',
        category: 'Web' as const,
      };

      await useAppStore.getState().addCustomProject(customProject);
      
      const { projects } = useAppStore.getState();
      expect(projects.length).toBe(initialProjectsCount + 1);
      expect(projects[0].id).toBe('custom-proj-1');
      expect(projects[0].title).toBe('Custom Test Project');
    });
  });

  describe('Chat Actions', () => {
    it('should toggle and set roast mode and disable conflicting mock interview', () => {
      useAppStore.getState().setMockInterview(true);
      useAppStore.getState().toggleRoastMode();
      
      const { isRoastMode, isMockInterview } = useAppStore.getState();
      expect(isRoastMode).toBe(true);
      expect(isMockInterview).toBe(false);
    });

    it('should toggle and set mock interview and disable conflicting roast mode', () => {
      useAppStore.getState().setRoastMode(true);
      useAppStore.getState().toggleMockInterview();
      
      const { isRoastMode, isMockInterview } = useAppStore.getState();
      expect(isRoastMode).toBe(false);
      expect(isMockInterview).toBe(true);
    });

    it('should set reading mode settings', () => {
      useAppStore.getState().setReadingMode(true, 'message-123');
      const { isReadingMode, activeReadingMessageId } = useAppStore.getState();
      expect(isReadingMode).toBe(true);
      expect(activeReadingMessageId).toBe('message-123');
    });

    it('should set translate language', () => {
      useAppStore.getState().setTranslateLanguage('Spanish');
      expect(useAppStore.getState().translateLanguage).toBe('Spanish');
    });

    it('should create, select, and delete conversations correctly', () => {
      const convId = useAppStore.getState().createNewConversation('Mock Project Chat');
      
      expect(convId).toBeDefined();
      const { conversations } = useAppStore.getState();
      const newConv = conversations.find(c => c.id === convId);
      expect(newConv).toBeDefined();
      expect(newConv?.title).toBe('Mock Project Chat');

      // Select conversation
      useAppStore.getState().selectConversation(convId);
      expect(useAppStore.getState().activeConversationId).toBe(convId);

      // Delete conversation
      useAppStore.getState().deleteConversation(convId);
      const { conversations: updatedConvs } = useAppStore.getState();
      expect(updatedConvs.find(c => c.id === convId)).toBeUndefined();
    });
  });

  describe('Theme Slice Actions', () => {
    it('should change global accent theme color', () => {
      useAppStore.getState().setAccentTheme('pink');
      expect(useAppStore.getState().accentTheme).toBe('pink');
    });
  });
});
