import {
    Code,
    Video,
    Database,
    Layout,
    Cpu,
    Globe,
    Award,
    Zap,
    Briefcase,
    Users,
    Mic,
    BookOpen,
    Camera,
    Smartphone
} from "lucide-react";

export const PROFILE_DATA = {
    name: "John Oluleke-Oke",
    role: "Creative Technologist · Filmmaker · Polymath",
    about:
        "Product-minded Software Engineer and National Speedcubing Champion. I blend technical depth with cinematic storytelling to build intuitive, intelligent experiences. From architecting full-stack AI applications to producing educational content for thousands of creators, I operate at the intersection of logic and creativity.",
    stats: {
        experience: "5+",
        projects: "30+",
        videos: "280+",
        views: "176K+",
    },
    socials: {
        github: "https://github.com/JStaRFilms",
        linkedin: "https://www.linkedin.com/in/saxy/",
        youtube: "https://youtube.com/@jstarfilms",
        email: "mailto:john@jstarfilms.com",
        whatsapp: "https://wa.me/2348152657887"
    },
    // NEW: Speedcubing Section
    speedcubing: {
        wcaId: "2022JOHN41",
        status: "National Champion",
        medals: {
            gold: 2, // 2x2, Megaminx
            silver: 2, // 4x4, OH
            bronze: 1, // 3x3
        },
        records: [
            { event: "3x3x3 Cube", single: "11.73s", average: "13.14s", rank: "Top 20 National" },
            { event: "2x2x2 Cube", single: "3.53s", average: "4.89s", rank: "National Gold" },
            { event: "Megaminx", single: "2:20.17", average: "2:50.86", rank: "National Gold" },
        ],
        highlight: "Solving problems at speed is my DNA. Whether it's an algorithm for a Rubik's cube or a distributed system, I optimize for efficiency and elegance.",
    },
    // NEW: Entrepreneurship & Speaking
    ventures: [
        {
            name: "The Olive Blessed Crest Academy",
            role: "Co-Owner & Director",
            description: "Driving educational innovation in Nigeria. Instrumental in integrating technology into the curriculum and overseeing strategic operations.",
            icon: Users,
        },
        {
            name: "TEDxElizadeUniversity",
            role: "Speaker",
            description: "Delivered the talk 'What if reality is editable?', exploring the intersection of digital media, perception, and technology.",
            icon: Mic,
        },
    ],
    projects: [
        {
            title: "Adaptive Study Game",
            category: "EdTech / AI",
            description: "Multimodal AI study platform transforming notes and videos into interactive quizzes. Built with 'Parallel Pipelines' for real-time generation.",
            tech: ["React", "TypeScript", "Gemini API", "IndexedDB"],
            link: "#",
            featured: true,
        },
        {
            title: "MindGuard-AI",
            category: "HealthTech",
            description: "Privacy-first desktop app for mental wellness tracking. Features local ONNX inference for offline sentiment analysis.",
            tech: ["Electron", "React", "Python", "ONNX"],
            link: "https://github.com/JStaRFilms/MindGuard-AI",
            featured: true,
        },
        {
            title: "AI Storyboard Studio",
            category: "Creative Tools",
            description: "Web app generating visual storyboards from scripts. Seamlessly bridges Next.js frontend with a Python/Flask ML backend.",
            tech: ["Next.js", "Python/Flask", "Supabase", "GenAI"],
            link: "https://github.com/JStaRFilms/AI-Storyboard-Studio",
            featured: true,
        },
    ],
    experience: [
        {
            company: "JStaRFilms",
            role: "Founder & Lead Creator",
            period: "2020 - Present",
            description: [
                "Grew a YouTube community with over 280+ videos, specializing in DaVinci Resolve color grading and mobile cinematography.",
                "Published unique 'filmmaking hacks' and technical problem-solving content, accumulating 176k+ total views.",
                "Provided professional videography for live events, managing projects from consultation to final delivery.",
            ],
            icon: Video,
        },
        {
            company: "Winning Worship Way",
            role: "Media Director",
            period: "2020 - Present",
            description: [
                "Head of live stream production and multi-camera broadcasts.",
                "Manage weekly post-production workflows and social media content strategy.",
            ],
            icon: Zap,
        },
        {
            company: "Google DSC",
            role: "Multimedia Lead",
            period: "2023 - 2024",
            description: [
                "Directed visual storytelling and branding for developer community events.",
                "Produced high-quality video and photo content adhering to official GDSC branding.",
            ],
            icon: Globe,
        },
        {
            company: "Sharon's Chronicles",
            role: "YouTube Strategist & Editor",
            period: "2023 - Present",
            description: [
                "Edited long-form storytelling content and produced dynamic trailers.",
                "Optimized videos for audience retention and platform algorithms.",
            ],
            icon: Smartphone,
        }
    ],
    skills: {
        engineering: [
            { name: "React / Next.js", level: 95, icon: Code },
            { name: "TypeScript", level: 90, icon: Layout },
            { name: "Python / AI", level: 85, icon: Cpu },
            { name: "System Design", level: 80, icon: Database },
        ],
        creative: [
            { name: "DaVinci Resolve", level: 95, icon: Video },
            { name: "Cinematography", level: 90, icon: Camera },
            { name: "Motion Graphics", level: 85, icon: Zap },
            { name: "Sound Design", level: 80, icon: Mic },
        ],
    },
};
