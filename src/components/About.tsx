import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { GraduationCap, Award, Star, Compass, Upload, Camera, RefreshCw, MapPin, Sparkles, Code2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
// @ts-ignore
import techAvatarImg from "../assets/images/tech_developer_avatar_1781108834995.png";

export default function About() {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Load photo from localStorage if present to display instantly
  useEffect(() => {
    try {
      const storedImage = localStorage.getItem("ganesh-profile-image");
      if (storedImage) {
        setProfileImage(storedImage);
      }
    } catch (e) {
      console.error("Failed to load profile photo from localStorage", e);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        
        // Render instantly on UI
        setProfileImage(base64Data);
        
        try {
          localStorage.setItem("ganesh-profile-image", base64Data);
        } catch (storageError) {
          console.warn("Storage quota exceeded, only caching this session in browser state:", storageError);
        }

        // Upload to Node Express server to persistently sync for all users / redeploys
        try {
          const response = await fetch("/api/avatar/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: base64Data }),
          });
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (data.success) {
              console.log("Photo synchronized to server storage completely.");
            }
          } else {
            console.warn("Avatar upload response was not JSON:", contentType);
          }
        } catch (serverErr) {
          console.error("Could not upload profile to Express server:", serverErr);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleReset = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem("ganesh-profile-image");
      setProfileImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Notify server to clear the persistent uploaded file
      await fetch("/api/avatar/reset", { method: "POST" });
    } catch (error) {
      console.error("Failed to reset profile image:", error);
    }
  };

  const education = [
    {
      year: "2024 — 2028",
      degree: t("about.edu1.degree", "B.Tech – CSE (Artificial Intelligence & Data Science)"),
      institution: t("about.edu1.institution", "Marwadi University, Rajkot, Gujarat"),
      summary: t("about.edu1.summary", "Currently pursuing 2nd Year. Expected Graduation: 2028. Actively specializing in machine learning algorithms, deep learning neural layers, data pipelines, and advanced predictive analysis."),
    },
    {
      year: "2022 — 2024",
      degree: t("about.edu2.degree", "Higher Secondary Education"),
      institution: t("about.edu2.institution", "Siddipet, Telangana, India"),
      summary: t("about.edu2.summary", "Formed strong foundational expertise in computer fundamentals, mathematics, and science disciplines."),
    }
  ];

  const expertises = [
    { title: t("about.exp1.title", "AI Conversational Chatbots"), desc: t("about.exp1.desc", "Constructing NLP processing pipelines, intent classifiers, and stateful conversational interfaces with Python.") },
    { title: t("about.exp2.title", "Data Science & Dashboards"), desc: t("about.exp2.desc", "Formulating visual reporting nodes, cleaning complex datasets, and drawing automated insights using Pandas & Matplotlib.") },
    { title: t("about.exp3.title", "Predictive Classifiers"), desc: t("about.exp3.desc", "Engineering supervised training models (classification and regression) utilizing Scikit-learn and TensorFlow.") },
    { title: t("about.exp4.title", "AI & Vibe Coding"), desc: t("about.exp4.desc", "Rapid prototyping, agile system orchestrations, and prompt optimizations to deploy smart tools at lightning speeds.") },
  ];

  const achievements = [
    t("about.ach1", "Shortlisted for the PixelVerse Offline Finale Hackathon as Team Lead, advancing to national scales."),
    t("about.ach2", "Participated in Convolve 4.0, a highly prestigious Pan-IIT AI/ML Hackathon across elite institutions."),
    t("about.ach3", "Earned certified certificates of completion in ET AI Hackathon & ZOMATHON 24-hr Data Hackathon."),
    t("about.ach4", "Selected for the RBU Global Digital Exchange Forum focusing on Inclusive & Ethical AI for ASEAN."),
  ];

  return (
    <section id="about-section" className="relative py-24 px-4 bg-transparent transition-colors duration-300">
      <div className="absolute inset-0 bg-radial-gradient-bottom pointer-events-none opacity-20" />

      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans"
          >
            {t("about.heading", "About Ganesh")}
          </motion.h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full" />
        </div>

        {/* Narrative & Objectives Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* 1. Profile Photo Sidebar (Interactive & Uploadable) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 space-y-6 flex flex-col items-center"
          >
            {/* Professional Monogram & System Stats Frame */}
            <div 
              className="group relative w-72 h-[384px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/80 p-2.5 shadow-[0_0_50px_rgba(6,182,212,0.15)] hover:shadow-[0_0_60px_rgba(6,182,212,0.35)] transition-all duration-350"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-indigo-500/5 to-pink-500/10 opacity-70 group-hover:opacity-100 transition-opacity" />
              
              {/* Outer neon border highlight animation on hover */}
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 opacity-0 group-hover:opacity-40 blur-sm transition-all duration-350" />

              {/* Dynamic Icon/Status container */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 flex flex-col justify-between border border-slate-800/60 select-none">
                {/* Image Section */}
                <div className="relative w-full h-52 overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={techAvatarImg}
                    alt="Ganesh Enyaram Tech Avatar"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                </div>

                {/* Status/Monogram Details Section */}
                <div className="p-5 flex-1 flex flex-col justify-center text-center -mt-4 relative z-10">
                  <h3 className="text-xl font-bold font-sans text-white tracking-wide">Ganesh Enyaram</h3>
                  <p className="text-xs font-mono text-cyan-400 mt-1 uppercase tracking-widest">Software Engineer & Architect</p>
                  
                  <div className="w-12 h-px bg-slate-800 my-3 mx-auto" />
                  
                  <div className="text-left font-mono text-[9px] text-slate-455 space-y-1.5 bg-slate-900/65 p-3 rounded-xl border border-slate-800/30 w-full">
                    <div className="flex justify-between">
                      <span className="text-slate-500">SYSTEM_STATUS</span>
                      <span className="text-green-400 animate-pulse font-bold">● ACTIVE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">DOMAIN</span>
                      <span className="text-cyan-400">AI.DATA_SCIENCE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">BASE_REGION</span>
                      <span className="text-indigo-400">SIDDIPET, IN</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Fast Facts */}
            <div className="w-full max-w-sm p-5 rounded-2xl bg-slate-900/40 border border-slate-850/60 backdrop-blur-xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/60 font-sans">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">STUDENT PROFILE</span>
              </div>

              {/* Fast stats indicators */}
              <div className="space-y-3 pt-1 text-left">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-800/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-mono">LOCATION</span>
                    <span className="font-semibold text-slate-200 text-xs">Rajkot, Gujarat, India</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="w-6 h-6 rounded-lg bg-indigo-950/80 border border-indigo-800/40 flex items-center justify-center text-indigo-400 shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-mono">FOCUS METRIC</span>
                    <span className="font-semibold text-slate-200">AI Enthusiast & ML Developer</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="w-6 h-6 rounded-lg bg-pink-950/80 border border-pink-800/40 flex items-center justify-center text-pink-400 shrink-0">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-mono">ACADEMIC STATUS</span>
                    <span className="font-semibold text-slate-200">2nd Year CSE (AI & Data Science)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. Narrative Objective & Honors (Side panels flowing together) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Objective Statement Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-850 shadow-xl space-y-4"
            >
              <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
                <Compass className="w-5 h-5 text-cyan-400" />
                {t("about.careerVision", "Career Vision & Objective")}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {t("about.careerVisionDesc1", "As a passionate B.Tech specialized student in AI & Data Science, my mission is to pioneer intelligent cognitive assistants, advanced RAG architectures, and highly intuitive user experiences. I seek opportunities within tech environments aiming to build real-world products incorporating neural models and scalable full-stack pipelines.")}
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                {t("about.careerVisionDesc2", "I thrive on translating complex mathematical or statistical models into highly optimized production software, focusing heavily on latency, accuracy, and accessibility.")}
              </p>
            </motion.div>

            {/* Combined Academic History & Achievements */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Achievements panel */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-850 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono mb-4">
                    <Award className="w-5 h-5 text-indigo-400" />
                    {t("about.academicHonors", "Academic Honors")}
                  </h3>
                  <div className="space-y-4">
                    {achievements.map((achievement, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <Star className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                        <span className="text-slate-300 text-xs leading-relaxed">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Education Timeline Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-850 shadow-xl space-y-6"
              >
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
                  <GraduationCap className="w-5 h-5 text-pink-400" />
                  {t("about.academicHistory", "Academic History")}
                </h3>

                <div className="relative border-l border-slate-800 pl-5 ml-2.5 space-y-6">
                  {education.map((edu, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline dot */}
                      <div className="absolute -left-7.5 top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:bg-cyan-400 transition-all z-10" />

                      <span className="text-[10px] font-mono text-cyan-400 font-semibold">{edu.year}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white mt-0.5 group-hover:text-cyan-350 transition-colors">
                        {edu.degree}
                      </h4>
                      <p className="text-[11px] font-mono text-indigo-350 mt-0.5">{edu.institution}</p>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{edu.summary}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
            
          </div>
        </div>

        {/* Expertise Columns */}
        <div className="space-y-6">
          <h3 className="text-center text-lg font-mono text-slate-400 tracking-wider">
            {t("about.engineeringFocus", "SPECIALIZED ENGINEERING FOCUS")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {expertises.map((xp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-850 hover:border-cyan-500/40 transition-all duration-350 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 text-xs font-mono font-bold">
                    0{idx + 1}
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{xp.title}</h4>
                  <p className="text-xs text-slate-405 leading-relaxed">{xp.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
