// =====================================================
// EDIT THIS FILE to change your skills, projects and
// achievements. You do not need to touch index.html.
// =====================================================

// cert: true counts the card in "Certificates" at the top of the page
// image: a picture of the certificate (shown on the card, opens full size when clicked)
const ACHIEVEMENTS = [
    {
        tag: "COURSE COMPLETION · JUNE 2024",
        title: "Java Fundamentals",
        text: "Oracle Academy award of course completion, for satisfactory completion of all coursework.",
        image: "images/certs/java-fundamentals.png",
        cert: true
    },
    {
        tag: "PARTICIPATION · OCTOBER 2024",
        title: "Cyber Security",
        text: "Certificate of participation in the \"Cyber Security\" event at STI College Alabang, Muntinlupa City.",
        image: "images/certs/cyber-security.jpg",
        cert: true
    },
    {
        tag: "CAPSTONE PROJECT",
        title: "UI/UX Designer, SkillConnect",
        text: "Designed the wireframes, clickable prototype and design system for a web-based system used by clients, workers and admins. 4-person team, 1 year."
    }
];

// Skill icons live in images/icons. To add a skill, write { name: "Name", icon: "file-name" }
// where file-name is the icon file without ".svg". A plain "Name" (no icon) also works.
const SKILLS = [
  {
    label: "DESIGN",
    title: "UI/UX DESIGN",
    text: "Designing clear, usable screens: wireframes, clickable prototypes and a design system.",
    items: [
            { name: "Figma", icon: "figma" },
            { name: "Wireframing", icon: "wireframing" },
            { name: "Prototyping", icon: "prototyping" },
            { name: "Design systems", icon: "design-systems" },
            { name: "User flows", icon: "user-flows" },
            { name: "UI design", icon: "ui-design" }
        ]
  },
  {
    label: "TECH",
    title: "IT FOUNDATIONS",
    text: "The technical basics behind the systems I design for.",
    items: [
            { name: "Java", icon: "java" },
            { name: "Cyber security basics", icon: "cyber-security" },
            { name: "HTML", icon: "html" },
            { name: "CSS", icon: "css" }
        ]
  },
  {
    label: "PEOPLE",
    title: "SOFT SKILLS",
    text: "Working well with a team and explaining my design decisions clearly.",
    items: [
            { name: "Time management", icon: "time-management" },
            { name: "Teamwork", icon: "teamwork" },
            { name: "Problem-solving", icon: "problem-solving" },
            { name: "Digital literacy", icon: "digital-literacy" }
        ]
  }
];

// image: put your screenshot in the images folder and change the file name
// alt: a short description of what the screenshot shows (read by screen readers)
// prototype / details / live: optional links. Leave them out and the button is not shown.
//   prototype -> "VIEW PROTOTYPE" button, for your Figma prototype link
// fit: "contain" shows the whole image on a dark background
const PROJECTS = [
  {
    image: "images/skillconnect.png",
    alt: "SkillConnect home page: Building dreams, connecting skills",
    live: "https://skillconnect-ph.vercel.app",
    type: "CAPSTONE · WEB SYSTEM",
    year: "2026",
    title: "SKILLCONNECT",
    text: "A web-based system that connects clients with the best construction professionals and supports the whole journey from inquiry to project completion. As the UI/UX designer on a 4-person team, I designed the wireframes, the clickable prototype and the design system in Figma, with dozens of screens for three user roles: clients, workers and admins.",
    tags: ["Figma", "Wireframing", "Prototyping", "Design system"]
    // prototype: "https://www.figma.com/proto/YOUR-LINK"
  },
  {
    image: "images/recipe-finder.png",
    alt: "Recipe Finder Pro: a search bar above a grid of chicken dish cards",
    type: "WEB APP",
    year: "2026",
    title: "RECIPE FINDER PRO",
    text: "A recipe search web app. Type a dish name to find matching recipes, shown as photo cards that flip over when you click them to reveal the recipe details.",
    tags: ["HTML", "CSS", "JavaScript", "API"],
    live: "https://gab969.github.io/RadioSmart/"
  },
  {
    image: "images/quote-speaker.png",
    alt: "Quote Speaker: a desert road photo above a quote box and voice controls",
    type: "WEB APP",
    year: "2026",
    title: "QUOTE SPEAKER",
    text: "A random quote generator that reads quotes out loud. Generate a quote or type your own, pick a voice, then control the reading with Speak, Pause, Resume and Stop.",
    tags: ["HTML", "CSS", "JavaScript", "Web Speech API"],
    live: "https://gab969.github.io/quote/"
  }
];
