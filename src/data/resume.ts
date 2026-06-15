import type {
  EducationItem,
  ExperienceItem,
  NavLink,
  Project,
  SkillCategory,
  SocialLink,
  Stat,
} from "@/types";

export const profile = {
  name: "Yashwanth B K",
  title: "Backend-Focused Software Developer",
  role: "Software Developer @ Eruna Technologies",
  headline:
    "Backend-focused Software Developer specializing in ASP.NET Core, CQRS architecture, and database engineering across PostgreSQL, MongoDB, and SQL Server, with hands-on production support for enterprise applications.",
  valueProp:
    "I design and maintain reliable server-side systems — CQRS-based ASP.NET Core services, well-modeled SQL and NoSQL data layers, and disciplined production support for platforms serving 12,000+ active users.",
  summary:
    "Backend-focused Software Developer experienced in building and maintaining enterprise systems with ASP.NET Core and CQRS architecture. My core strengths are server-side development, database engineering across PostgreSQL, MongoDB, and SQL Server, production support, and debugging legacy code. I've contributed to a CRM platform serving 12,000+ active users across 100+ organizations. I also work across the stack and can build front ends with React when a project calls for it.",
  location: "Bengaluru, Karnataka, India",
  email: "yashwanthgowdabk1@gmail.com",
  phone: "+91-8073889562",
  github: "https://github.com/Yashwanth-b-k",
  linkedin: "https://www.linkedin.com/in/yashwanth-b-k-96737323a/",
  portfolio: "https://yashwanthbk.netlify.app",
  resume: "/Yashwanth_Gowda_Resume.pdf",
};

