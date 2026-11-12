import { useState } from "react";
import { motion } from "motion/react";
import { Github, ExternalLink, Bot, Cpu, TrendingUp, Search, Layers, FileText } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface Project {
  id: string;
  title: string;
  description: string;
  category: "AI & ML" | "Full-Stack" | "Generative AI";
  techs: string[];
  githubUrl: string;
  liveUrl: string;
  metricLabel: string;
  metricValue: string;
  icon: any;
}

export default function Projects() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<string>("All");

  const projectsList: Project[] = [
    {
      id: "proj-1",
      title: t("projects.proj1.title", "AI-Powered Chatbot"),
      category: "Generative AI",
      description: t("projects.proj1.desc", "Developed a conversational AI chatbot using Python and NLP techniques capable of handling domain-specific queries. Integrated machine learning models for intent classification and response generation."),
      techs: ["Python", "NLTK", "TensorFlow", "NLP", "Flask"],
      githubUrl: "https://github.com/ganeshenyaram/ai-powered-chatbot",
      liveUrl: "#ai-labs",
      metricLabel: t("projects.proj1.metric", "Intent Parsing Accuracy"),
      metricValue: "95.4% Accuracy",
      icon: Bot,
    },
    {
      id: "proj-2",
      title: t("projects.proj2.title", "Data Analysis Dashboard"),
      category: "Full-Stack",
      description: t("projects.proj2.desc", "Built an interactive data visualization dashboard using Python (Pandas, Matplotlib) to analyze large datasets. Automated data cleaning pipelines and produced actionable insights for decision-making."),
      techs: ["Python", "Pandas", "Matplotlib", "Seaborn", "Streamlit"],
      githubUrl: "https://github.com/ganeshenyaram/data-analysis-dashboard",
      liveUrl: "#analytics-dashboard",
      metricLabel: t("projects.proj2.metric", "Dataset Rows Cleaned"),
      metricValue: "10,000+ Rows",
      icon: TrendingUp,
    },
    {
      id: "proj-3",
      title: t("projects.proj3.title", "Predictive ML Model"),
      category: "AI & ML",
      description: t("projects.proj3.desc", "Trained and evaluated supervised learning models (classification & regression) using Scikit-learn and TensorFlow. Achieved high accuracy on benchmark datasets through feature engineering and hyperparameter tuning."),
      techs: ["Python", "Scikit-Learn", "TensorFlow", "NumPy", "Pandas"],
      githubUrl: "https://github.com/ganeshenyaram/predictive-ml-model",
      liveUrl: "#predictive-model",
      metricLabel: t("projects.proj3.metric", "R2 Score Accuracy"),
      metricValue: "0.94 R² Score",
      icon: Cpu,
    }
  ];

  const categories = ["All", "AI & ML", "Generative AI", "Full-Stack"];

  const getTranslatedCategoryLabel = (cat: string) => {
    switch (cat) {
      case "All": return t("projects.filterAll", "All");
      case "AI & ML": return t("projects.filterAIML", "AI & ML");
      case "Generative AI": return t("projects.filterGenAI", "Generative AI");
      case "Full-Stack": return t("projects.filterFullStack", "Full-Stack");
      default: return cat;
    }
  };

  const filteredProjects = filter === "All"
    ? projectsList
    : projectsList.filter(p => p.category === filter);

  return (
    <section id="projects-section" className="relative py-24 px-4 bg-transparent transition-colors duration-300">
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans"
          >
            {t("projects.heading", "Futuristic Deployments")}
          </motion.h2>
          <p className="text-slate-455 font-mono text-xs max-w-lg mx-auto">
            {t("projects.subtitle", "Practical architectures built with edge computing accelerators and modern generative pipelines.")}
          </p>
          <div className="w-16 h-1 w-16 bg-gradient-to-r from-purple-500 to-cyan-400 mx-auto rounded-full mt-4" />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-300 border cursor-pointer ${
                filter === cat
                  ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white border-transparent shadow-[0_2px_12px_rgba(147,51,234,0.3)]"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
              }`}
            >
              {getTranslatedCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProjects.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-slate-900 border border-slate-850 hover:border-purple-500/40 hover:-translate-y-1.5 transition-all duration-350 shadow-2xl"
              >
                {/* Neon core decorative bar */}
                <div className="absolute top-0 inset-x-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-purple-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Top Row content */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800 text-purple-400">
                      {getTranslatedCategoryLabel(p.category)}
                    </span>
                    <div className="flex items-center gap-3">
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-400 text-slate-400 hover:text-white transition-all"
                        title="GitHub Code"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      <a
                        href={p.liveUrl}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-400 text-slate-400 hover:text-white transition-all"
                        title="Interactive Sandbox"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                      <Icon className="w-4.5 h-4.5 text-cyan-400" />
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed min-h-[72px]">
                      {p.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Row content */}
                <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-4">
                  {/* Tech pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {p.techs.map((t, index) => (
                      <span key={index} className="text-[10px] font-mono text-slate-400 bg-slate-950/55 px-2 py-0.5 rounded border border-slate-850">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Smart metric gauge */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-850/80">
                    <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-rose-500" />
                      {p.metricLabel}
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {p.metricValue}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
