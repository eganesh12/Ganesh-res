export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  image: string;
  metricLabel?: string;
  metricValue?: string;
}

export interface Skill {
  name: string;
  level: number; // 0 to 100
  icon?: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface Certificate {
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  verifyLink: string;
  category: "Google" | "Microsoft" | "AWS" | "IBM" | "Coursera" | "Udemy" | "NPTEL" | "AI" | "National Team Lead" | "IIT AI/ML" | "Data Hackathon" | "International Delegate" | "Case Competition";
}

export interface TimelineEvent {
  period: string;
  title: string;
  organization: string;
  description: string[];
  tag: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface AnalyticsStats {
  visitors: number;
  resumeDownloads: number;
  contactRequests: number;
  projectViews: number;
  chatbotUsage: number;
}
