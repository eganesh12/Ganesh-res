import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  MapPin,
  Linkedin,
  Github,
  Lock,
  Unlock,
  Users,
  LogOut,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Activity,
  FileText,
  Trash2
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth, AdminProtectedRoute } from "../context/AuthContext";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../lib/firebase";

interface ContactProps {
  onTrackAction: (metricName: string) => void;
  onTrackerRefresh: () => void;
  onNavigateToAuth?: () => void;
}

interface ContactViewer {
  id: string;
  name: string;
  email: string;
  loginType: string;
  date: string;
}

const maskEmail = (email: string) => {
  if (!email) return "";
  const parts = email.split("@");
  if (parts.length !== 2) return email;
  const name = parts[0];
  const domain = parts[1];
  if (name.length <= 2) {
    return `${name}***@${domain}`;
  }
  return `${name.substring(0, 2)}***${name.substring(name.length - 1)}@${domain}`;
};

export default function Contact({ onTrackAction, onTrackerRefresh, onNavigateToAuth }: ContactProps) {
  const { t } = useLanguage();
  
  // Real Firebase Auth Integration
  const { 
    user: firebaseUser, 
    loading: authLoading, 
    isAdmin: isUserAdmin, 
    logout 
  } = useAuth();

  // Map Firebase User state into local user shape
  const user = firebaseUser ? {
    name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split("@")[0] : "") || firebaseUser.phoneNumber || "Verified User",
    email: firebaseUser.email || firebaseUser.phoneNumber || "Verified Coordinate",
    loginType: (() => {
      const providerId = firebaseUser.providerData?.[0]?.providerId;
      if (providerId === "google.com") return "Google Identity (Strong)";
      if (providerId === "github.com") return "GitHub Network (Strong)";
      if (providerId === "phone") return "Phone OTP (Strong)";
      if (firebaseUser.email?.endsWith("@github.verified")) return "GitHub Network (Verified)";
      if (firebaseUser.email?.includes("phone_user_")) return "Phone OTP Verified";
      return "Strong Secure Identity";
    })(),
    isAdmin: isUserAdmin
  } : null;

  const [viewers, setViewers] = useState<ContactViewer[]>([]);
  const [viewerCount, setViewerCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Google Sheets & Analytics Management States
  const [analyticsData, setAnalyticsData] = useState<{ visitors: number; resumeDownloads: number; contactRequests: number; projectViews: number; chatbotUsage: number } | null>(null);
  const [sheetWebhookUrl, setSheetWebhookUrl] = useState("");
  const [sheetSpreadsheetId, setSheetSpreadsheetId] = useState("");
  const [sheetsLogs, setSheetsLogs] = useState<string[]>([]);
  const [isPushingToSheet, setIsPushingToSheet] = useState(false);
  const [isSavingSheetSettings, setIsSavingSheetSettings] = useState(false);
  const [sheetSyncSuccess, setSheetSyncSuccess] = useState<boolean | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Cloud Function triggers simulation state
  const [oauthEmailLogs, setOauthEmailLogs] = useState<Array<{ id: string; email: string; name: string; provider: string; status: string; date: string }>>([]);
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);

  const fetchOauthEmailLogs = async () => {
    try {
      const res = await fetch("/api/oauth-email-logs");
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          const logs = data.logs || [];
          setOauthEmailLogs(logs);
          // Keep only selected IDs that still exist
          setSelectedLogIds(prev => prev.filter(id => logs.some((l: any) => l.id === id)));
        } else {
          console.warn("OAuth response returned non-JSON content type:", contentType);
        }
      }
    } catch (err) {
      console.warn("Failed to retrieve OAuth email logs:", err);
    }
  };

  const handleDeleteOauthEmailLog = async (id: string) => {
    try {
      const res = await fetch(`/api/oauth-email-logs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setOauthEmailLogs(data.logs || []);
          setSelectedLogIds(prev => prev.filter(item => item !== id));
        }
      }
    } catch (err) {
      console.warn("Failed to delete OAuth email log:", err);
    }
  };

  const handleSelectAllLogs = () => {
    if (oauthEmailLogs.length === 0) return;
    if (selectedLogIds.length === oauthEmailLogs.length) {
      setSelectedLogIds([]);
    } else {
      setSelectedLogIds(oauthEmailLogs.map(log => log.id));
    }
  };

  const handleToggleSelectLog = (id: string) => {
    setSelectedLogIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteLogs = async () => {
    if (selectedLogIds.length === 0) return;
    try {
      const res = await fetch("/api/oauth-email-logs/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ids: selectedLogIds })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setOauthEmailLogs(data.logs || []);
          setSelectedLogIds([]);
        }
      }
    } catch (err) {
      console.warn("Failed to bulk delete OAuth email logs:", err);
    }
  };

  // Load user from Firebase Auth & fetch global viewers log
  useEffect(() => {
    if (!authLoading) {
      fetchViewers(isUserAdmin);
      fetchOauthEmailLogs();
      if (isUserAdmin) {
        fetchAnalytics();
        fetchSheetSettings();
      }
    }
  }, [firebaseUser, authLoading, isUserAdmin]);

  const fetchViewers = async (isAdminUser?: boolean) => {
    try {
      const isCurrentlyAdmin = isAdminUser !== undefined ? isAdminUser : isUserAdmin;
      const viewersList: ContactViewer[] = [];

      if (isCurrentlyAdmin) {
        try {
          const q = query(collection(db, "contactViewers"), orderBy("date", "desc"), limit(50));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            viewersList.push({
              id: doc.id,
              name: data.name || "",
              email: data.email || "",
              loginType: data.loginType || "",
              date: data.date || ""
            });
          });
        } catch (fireErr) {
          console.warn("Firestore error, falling back to local DB API:", fireErr);
        }
      }

      if (viewersList.length > 0) {
        setViewers(viewersList);
        setViewerCount(viewersList.length);
      } else {
        const url = isCurrentlyAdmin 
          ? "/api/contact-views?adminKey=ganesh_admin" 
          : "/api/contact-views";
        const res = await fetch(url);
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            setViewers(data.viewers || []);
            setViewerCount(data.total || data.viewers?.length || 0);
          } else {
            console.warn("Contact registry response was not JSON:", contentType);
          }
        }
      }
    } catch (err) {
      console.warn("Failed to query contact registry:", err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics?adminKey=ganesh_admin");
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setAnalyticsData(data);
        } else {
          console.warn("System analytics response was not JSON:", contentType);
        }
      }
    } catch (err) {
      console.warn("Failed to query system analytics:", err);
    }
  };

  const fetchSheetSettings = async () => {
    try {
      const res = await fetch("/api/analytics/settings?adminKey=ganesh_admin");
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setSheetWebhookUrl(data.webhookUrl || "");
          setSheetSpreadsheetId(data.sheetId || "");
        } else {
          console.warn("Spreadsheet settings response was not JSON:", contentType);
        }
      }
    } catch (err) {
      console.warn("Failed to load spreadsheet connection parameters:", err);
    }
  };

  const handleSaveSheetSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSheetSettings(true);
    try {
      const res = await fetch("/api/analytics/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminKey: "ganesh_admin",
          webhookUrl: sheetWebhookUrl,
          sheetId: sheetSpreadsheetId
        })
      });
      if (res.ok) {
        alert("Google Sheet connection parameters updated inside the secure registry database!");
      }
    } catch (error) {
      console.error("Failed to save sheets configuration:", error);
    } finally {
      setIsSavingSheetSettings(false);
    }
  };

  const handlePushToSheets = async () => {
    setIsPushingToSheet(true);
    setSheetSyncSuccess(null);
    setSheetsLogs([`[${new Date().toISOString()}] ESTABLISHING HANDSHAKE PROTOCOL...`]);
    try {
      const res = await fetch("/api/analytics/push-to-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey: "ganesh_admin" })
      });
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setSheetsLogs(data.logs || []);
          setSheetSyncSuccess(true);
          fetchAnalytics();
        } else {
          setSheetSyncSuccess(false);
          setSheetsLogs((prev) => [...prev, `[ERROR] Sheet response format was invalid (non-JSON).`]);
        }
      } else {
        setSheetSyncSuccess(false);
        setSheetsLogs((prev) => [...prev, `[ERROR] Dispatch rejected by remote Sheet webhook destination.`]);
      }
    } catch (err) {
      setSheetSyncSuccess(false);
      setSheetsLogs((prev) => [...prev, `[CRITICAL ERROR] Network connection timeout: ${err instanceof Error ? err.message : err}`]);
    } finally {
      setIsPushingToSheet(false);
      onTrackerRefresh();
    }
  };

  const handleLogOut = async () => {
    try {
      await logout();
      setViewers([]);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const handleExportSpreadsheet = () => {
    window.open("/api/contact-views/download?adminKey=ganesh_admin", "_blank");
  };

  const handleDownloadOauthExcel = () => {
    window.location.href = "/api/oauth-email-logs/download/excel";
  };

  const handleDownloadOauthMongodb = () => {
    window.location.href = "/api/oauth-email-logs/download/mongodb";
  };

  const getFilteredViewers = () => {
    if (!searchQuery) return viewers;
    const q = searchQuery.toLowerCase();
    return viewers.filter(
      v => v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q)
    );
  };

  return (
    <section id="contact-section" className="relative py-24 px-4 bg-slate-900/60 border-t border-slate-900/60">
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* HEADER SECTION */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded-full font-mono text-[10px] text-cyan-400 tracking-wider uppercase mb-2"
          >
            {user ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Secure Node Access Unlocked
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-400">
                <Lock className="w-3 h-3 text-slate-400" /> Secure Communication Hub
              </span>
            )}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans"
          >
            {t("contact.heading", "Connect with Ganesh")}
          </motion.h2>
          
          <p className="text-slate-400 font-mono text-xs max-w-lg mx-auto">
            {user 
              ? "You are authenticated. Direct email templates and simulated automated triggers are unsealed."
              : "Access direct networks, coordinate maps, and secure SMTP cloud triggers unconditionally below."
            }
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full mt-4" />
        </div>

        {/* SECURITY SESSION STATUS BAR */}
        {user && (
          <div className="max-w-4xl mx-auto">
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-800/25 flex flex-col sm:flex-row justify-between items-center gap-4 text-left font-sans">
              <div>
                <p className="text-xs text-slate-300">
                  Welcome to Ganesh's Secure Gateway, <span className="text-white font-bold">{user.name}</span>
                </p>
                <div className="flex flex-wrap gap-2 items-center text-[10px] text-slate-500 font-mono mt-1">
                  <span className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-850 text-cyan-400">{user.loginType}</span>
                </div>
              </div>
              <button
                onClick={handleLogOut}
                className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-850 text-[10px] text-slate-400 hover:text-rose-450 transition-all font-mono cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out & Lock Presets
              </button>
            </div>
          </div>
        )}

        {/* PRIMARY CHANNELS & CARDS */}
        <div className="space-y-12">
          
          {/* Outbound Direct Mail Link Dispatcher */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto p-5 rounded-3xl bg-cyan-950/20 border border-cyan-800/30 flex flex-col md:flex-row items-center justify-between gap-5 text-left font-sans"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/25 text-cyan-400 mt-0.5 flex-shrink-0">
                <Mail className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-widest flex items-center gap-1.5">
                  Transmit Direct E-Mail to Ganesh
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  Instantly compose a secure network connection message from your mail application. Your authenticated profile coordinates and verified methods will automatically map if you are signed in.
                </p>
              </div>
            </div>
            <a
              href={`mailto:eganesh7997@gmail.com?subject=AI Portfolio Connection from ${user ? user.name : "Visitor"}&body=${encodeURIComponent(
                `Hello Ganesh,\n\nSaw your awesome AI Portfolio website and wanted to connect with your network.\n\nMy session coordinates:\n- Profile Name: ${user ? user.name : "Anonymous Visitor"}\n- Connection Coordinate: ${user ? user.email : "Not authenticated"}\n- Authentication Method: ${user ? user.loginType : "Guest Status"}\n\nLet's connect and build amazing AI integrations together!\n\nWarm regards,\n${user ? user.name : "Anonymous Visitor"}`
              )}`}
              className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider text-center inline-flex items-center justify-center gap-2 transition-all hover:shadow-cyan-500/10 active:scale-98"
            >
              Send Message via Mail <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          {/* Direct contact information panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* HQ coordinates card */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-850 space-y-6 text-left">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Unlock className="w-4 h-4 text-emerald-400" /> Primary Coordinates
              </h3>

              <div className="space-y-5">
                <div className="flex gap-3.5 items-start">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-805 text-cyan-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-300">{t("contact.hqCoordinate", "HQ Coordinate")}</p>
                    <p className="text-xs text-slate-400">{t("contact.location", "Hyderabad, Telangana, India")}</p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-805 text-pink-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-300">{t("contact.terminalEmail", "Terminal Email")}</p>
                    <a href="mailto:eganesh7997@gmail.com" className="text-xs text-cyan-500 hover:underline font-mono select-all">
                      eganesh7997@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Channels panel */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-850 space-y-6 text-left flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-widest">
                  {t("contact.connectOuterSpace", "Connect Outer-space")}
                </h4>
                <p className="text-xs text-slate-400 font-sans">
                  Feel free to ping me on these networks of choice. Let's arrange meetings, collaborations, hackathons, or chat on direct tech integrations.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <a
                  href="https://linkedin.com/in/ganesh-enyaram"
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 rounded-xl bg-slate-900 border border-slate-880 hover:border-indigo-500/50 hover:bg-slate-800 flex items-center justify-center gap-2 text-xs text-slate-300 transition-all font-sans cursor-pointer hover:text-white"
                >
                  <Linkedin className="w-4 h-4 text-indigo-400" />
                  LinkedIn Profile
                </a>
                <a
                  href="https://github.com/ganeshenyaram"
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 rounded-xl bg-slate-900 border border-slate-880 hover:border-cyan-500/50 hover:bg-slate-800 flex items-center justify-center gap-2 text-xs text-slate-300 transition-all font-sans cursor-pointer hover:text-white"
                >
                  <Github className="w-4 h-4 text-white" />
                  GitHub Secure
                </a>
              </div>
            </div>
          </div>

          {/* FIREBASE AUTH CLOUD FUNCTION MONITOR PANEL */}
          {isUserAdmin && (
            <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-slate-950 border border-slate-850 text-left space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-850">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-cyan-950/40 border border-cyan-800/30 rounded-md font-mono text-[9px] text-cyan-400 uppercase tracking-widest mb-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" /> Firebase Cloud Function Active
                  </div>
                  <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider flex items-center gap-2">
                    <Mail className="w-4.5 h-4.5 text-cyan-400" /> OAuth Welcome Email Dispatch Monitor
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-sans">
                    Real-time logs of the automated <code>onUserCreated</code> trigger dispatching a thank-you email upon successful Google or GitHub registration.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <button
                    onClick={fetchOauthEmailLogs}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] text-slate-300 hover:text-white rounded-xl font-mono transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Activity className="w-3.5 h-3.5 text-cyan-450 animate-pulse" />
                    Refresh Triggers
                  </button>
                  <button
                    onClick={handleDownloadOauthExcel}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] text-slate-300 hover:text-white rounded-xl font-mono transition-all cursor-pointer whitespace-nowrap"
                    title="Export Dispatch Log stream to CSV Excel Spreadsheet"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-500" />
                    Save Excel List
                  </button>
                  <button
                    onClick={handleDownloadOauthMongodb}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] text-slate-300 hover:text-white rounded-xl font-mono transition-all cursor-pointer whitespace-nowrap"
                    title="Export Dispatch Log stream to MongoDB JSON Document Collection"
                  >
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    Save MongoDB Datasheet
                  </button>
                </div>
              </div>

              {/* CLOUD TRIGGER INFORMATION */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-850 space-y-2">
                  <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest">01 / Trigger Event</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Triggered on the absolute first-time user registration event in Firebase Authentication using custom SSO hooks.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-850 space-y-2">
                  <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest">02 / Identity Matching</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Automatically extracts the verified profile coordinates, email routes, and displayName fields from security handshakes.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-850 space-y-2">
                  <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest">03 / SMTP Delivery</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Sends high-integrity, visual thank-you templates to the registered address instantly.
                  </p>
                </div>
              </div>

              {/* LIVE DISPATCH LOG TABLE */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                    Cloud Dispatch Log Stream (Filtered to recent handshakes)
                  </span>
                  {selectedLogIds.length > 0 && (
                    <button
                      type="button"
                      onClick={handleBulkDeleteLogs}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900 border border-rose-850 hover:border-rose-700 text-[10px] text-rose-300 hover:text-white rounded-lg font-mono transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto animate-pulse"
                    >
                      <Trash2 className="w-3 h-3 text-rose-400" />
                      Clear Selected ({selectedLogIds.length})
                    </button>
                  )}
                </div>
                
                <div className="overflow-hidden rounded-xl border border-slate-850 bg-slate-900/20">
                  <div className="overflow-x-auto overflow-y-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-900/50 text-slate-400 font-mono text-[9px] uppercase tracking-wider border-b border-slate-850">
                        <tr>
                          <th className="py-2.5 px-3 text-center w-10">
                            <input
                              type="checkbox"
                              checked={selectedLogIds.length === oauthEmailLogs.length && oauthEmailLogs.length > 0}
                              onChange={handleSelectAllLogs}
                              className="rounded border-slate-850 bg-slate-950 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer w-3.5 h-3.5 accent-cyan-500"
                              title="Select All / Deselect All Logs"
                            />
                          </th>
                          <th className="py-2.5 px-4 font-mono">Recipient Name</th>
                          <th className="py-2.5 px-4 font-mono">Email Coordinates</th>
                          <th className="py-2.5 px-4 text-center font-mono">Auth Platform</th>
                          <th className="py-2.5 px-4 text-center font-mono">Cloud Status</th>
                          <th className="py-2.5 px-4 text-right font-mono">Dispatch Stamp</th>
                          <th className="py-2.5 px-4 text-center font-mono w-16">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-950/50">
                        {oauthEmailLogs.length > 0 ? (
                          oauthEmailLogs.map((log, idx) => (
                            <tr key={log.id || idx} className="hover:bg-slate-900/30 transition-colors">
                              <td className="py-3 px-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedLogIds.includes(log.id)}
                                  onChange={() => handleToggleSelectLog(log.id)}
                                  className="rounded border-slate-850 bg-slate-950 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer w-3.5 h-3.5 accent-cyan-500"
                                />
                              </td>
                              <td className="py-3 px-4 font-semibold text-slate-200">
                                {log.name}
                              </td>
                              <td className="py-3 px-4 font-mono text-[11px] text-slate-400 select-all">
                                {maskEmail(log.email)}
                              </td>
                              <td className="py-3 px-4 text-center font-mono text-[10px] text-slate-400">
                                {log.provider}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950/50 border border-emerald-800/30 text-emerald-400">
                                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" /> {log.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-400">
                                {new Date(log.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOauthEmailLog(log.id)}
                                  className="p-1 rounded-lg hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                                  title="Delete Log"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="py-8 px-4 text-center text-slate-500 font-mono text-xs">
                              Awaiting first OAuth registration trigger event. 
                              <span className="block text-[10px] text-slate-600 mt-1">Sign up/register using Google or GitHub to see the trigger fire active logs.</span>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WORKSPACE VIEWING STATISTICS DIRECT LEDGER (Locked / Unlocked conditionally) */}
          {isUserAdmin && (
            <div className="max-w-4xl mx-auto">
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-850 text-left space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-850">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-cyan-950/40 border border-cyan-800/30 rounded-md font-mono text-[9px] text-cyan-400 uppercase tracking-widest mb-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" /> Connected Registry
                    </div>
                    <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4.5 h-4.5 text-cyan-400" /> Document Views Ledger
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-sans">
                      Active database logs listing authenticating visitors, device tokens, and credentials saved inside Firebase collections.
                    </p>
                  </div>
                  
                  <div className="flex gap-2 whitespace-nowrap">
                    <button
                      onClick={handleExportSpreadsheet}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] text-slate-450 hover:text-white rounded-xl font-mono transition-all cursor-pointer"
                    >
                      Export Excel
                    </button>
                    <button
                      onClick={() => fetchViewers(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] text-cyan-450 hover:text-white rounded-xl font-mono transition-all cursor-pointer"
                    >
                      Force Load views
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search credentials, providers, or IDs inside database stack..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-left"
                    />
                  </div>

                  <div className="overflow-hidden rounded-xl border border-slate-850 bg-slate-900/20">
                    <div className="overflow-x-auto overflow-y-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-900/50 text-slate-400 font-mono text-[9px] uppercase tracking-wider border-b border-slate-850">
                          <tr>
                            <th className="py-2 px-4 font-mono">Visitor Name</th>
                            <th className="py-2 px-4 font-mono">Profile Coordinate</th>
                            <th className="py-2 px-4 font-mono">Provider Handshake</th>
                            <th className="py-2 px-4 text-right font-mono">Sign-In Stamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-950/50">
                          {getFilteredViewers().length > 0 ? (
                            getFilteredViewers().map((viewer) => (
                              <tr key={viewer.id} className="hover:bg-slate-900/30 transition-colors">
                                <td className="py-2.5 px-4 font-semibold text-slate-200">{viewer.name}</td>
                                <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400 select-all">{maskEmail(viewer.email)}</td>
                                <td className="py-2.5 px-4 font-mono text-[10px] text-cyan-404">{viewer.loginType}</td>
                                <td className="py-2.5 px-4 text-right font-mono text-[10px] text-slate-400">
                                  {new Date(viewer.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="py-6 px-4 text-center text-slate-500 font-mono text-xs">
                                No viewer logs discovered matching current search criteria.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SPREADSHEETS AUTOMATION webhook GATE (Locked / Unlocked conditionally) */}
          {isUserAdmin && (
            <div className="max-w-4xl mx-auto">
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-850 text-left space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-cyan-400" /> Spreadsheet Stream Connection Gates
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-sans leading-relaxed">
                    Keep personal Excel spreadsheets and Google Sheets fully synchronized with live visitors status, contact requests, and chatbot analytics telemetry.
                  </p>
                </div>

                <form onSubmit={handleSaveSheetSettings} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-slate-450 uppercase tracking-widest">
                      SheetDB/Webhook Endpoint API URL
                    </label>
                    <input
                      type="url"
                      placeholder="e.g. https://api.sheetdb.io/api/v1/..."
                      value={sheetWebhookUrl}
                      onChange={(e) => setSheetWebhookUrl(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-200 text-left placeholder-slate-650 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-slate-450 uppercase tracking-widest">
                      Google Sheet SpreadsheetID Key
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1aBCDeFGhIjkLMnO..."
                      value={sheetSpreadsheetId}
                      onChange={(e) => setSheetSpreadsheetId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-200 text-left placeholder-slate-650 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2 pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isSavingSheetSettings}
                      className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] font-mono font-bold text-slate-350 cursor-pointer transition-all"
                    >
                      {isSavingSheetSettings ? "Registering Keys..." : "Save Webhook Keys"}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handlePushToSheets}
                      disabled={isPushingToSheet}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-[11px] font-mono uppercase cursor-pointer transition-all"
                    >
                      {isPushingToSheet ? "Pushing data..." : "Trigger Push Dispatch"}
                    </button>
                  </div>
                </form>

                {/* SPREADSHEET LOG STREAM */}
                {sheetsLogs.length > 0 && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-850 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Spreadsheet handshakes results</span>
                      {sheetSyncSuccess !== null && (
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-900 border ${sheetSyncSuccess ? "border-emerald-800/30 text-emerald-400" : "border-rose-800/30 text-rose-450"}`}>
                          {sheetSyncSuccess ? "TRANSMISSION SECURED" : "HANDSHAKE TIMEOUT"}
                        </span>
                      )}
                    </div>
                    <div className="max-h-24 overflow-y-auto font-mono text-[9px] p-2 bg-slate-950/70 rounded-lg space-y-1">
                      {sheetsLogs.map((log, lIdx) => (
                        <div key={lIdx} className={log.includes("[ERROR]") || log.includes("[CRITICAL]") ? "text-rose-500 text-left" : log.includes("SUCCESS") ? "text-emerald-400 text-left" : "text-slate-400 text-left"}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
