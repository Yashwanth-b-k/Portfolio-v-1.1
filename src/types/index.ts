export interface NavLink {
  id: string;
  label: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "mail" | "globe" | "phone";
}

export interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  duration: string;
  type: "Full-time" | "Internship" | "Training";
  highlights: string[];
  impact: string[];
}

export interface SkillCategory {
  category: string;
  icon: "server" | "layout" | "database" | "layers" | "cloud" | "wrench";
  skills: { name: string; strong?: boolean }[];
}

export interface Project {
  name: string;
  tagline: string;
  description: string;
  technologies: string[];
  achievements: string[];
  architecture: string[];
  featured?: boolean;
  date?: string;
  github?: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  location: string;
  duration: string;
  gpa?: string;
  courses?: string[];
}

export interface Stat {
  label: string;
  value: string;
}
