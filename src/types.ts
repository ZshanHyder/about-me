export interface GithubProfile {
  name: string;
  avatarUrl: string;
  bio: string;
  location: string;
  company: string | null;
  blog: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  htmlUrl: string;
}

export interface Repository {
  name: string;
  owner: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  url: string;
  isPinned: boolean;
}

export interface OptimizedPromptResponse {
  optimizedPrompt: string;
  enhancements: string[];
  expertTips: string;
}
