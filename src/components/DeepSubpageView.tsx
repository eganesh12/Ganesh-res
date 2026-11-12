import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Cpu, Terminal, Shield, Award, CheckCircle2, 
  MapPin, HelpCircle, Activity, RefreshCw, 
  Layers, Database, Code, Globe, User, Zap, Mail, Phone, Calendar,
  Maximize2, X
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

// Components to embed inside deep pages
import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Certifications from "./Certifications";
import ExperienceAchievements from "./ExperienceAchievements";
import Contact from "./Contact";

interface DeepSubpageViewProps {
  view: string;
  theme: "dark" | "light";
  onBack: () => void;
  onTrackAction: (metric: string) => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  analytics: any;
  activeTab?: "overview" | "media" | "specifications";
  onTabChange?: (tab: "overview" | "media" | "specifications") => void;
}

export default function DeepSubpageView({ 
  view, 
  theme, 
  onBack, 
  onTrackAction, 
  fetchAnalytics, 
  analytics,
  activeTab,
  onTabChange
}: DeepSubpageViewProps) {
  const { t } = useLanguage();

  const videoSources = {
    about: {
      video: "https://assets.mixkit.co/videos/preview/mixkit-abstract-digital-connection-lines-background-43301-large.mp4",
      tagline: "Unveiling the Engineer behind the Architectures",
      desc: "Delve deeper into Ganesh's academic discipline, design principles, and career philosophy of bridging statistics with scalable engineering grids."
    },
    skills: {
      video: "https://assets.mixkit.co/videos/preview/mixkit-tech-animation-of-glowing-nodes-and-lines-43292-large.mp4",
      tagline: "Quantifying Technical Weaponry & Latency Targets",
      desc: "View direct evidence of Ganesh's technical stack spanning advanced AI pipelines, RAG orchestration agents, and lightning-fast full-stack APIs."
    },
    projects: {
      video: "https://assets.mixkit.co/videos/preview/mixkit-blue-tech-grid-background-43286-large.mp4",
      tagline: "Autonomous Agentic Systems & Edge Tracking Labs",
      desc: "Examine detailed multi-modal generative layouts, real-time classroom facial recognition codebases, and interactive GPA diagnostics."
    },
    certifications: {
      video: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-data-43287-large.mp4",
      tagline: "Verified Cloud Accreditations & Specialist Certs",
      desc: "A closer inspection of formal specializations received from authorized world-tier industries including Stanford ML, Google Cloud, and IBM."
    },
    contact: {
      video: "https://assets.mixkit.co/videos/preview/mixkit-slow-motion-digital-data-processing-43299-large.mp4",
      tagline: "Secure Real-time Scheduling Node & Message Terminal",
      desc: "Dispatch secure payloads directly to database nodes, or select custom dates for interview invites via the autonomous booking system."
    }
  };

  const activeMeta = videoSources[view as keyof typeof videoSources] || videoSources.about;

  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; caption: string } | null>(null);
  const [localTab, setLocalTab] = useState<"overview" | "media" | "specifications">("overview");

  const currentTab = activeTab !== undefined ? activeTab : localTab;
  const setTab = (tab: "overview" | "media" | "specifications") => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setLocalTab(tab);
    }
  };

  // Track terminal interactions for Skills subpage
  const [termOutput, setTermOutput] = useState<string[]>([
    "Initial connection established with GANESH_PORTFOLIO_OS [v2.42-CHIP] ...",
    "Enter diagnostic commands to analyze core competency details.",
    "Try entering: 'help', 'skills', 'latency', 'models', 'clear'"
  ]);
  const [termInput, setTermInput] = useState("");

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = termInput.trim().toLowerCase();
    let reply = "";
    if (cmd === "help") {
      reply = "Available options: 'skills' (core competency breakdown), 'latency' (pipeline processing delays), 'models' (currently supported neural anchors), 'clear' (reset system term log)";
    } else if (cmd === "skills") {
      reply = "COMPETENCY BREAKDOWN: \n- AI/ML pipelines (Haar Cascades, XGBoost, Random Forests) \n- Generative RAG (crewAI Agentic clusters, LlamaIndex anchors) \n- Development (Vite, React 19, TypeScript, Express routers) \n- Cloud (GCP compute engines, Firestore, local caches)";
    } else if (cmd === "latency") {
      reply = "SIMULATED PLATFORM MEASUREMENTS: \n- ATS resume scanner parse: 280ms \n- Face detection inference: 42ms (Haar-cascade model) \n- Chatbot context routing: 110ms";
    } else if (cmd === "models") {
      reply = "NEURAL ANCHORS DETECTED: \n- Gemini 1.5 Pro (Text analysis) \n- Gemini 1.5 Flash (Latency-sensitive interactive chat) \n- OpenCV cv2.CascadeClassifier (Edge facial recognition)";
    } else if (cmd === "clear") {
      setTermOutput([]);
      setTermInput("");
      return;
    } else if (cmd !== "") {
      reply = `Command not recognized: '${cmd}'. Enter 'help' for possible vectors.`;
    }

    if (cmd !== "") {
      setTermOutput(prev => [...prev, `GaneshOS> ${termInput}`, reply]);
    }
    setTermInput("");
  };


  // Render high-quality curated images for corresponding subsections
  const imageGalleries = {
    about: [
      { url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80", title: "Cybernetic Development Workspace", caption: "Ganesh's local developer setup optimizing multi-agentic chains and statistical algorithms on local CPU/GPU cores." },
      { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80", title: "Neural Networking Visualizations", caption: "Generative model representation showing weight transformations, prompting structures, and prompt feedback matrices." },
      { url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80", title: "Academic Coding Hub", caption: "Engineering lab workstation at Marwadi University where local face-recognition networks are benchmarked." }
    ],
    skills: [
      { url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80", title: "Latency Benchmarking Monitors", caption: "Real-time measurements targeting Haar cascades edge classifier frame extraction rates under diverse lighting metrics." },
      { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80", title: "Cloud Integration Pipelines", caption: "Express Node API server clusters deployed to handle high-concurrency client requests with Firestore connection persistence." }
    ],
    projects: [
      { url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80", title: "Decentralized System Frameworks", caption: "Multi-agentic RAG orchestrations utilizing crewAI workflows with localized LlamaIndex caches." },
      { url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80", title: "Interactive Canvas Simulators", caption: "Dynamic GPAs analytics charting systems using premium customized React components." }
    ],
    certifications: [
      { url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80", title: "Stanford/Coursera Examination", caption: "Machine Learning specialization completion records verifying vector optimization and back-propagation mastery." }
    ],
    contact: [
      { url: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&w=600&q=80", title: "Integrated Messaging Bridge", caption: "Real-time socket notifications alerting local devices whenever target contract leads emit contact vectors." }
    ]
  };

  const activeGallery = imageGalleries[view as keyof typeof imageGalleries] || imageGalleries.about;

  useEffect(() => {
    // Track the subpage view entry state
    onTrackAction(`view_subpage_${view}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  const maxOpacity = theme === "light" ? 0.45 : 0.65;
  const minOpacity = theme === "light" ? 0.15 : 0.25;
  const videoFilter = theme === "light" 
    ? "contrast-[1.05] saturation-[0.8] brightness-[0.92]" 
    : "contrast-[1.1] saturation-[0.9] brightness-[0.78]";

  const overlayBg = theme === "light" ? "from-slate-50" : "from-slate-950";
  const overlayViaB = theme === "light" ? "via-slate-50/65" : "via-slate-950/75";
  const radialColor = theme === "light" ? "#f8fafc" : "#020617";

  return (
    <div className={`relative min-h-screen ${theme === "light" ? "text-slate-900 bg-slate-50" : "text-slate-100 bg-slate-950"} transition-all duration-300`}>
      
      {/* 1. CINEMATIC GRADIENT BACKDROP SYSTEM FOR SUBPAGE */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(244,244,255,0.01)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(244,244,255,0.01)_1.5px,transparent_1.5px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
        
        {/* Animated scrolling scanning laser beam bar */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-[bounce_8s_infinite] pointer-events-none" />

        {/* Theme-specific cinematic masks */}
        <div className={`absolute inset-0 bg-gradient-to-t ${overlayBg} ${overlayViaB} to-transparent opacity-90 pointer-events-none`} />
        <div className={`absolute inset-0 bg-gradient-to-b ${overlayBg}/40 via-transparent to-transparent opacity-80 pointer-events-none`} />
        <div 
          className="absolute inset-0 opacity-70 pointer-events-none" 
          style={{ backgroundImage: `radial-gradient(circle at center, transparent 45%, ${radialColor} 90%)` }}
        />
      </div>

      {/* 2. SUBPAGE HERO/HUD REGIONS */}
      <div className="relative pt-24 pb-12 px-4 sm:px-6 z-10 max-w-6xl mx-auto">
        <motion.button
          onClick={onBack}
          whileHover={{ x: -4 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider cursor-pointer border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 hover:bg-cyan-500/15 hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)] w-fit shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t("nav.home", "Back to Interactive Hub")}
        </motion.button>

        <div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-slate-900/60 pb-8">
          <div className="space-y-3.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span className="font-mono text-[9px] font-bold text-cyan-400 tracking-widest uppercase">
                EXCLUSIVE PAGE: {view.toUpperCase()}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight font-sans text-white capitalize">
              Ganesh's <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500">{view} Deep-Dive</span>
            </h1>
            
            <p className="text-sm font-mono text-cyan-400/90 tracking-wide font-medium">
              // {activeMeta.tagline}
            </p>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              {activeMeta.desc}
            </p>
          </div>
        </div>

        {/* 3. CORE SUBPAGE VIEW WRAPPERS & TAB ARCHITECTURES */}
        <div id="subpage-content-tabs-container" className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24">
          
          {/* Main Area (7 cols on Desktop) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Highly Descriptive Custom Visual Navigation Cards */}
            <div id="subpage-tabs-btn-container" className={`grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-1.5 rounded-2xl border ${
              theme === "light" 
                ? "bg-slate-100/80 border-slate-200/80" 
                : "bg-slate-950/65 border-slate-900"
            } w-full`}>
              <button
                onClick={() => setTab("overview")}
                className={`flex flex-col items-start p-3 rounded-xl text-left cursor-pointer transition-all ${
                  currentTab === "overview" 
                    ? "bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                    : `${theme === "light" 
                        ? "text-slate-700 bg-slate-50/60 border border-slate-200/60 hover:bg-slate-50 hover:text-slate-900" 
                        : "text-slate-400 bg-slate-900/35 border border-slate-850/40 hover:bg-slate-900/60 hover:text-white"}`
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">Profile & CV Details</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1.5 leading-normal font-sans">
                  Explore Ganesh's academic discipline, key engineering roles, and personal milestones.
                </span>
              </button>

              <button
                onClick={() => setTab("media")}
                className={`flex flex-col items-start p-3 rounded-xl text-left cursor-pointer transition-all ${
                  currentTab === "media" 
                    ? "bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                    : `${theme === "light" 
                        ? "text-slate-700 bg-slate-50/60 border border-slate-200/60 hover:bg-slate-50 hover:text-slate-900" 
                        : "text-slate-400 bg-slate-900/35 border border-slate-850/40 hover:bg-slate-900/60 hover:text-white"}`
                }`}
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">Visual Workspace & Demos</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1.5 leading-normal font-sans">
                  Bespoke grid of Ganesh's local development setup, model tracking logs, and code configurations.
                </span>
              </button>

              <button
                onClick={() => setTab("specifications")}
                className={`flex flex-col items-start p-3 rounded-xl text-left cursor-pointer transition-all ${
                  currentTab === "specifications" 
                    ? "bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                    : `${theme === "light" 
                        ? "text-slate-700 bg-slate-50/60 border border-slate-200/60 hover:bg-slate-50 hover:text-slate-900" 
                        : "text-slate-400 bg-slate-900/35 border border-slate-850/40 hover:bg-slate-900/60 hover:text-white"}`
                }`}
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">Speed Specs Ledger</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1.5 leading-normal font-sans">
                  Rigorous latency stats, processing speed audits, and cloud database performance metrics.
                </span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {currentTab === "overview" && (
                  <div className="space-y-6">
                    {/* SYSTEMS ARCHITECTURE BENTO GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Bento 1: Adaptive Mission Hub */}
                      <div className="rounded-xl border border-cyan-500/15 bg-slate-900/35 backdrop-blur-sm p-4 space-y-3 relative overflow-hidden group hover:border-cyan-400/40 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-3 opacity-[0.06] group-hover:opacity-15 group-hover:scale-110 transition-all text-cyan-400">
                          <Cpu className="w-16 h-16" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-mono text-cyan-400 tracking-widest">// ARCHITECTURE INDEX</span>
                          <h4 className="text-xs font-bold text-white tracking-widest uppercase">{view.toUpperCase()} METRICS</h4>
                        </div>
                        <p className="text-3xs text-slate-400 leading-relaxed max-w-sm">
                          Exploring Ganesh's highly responsive system nodes. Leveraging machine learning optimization algorithms, local storage caching, and secure API gateways.
                        </p>
                      </div>

                      {/* Bento 2: Latency Telemetry Overview */}
                      <div className="rounded-xl border border-indigo-500/15 bg-slate-900/35 backdrop-blur-sm p-4 flex flex-col justify-between relative overflow-hidden group hover:border-indigo-400/40 transition-all duration-300">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-mono text-indigo-400 tracking-widest">// SPEED HYPOTHESIS</span>
                          <h4 className="text-xs font-bold text-white tracking-widest uppercase">LATENCY STATS</h4>
                        </div>
                        <div className="space-y-2 py-1.5">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[8px] font-mono">
                              <span className="text-slate-400">Edge face tracking</span>
                              <span className="text-cyan-400 font-bold">42ms</span>
                            </div>
                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-400 w-[95%]" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[8px] font-mono">
                              <span className="text-slate-400">Express DB query delay</span>
                              <span className="text-indigo-400 font-bold">75ms</span>
                            </div>
                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 w-[85%]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Native Module Render */}
                    <div id="subpage-actual-anchor" className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md overflow-hidden relative shadow-2xl">
                      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent pointer-events-none" />
                      
                      {view === "about" && <About />}
                      {view === "skills" && <Skills />}
                      {view === "projects" && <Projects />}
                      {view === "certifications" && <Certifications />}
                      {view === "contact" && (
                        <Contact 
                          onTrackAction={onTrackAction} 
                          onTrackerRefresh={fetchAnalytics} 
                        />
                      )}
                    </div>
                  </div>
                )}

                {currentTab === "media" && (
                  <div className="space-y-6">
                    {/* Interactive Media Slider */}
                    <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-6 space-y-6 relative">
                      <div className="absolute top-0 right-6 -translate-y-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded bg-cyan-700 hover:bg-cyan-600 border border-cyan-500/20 text-cyan-400 font-mono text-[9px]">
                        <Zap className="w-3 h-3 animate-bounce" /> CORE_GALLERY_OS
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-bold font-sans text-white">Visual Telemetry Gallery</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Review structured high-resolution images mapping Ganesh's engineering workspace coordinates, model simulation weights, and code configurations.
                        </p>
                      </div>

                      <div className={`grid gap-5 ${
                        activeGallery.length === 1 
                          ? "grid-cols-1 max-w-2xl mx-auto" 
                          : activeGallery.length === 2 
                            ? "grid-cols-1 md:grid-cols-2" 
                            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      }`}>
                        {activeGallery.map((img, i) => (
                          <div 
                            key={i} 
                            onClick={() => setLightboxImage(img)}
                            className="group relative rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm overflow-hidden flex flex-col h-full transform hover:-translate-y-1.5 hover:border-cyan-500/45 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] cursor-zoom-in transition-all duration-300 shadow-lg"
                          >
                            <div className="aspect-video w-full overflow-hidden relative border-b border-slate-850">
                              <img 
                                src={img.url} 
                                alt={img.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none brightness-[0.82] group-hover:brightness-95"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent opacity-90 pointer-events-none" />
                              
                              {/* Overlay expand helper */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-slate-955/40 backdrop-blur-[1.5px] transition-opacity duration-300">
                                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-500/20 bg-slate-950/80 text-[10px] font-mono text-cyan-400 uppercase tracking-widest shadow-xl">
                                  <Maximize2 className="w-3 h-3 text-cyan-400 animate-pulse" />
                                  <span>Maximize Spec</span>
                                </div>
                              </div>

                              <span className="absolute top-3 right-3 select-none px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800/80 text-cyan-400 font-mono text-[8px] uppercase tracking-wider">
                                HD_VIEW_0{i+1}
                              </span>
                            </div>
                            <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                              <h4 className="text-xs font-bold font-mono text-white tracking-wide border-b border-slate-850/40 pb-1 flex items-center justify-between">
                                <span>{img.title}</span>
                                <span className="text-[9px] text-cyan-400 font-mono font-normal flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" /> Verified Spec
                                </span>
                              </h4>
                              <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">{img.caption}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Core images gallery grid is displayed above with full detail */}
                    </div>
                  </div>
                )}

                {currentTab === "specifications" && (
                  <div className="space-y-6">
                    {/* Core Specifications Table */}
                    <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-6 space-y-6 relative">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold font-sans text-white">Full Technology Audit Ledger</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Rigorous mathematical thresholds, execution latency parameters, and architecture dependencies tracking database queries and AI agents.
                        </p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-2xs text-slate-400 border-collapse">
                          <thead>
                            <tr className="border-b border-slate-850 text-cyan-400 pb-2">
                              <th className="py-2.5 font-bold uppercase tracking-wider">Metric Node</th>
                              <th className="py-2.5 font-bold uppercase tracking-wider">Benchmark value</th>
                              <th className="py-2.5 font-bold uppercase tracking-wider">Target platform</th>
                              <th className="py-2.5 font-bold uppercase tracking-wider">Health Core</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850/60">
                            <tr>
                              <td className="py-3 font-semibold text-white">ATS Semantic Parse Delay</td>
                              <td className="py-3">280ms / resume model</td>
                              <td className="py-3 text-cyan-450">Marwadi AI Labs</td>
                              <td className="py-3"><span className="text-emerald-500">EXCELLENT</span></td>
                            </tr>
                            <tr>
                              <td className="py-3 font-semibold text-white">Edge Classifier Inference</td>
                              <td className="py-3">42ms / standard frame (640x480)</td>
                              <td className="py-3 text-cyan-450">Local Edge Device (OpenCV)</td>
                              <td className="py-3"><span className="text-emerald-500">EXCELLENT</span></td>
                            </tr>
                            <tr>
                              <td className="py-3 font-semibold text-white">Multi-Agent Sync Overhead</td>
                              <td className="py-3">35% latency optimization</td>
                              <td className="py-3 text-cyan-450">HexaMind Labs API</td>
                              <td className="py-3"><span className="text-cyan-450">STABLE</span></td>
                            </tr>
                            <tr>
                              <td className="py-3 font-semibold text-white">API SQL Query Fetch delay</td>
                              <td className="py-3">75ms / active call</td>
                              <td className="py-3 text-cyan-450">Node.js Express Server</td>
                              <td className="py-3"><span className="text-emerald-500">EXCELLENT</span></td>
                            </tr>
                            <tr>
                              <td className="py-3 font-semibold text-white">Student Behavior indexing</td>
                              <td className="py-3">D3/Recharts dynamic loading</td>
                              <td className="py-3 text-cyan-450">Portfolio Client SPA</td>
                              <td className="py-3"><span className="text-emerald-500">EXCELLENT</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Technical checklist of components used */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-850">
                        <div className="p-4 rounded-xl bg-slate-900/40 space-y-3 border border-slate-850">
                          <h4 className="text-xs font-bold font-mono text-cyan-400">ENGINEERING SYSTEM STACK</h4>
                          <ul className="space-y-2 text-2xs font-mono">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> React 18+ (Vite) Single Page SPA</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Tailwind CSS customized layouts</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Framer Motion / Motion animations</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Lucide dynamic vectors</li>
                          </ul>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-900/40 space-y-3 border border-slate-850">
                          <h4 className="text-xs font-bold font-mono text-indigo-400">AI MODEL CHANNELS</h4>
                          <ul className="space-y-2 text-2xs font-mono">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Haar cascade face vectors</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Agent-based semantic analyzer</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> RAG context vector database</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Stable Diffusion multi-modal layers</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Sidebar Area (4 cols on Desktop) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Terminal Prompt Box (ONLY on Skills) */}
            {view === "skills" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-slate-900 bg-slate-950 p-4 font-mono shadow-2xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-slate-850 pb-2 mb-3 text-3xs text-slate-500">
                  <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-cyan-400" /> GANESH_OS TERMINAL</span>
                  <span>ONLINE</span>
                </div>
                <div className="h-44 overflow-y-auto text-3xs text-cyan-400 space-y-2 select-text whitespace-pre-wrap leading-tight scrollbar-thin scrollbar-thumb-slate-800">
                  {termOutput.map((out, idx) => (
                    <div key={idx} className={out.startsWith("GaneshOS>") ? "text-indigo-400 pt-1" : ""}>
                      {out}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleCommand} className="mt-3 flex items-center border border-slate-800 rounded bg-slate-900/60 p-1">
                  <span className="text-3xs text-cyan-400 pr-1 select-none">GaneshOS&gt;</span>
                  <input
                    type="text"
                    value={termInput}
                    onChange={(e) => setTermInput(e.target.value)}
                    className="flex-1 bg-transparent text-3xs text-white border-0 outline-none p-0 focus:ring-0 focus:outline-none"
                    placeholder="help, skills, latency, clear..."
                  />
                  <button type="submit" className="hidden" />
                </form>
              </motion.div>
            )}

            {/* 2. Achievements and diagnostic overview card */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                <Shield className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold font-mono text-white tracking-widest uppercase">DIAGNOSTIC STATUS</h3>
              </div>

              <div className="space-y-3 font-mono text-3xs">
                <div className="flex justify-between items-center bg-slate-900/35 p-2 rounded border border-slate-850/40">
                  <span className="text-slate-400">Total System Views:</span>
                  <span className="font-bold text-white">{analytics.projectViews}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/35 p-2 rounded border border-slate-850/40">
                  <span className="text-slate-400">Resume Diagnostic Downloads:</span>
                  <span className="font-bold text-cyan-400">{analytics.resumeDownloads}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/35 p-2 rounded border border-slate-850/40">
                  <span className="text-slate-400">Direct Message Signals:</span>
                  <span className="font-bold text-indigo-400">{analytics.contactRequests}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/35 p-2 rounded border border-slate-850/40">
                  <span className="text-slate-400">Deployments Audited:</span>
                  <span className="font-bold text-white">{analytics.visitors}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-850/80">
                <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                  All statistical payloads are persistently synchronized with a cloud-authoritative Firestore connection endpoint.
                </p>
              </div>
            </div>

            {/* 3. Deep Quick Q&A Interactive Assistant */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                <HelpCircle className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h4 className="text-xs font-bold font-mono text-white tracking-widest uppercase">VIRTUAL Q&A AGENT</h4>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-mono text-cyan-400">Q: Does Ganesh possess industry certification?</p>
                  <p className="text-2xs text-slate-400 leading-relaxed">
                    Yes, Ganesh is fully certified by **Stanford (Machine Learning)**, **IBM (Data Science)**, and **Google Cloud (Generative AI)**, with a highly competitive CGPA of 9.2.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-mono text-cyan-400">Q: Can he operate in high-concurrency roles?</p>
                  <p className="text-2xs text-slate-400 leading-relaxed">
                    Yes, as proven by his freelance contracts and national hackathons (HackIndia 2025 top elite tier), he has optimized API queries, dropping server payload delays down to 75ms.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 4. HIGH-RESOLUTION LIGHTBOX INTEGRATED OVERLAY */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md pointer-events-auto cursor-zoom-out"
            onClick={() => setLightboxImage(null)}
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImage(null);
              }}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer hover:bg-slate-800 transition-all shadow-[0_0_15px_rgba(0,0,0,0.6)]"
              title="Close System visual module preview"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="max-w-4xl w-full rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl relative cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img 
                  src={lightboxImage.url} 
                  alt={lightboxImage.title} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>
              <div className="p-6 space-y-2 border-t border-slate-800 bg-slate-950/80">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-700/30 border border-cyan-500/20 text-cyan-400 font-mono text-[9px] uppercase tracking-wider">
                    SYSTEM_HD_METRIC
                  </span>
                  <h4 className="text-sm font-bold font-mono text-white tracking-wide">{lightboxImage.title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{lightboxImage.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
