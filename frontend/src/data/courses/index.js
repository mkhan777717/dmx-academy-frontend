import { allPhases as reactPhases, resourcesList as reactRes, glossary as reactGloss } from "./reactData";
import { allPhases as nextPhases, resourcesList as nextRes, glossary as nextGloss } from "./nextData";
import { allPhases as nodePhases, resourcesList as nodeRes, glossary as nodeGloss } from "./nodeData";
import { allPhases as webdevPhases, resourcesList as webdevRes, glossary as webdevGloss } from "./webdevData";
import { allPhases as genaiPhases, resourcesList as genaiRes, glossary as genaiGloss } from "./genai/resources";
import { allPhases as mongodbPhases, resourcesList as mongodbRes, glossary as mongodbGloss } from "./mongodbData";
import { allPhases as devopsPhases, resourcesList as devopsRes, glossary as devopsGloss } from "./devopsData";
import { allPhases as flutterPhases, resourcesList as flutterRes, glossary as flutterGloss } from "./flutterData";
import { allPhases as reactNativePhases, resourcesList as reactNativeRes, glossary as reactNativeGloss } from "./reactNativeData";
import { allPhases as mlAiPhases, resourcesList as mlAiRes, glossary as mlAiGloss } from "./mlAiData";
import { allPhases as cybersecurityPhases, resourcesList as cybersecurityRes, glossary as cybersecurityGloss } from "./cybersecurityData";
import { allPhases as cloudComputingPhases, resourcesList as cloudComputingRes, glossary as cloudComputingGloss } from "./cloudComputingData";
import { allPhases as dataSciencePhases, resourcesList as dataScienceRes, glossary as dataScienceGloss } from "./dataScienceData";
import { allPhases as blockchainPhases, resourcesList as blockchainRes, glossary as blockchainGloss } from "./blockchainData";
import { allPhases as trendingTechPhases, resourcesList as trendingTechRes, glossary as trendingTechGloss } from "./trendingTechData";

