import { motion } from "motion/react";
import { Award, CheckCircle, ExternalLink, ShieldCheck } from "lucide-react";
import { Certificate } from "../types";
import { useLanguage } from "../context/LanguageContext";

export default function Certifications() {
  const { t } = useLanguage();

  const certs: Certificate[] = [
    {
      title: "ET AI Hackathon Certified Participant",
      issuer: "Economic Times & Partners",
      issueDate: "2025",
      credentialId: "ETAI-2025-0482",
      verifyLink: "#",
      category: "AI",
    },
    {
      title: "PixelVerse Offline Finale Shortlist as Team Lead",
      issuer: "PixelVerse National Hackathon Guild",
      issueDate: "2025",
      credentialId: "PV-LEAD-RED-DRAGON",
      verifyLink: "#",
      category: "National Team Lead",
    },
    {
      title: "Convolve 4.0 Pan-IIT AI/ML Certificate",
      issuer: "IIT Organizing Committee",
      issueDate: "2025",
      credentialId: "CONV4-PAN-IIT-822",
      verifyLink: "#",
      category: "IIT AI/ML",
    },
    {
      title: "ZOMATHON Data Hackathon Certificate",
      issuer: "ZOMATHON Organizing Committee",
      issueDate: "2025",
      credentialId: "ZOM-DATA-24HR-902",
      verifyLink: "#",
      category: "Data Hackathon",
    },
    {
      title: "RBU Global Digital Exchange Forum Delegate",
      issuer: "RBU & ASEAN Alliance",
      issueDate: "2026",
      credentialId: "RBU-ASEAN-AI-2026",
      verifyLink: "#",
      category: "International Delegate",
    },
    {
      title: "NationBuilding Case Study Finalist",
      issuer: "NationBuilding Case Competition Committee",
      issueDate: "2026",
      credentialId: "NBC-CASE-2026",
      verifyLink: "#",
      category: "Case Competition",
    }
  ];

  const getTagColor = (cat: string) => {
    switch (cat) {
      case "AI": return "text-amber-400 bg-amber-950/40 border-amber-800/40";
      case "National Team Lead": return "text-blue-400 bg-blue-950/40 border-blue-800/40";
      case "IIT AI/ML": return "text-cyan-400 bg-cyan-950/40 border-cyan-800/40";
      case "Data Hackathon": return "text-indigo-400 bg-indigo-950/40 border-indigo-800/40";
      case "International Delegate": return "text-yellow-400 bg-yellow-950/40 border-yellow-800/40";
      default: return "text-rose-450 bg-rose-950/40 border-rose-800/40";
    }
  };

  return (
    <section id="certifications-section" className="relative py-24 px-4 bg-slate-900/40">
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans"
          >
            {t("certs.heading", "Verified Accomplishments")}
          </motion.h2>
          <p className="text-slate-455 font-mono text-xs max-w-lg mx-auto">
            {t("certs.subtitle", "Formal cloud accreditation and deep-learning specialized profiles verified by authorized industry issuers.")}
          </p>
          <div className="w-16 h-1 w-16 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full mt-4" />
        </div>

        {/* Certificate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((c, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-850 hover:border-cyan-550/30 transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-4">
                {/* Header card state */}
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${getTagColor(c.category)}`}>
                    {c.category} Secure
                  </span>
                  <Award className="w-4.5 h-4.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>

                {/* Info block */}
                <div className="space-y-1.5 text-left">
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">{c.issuer}</p>
                </div>
              </div>

              {/* Bottom detail blocks */}
              <div className="mt-6 pt-4 border-t border-slate-900 space-y-3">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-slate-500">Cred ID:</span>
                  <span className="text-slate-350 select-all font-mono uppercase">{c.credentialId}</span>
                </div>

                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-slate-505">Issued:</span>
                  <span className="text-slate-400">{c.issueDate}</span>
                </div>

                {/* Deep verification router link */}
                <a
                  href={c.verifyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full mt-2 py-2 rounded-xl bg-slate-900 border border-slate-850 text-slate-300 hover:text-white hover:border-cyan-500/50 flex items-center justify-center gap-2 text-xs transition-all cursor-pointer font-sans"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  {t("certs.verifyBtn", "Verify Credential")}
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
