import { useState } from "react";
import { motion } from "motion/react";
import { 
  Mail, 
  Phone, 
  Linkedin, 
  MapPin, 
  Terminal,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Award,
  Globe,
  LayoutGrid,
  FileText,
  User,
  Check
} from "lucide-react";
import GithubExplorer from "./components/GithubExplorer";
import PromptOptimizer from "./components/PromptOptimizer";
import ResumeSection from "./components/ResumeSection";

export default function App() {
  const [activeTab, setActiveTab] = useState<"portfolio" | "prompt" | "resume">("portfolio");
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

  const handleCopyContact = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedContact(label);
    setTimeout(() => setCopiedContact(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 selection:bg-slate-900 selection:text-white" id="root-container">
      {/* Visual Accent Top Bar */}
      <div className="h-1.5 bg-slate-900 w-full" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-12">
        
        {/* Header Section */}
        <header className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 md:p-10 relative overflow-hidden" id="app-header">
          {/* Subtle decorative grid lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

          <div className="relative flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
              {/* Profile Image Frame */}
              <div className="relative shrink-0" id="header-avatar-frame">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-slate-100 shadow-inner bg-slate-100">
                  <img
                    id="user-avatar"
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300"
                    alt="Zshan Hyder"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                {/* Embedded Status Flag */}
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs">
                  <span className="block w-2.5 h-2.5 rounded-full" />
                </div>
              </div>

              {/* Title & Slogan */}
              <div className="space-y-3">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight" id="user-name">
                    ZSHAN HYDER
                  </h1>
                  <p className="text-xs md:text-sm font-mono font-bold text-slate-500 uppercase tracking-widest mt-1.5" id="user-roles">
                    IT Support Specialist • Desktop Support Engineer • AI Prompt Engineer
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5" id="location-indicator">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Karachi, Sindh, Pakistan
                  </span>
                  <span className="hidden md:inline text-slate-300">|</span>
                  <span className="flex items-center gap-1.5" id="availability-indicator">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    Available for Remote & On-Site Projects
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Actions Drawer */}
            <div className="flex flex-col gap-2 w-full md:w-auto" id="contact-panel">
              {/* Email Button */}
              <button
                id="contact-email-btn"
                onClick={() => handleCopyContact("zshahhyder2@gmail.com", "email")}
                className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-between gap-4 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>zshahhyder2@gmail.com</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {copiedContact === "email" ? "Copied" : "Copy"}
                </span>
              </button>

              {/* Phone Button */}
              <button
                id="contact-phone-btn"
                onClick={() => handleCopyContact("+923113978657", "phone")}
                className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-between gap-4 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>+92 311 3978657</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {copiedContact === "phone" ? "Copied" : "Copy"}
                </span>
              </button>

              {/* LinkedIn Link */}
              <a
                id="contact-linkedin-link"
                href="https://linkedin.com/in/zeeshan-hyder-9597702387"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-semibold text-white flex items-center justify-between gap-4 cursor-pointer transition-all shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-slate-300" />
                  <span>linkedin.com/in/zeeshan-hyder-9597702387</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </header>

        {/* Custom Tabbed Navigation Bar */}
        <nav className="flex justify-center border-b border-slate-200/60 pb-px" id="navigation-tabs">
          <div className="flex gap-1 md:gap-2">
            <button
              id="tab-portfolio"
              onClick={() => setActiveTab("portfolio")}
              className={`px-4 md:px-6 py-3 text-xs md:text-sm font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-all ${
                activeTab === "portfolio"
                  ? "border-slate-900 text-slate-900 font-bold"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>GitHub Portfolio</span>
            </button>

            <button
              id="tab-prompt"
              onClick={() => setActiveTab("prompt")}
              className={`px-4 md:px-6 py-3 text-xs md:text-sm font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-all ${
                activeTab === "prompt"
                  ? "border-indigo-600 text-indigo-900 font-bold"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Prompt Engineering</span>
            </button>

            <button
              id="tab-resume"
              onClick={() => setActiveTab("resume")}
              className={`px-4 md:px-6 py-3 text-xs md:text-sm font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-all ${
                activeTab === "resume"
                  ? "border-slate-900 text-slate-900 font-bold"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Full Interactive Resume</span>
            </button>
          </div>
        </nav>

        {/* Sub-panels display */}
        <main className="space-y-8 animate-fade-in" id="main-content-display">
          {activeTab === "portfolio" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
              id="portfolio-panel"
            >
              <GithubExplorer />
              
              {/* Highlight Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="overview-highlight-grid">
                <div className="p-6 bg-white border border-slate-100 rounded-2xl space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                    <span className="p-1.5 bg-sky-50 text-sky-600 rounded-md">
                      <Terminal className="w-4 h-4" />
                    </span>
                    IT & Technical Support Focus
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Over 3 years of diagnostic and troubleshooting excellence. Advanced specialization in Windows deployments, component-level repairs, backup schema designs, and printer setup architectures.
                  </p>
                </div>

                <div className="p-6 bg-white border border-slate-100 rounded-2xl space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                    <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    AI Prompt Engineering Focus
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Certified prompt architecture expert. Specializing in designing contextual system prompts, structuring tabular constraints, and constructing prompt translation flows utilizing advanced AI models.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "prompt" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              id="prompt-panel"
            >
              <PromptOptimizer />
            </motion.div>
          )}

          {activeTab === "resume" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              id="resume-panel"
            >
              <ResumeSection />
            </motion.div>
          )}
        </main>

        {/* Footer section */}
        <footer className="text-center pt-12 border-t border-slate-100 text-slate-400 text-xs space-y-2" id="app-footer">
          <p>© 2026 Zshan Hyder. Engineered with React, Express, and Gemini 3.5 Flash.</p>
          <div className="flex justify-center gap-4 text-[10px] font-mono">
            <span>Location: Karachi, Pakistan</span>
            <span>•</span>
            <span>Version: v2.0-Live</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
