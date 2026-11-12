import { motion } from "motion/react";
import { Code, Brain, Laptop, Cloud, Terminal } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Skills() {
  const { t } = useLanguage();

  const categories = [
    {
      title: t("skills.cat1", "Programming"),
      icon: Code,
      color: "text-cyan-400",
      skills: [
        { name: "Python", val: 95 },
        { name: "Java", val: 85 },
        { name: "C++", val: 82 },
        { name: "JavaScript", val: 90 },
        { name: "TypeScript", val: 88 }
      ]
    },
    {
      title: t("skills.cat2", "AI & ML"),
      icon: Brain,
      color: "text-rose-450",
      skills: [
        { name: "Machine Learning", val: 92 },
        { name: "Deep Learning", val: 88 },
        { name: "Generative AI / RAG", val: 94 },
        { name: "LLM Apps", val: 92 },
        { name: "AI Agents", val: 90 },
        { name: "Computer Vision", val: 84 },
        { name: "NLP", val: 86 }
      ]
    },
    {
      title: t("skills.cat3", "Development"),
      icon: Laptop,
      color: "text-indigo-400",
      skills: [
        { name: "React", val: 92 },
        { name: "Next.js", val: 90 },
        { name: "Node.js", val: 88 },
        { name: "Express.js", val: 90 },
        { name: "MongoDB", val: 84 },
        { name: "SQL", val: 86 },
        { name: "REST APIs", val: 92 }
      ]
    },
    {
      title: t("skills.cat4", "Cloud & DevOps"),
      icon: Cloud,
      color: "text-cyan-400",
      skills: [
        { name: "Git", val: 92 },
        { name: "GitHub", val: 94 },
        { name: "Docker", val: 82 },
        { name: "AWS", val: 84 },
        { name: "Firebase", val: 88 },
        { name: "Vercel", val: 90 }
      ]
    }
  ];

  return (
    <section id="skills-section" className="relative py-24 px-4 bg-slate-900/60 border-y border-slate-900/50">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans"
          >
            {t("skills.heading", "Technical Weaponry")}
          </motion.h2>
          <p className="text-slate-400 font-mono text-xs max-w-lg mx-auto">
            {t("skills.subtitle", "Categorized competence metrics evaluated over hackathons, core placements, academic labs, and open-source applications.")}
          </p>
          <div className="w-16 h-1 w-16 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full mt-4" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, catIdx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={catIdx}
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIdx * 0.1 }}
                className="p-6 rounded-2xl bg-slate-950/80 border border-slate-850 hover:border-cyan-500/20 shadow-xl space-y-6 transition-all duration-300"
              >
                {/* Title */}
                <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                  <h3 className="text-lg font-bold text-white font-sans flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${cat.color} bg-opacity-20`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {cat.title}
                  </h3>
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1.5 uppercase tracking-widest">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400/80" />
                    {t("skills.category", "Category")} 0{catIdx + 1}
                  </span>
                </div>

                {/* Progress bars */}
                <div className="space-y-4">
                  {cat.skills.map((skill, skillIdx) => (
                    <div key={skillIdx} className="space-y-1.5">
                      <div className="flex items-center justify-between font-mono text-xs text-slate-300">
                        <span className="hover:text-cyan-400 transition-colors uppercase font-medium">{skill.name}</span>
                        <span className="text-slate-500 font-semibold">{skill.val}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.val}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: skillIdx * 0.05 }}
                          className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-rose-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
