import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, X, Send, Sparkles, Cpu, Terminal, 
  ChevronDown, HelpCircle, ShieldCheck, RefreshCw, Bot, Info, ArrowUpRight,
  Mic, MicOff, Wifi, WifiOff, Download
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export default function AIChatbot() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const userName = user?.displayName || (user?.email ? user.email.split("@")[0] : null) || "Guest Commander";

  // State to track Network Connection status (Online vs Offline)
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am Ganesh's secure portfolio AI Neural Navigator. It is an absolute pleasure to synchronize with you!",
      timestamp: new Date()
    }
  ]);

  // Dynamically personalize/initialize greeting message
  useEffect(() => {
    if (messages.length === 0 || (messages.length === 1 && messages[0].sender === "bot" && (messages[0].text.startsWith("Hello! I am Ganesh's secure portfolio AI Neural Navigator.") || messages[0].text.startsWith("Greetings, Commander!")))) {
      setMessages([
        {
          sender: "bot",
          text: `Hello! I am Ganesh's secure portfolio AI Neural Navigator. It is an absolute pleasure to synchronize with you, **${userName}**!\n\nI have primary clearance to share detailed breakdowns of his ML architectures, B.Tech curriculum nodes, cloud designs, and career credentials. How can I assist you today to make this a good conversation?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [userName]);
  // Listen to open-ai-chat global custom event from Hero or other components
  useEffect(() => {
    const handleOpenChat = (e: any) => {
      setIsOpen(true);
      setIsMinimized(false);
      if (e?.detail?.query) {
        setInputValue(e.detail.query);
      }
    };
    window.addEventListener("open-ai-chat", handleOpenChat);
    return () => window.removeEventListener("open-ai-chat", handleOpenChat);
  }, []);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorStatus("Speech recognition is not supported in this browser. Please use Google Chrome, MS Edge, or Apple Safari.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setErrorStatus("Microphone access denied. Please unblock microphone permissions in your browser address bar.");
        } else {
          setErrorStatus(`Speech interface error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue((prev) => {
            const separator = prev.trim() ? " " : "";
            return prev + separator + transcript;
          });
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.error("Failed to start speech recognition:", e);
      setErrorStatus("Failed to boot neural voice module.");
      setIsListening(false);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  // Suggestions chips for starting conversation
  const suggestions = [
    { label: "Check Core Projects", text: "Tell me about your AI & ML projects in detail." },
    { label: "Request Career Objectives", text: "What roles are you looking for, and what are your career objectives?" },
    { label: "Review Certifications", text: "What official AWS and Google Cloud certifications do you possess?" },
    { label: "CGPA & Tech Stats", text: "Give me a summary of your academic achievements, hackathon wins, and coding practice stats." }
  ];

  const generateOfflineReply = (msg: string, name: string): string => {
    const clean = msg.toLowerCase();
    
    if (clean.includes("hello") || clean.includes("hi") || clean.includes("hey") || clean.includes("greetings")) {
      return `Hello, **${name}**! I am currently running on my local backup offline database. Even without an active internet connection, I can answer questions about Ganesh's skills, B.Tech projects, CV certifications, and education details! Ask me anything!`;
    }
    
    if (clean.includes("project") || clean.includes("portfolio") || clean.includes("analyzer") || clean.includes("attendance") || clean.includes("rag") || clean.includes("work")) {
      return `### Offline Database: Ganesh Enyaram's Main Projects
- **Agentic Resume Analyzer**: Uses Advanced RAG to compare a developer's resume with a target Job Description (JD), returning an ATS matching score and structural improvements. Built with Next.js & PyTorch.
- **Smart Attendance System**: Edge face-recognition model mapping OpenCV face-vectors into a secure Firebase/Firestore storage.
- **Generative AI Assistant**: Text-to-image and conversational engine built with Next.js, Node.js, and stable diffusion checkpoints.
- **AI Chatbot RAG**: Advanced contextual Q&A bot leveraging Pinecone vector indexing and Llama-index pipelines.

*Note: You are viewing this information from the secure local offline cache.*`;
    }

    if (clean.includes("skill") || clean.includes("techno") || clean.includes("expert") || clean.includes("language") || clean.includes("framework") || clean.includes("program")) {
      return `### Offline Database: Ganesh's Technical Skills
- **Core Languages**: Python, Java, C++, JavaScript, TypeScript.
- **Artificial Intelligence**: Deep Learning, Machine Learning, Generative AI (LLMs, prompt engineering), crewAI Agents, LangChain pipelines, Computer Vision (OpenCV), NLP.
- **Web Technologies**: React, Next.js, Node.js, Express.js, MongoDB, SQL, GraphQL.
- **Developer Tools**: AWS (SageMaker, S3), Git/GitHub, Docker, Firebase, Supabase.`;
    }

    if (clean.includes("cert") || clean.includes("aws") || clean.includes("google") || clean.includes("ibm") || clean.includes("cloud")) {
      return `### Offline Database: Certified Credentials
Ganesh holds several masterclass technical credentials:
1. **AWS Certified Cloud Practitioner** (ID: AWS-CCP-100234, Nov 2025)
2. **Google Cloud Associate Cloud Engineer** (ID: GCA-993822, Dec 2025)
3. **IBM AI Engineering Professional Certificate** (ID: IBM-AI-3281, Sept 2025)
4. **DeepLearning.AI Generative AI with LLMs** (ID: DL-GENAI-11882, Oct 2025)
5. **NPTEL Elite+Gold in Natural Language Processing** (Nov 2024)`;
    }

    if (clean.includes("edu") || clean.includes("college") || clean.includes("btech") || clean.includes("university") || clean.includes("cgpa") || clean.includes("grade") || clean.includes("gpa")) {
      return `### Offline Database: Academic Credentials
- **Course**: B.Tech in Artificial Intelligence & Data Science (Senior Year)
- **Cumulative GPA**: **9.2 / 10** (Academic Excellence Scholarship recipient)
- **Achievements**: Solved **400+ online coding problems** (LeetCode, HackerRank), Winner of **2 Hackathons**, Top 2% in HackIndia 2025 Hackathon.`;
    }

    if (clean.includes("contact") || clean.includes("email") || clean.includes("mail") || clean.includes("phone") || clean.includes("linkedin") || clean.includes("github")) {
      return `### Offline Database: Contact Details
Below are Ganesh's immediate communication channels:
- **Email Coordinates**: eganesh7997@gmail.com
- **LinkedIn**: linkedin.com/in/ganesh-enyaram
- **GitHub**: github.com/ganeshenyaram
- **Location**: Hyderabad, India
*Tip: When you are back online, you can also book a simulated slot on Calendly!*`;
    }

    return `### [Local NLP Backup Module Active]
Currently, you are **offline**, but my local database is loaded! Here is a summary of Ganesh's profile context:

Ganesh Enyaram is an **AI & Data Science Senior B.Tech Student** with a strong **9.2 CGPA**, specializing in **LLM applications, AI agents, and Full-Stack development**. He is certified in **AWS Services** and **IBM AI Engineering**, and has solved 400+ coding challenges.

What specific details would you like to know offline?
1. **skills** - Ganesh's technical stack and programming languages.
2. **projects** - Notable work including his ATS Resume Analyzer.
3. **certifications** - AWS, Google Cloud, and IBM deep learning licenses.
4. **contact** - His direct email coordinates.`;
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    // Clear field
    setInputValue("");
    setErrorStatus(null);

    // Add user message locally
    const userMsg: Message = {
      sender: "user",
      text: trimmed,
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Check online/offline state
    if (!isOnline) {
      setTimeout(() => {
        const localReply = generateOfflineReply(trimmed, userName);
        const botMsg: Message = {
          sender: "bot",
          text: localReply,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
        setIsLoading(false);
      }, 700);
      return;
    }

    try {
      // Map message history to simple payload format expected by Express "/api/bot"
      const historyPayload = updatedMessages.slice(0, -1).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch("/api/bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: trimmed,
          chatHistory: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned error status ${res.status}`);
      }

      const data = await res.json();
      
      const botMsg: Message = {
        sender: "bot",
        text: data.reply || "Authorization complete, but payload returned empty.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      setErrorStatus("Connection timeout. Please double-check if server is active.");
      console.error("AI Communication error:", err);
      
      // Add error reaction from Bot
      const errorBotMsg: Message = {
        sender: "bot",
        text: "[SYSTEM RESPONSE DEGRADED] Unable to verify connection to the Gemini API socket. Please ensure the host GEMINI_API_KEY environment variable is configured inside the settings menu.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorBotMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage(inputValue);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: `System refreshed. Hello, **${userName}**! Connection successfully secure-synced. Query me anything about Ganesh's career checkpoints to begin.`,
        timestamp: new Date()
      }
    ]);
    setErrorStatus(null);
  };

  const downloadChat = () => {
    if (messages.length === 0) return;
    
    const formattedTranscript = messages.map((msg) => {
      const timeStr = msg.timestamp.toLocaleString();
      const senderLabel = msg.sender === "user" ? `USER (${userName})` : "GANESH AI CORE AGENT";
      // Remove any trailing extra spaces/lines
      return `==========================================\n[${timeStr}] ${senderLabel}\n==========================================\n${msg.text}\n`;
    }).join("\n");

    const header = `========================================================\nGANESH PORTFOLIO NEURAL NAVIGATOR: CHAT TRANSCRIPT\nGenerated on: ${new Date().toLocaleString()}\nSynchronized User: ${userName}\nConnection mode: ${isOnline ? "ONLINE (Gemini Live)" : "OFFLINE (Local Cognitive Core)"}\n========================================================\n\n`;
    
    const fileContent = header + formattedTranscript;
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    const dateStamp = new Date().toISOString().replace(/[:.]/g, "-");
    link.download = `ganesh_ai_chat_transcript_${dateStamp}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Inline markdown formatter helper to display bullet points, bold tags, and monospaces beautifully
  const parseInlineFormatting = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-extrabold text-white text-[11.5px] tracking-wide">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-mono text-[10px]">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const formatMarkdown = (text: string) => {
    if (!text) return "";
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmedLine = line.trim();
      
      // Check for bullet points
      if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-300 my-1 leading-relaxed">
            {parseInlineFormatting(trimmedLine.substring(2))}
          </li>
        );
      }
      
      // Check for numbered lists
      const orderedMatch = trimmedLine.match(/^\d+\.\s(.*)/);
      if (orderedMatch) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs text-slate-350 my-1 leading-relaxed">
            {parseInlineFormatting(orderedMatch[1])}
          </li>
        );
      }

      // Large subheadings
      if (trimmedLine.startsWith("### ")) {
        return (
          <h5 key={idx} className="font-mono text-[11px] uppercase tracking-wider text-cyan-400 font-bold mt-3 mb-1.5">
            {trimmedLine.replace("### ", "")}
          </h5>
        );
      }

      // Main lines/subtitles
      if (trimmedLine.startsWith("## ")) {
        return (
          <h4 key={idx} className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-extrabold mt-4 mb-2 pb-1 border-b border-slate-900/40">
            {trimmedLine.replace("## ", "")}
          </h4>
        );
      }

      // Empty blank lines
      if (!trimmedLine) {
        return <div key={idx} className="h-2" />;
      }

      // Default paragraph node
      return (
        <p key={idx} className="text-xs text-slate-300 leading-relaxed mb-1.5">
          {parseInlineFormatting(line)}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Sparkle Trigger Button with Ring Lights */}
      <motion.div 
        className="fixed bottom-6 right-20 z-40"
        animate={{ 
          y: [0, -6, 0] 
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut"
        }}
      >
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
          }}
          className={`relative p-3.5 rounded-full bg-slate-950 border transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(6,182,212,0.3)] hover:shadow-cyan-500/40 group flex items-center justify-center ${
            isOpen 
              ? "border-cyan-400 text-cyan-400 rotate-90" 
              : "border-slate-800 text-slate-400 hover:text-white"
          }`}
          title="Query Ganesh's Portfolio AI Agent"
          aria-label="Toggle AI agent"
          id="ai-chatbot-floating-trigger"
        >
          {/* Dynamic Animated Core Rings */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-transparent group-hover:border-cyan-500/30 group-hover:scale-110 transition-all duration-300 pointer-events-none" />

          {/* Active Status Pulse Dot */}
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? "bg-cyan-400" : "bg-amber-400"}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? "bg-cyan-500" : "bg-amber-500"}`}></span>
          </span>

          {isOpen ? (
            <X className="w-5.5 h-5.5" />
          ) : (
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 3, -3, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              }}
              className="relative flex items-center justify-center text-cyan-400"
            >
              <Bot className="w-5.5 h-5.5 group-hover:scale-105 transition-transform" />
            </motion.div>
          )}
        </button>
      </motion.div>

      {/* Embedded Chat Layout Canvas */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            ref={chatWindowRef}
            className="fixed bottom-24 right-6 sm:right-12 w-[calc(100vw-2rem)] sm:w-[410px] h-[550px] rounded-3xl bg-slate-950/95 border border-slate-850/90 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-md z-40 flex flex-col overflow-hidden"
            id="ai-chatbot-window-panel"
          >
            {/* Ambient Background Matrix glow */}
            <div className="absolute inset-0 bg-radial-gradient(ellipse_60%_20%_at_50%_0%,rgba(6,182,212,0.12),transparent_100%) pointer-events-none" />

            {/* HEADER INTERFACE */}
            <div className="relative p-4 border-b border-slate-900/60 bg-slate-950/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* HIGHLY ANIMATED LOGO EMBLEM WITH SCREENGROUND SCANNER */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.08, 1]
                    }}
                    transition={{
                      rotate: { repeat: Infinity, duration: 8, ease: "linear" },
                      scale: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                    }}
                    className={`absolute inset-0 rounded-xl blur-[3px] opacity-75 ${
                      isOnline 
                        ? "bg-gradient-to-tr from-cyan-500/30 to-indigo-500/30" 
                        : "bg-gradient-to-tr from-amber-500/30 to-red-500/30"
                    }`}
                  />
                  <div className={`relative p-2 rounded-xl bg-slate-900 border text-cyan-400 flex items-center justify-center overflow-hidden h-10 w-10 ${
                    isOnline ? "border-cyan-500/40" : "border-amber-500/40"
                  }`}>
                    <motion.div
                      animate={{
                        y: [-1, 1, -1]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.2,
                        ease: "easeInOut"
                      }}
                      className={isOnline ? "text-cyan-400" : "text-amber-400"}
                    >
                      <Bot className="w-5.5 h-5.5" />
                    </motion.div>
                    
                    {/* Glowing scanning laser beam */}
                    <motion.div 
                      key={isOnline ? "online-scan" : "offline-scan"}
                      animate={{
                        y: [-20, 20]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.8,
                        ease: "linear"
                      }}
                      className={`absolute left-0 right-0 h-[1.5px] opacity-80 pointer-events-none ${
                        isOnline ? "bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,1)]" : "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,1)]"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-[11.5px] font-black tracking-widest text-slate-100 uppercase flex items-center gap-1.5 leading-none">
                    GANESH AI AGENT
                    <span className={`w-1.5 h-1.5 rounded-full inline-block animate-pulse ${isOnline ? "bg-emerald-500" : "bg-amber-500"}`} />
                  </h4>
                  <div className="flex items-center gap-1.5 font-mono text-[8.5px] text-slate-500 mt-1.5 uppercase">
                    {isOnline ? (
                      <>
                        <Wifi className="w-3 h-3 text-cyan-500" />
                        <span className="text-cyan-400/80">ONLINE // SYSTEM ACTIVE</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3 h-3 text-amber-500 animate-pulse" />
                        <span className="text-amber-400/80">OFFLINE // LOCAL COGNITIVE CORE</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Utility Panel */}
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadChat}
                  title="Download Chat Transcript"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-slate-900/80 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={clearChat}
                  title="Wipe conversation logs"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900/80 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  title="Minimize chatbot panel"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900/80 transition-all cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close AI Interface"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* MESSAGES VIEWING CANVAS */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              
              {/* Secure Node Info Alert */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-900 flex gap-2.5 text-left text-[10.5px] text-slate-400 leading-relaxed">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Neural Sync Status</span>: Connected to Ganesh's curriculum corpus. AI will directly analyze skill nodes, ATS standards, and project parameters.
                </div>
              </div>

              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    opacity: { duration: 0.25, delay: Math.min(idx * 0.05, 0.25) },
                    y: { type: "spring", stiffness: 280, damping: 20, delay: Math.min(idx * 0.05, 0.25) },
                    scale: { type: "spring", stiffness: 300, damping: 20, delay: Math.min(idx * 0.05, 0.25) },
                    layout: { type: "spring", stiffness: 280, damping: 24 }
                  }}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  {/* Sender title label */}
                  <div className="font-mono text-[8.5px] uppercase text-slate-500 mb-1 px-1 flex items-center gap-1">
                    {msg.sender === "user" ? "Vessel Terminal" : "AI Core Node"} 
                    &bull; {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>

                  {/* Bubble styling */}
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-left shadow-sm ${
                      msg.sender === "user"
                        ? "bg-indigo-650 text-white rounded-tr-none border border-indigo-500/30"
                        : "bg-slate-900 border border-slate-850/80 rounded-tl-none"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <p className="text-xs text-slate-100 leading-relaxed font-sans">{msg.text}</p>
                    ) : (
                      <div className="space-y-1 font-sans">
                        {formatMarkdown(msg.text)}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Loader Pinging */}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="font-mono text-[8.5px] uppercase text-slate-500 mb-1 px-1">
                    AI Core Node &bull; Thinking
                  </div>
                  <div className="max-w-[85%] px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-850/80 rounded-tl-none flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-200" />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-300" />
                    <span className="font-mono text-[10px] text-slate-400 ml-1.5">Consulting profile logs...</span>
                  </div>
                </div>
              )}

              {/* Invisible anchor for scrolling */}
              <div ref={messagesEndRef} />
            </div>

            {/* SUGGESTED COMMANDS CHIPS */}
            {messages.length === 1 && (
              <div className="p-3 bg-slate-950/80 border-t border-slate-900/60 text-left">
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-cyan-400" /> Suggested Query Inputs:
                </p>
                <div className="flex flex-col gap-1.5">
                  {suggestions.map((suggestion, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSendMessage(suggestion.text)}
                      className="w-full text-left p-2 rounded-xl bg-slate-900 hover:bg-slate-850/80 border border-slate-850/60 hover:border-cyan-500/40 text-[10.5px] text-slate-300 hover:text-white font-sans transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <span>{suggestion.label}</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ERROR STATS BAR */}
            {errorStatus && (
              <div className="mx-3.5 mb-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400 font-sans flex items-center justify-between gap-2 shrink-0">
                <span className="flex-1 text-left">{errorStatus}</span>
                <button 
                  onClick={() => setErrorStatus(null)} 
                  className="text-slate-400 hover:text-white font-semibold uppercase text-[9px] cursor-pointer bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 shrink-0"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* CONSOLE INPUT BAR */}
            <div className="p-3.5 border-t border-slate-900 bg-slate-950/60 flex items-center gap-2">
              {isSpeechSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 relative ${
                    isListening
                      ? "bg-rose-500/15 border-rose-500 text-rose-400 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                      : "bg-slate-900 border-slate-850 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40"
                  }`}
                  title={isListening ? "Listening... Click to stop" : "Use voice command (Speech-to-Text)"}
                  aria-label={isListening ? "Stop voice command" : "Start voice command"}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  {isListening && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                  )}
                </button>
              )}
              <input
                type="text"
                placeholder={isListening ? "Neural listening active... Speak now." : "Ask for custom career advice or project details..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`flex-1 py-1.5 px-3 rounded-xl border font-sans text-xs outline-none transition-all ${
                  isListening
                    ? "bg-rose-950/10 border-rose-500/40 text-rose-200 placeholder-rose-500/50 shadow-[0_0_12px_rgba(239,68,68,0.05)]"
                    : "bg-slate-900 border-slate-850 focus:border-cyan-500/60 focus:bg-slate-900/90 text-white placeholder-slate-500 focus:shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                }`}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all shadow-sm active:scale-95 disabled:scale-100 disabled:opacity-40 disabled:bg-slate-900 disabled:text-slate-500 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Capsule Launcher */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-24 right-6 sm:right-12 px-4 py-2.5 rounded-2xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 shadow-[0_4px_25px_rgba(6,182,212,0.25)] flex items-center gap-2 cursor-pointer hover:bg-cyan-900/30 font-mono text-[10.5px] uppercase tracking-wider z-40 transition-colors"
            id="ai-chatbot-minimized-capsule"
          >
            <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
            <span>Restore Active Agent Session</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
