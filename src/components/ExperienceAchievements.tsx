import { motion } from "motion/react";
import { Briefcase, Milestone, Award, Flame, Star } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function ExperienceAchievements() {
  const { t } = useLanguage();

  const experiences = [
    {
      period: "2026",
      role: t("exp.item1.role", "RBU Global Digital Exchange Forum Delegate"),
      org: t("exp.item1.org", "Inclusive AI for ASEAN and Beyond"),
      bullets: [
        t("exp.item1.bullet1", "Participated in an international forum focusing on inclusive and ethical AI development for ASEAN nations and beyond."),
        t("exp.item1.bullet2", "Gained exposure to global perspectives on responsible AI, policy frameworks, and cross-border collaboration."),
        t("exp.item1.bullet3", "Conducted high-level dialogues regarding deployment ethics and automated system transparency.")
      ],
      tag: "International forum"
    },
    {
      period: "2026",
      role: t("exp.item2.role", "NationBuilding Case Study Competitor"),
      org: t("exp.item2.org", "National Level Tech Case Competitions"),
      bullets: [
        t("exp.item2.bullet1", "Competed in a national-level case study competition focused on technology-driven nation-building initiatives."),
        t("exp.item2.bullet2", "Presented data-backed solutions addressing real-world socioeconomic challenges using AI and data science models.")
      ],
      tag: "National Competition"
    },
    {
      period: "2025",
      role: t("exp.item3.role", "Hackathon Participant & Team Lead"),
      org: t("exp.item3.org", "Leading National Hackathons (PixelVerse, Convolve, ZOMATHON)"),
      bullets: [
        t("exp.item3.bullet1", "Led Team Red Dragon as Team Lead at PixelVerse National offline hackathon, coordinating technical strategy under real deadlines."),
        t("exp.item3.bullet2", "Analyzed complex datasets inside ZOMATHON's 24-hr data contest and presented optimized ML insights.")
      ],
      tag: "Hackathon Leader"
    }
  ];

  const accomplishments = [
    {
      title: t("exp.ach1.title", "LeetCode Specialist"),
      desc: t("exp.ach1.desc", "Solved 400+ mathematical and algorithmic puzzles. Experienced with binary searches, sliding window techniques, dynamic graphs, and core data models."),
      points: t("exp.ach1.points", "Top 7% globally"),
      icon: Flame,
      color: "text-rose-400 bg-rose-950/20 border-rose-900/30"
    },
    {
      title: t("exp.ach2.title", "Smart OpenCV Winner"),
      desc: t("exp.ach2.desc", "Awarded 1st Prize in Innovation Fair for developing the Local Edge Facial recognition attendance tracker. Honored by college principal board."),
      points: t("exp.ach2.points", "Innovation Champion"),
      icon: Award,
      color: "text-cyan-400 bg-cyan-950/20 border-cyan-900/30"
    },
    {
      title: t("exp.ach3.title", "Open Source Contributor"),
      desc: t("exp.ach3.desc", "Committed optimizations to popular RAG pipelines and React UI wrappers. Maintained high documentation standards and addressed open community issues."),
      points: t("exp.ach3.points", "Active GitHub Profile"),
      icon: Star,
      color: "text-indigo-400 bg-indigo-950/20 border-indigo-900/30"
    },
    {
      title: t("exp.ach4.title", "Elite Academic Tier"),
      desc: t("exp.ach4.desc", "Recieved Academic Honor Scholarships and maintained a continuous GPA score of 9.2 out of 10 throughout the engineering curriculum."),
      points: t("exp.ach4.points", "9.2 Core CGPA"),
      icon: Briefcase,
      color: "text-amber-400 bg-amber-950/20 border-amber-900/30"
    }
  ];

  return (
    <section id="experience-section" className="relative py-24 px-4 bg-transparent overflow-hidden transition-colors duration-300">
      {/* Clean Gradient Backdrop to substitute Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(244,244,255,0.006)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(244,244,255,0.006)_1.5px,transparent_1.5px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,#020617_95%)] opacity-90 pointer-events-none" />
      </div>

      <div className="absolute top-1/4 right-1/10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto space-y-16 z-10">
        {/* Title */}
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans"
          >
            {t("experience.heading", "Chronology & Triumphs")}
          </motion.h2>
          <p className="text-slate-450 font-mono text-xs max-w-lg mx-auto">
            {t("exp.subtitle", "Practical development timelines and key milestones recorded over hackathons, placement preparation, and research internships.")}
          </p>
          <div className="w-16 h-1 w-16 bg-gradient-to-r from-cyan-400 via-indigo-400 to-rose-450 mx-auto rounded-full mt-4" />
        </div>

        {/* Master Flex grid side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Experience Timeline Left 7 Cols */}
          <div className="lg:col-span-7 space-y-8">
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Milestone className="w-5 h-5 text-cyan-400" />
              {t("exp.timelineTitle", "Career Timeline & Labs")}
            </h3>

            <div className="relative border-l border-slate-900 pl-6 space-y-10 ml-3.5">
              {experiences.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="relative group space-y-2 text-left"
                >
                  {/* Glowing vertical bullet element */}
                  <div className="absolute -left-9.5 top-1.5 w-6 h-6 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center transition-all group-hover:border-cyan-400">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">{exp.period}</span>
                    <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-indigo-400">
                      {exp.tag}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {exp.role}
                  </h4>
                  <p className="text-xs font-mono text-slate-450">{exp.org}</p>

                  <ul className="space-y-1.5 mt-3">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-xs sm:text-sm text-slate-400 flex items-start gap-2 leading-relaxed">
                        <span className="text-cyan-400 font-mono mt-0.5 shrink-0 select-none">&gt;</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Achievements Bento Right 5 Cols */}
          <div className="lg:col-span-5 space-y-8">
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Milestone className="w-5 h-5 text-rose-455" />
              {t("exp.achievementsTitle", "Key Achievements")}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {accomplishments.map((ac, idx) => {
                const Icon = ac.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className={`p-5 rounded-2xl bg-slate-900/60 border ${ac.color} hover:border-slate-700/80 transition-all shadow-xl flex flex-col justify-between text-left`}
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center text-white mb-3">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white mb-1.5">{ac.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{ac.desc}</p>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-slate-900 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider uppercase">Rank Status</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-white font-semibold flex items-center justify-center text-center">
                        {ac.points}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
