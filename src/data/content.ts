export type Theme = "light" | "dark";
export type TextSize = "sm" | "md" | "lg";

export const THEME_KEY = "ac-theme";
export const TEXT_SIZE_KEY = "ac-text-size";

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

export interface Comment {
  id: string;
  author: string;
  message: string;
  date: string;
}

export const aboutIntro = "Hi, I'm Abygail.";

export const aboutBio = [
  "Life hasn't always been easy, but it's taught me resilience, compassion, and the importance of helping others whenever I can. I'm deeply family-oriented, and the people closest to me have always been my greatest source of strength and inspiration.",
  "For as long as I can remember, I've loved building things. I was the child who would gather random parts and little knickknacks from around the house and turn them into something new. My imagination has always been one of my greatest strengths. It allows me to dream beyond what's in front of me and imagine possibilities others might overlook.",
  "Today, that same curiosity drives my passion for technology. I enjoy creating, learning, and solving problems, knowing that every project is another step toward becoming the kind of engineer I aspire to be.",
  "My goal is bigger than simply writing code. I want to create technology that improves lives, solves meaningful problems, and leaves a lasting impact on the world. I believe the greatest innovations begin with a simple idea and the courage to build it, and that's the journey I'm committed to pursuing.",
];

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "1",
    src: "",
    alt: "Graduation moment",
    caption: "Graduation day, a milestone I'm proud of.",
  },
  {
    id: "2",
    src: "",
    alt: "Drama performance",
    caption: "On stage with the drama club.",
  },
  {
    id: "3",
    src: "",
    alt: "Community service",
    caption: "Volunteering and giving back to the community.",
  },
];

export const comments: Comment[] = [
  {
    id: "seed-1",
    author: "Abygail",
    message: "Welcome to my gallery! Photos and messages will be added here over time.",
    date: "2026-07-08",
  },
];

export const extracurriculars = [
  "Graduating member, Heroes Foundation",
  "National Secondary School Entrepreneurship Competition (NSEC)",
  "Choir",
  "Parang",
  "Debate",
  "School Prefect",
  "Tennis",
  "Basketball",
  "Volleyball",
  "Junior Achievement",
  "Journalism",
  "Drama Club",
  "Hip-hop",
  "International Volunteer",
  "Poetry",
  "Painting & Art",
  "Writing",
];

export const skills = [
  "Communication",
  "Design thinking",
  "Works well with others",
  "Leadership",
  "Public speaking",
  "Creative problem-solving",
  "Team collaboration",
  "Time management",
  "Adaptability",
  "Empathy & active listening",
];

export const achievements = [
  {
    title: "Humanitarian Award",
    category: "Service",
  },
  {
    title: "Robotics Certificate",
    category: "STEM",
  },
  {
    title: "Trailblazer Award",
    category: "Leadership",
  },
  {
    title: "Drama and Theatre Performance Award",
    category: "Arts & Performance",
  },
  {
    title: "Junior Achievement Certificate",
    category: "Entrepreneurship",
  },
  {
    title: "National Secondary School Entrepreneurship Competition (NSEC) Certificate",
    category: "Entrepreneurship",
  },
  {
    title: "Kindness Club Certificate",
    category: "Community",
  },
  {
    title: "Prefect Certificate",
    category: "Leadership",
  },
  {
    title: "Basketball Certificate",
    category: "Sports",
  },
];

export const vision = `I believe in using every experience, the challenges and the wins, to grow into someone who lifts others up. My vision is to keep learning, leading, and creating spaces where young people feel seen, supported, and capable of more than they imagined. Whether through tutoring, the arts, entrepreneurship, or community service, I want my work to leave a lasting, positive mark on the lives around me.`;

export const socials = [
  {
    name: "Email",
    handle: "abygailmonicacharles@gmail.com",
    href: "mailto:abygailmonicacharles@gmail.com",
    preferred: true,
  },
  {
    name: "Instagram",
    handle: "@abby.charless",
    href: "https://instagram.com/abby.charless",
    preferred: false,
  },
  {
    name: "TikTok",
    handle: "@____abbyyy",
    href: "https://tiktok.com/@____abbyyy",
    preferred: false,
  },
];