export const coursesRegistry = {
  "react": {
    allPhases: reactPhases,
    resourcesList: reactRes,
    glossary: reactGloss,
    title: "React.js Foundations",
    desc: "Master component state variables, JSX mechanics, props mapping, hooks lifecycle, and React 19 rendering rules.",
    icon: "Layers",
    tags: ["React 19", "Hooks", "Virtual DOM"],
    category: "Web & Mobile Development",
    difficulty: "Beginner-Intermediate",
    accent: "#3b82f6",
    gradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
    duration: "18 hrs",
    lessons: 30
  },
  "next": {
    allPhases: nextPhases,
    resourcesList: nextRes,
    glossary: nextGloss,
    title: "Next.js App Router",
    desc: "Leverage App Router nested layouts, Server Components optimization, dynamic endpoints, caching revalidation, and Server Actions.",
    icon: "Server",
    tags: ["Next.js 15", "App Router", "RSC"],
    category: "Web & Mobile Development",
    difficulty: "Intermediate",
    accent: "#6366f1",
    gradient: "from-indigo-500/10 via-purple-500/5 to-transparent",
    duration: "22 hrs",
    lessons: 45
  },
  "node": {
    allPhases: nodePhases,
    resourcesList: nodeRes,
    glossary: nodeGloss,
    title: "Node.js & Express API",
    desc: "Build asynchronous backend REST API routers, configure logger middleware chains, parse requests, and secure auth tokens.",
    icon: "Cpu",
    tags: ["Node.js", "Express", "REST APIs"],
    category: "Web & Mobile Development",
    difficulty: "Advanced",
    accent: "#10b981",
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    duration: "15 hrs",
    lessons: 24
  },
  "web-development": {
    allPhases: webdevPhases,
    resourcesList: webdevRes,
    glossary: webdevGloss,
    title: "Complete Web Dev",
    desc: "Build structured, semantic, responsive webpages from scratch using HTML5, CSS3, Flexbox grids, and vanilla JavaScript programming.",
    icon: "Code",
    tags: ["HTML", "CSS", "JavaScript"],
    category: "Web & Mobile Development",
    difficulty: "Beginner",
    accent: "#ef4444",
    gradient: "from-red-500/10 via-orange-500/5 to-transparent",
    duration: "16 Weeks",
    lessons: 16
  },
  "generative-ai": {
    allPhases: genaiPhases,
    resourcesList: genaiRes,
    glossary: genaiGloss,
    title: "Generative AI Specialist",
    desc: "Explore neural nets transformers, build autonomous prompt workflows, construct LangChain vector networks, and manage RAG search databases.",
    icon: "Sparkles",
    tags: ["Transformers", "LangChain", "RAG"],
    category: "Data & AI",
    difficulty: "Intermediate",
    accent: "#f59e0b",
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    duration: "25 hrs",
    lessons: 40
  },
  "mongodb": {
    allPhases: mongodbPhases,
    resourcesList: mongodbRes,
    glossary: mongodbGloss,
    title: "MongoDB Mastery",
    desc: "NoSQL database design, aggregation pipelines, document indexing, Mongoose schema validations, and MongoDB Atlas cloud deployment.",
    icon: "Database",
    tags: ["MongoDB", "Mongoose", "Atlas"],
    category: "Web & Mobile Development",
    difficulty: "Intermediate",
    accent: "#10b981",
    gradient: "from-green-500/10 via-emerald-500/5 to-transparent",
    duration: "10 hrs",
    lessons: 18
  },
  "devops": {
    allPhases: devopsPhases,
    resourcesList: devopsRes,
    glossary: devopsGloss,
    title: "DevOps & CI/CD",
    desc: "Docker containerization files, orchestrating multi-container networks using Docker Compose, Jenkins, and automated GitHub Actions workflows.",
    icon: "Cpu",
    tags: ["Docker", "Kubernetes", "CI/CD"],
    category: "Cloud & DevOps",
    difficulty: "Advanced",
    accent: "#6366f1",
    gradient: "from-indigo-500/10 via-blue-500/5 to-transparent",
    duration: "14 hrs",
    lessons: 22
  },
  "flutter": {
    allPhases: flutterPhases,
    resourcesList: flutterRes,
    glossary: flutterGloss,
    title: "Flutter Development",
    desc: "Build beautiful cross-platform mobile apps with Flutter, Dart language specifications, and Material Design layout widgets.",
    icon: "Globe",
    tags: ["Flutter", "Dart", "Mobile"],
    category: "Web & Mobile Development",
    difficulty: "Beginner-Intermediate",
    accent: "#06b6d4",
    gradient: "from-cyan-500/10 via-blue-500/5 to-transparent",
    duration: "20 hrs",
    lessons: 35
  },
  "react-native": {
    allPhases: reactNativePhases,
    resourcesList: reactNativeRes,
    glossary: reactNativeGloss,
    title: "React Native",
    desc: "Create native iOS & Android applications using JavaScript, Expo Go packaging, and stylesheet design optimizations.",
    icon: "Globe",
    tags: ["React Native", "Expo", "Mobile"],
    category: "Web & Mobile Development",
    difficulty: "Intermediate",
    accent: "#d946ef",
    gradient: "from-fuchsia-500/10 via-purple-500/5 to-transparent",
    duration: "16 hrs",
    lessons: 28
  },
  "ml-ai": {
    allPhases: mlAiPhases,
    resourcesList: mlAiRes,
    glossary: mlAiGloss,
    title: "Machine Learning & AI",
    desc: "Python analytics, NumPy arrays, scikit-learn models fitting, dataset classification calculations, and neural networks integrations.",
    icon: "Cpu",
    tags: ["Python", "TensorFlow", "PyTorch"],
    category: "Data & AI",
    difficulty: "Advanced",
    accent: "#f59e0b",
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    duration: "30 hrs",
    lessons: 48
  },
  "cybersecurity": {
    allPhases: cybersecurityPhases,
    resourcesList: cybersecurityRes,
    glossary: cybersecurityGloss,
    title: "Cybersecurity Foundations",
    desc: "Ethical hacking targets, penetration testing, network auditing firewall setups, OWASP security checks, and password encryptions.",
    icon: "Layers",
    tags: ["Ethical Hacking", "OWASP", "Security"],
    category: "Cloud & DevOps",
    difficulty: "Intermediate-Advanced",
    accent: "#ef4444",
    gradient: "from-red-500/10 via-rose-500/5 to-transparent",
    duration: "18 hrs",
    lessons: 30
  },
  "cloud-computing": {
    allPhases: cloudComputingPhases,
    resourcesList: cloudComputingRes,
    glossary: cloudComputingGloss,
    title: "Cloud Computing",
    desc: "Infrastructure provision, cloud virtual private networks (VPC) layouts, serverless architecture functions, AWS hosting, and GCP integration.",
    icon: "Server",
    tags: ["AWS", "Azure", "GCP"],
    category: "Cloud & DevOps",
    difficulty: "Intermediate",
    accent: "#6366f1",
    gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
    duration: "12 hrs",
    lessons: 20
  },
  "data-science": {
    allPhases: dataSciencePhases,
    resourcesList: dataScienceRes,
    glossary: dataScienceGloss,
    title: "Data Science & Analytics",
    desc: "Tabular data wrangling using Python Pandas, Series selectors, aggregations grouping, matplotlib plots, and Power BI dashboards.",
    icon: "Layers",
    tags: ["Pandas", "Power BI", "Analytics"],
    category: "Data & AI",
    difficulty: "Beginner-Intermediate",
    accent: "#10b981",
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    duration: "15 hrs",
    lessons: 25
  },
  "blockchain": {
    allPhases: blockchainPhases,
    resourcesList: blockchainRes,
    glossary: blockchainGloss,
    title: "Blockchain & Web3",
    desc: "Solidity smart contracts syntax, Ethereum Virtual Machine rules, gas consumption optimization, Remix local builds, and Web3 DApps integrations.",
    icon: "Database",
    tags: ["Solidity", "Web3", "DApps"],
    category: "Creative Tech",
    difficulty: "Advanced",
    accent: "#a855f7",
    gradient: "from-purple-500/10 via-indigo-500/5 to-transparent",
    duration: "20 hrs",
    lessons: 32
  },
  "trending-tech": {
    allPhases: trendingTechPhases,
    resourcesList: trendingTechRes,
    glossary: trendingTechGloss,
    title: "Trending Tech Stack",
    desc: "TypeScript typing configurations, compiler tsconfig custom options, GraphQL query methods, Tailwind CSS grids, and Rust memory borrowing checks.",
    icon: "Sparkles",
    tags: ["TypeScript", "GraphQL", "Rust"],
    category: "Creative Tech",
    difficulty: "Intermediate-Advanced",
    accent: "#d946ef",
    gradient: "from-fuchsia-500/10 via-purple-500/5 to-transparent",
    duration: "14 hrs",
    lessons: 22
  }
};
