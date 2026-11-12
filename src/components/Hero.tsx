import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, Mail, Github, Linkedin, Cpu, Code2, Award, Users, Printer, 
  ArrowUpRight, ArrowDownRight, Sparkles, CheckCircle2, ShieldCheck, 
  Bot, LogOut, Loader2, Zap, Scan, ExternalLink, Box 
} from "lucide-react";
import { AnalyticsStats } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
// @ts-ignore
import techAvatarImg from "../assets/images/tech_developer_avatar_1781108834995.png";

interface HeroProps {
  analytics: AnalyticsStats;
  onTrackAction: (metricName: string) => void;
  onNavigateToContact: () => void;
  theme?: "dark" | "light";
  onNavigateToAuth?: () => void;
  onOpen3DFirstPage?: () => void;
}

function GoogleLogoIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.14C3.31 21.36 7.37 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.14z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.31 2.64 1.27 6.59l4.01 3.14c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function Hero({ analytics, onTrackAction, onNavigateToContact, theme = "dark", onNavigateToAuth, onOpen3DFirstPage }: HeroProps) {
  const { t, language } = useLanguage();

  // Animated titles list
  const roles = [
    t("role.0", "AI & Data Science Engineer"),
    t("role.1", "Machine Learning Enthusiast"),
    t("role.2", "Generative AI Developer"),
    t("role.3", "Full Stack Developer"),
  ];

  const [currentRoleIdx, setCurrentRoleIdx] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Google Identity Auth integration
  const { user, signInWithGoogle, logout } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [googleSuccess, setGoogleSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");

  const handleGoogleSignIn = async () => {
    setGoogleError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      onTrackAction("googleSignInHero");
      setGoogleSuccess(true);
      setTimeout(() => setGoogleSuccess(false), 3500);
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setGoogleError(err?.message || "Sign-in handshake cancelled.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAvatarScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanMessage("DIAGNOSTIC MATRIX ACTIVE: AI & DATA ARCHITECT");
    setTimeout(() => {
      setScanMessage("VERIFIED: GANESH ENYARAM // 9.2 CGPA // MARWADI UNIV.");
      setTimeout(() => {
        setIsScanning(false);
        setScanMessage("");
      }, 2800);
    }, 1200);
  };

  // Sync profile photo from local storage or api instantly
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem("ganesh-profile-image");
        if (stored) {
          setProfileImage(stored);
        } else {
          setProfileImage(null);
        }
      } catch (e) {
        console.error("Local storage error in Hero", e);
      }
    };
    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    // Poll to keep multiple tabs or frames in sync
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Track projectViews history for 10-second trend comparisons
  const [projectViewsHistory, setProjectViewsHistory] = useState<{ time: number; val: number }[]>([]);

  useEffect(() => {
    const currentValue = analytics.projectViews || 266;
    const now = Date.now();
    
    // Initial data point immediately
    setProjectViewsHistory((prev) => {
      if (prev.length === 0) {
        return [{ time: now, val: currentValue }];
      }
      return prev;
    });

    const interval = setInterval(() => {
      const liveVal = analytics.projectViews || 266;
      const stamp = Date.now();
      setProjectViewsHistory((prev) => {
        const threshold = stamp - 20000; // retain last 20 seconds of traffic history
        const filtered = prev.filter((item) => item.time >= threshold);
        return [...filtered, { time: stamp, val: liveVal }];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [analytics.projectViews]);

  // Derive the visitor count from exactly 10 seconds ago
  const getTenSecsAgoValue = () => {
    if (projectViewsHistory.length === 0) return analytics.projectViews || 266;
    const targetTime = Date.now() - 10000;
    let closestItem = projectViewsHistory[0];
    let minDiff = Math.abs(closestItem.time - targetTime);

    for (let i = 1; i < projectViewsHistory.length; i++) {
      const diff = Math.abs(projectViewsHistory[i].time - targetTime);
      if (diff < minDiff) {
        minDiff = diff;
        closestItem = projectViewsHistory[i];
      }
    }
    return closestItem.val;
  };

  const tenSecsAgoValue = getTenSecsAgoValue();
  const currentVal = analytics.projectViews || 266;
  const trendDiff = currentVal - tenSecsAgoValue;

  // Stats Counters
  const statsList = [
    { id: "aiChats", label: t("hero.stats.aiChats", "AI & Data Solutions"), value: "3", icon: Cpu, color: "text-cyan-400" },
    { id: "solved", label: t("hero.stats.solved", "Core Skills Listed"), value: "18", icon: Code2, color: "text-indigo-400" },
    { id: "systemViews", label: t("hero.stats.systemViews", "System Views"), value: currentVal, icon: Users, color: "text-pink-400" },
    { id: "won", label: t("hero.stats.won", "Hackathons & Events"), value: "6", icon: Award, color: "text-amber-400" },
  ];

  // Typing effect loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullText = roles[currentRoleIdx];

    if (!isDeleting) {
      timer = setTimeout(() => {
        setTypedText(fullText.substring(0, typedText.length + 1));
        setTypingSpeed(75);
      }, typingSpeed);

      if (typedText === fullText) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800); // Wait on full role
      }
    } else {
      timer = setTimeout(() => {
        setTypedText(fullText.substring(0, typedText.length - 1));
        setTypingSpeed(35);
      }, typingSpeed);

      if (typedText === "") {
        setIsDeleting(false);
        setCurrentRoleIdx((prev) => (prev + 1) % roles.length);
      }
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, currentRoleIdx, language]);

  // Track manual Resume Download
  const handleDownloadResume = () => {
    onTrackAction("resumeDownloads");
    // Generate simulated resume download (since real PDF is missing, we create a rich textual PDF/Markdown download)
    const resumeText = `
GANESH ENYARAM - AI & DATA SCIENCE UNDERGRADUATE
Email: eganesh7997@gmail.com | LinkedIn: linkedin.com/in/ganesh-enyaram | Location: Siddipet, Telangana / Rajkot, Gujarat, India

EDUCATION:
- Bachelor of Technology - CSE (Artificial Intelligence & Data Science) [2024 - 2028]
  Marwadi University, Rajkot, Gujarat (Currently pursuing 2nd Year)

TECHNICAL SKILLS:
- Programming: Python, C, C++, Java
- AI & ML: Machine Learning, NumPy, Pandas, Scikit-learn, TensorFlow, Keras, Data Analysis, SQL, Git & GitHub
- Soft Skills: Communication, Team Leadership (Red Dragon lead), Problem Solving, Critical Thinking, Time Management, Adaptability

PROJECTS:
1. AI-Powered Chatbot (2024): Conversational Python & NLP query assistant.
2. Data Analysis Dashboard (2025): Pandas & Matplotlib visual dashboards.
3. Predictive ML Model (2025): Supervised Scikit-learn classification & regression pipelines.

HACKATHONS & ACHIEVEMENTS:
- ET AI Hackathon - Certified Participant (2025)
- Team Lead - Red Dragon Team (2025): Shortlisted for the PixelVerse Offline Finale Hackathon as Team Lead.
- Convolve 4.0 - Pan-IIT AI/ML Hackathon Participation Certificate (2025)
- ZOMATHON - India's Biggest Data Hackathon Participant (2025)
- RBU Global Digital Exchange Forum Delegate [Inclusive AI for ASEAN] (2026)
- NationBuilding Case Study Competition Competitor (2026)
    `;
    const blob = new Blob([resumeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Ganesh_Enyaram_AI_Resume.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Spring & Blur orchestrations for cohesive premium load sequence
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 85,
        damping: 14,
      },
    },
  };

  return (
    <section id="hero-section" className="relative min-h-screen flex flex-col justify-between items-center overflow-hidden pt-28 pb-10 px-4">
      {/* Visual cybernetic backdrop */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 flex-1 justify-center my-auto w-full">
        {/* Hero Copywriter area - orchestrated motion list */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 text-center md:text-left space-y-6"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider uppercase backdrop-blur-md"
          >
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            {t("hero.coreIntelligence", "Core Intelligence Ready")}
          </motion.div>

          <div className="space-y-3">
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl font-bold tracking-tight text-white font-sans hero-title"
            >
              <span className="name-first">Ganesh</span> <span className="name-last">Enyaram</span>
            </motion.h1>

            {/* Print-only professional resume header contact info */}
            <div className="hidden print:flex flex-wrap justify-between items-center text-[10pt] text-black mt-2 border-b-2 border-black pb-3 font-mono">
              <span>Email: eganesh7997@gmail.com</span>
              <span>Location: Rajkot, Gujarat / Siddipet, IN</span>
              <span>GitHub: github.com/ganeshenyaram</span>
              <span>LinkedIn: linkedin.com/in/ganesh-enyaram</span>
            </div>

            <motion.div
              variants={itemVariants}
              className="h-8 flex items-center justify-center md:justify-start"
            >
              <p className="text-lg sm:text-xl font-mono text-slate-350">
                &gt; <span className="text-cyan-400 font-bold">{typedText}</span>
                <span className="w-1.5 h-4 bg-cyan-400 inline-block ml-1 animate-blink-cursor" />
              </p>
            </motion.div>
          </div>

          <motion.p
            variants={itemVariants}
            className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto md:mx-0 leading-relaxed font-sans"
          >
            {t("hero.description", "B.Tech specialist in Artificial Intelligence & Data Science. Merging statistical precision with state-of-the-art neural architectures to construct hyper-scalable agentic solutions and robust full-stack applications.")}
          </motion.p>

          {/* Social and Call to Actions Row */}
          {/* Social and Call to Actions Row */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center md:justify-start gap-4"
          >
            <button
              id="hero-contact-btn"
              onClick={onNavigateToContact}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-[0_4px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_4px_25px_rgba(6,182,212,0.55)] cursor-pointer flex items-center justify-center gap-2 text-sm animate-pulse-subtle"
            >
              <Mail className="w-4 h-4" />
              {t("hero.contactBtn", "Contact Ganesh")}
            </button>

            <button
              id="hero-download-btn"
              onClick={handleDownloadResume}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl border font-medium transition-all cursor-pointer flex items-center justify-center gap-2 text-sm ${
                theme === "light"
                  ? "bg-white border-slate-300 text-slate-800 hover:bg-slate-50 shadow-sm"
                  : "bg-slate-900 border-slate-700/80 text-slate-200 hover:bg-slate-800"
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              {t("hero.resumeBtn", "Analyze/Get Resume")}
            </button>

            <button
              id="hero-print-btn"
              onClick={() => {
                onTrackAction("resumeDownloads");
                window.print();
              }}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl border font-medium transition-all cursor-pointer flex items-center justify-center gap-2 text-sm ${
                theme === "light"
                  ? "bg-white border-slate-300 text-slate-800 hover:bg-slate-50 shadow-sm"
                  : "bg-slate-900 border-slate-700/80 text-slate-200 hover:bg-slate-800"
              }`}
              title="Prints standard beautiful resume layout"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              {t("hero.printBtn", "Print Resume")}
            </button>

            <div className="flex items-center gap-3">
              <a
                id="hero-github-link"
                href="https://github.com/ganeshenyaram"
                target="_blank"
                rel="noreferrer"
                className={`p-3 border rounded-xl transition-all ${
                  theme === "light"
                    ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-cyan-500 shadow-sm"
                    : "bg-slate-900 border-slate-700/80 text-slate-300 hover:border-cyan-400/50 hover:bg-slate-800"
                }`}
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                id="hero-linkedin-link"
                href="https://linkedin.com/in/ganesh-enyaram"
                target="_blank"
                rel="noreferrer"
                className={`p-3 border rounded-xl transition-all ${
                  theme === "light"
                    ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-indigo-500 shadow-sm"
                    : "bg-slate-900 border-slate-700/80 text-slate-300 hover:border-indigo-400/50 hover:bg-slate-800"
                }`}
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Quick interactive starting discovery chips */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1"
          >
            {onOpen3DFirstPage && (
              <button
                onClick={onOpen3DFirstPage}
                className={`px-3 py-1.5 rounded-full border text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-sm group ${
                  theme === "light"
                    ? "bg-gradient-to-r from-cyan-50 via-white to-indigo-50 border-cyan-400 text-cyan-800 hover:shadow-md hover:border-cyan-500"
                    : "bg-cyan-950/70 border-cyan-400/60 text-cyan-300 hover:bg-cyan-900/70 hover:border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                }`}
                title="Enter Three.js 3D Interactive First Page"
              >
                <Box className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow group-hover:scale-110 transition-transform" />
                <span className="font-bold">3D First Page</span>
                <span className="text-[9px] px-1 rounded bg-cyan-500/20 text-cyan-400 uppercase font-mono">PBR</span>
              </button>
            )}

            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-ai-chat", {
                  detail: { query: "What are Ganesh Enyaram's key AI & Machine Learning strengths and projects?" }
                }));
                onTrackAction("heroQuickAskAI");
              }}
              className={`px-3 py-1.5 rounded-full border text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                theme === "light"
                  ? "bg-white border-cyan-400/60 text-cyan-700 hover:bg-cyan-50 shadow-sm"
                  : "bg-cyan-950/40 border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/50"
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask AI About Ganesh</span>
            </button>
            <a
              href="#skills-section"
              className={`px-3 py-1.5 rounded-full border text-[11px] font-mono flex items-center gap-1.5 transition-all ${
                theme === "light"
                  ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm"
                  : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>18+ Tech Skills</span>
            </a>
            <a
              href="#projects-section"
              className={`px-3 py-1.5 rounded-full border text-[11px] font-mono flex items-center gap-1.5 transition-all ${
                theme === "light"
                  ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm"
                  : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>3 AI Systems</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Futuristic Interactive Column with Logo + Sign In with Google below Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="flex-1 relative flex flex-col items-center justify-center w-full gap-4 z-20"
        >
          {/* Orbital Graphic Ring with Tech Avatar Logo */}
          <div className="relative flex items-center justify-center h-[240px] sm:h-[260px] w-full">
            {/* Cyber Core Sphere Grid */}
            <div className="absolute w-[230px] h-[230px] rounded-full border border-dashed border-cyan-500/20 animate-spin-slow" />
            <div className="absolute w-[180px] h-[180px] rounded-full border border-cyan-400/40 animate-spin-reverse" />
            <div className="absolute w-[100px] h-[100px] rounded-full border border-rose-500/30 animate-pulse" />

            {/* Core Central Node with ultra premium interactive style */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleAvatarScan}
              transition={{
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                scale: {
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }
              }}
              className="w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-cyan-400 via-indigo-500 to-pink-500 p-[3px] flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.45)] hover:shadow-[0_0_75px_rgba(236,72,153,0.55)] border border-white/20 backdrop-blur-xl z-20 overflow-hidden cursor-pointer relative group"
              title="Click to trigger Quantum Diagnostic Hologram Scan"
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 relative">
                <img
                  src={techAvatarImg}
                  alt="Ganesh Enyaram Tech Avatar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                />
                {/* Scanline overlay for high-tech look */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity" />
                {/* Glass reflection sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" />

                {/* Interactive Hologram Laser Scanner animation on click */}
                {isScanning && (
                  <motion.div
                    initial={{ top: "-10%" }}
                    animate={{ top: "110%" }}
                    transition={{ duration: 1.1, repeat: 2, ease: "easeInOut" }}
                    className="absolute inset-x-0 h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] z-30 pointer-events-none"
                  />
                )}
              </div>

              {/* Click instruction hint on hover */}
              <div className="absolute inset-0 bg-slate-950/65 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 text-center p-2">
                <Scan className="w-5 h-5 text-cyan-400 animate-pulse mb-1" />
                <span className="text-[9.5px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                  Diagnostic Scan
                </span>
              </div>
            </motion.div>

            {/* Floating graphic orbital icons */}
            <div className="absolute w-full h-full max-w-[280px] pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="absolute top-0 left-10 w-8.5 h-8.5 rounded-lg bg-slate-900/90 border border-cyan-400/50 flex items-center justify-center text-cyan-400 transform -rotate-360 shadow-lg">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="absolute bottom-3 right-6 w-8.5 h-8.5 rounded-lg bg-slate-900/90 border border-pink-400/50 flex items-center justify-center text-pink-400 transform -rotate-360 shadow-lg">
                  <BrainIcon />
                </div>
                <div className="absolute top-1/2 right-0 w-8.5 h-8.5 rounded-lg bg-slate-900/90 border border-indigo-400/50 flex items-center justify-center text-indigo-400 transform -rotate-360 shadow-lg">
                  <NetworkIcon />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Diagnostic scanner banner message if active */}
          <AnimatePresence>
            {scanMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                className="px-3.5 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-400 text-cyan-300 font-mono text-[10px] uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 z-30"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>{scanMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SIGN IN WITH GOOGLE & INTERACTIVE GATEWAY RIGHT BELOW LOGO */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className={`w-full max-w-sm rounded-2xl p-4 border transition-all duration-300 relative z-30 ${
              theme === "light"
                ? "bg-white border-slate-300/90 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.08)]"
                : "bg-slate-900/90 border-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            }`}
          >
            {/* Ambient cyber line */}
            <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

            {user ? (
              /* State when ALREADY signed in */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] shrink-0">
                      <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-xs uppercase overflow-hidden">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                        ) : (
                          (user.displayName || "G").charAt(0)
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold truncate ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                          {user.displayName || "Verified Visitor"}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 block truncate">
                        Google Identity Verified
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      await logout();
                      onTrackAction("heroLogout");
                    }}
                    title="Sign Out"
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      theme === "light"
                        ? "border-slate-300 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                        : "border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30"
                    }`}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick actions for signed-in user */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("open-ai-chat", {
                        detail: { query: "Hi! Tell me about Ganesh's core strengths and recent achievements." }
                      }));
                      onTrackAction("heroOpenAIChat");
                    }}
                    className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-[11px] font-mono flex items-center justify-center gap-1.5 hover:shadow-cyan-500/25 shadow-sm transition-all cursor-pointer group"
                  >
                    <Bot className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>Launch AI Chat</span>
                  </button>
                  <button
                    onClick={onNavigateToContact}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      theme === "light"
                        ? "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        : "border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-800/80"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
            ) : (
              /* State when NOT signed in - Primary "Sign In with Google" Button */
              <div className="space-y-3">
                <div className="text-center">
                  <span className={`text-[11px] font-mono font-bold tracking-wider uppercase block ${
                    theme === "light" ? "text-slate-900" : "text-white"
                  }`}>
                    Visitor Access Hub
                  </span>
                  <p className={`text-[10px] mt-0.5 ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
                    Sign in below to personalize your session & unlock full features
                  </p>
                </div>

                {/* Main Sign in with Google Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm relative overflow-hidden group ${
                    theme === "light"
                      ? "bg-white hover:bg-slate-50 border-slate-300 text-slate-900 hover:border-slate-400 shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
                      : "bg-slate-950 hover:bg-slate-900 border-slate-700 text-white hover:border-cyan-400/60 shadow-[0_4px_20px_rgba(6,182,212,0.15)]"
                  }`}
                  id="hero-google-signin-btn"
                >
                  {/* Subtle hover gradient glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  ) : (
                    <GoogleLogoIcon className="w-4.5 h-4.5 shrink-0" />
                  )}

                  <span className="font-sans font-semibold text-xs tracking-wide relative z-10">
                    {googleLoading ? "Connecting with Google..." : "Sign in with Google"}
                  </span>
                </motion.button>

                {/* Error message if any */}
                {googleError && (
                  <p className="text-[10px] text-rose-500 text-center font-mono leading-tight">
                    {googleError}
                  </p>
                )}

                {/* Success message */}
                {googleSuccess && (
                  <p className="text-[10px] text-emerald-400 text-center font-mono flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Signed in successfully!</span>
                  </p>
                )}

                {/* Perks chips below button */}
                <div className="flex items-center justify-center gap-3 pt-0.5 text-[9.5px] font-mono">
                  <span className={`inline-flex items-center gap-1 ${theme === "light" ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                    <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                    Live AI Assistant
                  </span>
                  <span className={theme === "light" ? "text-slate-300" : "text-slate-700"}>•</span>
                  <span className={`inline-flex items-center gap-1 ${theme === "light" ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                    Verified Ledger
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Counter Panel Overlay */}
      <div className="relative w-full max-w-6xl px-4 z-20 pointer-events-auto mt-8 md:mt-2 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className={`grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-7 md:gap-6 p-5 sm:p-6 rounded-2xl border backdrop-blur-xl transition-colors duration-300 ${
            theme === "light"
              ? "bg-white/95 border-slate-300 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.06)]"
              : "bg-slate-900/70 border-slate-800/80 shadow-2xl"
          }`}
        >
          {statsList.map((st, i) => {
            const Icon = st.icon;
            return (
              <div key={i} className="flex items-center gap-3 pl-1 sm:pl-2">
                <div className={`p-2 rounded-xl ${
                  theme === "light" ? "bg-slate-100 border border-slate-200" : "bg-slate-800/50 border border-slate-700/50"
                } ${st.color} bg-opacity-10 shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`text-lg sm:text-2xl font-bold font-mono tracking-tight leading-tight flex items-center gap-1.5 flex-wrap ${
                    theme === "light" ? "text-slate-900" : "text-white"
                  }`}>
                    <span>{st.value}</span>
                    {st.id === "systemViews" && (
                      <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono select-none transition-all duration-300 ${
                        trendDiff > 0
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : trendDiff < 0
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-slate-800/80 text-slate-400 border border-slate-700/30"
                      }`}>
                        {trendDiff > 0 ? (
                          <>
                            <ArrowUpRight className="w-2.5 h-2.5 text-emerald-400" />
                            <span>+{trendDiff}</span>
                          </>
                        ) : trendDiff < 0 ? (
                          <>
                            <ArrowDownRight className="w-2.5 h-2.5 text-rose-400" />
                            <span>{trendDiff}</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            <span>steady</span>
                          </>
                        )}
                      </span>
                    )}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-sans leading-snug tracking-normal ${
                    theme === "light" ? "text-slate-600 font-medium" : "text-slate-400"
                  }`}>
                    {st.label}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// Custom neat visual helpers to avoid import issues
function BrainIcon() {
  return (
    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="3" />
      <circle cx="5" cy="19" r="3" />
      <circle cx="19" cy="19" r="3" />
      <path d="M5 16l4-8M19 16l-4-8M7 19h10" />
    </svg>
  );
}
