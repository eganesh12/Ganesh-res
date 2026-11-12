import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Unlock, 
  ArrowLeft, 
  Fingerprint, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  X,
  Loader2,
  Clock,
  ExternalLink,
  Settings,
  AlertTriangle,
  Mail,
  Send,
  Sparkles,
  User,
  Globe,
  Database,
  Award,
  Cloud,
  Terminal,
  Layers,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const loginIllu = "/src/assets/images/secure_login_illustration_1781421404117.jpg";
const ganeshPhoto = "/src/assets/images/ganesh_custom_photo_1781015074351.png";
const cyberAvatar = "/src/assets/images/cyber_avatar_emblem_1781014510118.png";
const developerAvatar = "/src/assets/images/tech_developer_avatar_1781108834995.png";

interface AuthPageProps {
  theme: "dark" | "light";
  onBack: () => void;
  hideBackButton?: boolean;
}

export default function AuthPage({ theme, onBack, hideBackButton = false }: AuthPageProps) {
  const { t } = useLanguage();
  const { 
    signInWithGoogle, 
    logContactViewer,
    user: firebaseUser 
  } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [activeLoadingProvider, setActiveLoadingProvider] = useState<"google" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [errorDetails, setErrorDetails] = useState<{
    code: string;
    provider: "google";
    callbackUrl: string;
    projectId: string;
  } | null>(null);

  // States for Gmail confirmation pop-up modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loggedUserEmail, setLoggedUserEmail] = useState("");
  const [loggedUserName, setLoggedUserName] = useState("");

  React.useEffect(() => {
    // If pop-up is shown, lock progress timeout
    if (isLoading || showSuccessModal || hideBackButton) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onBack();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const resetTimer = () => {
      setTimeLeft(60);
    };

    // Listen to user touches, keystrokes, mouse moves for true session timeout
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, [isLoading, onBack]);

  const getAuthErrorMessage = (err: any): string => {
    const code = err?.code;
    switch (code) {
      case "auth/popup-closed-by-user":
        return "Authentication cancelled. The popup was closed before completing the handshake.";
      case "auth/cancelled-popup-request":
        return "Multiple popup requests detected. Please wait for the initial window to complete.";
      case "auth/network-request-failed":
        return "Network connection issue detected. Please check your secure connection parameters.";
      case "auth/operation-not-allowed":
        return "This authentication provider is not enabled in your Firebase project. To enable it: 1) Go to your Firebase Console, 2) Navigate to Authentication -> Sign-in method, and 3) Enable Google sign-in. Firebase will then authorize these sign-in requests!";
      default:
        return err?.message || "Authentication handshake failed. Please try again.";
    }
  };

  const handleProviderLogin = async (provider: "google") => {
    setErrorMsg("");
    setSuccessMsg("");
    setErrorDetails(null);
    setIsLoading(true);
    setActiveLoadingProvider(provider);

    try {
      let loggedUser = null;
      if (provider === "google") {
        loggedUser = await signInWithGoogle();
      }
      
      const email = loggedUser?.email || "";
      const displayName = loggedUser?.displayName || email.split("@")[0] || "Google User";
      
      setLoggedUserEmail(email);
      setLoggedUserName(displayName);
      setSuccessMsg("Google identity validated! A confirmation email from 'Ganesh Enyaram Portfolio' has been automatically sent to your Google inbox.");
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
        onBack();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(getAuthErrorMessage(err));
      if (err?.code === "auth/operation-not-allowed") {
        setErrorDetails({
          code: err.code,
          provider: provider,
          callbackUrl: "https://gdgmu-481810.firebaseapp.com/__/auth/handler",
          projectId: "gdgmu-481810"
        });
      }
    } finally {
      setIsLoading(false);
      setActiveLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-screen pt-12 pb-24 md:pt-16 md:pb-28 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden bg-slate-950 font-sans">
      
      {/* Background dynamic visual layers - "videotic" cinematic mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Orbiting Cyan ambient core orb */}
        <motion.div 
          animate={{ 
            x: [-60, 60, -60], 
            y: [-40, 50, -40],
            scale: [1, 1.3, 1],
            opacity: [0.25, 0.45, 0.25]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[8%] left-[12%] w-[550px] h-[550px] rounded-full bg-cyan-500/15 filter blur-[110px]" 
        />

        {/* Orbiting Indigo/Holographic ambient core orb */}
        <motion.div 
          animate={{ 
            x: [60, -60, 60], 
            y: [50, -40, 50],
            scale: [1.3, 0.95, 1.3],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[8%] right-[12%] w-[600px] h-[600px] rounded-full bg-indigo-500/15 filter blur-[130px]" 
        />

        {/* Orbiting Deep Violet tertiary ambient orb */}
        <motion.div 
          animate={{ 
            x: [-30, 30, -30], 
            y: [40, -60, 40],
            scale: [0.85, 1.15, 0.85],
            opacity: [0.2, 0.35, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[35%] right-[25%] w-[400px] h-[400px] rounded-full bg-fuchsia-600/10 filter blur-[100px]" 
        />

        {/* Cinematic Glowing Cyber-Particles drifting horizontally */}
        <div className="absolute inset-0 z-10 opacity-30">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`cyber-part-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500"
              style={{
                width: i % 2 === 0 ? "6px" : "4px",
                height: i % 2 === 0 ? "6px" : "4px",
                top: `${8 + (i * 7.5)}%`,
                left: `${10 + (i * 6.5)}%`,
                filter: "drop-shadow(0 0 4px rgba(6, 182, 212, 0.8))",
              }}
              animate={{
                x: [0, 80, -20, 0],
                y: [0, -40, 30, 0],
                opacity: [0.2, 0.9, 0.4, 0.2],
                scale: [0.8, 1.3, 0.9, 0.8]
              }}
              transition={{
                duration: 12 + (i * 1.5),
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
        
        {/* Advanced tech matrix scan grid dots with delicate horizontal scan line sweep */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.22)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Grid Highlight Accent overlay */}
        <div className="absolute inset-0 bg-radial-gradient(from-center, rgba(15,23,42,0) 40%, rgba(2,6,23,0.85) 100%) pointer-events-none" />
        
        {/* Scan lines overlay with slow pulsing screen glow height */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0)_97%,rgba(6,182,212,0.08)_99%,rgba(6,182,212,0.08)_100%)] bg-[size:100%_6px] opacity-70 pointer-events-none" />
      </div>

      <motion.div 
        id="auth-main-panel" 
        initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)", y: 25 }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.1 }}
        className="relative z-10 w-full max-w-5xl bg-slate-950/90 border border-slate-900 rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.9)] grid grid-cols-1 lg:grid-cols-12 min-h-[600px] backdrop-blur-xl"
      >
        
        {/* LEFT COMPACT PANEL: Visually Compelling developer focus showcase */}
        <div className="lg:col-span-5 bg-slate-950/80 border-r border-slate-900/60 p-8 flex flex-col justify-center relative overflow-hidden group">
          
          {/* Cover grid backdrop */}
          <div className="absolute inset-0 z-0 opacity-20">
            <img 
              src={loginIllu} 
              alt="High-Tech Biometric Gateway" 
              className="w-full h-full object-cover object-center filter saturate-[0.8] brightness-[0.4] contrast-[1.15] transition-transform duration-1000 group-hover:scale-105" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/10 via-transparent to-slate-950" />
          </div>

          <div className="relative z-10 space-y-6 text-left">
            {/* Return Arrow trigger */}
            {!hideBackButton && (
              <button 
                onClick={onBack}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 hover:text-white font-mono uppercase tracking-wider hover:bg-slate-900 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Hub
              </button>
            )}

            {/* Ganesh Profile Image & Interactive Hologram */}
            <div className="flex flex-col items-center text-center pt-4 space-y-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Outer spinning glowing dash ring */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                />
                
                {/* Inner slow reverse-spinning dotted ring */}
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 rounded-full border border-dotted border-indigo-400/30"
                />

                {/* Glowing status pulse dot */}
                <span className="absolute top-2 right-2 z-25 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>

                {/* Profile Photo Wrapper */}
                <div className="relative w-26 h-26 rounded-full overflow-hidden border-2 border-cyan-500/65 bg-slate-950 shadow-[0_8px_30px_rgba(6,182,212,0.3)]">
                  <img 
                    src={developerAvatar} 
                    alt="Ganesh Enyaram" 
                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback if not found
                      e.currentTarget.src = developerAvatar;
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="text-xl font-black text-white tracking-tight leading-none uppercase">
                  Ganesh <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-indigo-400">Enyaram</span>
                </h1>
                <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-extrabold">
                  Cloud Architect & AI Data Engineer
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM PANEL: Pure OAuth Gates */}
        <div className="lg:col-span-7 p-6 sm:p-12 flex flex-col justify-center bg-slate-950 relative">
          
          <div className="absolute top-[20%] right-[10%] w-[250px] h-[250px] rounded-full bg-cyan-500/5 filter blur-[60px] pointer-events-none" />

          <div className="max-w-md w-full mx-auto">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="skeleton-handshake-io"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 text-center py-8"
                >
                  <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-2xl border-t-2 border-r-2 border-cyan-400"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-2 rounded-2xl border-b-2 border-l-2 border-indigo-400/40"
                    />
                    <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-lg font-bold tracking-tight text-white font-sans uppercase">
                      Verifying Identity Token...
                    </h2>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Securing session tunnel parameters and validating OIDC credentials against Google identity databases.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 font-mono text-[9px] text-cyan-400 uppercase tracking-widest animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Handshake active...
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="auth-interactive-sso"
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="space-y-6"
                >
                  {/* 1. WELCOME GREETING HEADLINE (NOW AT THE TOP) */}
                  <div className="space-y-1.5 text-left border-b border-slate-900/40 pb-4">
                    <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase font-extrabold block text-left">
                      Secure Handshake Portal
                    </span>
                    <h2 className="text-2xl font-black tracking-tight text-white font-sans uppercase">
                      Welcome to the Hub
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2.5 text-left">
                      Sign in with your Google account credentials to unlock Ganesh Enyaram's advanced live analytics workspace, secure developer utilities, and active system directories.
                    </p>
                  </div>

                  {/* 2. GOOGLE BRANDED BUTTON / HANDSHAKE FEEDBACK */}
                  <AnimatePresence mode="wait">
                    {errorDetails ? (
                      <motion.div
                        key="firebase-ops-not-allowed-helper"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="space-y-4 text-left"
                      >
                        {/* HIGH CONTRAST GOLD/ROSE DIAGNOSTIC HEADER */}
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex flex-col gap-3">
                          <div className="flex items-start gap-2.5">
                            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                            <div className="space-y-1">
                              <h3 className="font-extrabold font-mono text-xs uppercase tracking-wider text-amber-300 animate-pulse">
                                Firebase Configuration Gate: Lock Detected
                              </h3>
                              <p className="text-[11px] text-slate-300">
                                This authentication provider (<strong>Google SSO</strong>) is not enabled in your current Firebase Auth ecosystem.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* STEP BY STEP INTERACTIVE CONFIG PLAN */}
                        <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono flex items-center gap-2">
                            <Settings className="w-3.5 h-3.5 text-cyan-400" /> Integration Resolve Blueprint
                          </h4>

                          <div className="space-y-3.5">
                            {/* Step 1 */}
                            <div className="flex gap-3">
                              <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                                1
                              </div>
                              <div className="text-xs text-slate-300">
                                Open the{" "}
                                <a
                                  href={`https://console.firebase.google.com/project/${errorDetails.projectId}/authentication/providers`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-cyan-400 underline font-semibold inline-flex items-center gap-1 hover:text-cyan-300"
                                >
                                  Firebase Sign-In Method Console <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex gap-3">
                              <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                                2
                              </div>
                              <div className="text-xs text-slate-300">
                                Click <strong className="text-slate-100">Add new provider</strong> and select{" "}
                                <strong className="text-slate-100">Google</strong>
                              </div>
                            </div>

                            {/* Step 3 for Google */}
                            <div className="flex gap-3">
                              <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                                3
                              </div>
                              <div className="text-xs text-slate-300 space-y-2">
                                Configure and enable Google SSO in your Firebase console settings, then click <strong className="text-slate-100">Save</strong>.
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* DISMISS / RETRY CTAs */}
                        <div className="flex gap-3.5 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setErrorDetails(null);
                              setErrorMsg("");
                            }}
                            className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-200 rounded-xl font-sans text-xs font-extrabold tracking-wider uppercase hover:text-white transition-all cursor-pointer text-center"
                          >
                            Return to Gateway Selection
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <>
                        {/* SSO ACTIVE PORTALS CONTAINER */}
                        <div className="space-y-4">
                          {/* GOOGLE BRANDED BUTTON */}
                          <motion.button
                            type="button"
                            onClick={() => handleProviderLogin("google")}
                            disabled={isLoading}
                            whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.985 }}
                            className="w-full relative group overflow-hidden py-4 px-5 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/50 disabled:opacity-45 text-slate-200 hover:text-white font-mono text-xs uppercase font-extrabold tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-between shadow-[0_12px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_40px_rgba(6,182,212,0.15)]"
                          >
                            {/* Animated shimmering sweep effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                            <div className="flex items-center gap-3.5 relative z-10 text-left">
                              <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-md select-none shrink-0 group-hover:scale-105 transition-transform duration-300">
                                {activeLoadingProvider === "google" ? (
                                  <Loader2 className="w-4 h-4 text-cyan-600 animate-spin" />
                                ) : (
                                  /* Official Google "G" Logo */
                                  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                                  </svg>
                                )}
                              </span>
                              <div className="flex flex-col text-left font-sans">
                                <span className="font-sans font-black text-sm tracking-tight text-white leading-tight normal-case text-left">
                                  {activeLoadingProvider === "google" ? "Unsealing session..." : "Sign in with Google"}
                                </span>
                                <span className="text-[9px] font-mono text-slate-400 capitalize font-normal leading-tight text-left">
                                  Secure single sign-on authentication
                                </span>
                              </div>
                            </div>

                            <div className="relative z-10 p-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-cyan-400 group-hover:text-emerald-400 group-hover:border-cyan-500/30 transition-all duration-300">
                              {activeLoadingProvider === "google" ? (
                                <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                              ) : (
                                <Unlock className="w-3.5 h-3.5" />
                              )}
                            </div>
                          </motion.button>
                        </div>

                        {errorMsg && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/30 text-rose-220 text-xs text-left leading-relaxed flex items-start gap-2.5"
                          >
                            <X className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0 cursor-pointer" onClick={() => setErrorMsg("")} />
                            <span>{errorMsg}</span>
                          </motion.div>
                        )}

                        {successMsg && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 text-xs text-left leading-relaxed flex items-start gap-2.5"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{successMsg}</span>
                          </motion.div>
                        )}
                      </>
                    )}
                  </AnimatePresence>

                  {/* 3. CORE CAPABILITIES / ENGINEERING FOCUS (SHOWN DIRECTLY BELOW GOOGLE SIGN IN) */}
                  <div className="relative z-10 space-y-3 text-left border-t border-slate-900/60 pt-4 mt-2">
                    <div className="space-y-0.5 flex items-center justify-between">
                      <span className="text-[9.5px] font-mono tracking-widest text-cyan-400 uppercase font-black block text-left">
                        Core Capabilities
                      </span>
                      <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-tight flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" /> Engineering Focus
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {/* Feature 1 */}
                      <div className="flex gap-2.5 items-center bg-slate-900/25 p-2 rounded-xl border border-slate-900/50 hover:bg-slate-900/40 transition-all">
                        <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 shrink-0">
                          <Cloud className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-extrabold text-slate-200 text-[10px] uppercase text-left tracking-wider">Cloud Data Solutions</h4>
                          <p className="text-[9.5px] text-slate-400 leading-normal text-left">Resilient cloud data pipelines and Zero-Trust landing zones on GCP.</p>
                        </div>
                      </div>

                      {/* Feature 2 */}
                      <div className="flex gap-2.5 items-center bg-slate-900/25 p-2 rounded-xl border border-slate-900/50 hover:bg-slate-900/40 transition-all">
                        <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 shrink-0">
                          <Database className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-extrabold text-slate-200 text-[10px] uppercase text-left tracking-wider">Advanced AI & ML</h4>
                          <p className="text-[9.5px] text-slate-400 leading-normal text-left">Orchestrating GenAI LLM models and predictive training workflows.</p>
                        </div>
                      </div>

                      {/* Feature 3 */}
                      <div className="flex gap-2.5 items-center bg-slate-900/25 p-2 rounded-xl border border-slate-900/50 hover:bg-slate-900/40 transition-all">
                        <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 shrink-0">
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-extrabold text-slate-200 text-[10px] uppercase text-left tracking-wider">Stream & Streamlining</h4>
                          <p className="text-[9.5px] text-slate-400 leading-normal text-left">High-volume event processing engines for real-time intelligence.</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-[9.5px] text-slate-400 font-mono leading-relaxed pt-2 text-left border-t border-slate-900/40 mt-1">
                      * Authorized credentials required. Firebase tokens are fully encrypted via client-side SSL handshakes.
                    </p>
                  </div>

                  {/* 4. AUTO-MOVING PREVIEW IMAGE MARQUEE / WORKSPACE LOGOS */}
                  <div className="w-full overflow-hidden rounded-2xl bg-slate-900/30 border border-slate-900/50 p-2.5 space-y-1.5">
                    <span className="text-[9px] font-mono font-black text-cyan-500 tracking-wider uppercase block text-left">
                      Live Workspace Assets & Developer Logs:
                    </span>
                    <div className="relative overflow-hidden w-full h-12 bg-slate-950/80 rounded-xl border border-slate-900/80 flex items-center">
                      <div className="flex select-none whitespace-nowrap animate-marquee-flow gap-4 items-center pr-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-slate-800 rounded-lg">
                          <img src={cyberAvatar} className="w-5 h-5 object-cover rounded-md border border-cyan-500/20" alt="Cyber Emblem" referrerPolicy="no-referrer" />
                          <span className="text-[9px] text-slate-300 font-mono">Cybernetic Portal Hub</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-slate-800 rounded-lg">
                          <img src={loginIllu} className="w-5 h-5 object-cover rounded-md border border-cyan-500/20" alt="Secure SSO" referrerPolicy="no-referrer" />
                          <span className="text-[9px] text-slate-300 font-mono">Secure SSO Handshake</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-slate-800 rounded-lg">
                          <img src={ganeshPhoto} className="w-5 h-5 object-cover rounded-md border border-cyan-500/20" alt="Ganesh Photo" referrerPolicy="no-referrer" />
                          <span className="text-[9px] text-slate-300 font-mono">AI Engineering Hub</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-slate-800 rounded-lg">
                          <img src={developerAvatar} className="w-5 h-5 object-cover rounded-md border border-cyan-500/20" alt="Developer Avatar" referrerPolicy="no-referrer" />
                          <span className="text-[9px] text-slate-300 font-mono">Neural Operator Systems</span>
                        </div>

                        {/* Duplicated for smooth infinite scrolling */}
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-slate-800 rounded-lg">
                          <img src={cyberAvatar} className="w-5 h-5 object-cover rounded-md border border-cyan-500/20" alt="Cyber Emblem" referrerPolicy="no-referrer" />
                          <span className="text-[9px] text-slate-300 font-mono">Cybernetic Portal Hub</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-slate-800 rounded-lg">
                          <img src={loginIllu} className="w-5 h-5 object-cover rounded-md border border-cyan-500/20" alt="Secure SSO" referrerPolicy="no-referrer" />
                          <span className="text-[9px] text-slate-300 font-mono">Secure SSO Handshake</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-slate-800 rounded-lg">
                          <img src={ganeshPhoto} className="w-5 h-5 object-cover rounded-md border border-cyan-500/20" alt="Ganesh Photo" referrerPolicy="no-referrer" />
                          <span className="text-[9px] text-slate-300 font-mono">AI Engineering Hub</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-slate-800 rounded-lg">
                          <img src={developerAvatar} className="w-5 h-5 object-cover rounded-md border border-cyan-500/20" alt="Developer Avatar" referrerPolicy="no-referrer" />
                          <span className="text-[9px] text-slate-300 font-mono">Neural Operator Systems</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5. SESSION PORTFOLIO ACCESS CONTROL CARD & PRIVILEGES */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-cyan-950/10 border border-cyan-500/15 flex items-start gap-2.5">
                      <div className="p-1 rounded-lg bg-cyan-950/30 text-cyan-400 shrink-0">
                        <Lock className="w-3.5 h-3.5 animate-pulse" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider text-left">
                          Access Controlled
                        </div>
                        <p className="text-[8.5px] text-slate-400 leading-normal text-left">
                          Validate credentials to access live developer databases and playgrounds.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/20 border border-slate-900/60 flex items-start gap-2.5">
                      <div className="p-1 rounded-lg bg-slate-950/40 text-cyan-300 shrink-0">
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[9px] font-mono font-bold text-cyan-300 uppercase tracking-wider text-left">
                          Global Clearance
                        </div>
                        <p className="text-[8.5px] text-slate-400 leading-normal text-left">
                          Secure OpenID compliance with high-frequency telemetry logging controls.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* HIGH SECURED FOOTNOTE */}
                  <div className="border-t border-slate-900/80 pt-3 text-center">
                    <p className="text-[9px] text-slate-500 font-mono">
                      Authorized via Google OpenID. Sessions are encrypted and fully sandboxed.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </motion.div>



      {/* POPUP MODAL ON SUCCESSFUL GOOGLE SIGN-IN */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md p-8 bg-slate-900 border border-slate-800/80 rounded-3xl shadow-[0_24px_100px_rgba(0,0,0,0.9)] text-center overflow-hidden"
            >
              {/* Decorative cyber line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500" />
              
              {/* Glowing decorative background bubbles */}
              <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

              {/* Icon Container with Envelope & Send effect */}
              <div className="relative mx-auto w-20 h-20 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 animate-pulse" />
                <div className="relative flex items-center justify-center">
                  <Mail className="w-10 h-10 text-cyan-400" />
                  <motion.div 
                    initial={{ x: -10, y: 10, opacity: 0 }}
                    animate={{ x: [10, -5, 0], y: [-10, 5, 0], opacity: [0, 1, 1] }}
                    transition={{ delay: 0.2, duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute -top-1 -right-1"
                  >
                    <Send className="w-4 h-4 text-emerald-400" />
                  </motion.div>
                </div>
              </div>

              {/* Sparkles / Success indicator */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/30 border border-emerald-500/20 rounded-full font-mono text-[10px] text-emerald-400 uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5" /> SECURE GATEWAY ENVELOPE DISPATCHED
              </div>

              {/* Header Title */}
              <h2 className="text-xl font-black text-white font-sans tracking-tight uppercase leading-none mb-3">
                Sign in successfully!
              </h2>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-6">
                An automatic welcome notification from <strong className="text-slate-100">Ganesh Enyaram Portfolio</strong> has been successfully sent to your Google inbox at <strong className="text-cyan-400 font-mono break-all">{loggedUserEmail}</strong>.
              </p>

              {/* Envelope details card */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 mb-6 text-left space-y-2.5">
                <div className="flex justify-between items-center text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider pb-1.5 border-b border-slate-900/60">
                  <span>OUTBOX DETAILS</span>
                  <span className="text-emerald-400 flex items-center gap-1">● DELIVERED</span>
                </div>
                <div className="space-y-1.5 font-mono text-[10px] text-slate-400 leading-normal">
                  <div>
                    <span className="text-slate-500">FROM:</span> Ganesh Enyaram Portfolio
                  </div>
                  <div>
                    <span className="text-slate-500">SUBJECT:</span> Successfully Signed In
                  </div>
                  <div>
                    <span className="text-slate-500">RECIPIENT:</span> {loggedUserName}
                  </div>
                  <div>
                    <span className="text-slate-500">TIMESTAMP:</span> {new Date().toUTCString()}
                  </div>
                </div>
              </div>

              {/* Dismiss / Continue to site button */}
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  onBack();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-450 hover:to-indigo-550 text-white font-sans text-xs font-black uppercase tracking-widest shadow-lg shadow-cyan-500/15 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Enter Portfolio Hub
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
