import { Layout, Server, Smartphone, Terminal } from 'lucide-react';

export const skills = [
  {
    name: 'Top Skills',
    icon: Layout,
    code: 'MOD_CORE',
    color: '#a78bfa',
    items: ['TypeScript', 'React', 'Full Stack Development', 'OAuth 2.0 / OIDC', 'CI/CD', 'System Design', 'React Flow'],
  },
  {
    name: 'Frontend & Frameworks',
    icon: Smartphone,
    code: 'MOD_FE',
    color: '#00f3ff',
    items: ['ReactJS', 'NextJS', 'Angular', 'VueJS', 'Tailwind CSS', 'Framer Motion', 'Material UI', 'RxJS/NgRx'],
  },
  {
    name: 'Backend & Database',
    icon: Server,
    code: 'MOD_BE',
    color: '#34d399',
    items: ['Node.js', 'Express.js', 'Python3', 'Kafka', 'MongoDB', 'PostgreSQL', 'Firebase', 'REST APIs'],
  },
  {
    name: 'Tools & Platforms',
    icon: Terminal,
    code: 'MOD_OPS',
    color: '#fbbf24',
    items: ['Git', 'Docker', 'AWS', 'Vercel', 'Postman', 'Stripe', 'Gemini AI', 'Browser Stack'],
  },
];