export const navLinks: NavLink[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export const socials: SocialLink[] = [
  { label: "GitHub", href: profile.github, icon: "github" },
  { label: "LinkedIn", href: profile.linkedin, icon: "linkedin" },
  { label: "Email", href: `mailto:${profile.email}`, icon: "mail" },
];

export const stats: Stat[] = [
  { label: "Years Experience", value: "1+" },
  { label: "Active Users Served", value: "12K+" },
  { label: "Organizations", value: "100+" },
  { label: "Projects Shipped", value: "6+" },
];

export const aboutHighlights: string[] = [
  "ASP.NET Core",
  "C#",
  "CQRS Architecture",
  "PostgreSQL",
  "MongoDB",
  "SQL Server",
  "REST APIs",
  "Production Support",
];

export const experiences: ExperienceItem[] = [
  {
    company: "Eruna Technologies",
    role: "Software Developer",
    location: "Bengaluru, India",
    duration: "Sep 2025 — Present",
    type: "Full-time",
    highlights: [
      "Develop new modules and maintain/debug legacy code to improve system stability, performance, and feature coverage.",
      "Maintain Production, Staging, and Development databases, ensuring consistency and data integrity.",
      "Resolve live production issues through log analysis and root-cause debugging.",
      "Work closely with QA and support teams to deploy fixes and enhancements efficiently.",
    ],
    impact: [
      "Improved system stability across enterprise modules",
      "Ensured data integrity across three environments",
      "Reduced production incident resolution time via structured log analysis",
    ],
  },
  {
    company: "Rooman Technologies",
    role: "MERN-Stack Intern",
    location: "Remote",
    duration: "Oct 2024 — Mar 2025",
    type: "Internship",
    highlights: [
      "Designed and deployed 3+ MERN full-stack applications, boosting development speed by 40%.",
      "Implemented JWT-based authentication and role-based access control.",
      "Completed 300+ hours of structured training in frontend and backend web technologies.",
    ],
    impact: [
      "40% faster delivery across full-stack apps",
      "Hardened authentication with JWT + RBAC",
      "300+ hours of structured engineering training",
    ],
  },
  {
    company: "KodNest Technologies",
    role: "Full Stack Java Trainee",
    location: "Bengaluru, India",
    duration: "May 2025 — Present",
    type: "Training",
    highlights: [
      "Hands-on training in Core/Advanced Java, Spring Boot, MySQL, HTML, CSS, and JavaScript.",
      "Enhanced analytical and coding skills by solving 70+ programming challenges.",
    ],
    impact: [
      "70+ coding challenges solved",
      "Strengthened Java + Spring Boot fundamentals",
    ],
  },
];

export const skillCategories: SkillCategory[] = [
  {
    category: "Backend",
    icon: "server",
    skills: [
      { name: "ASP.NET Core", strong: true },
      { name: "C#", strong: true },
      { name: "REST APIs", strong: true },
      { name: "Node.js" },
    ],
  },
  {
    category: "Databases",
    icon: "database",
    skills: [
      { name: "PostgreSQL", strong: true },
      { name: "MongoDB", strong: true },
      { name: "SQL Server", strong: true },
      { name: "MySQL" },
    ],
  },
  {
    category: "Architecture",
    icon: "layers",
    skills: [
      { name: "CQRS", strong: true },
      { name: "MVC", strong: true },
    ],
  },
  {
    category: "Cloud",
    icon: "cloud",
    skills: [{ name: "AWS EC2" }, { name: "AWS S3" }],
  },
  {
    category: "Tools",
    icon: "wrench",
    skills: [
      { name: "Git", strong: true },
      { name: "Postman", strong: true },
      { name: "Axios" },
      { name: "Code Review" },
    ],
  },
  {
    category: "Frontend",
    icon: "layout",
    skills: [
      { name: "React.js" },
      { name: "JavaScript" },
      { name: "Tailwind CSS" },
      { name: "HTML & CSS" },
    ],
  },
];

export const projects: Project[] = [
  {
    name: "CRM Management System",
    tagline: "Enterprise multi-client CRM platform",
    description:
      "A multi-client enterprise CRM platform used by 12,000+ active users across 100+ organizations, built on a CQRS architecture for scalability and maintainability. My work centers on the ASP.NET Core backend, data layer, and production stability.",
    technologies: ["ASP.NET Core", "CQRS", "SQL Server", "C#", "React"],
    achievements: [
      "Developed and maintained a CRM serving 12,000+ active users across 100+ organizations",
      "Built and maintained core modules — Attendance, Leave Management, Shift Management, and Exit Management",
      "Handled production issues, database management, and code debugging to ensure system stability",
    ],
    architecture: [
      "CQRS command/query separation for scalable reads and writes",
      "Layered ASP.NET Core services with SQL Server persistence",
      "Versioned REST APIs consumed by a React front end",
    ],
    featured: true,
    github: "https://github.com/Yashwanth-Eruna",
  },
  {
    name: "Ruchi Hub",
    tagline: "Food ordering application",
    description:
      "A food ordering platform with secure authentication, restaurant management, and order processing, built on Spring Boot with a normalized relational data model.",
    technologies: ["Java", "Spring Boot", "Spring Security", "JWT", "MySQL"],
    achievements: [
      "Programmed 12+ secure REST APIs with JWT authentication and role-based access",
      "Implemented user login, restaurant CRUD, and order management",
      "Reduced API response time by 30%",
    ],
    architecture: [
      "Spring Boot REST layer secured with Spring Security + JWT",
      "Role-based access control across user and admin flows",
      "Normalized MySQL schema for orders and restaurants",
    ],
    featured: true,
    date: "Mar 2025",
    github: "https://github.com/Yashwanth-b-k/Ruchi-Hub",
  },
  {
    name: "Real Estate Web Application",
    tagline: "Property discovery platform",
    description:
      "A dynamic real estate application with rich filtering and a secure authentication system for browsing and managing property listings, backed by an Express + MongoDB API.",
    technologies: ["Node.js", "Express", "MongoDB", "React"],
    achievements: [
      "Built the Express + MongoDB API for listings, accounts, and search",
      "Developed 4+ filter and search components, improving property discoverability",
      "Implemented JWT-based authentication for secure user access",
    ],
    architecture: [
      "Express REST API over a MongoDB document store",
      "JWT authentication securing account and listing access",
      "Composable filter/search components on the client",
    ],
    featured: true,
    date: "Feb 2024",
    github: "https://github.com/Yashwanth-b-k/M-Estate",
  },
];

export const education: EducationItem[] = [
  {
    institution: "Don Bosco Institute of Technology",
    degree: "B.Tech — Computer Science and Engineering",
    location: "Bengaluru, India",
    duration: "Dec 2021 — May 2025",
    gpa: "8.9 / 10",
    courses: [
      "Operating Systems",
      "Data Structures",
      "Analysis of Algorithms",
      "Artificial Intelligence",
      "Object-Oriented Programming",
      "Databases",
      "Full Stack with Django",
    ],
  },
];
