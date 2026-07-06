import { useState } from "react";
import { motion } from "motion/react";
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  CheckCircle, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Cpu, 
  HardDrive, 
  Network, 
  FileSpreadsheet, 
  Settings
} from "lucide-react";

export default function ResumeSection() {
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>("All");

  const skillCategories = ["All", "Core Technical", "Hardware & Networks", "Software & Admin", "Programming & AI", "Professional"];

  const skills = [
    // Core Technical
    { name: "Windows 10/11 Installation & Configuration", category: "Core Technical", level: "Expert" },
    { name: "Desktop & Laptop Troubleshooting", category: "Core Technical", level: "Expert" },
    { name: "Operating System Deployment", category: "Core Technical", level: "Expert" },
    { name: "Remote Technical Support", category: "Core Technical", level: "Expert" },
    { name: "Security & Maintenance", category: "Core Technical", level: "Advanced" },
    
    // Hardware & Networks
    { name: "Hardware Diagnostics & Repair", category: "Hardware & Networks", level: "Expert" },
    { name: "RAM, HDD/SSD & Component Replacement", category: "Hardware & Networks", level: "Expert" },
    { name: "Data Recovery & Backup", category: "Hardware & Networks", level: "Expert" },
    { name: "Basic Networking (LAN/Wi-Fi)", category: "Hardware & Networks", level: "Advanced" },
    { name: "Printer Installation & Configuration", category: "Hardware & Networks", level: "Expert" },

    // Software & Admin
    { name: "Microsoft Word & Excel (Advanced)", category: "Software & Admin", level: "Expert" },
    { name: "Microsoft PowerPoint & Office 365", category: "Software & Admin", level: "Expert" },
    { name: "Batching & Analysis", category: "Software & Admin", level: "Advanced" },
    { name: "Bus & MultiTeach Accounting Software", category: "Software & Admin", level: "Intermediate" },
    { name: "Technical Documentation", category: "Software & Admin", level: "Expert" },

    // Programming & AI
    { name: "AI Prompt Engineering", category: "Programming & AI", level: "Expert" },
    { name: "HTML (Basic)", category: "Programming & AI", level: "Intermediate" },
    { name: "Python (Basic)", category: "Programming & AI", level: "Intermediate" },

    // Professional
    { name: "Problem Solving", category: "Professional", level: "Expert" },
    { name: "Customer Service", category: "Professional", level: "Expert" },
    { name: "Team Collaboration", category: "Professional", level: "Expert" },
    { name: "Attention to Detail", category: "Professional", level: "Expert" },
  ];

  const filteredSkills = selectedSkillCategory === "All" 
    ? skills 
    : skills.filter(skill => skill.category === selectedSkillCategory);

  const experiences = [
    {
      title: "Freelance IT Support & Computer Technician",
      company: "Independent Consultant",
      location: "Larkana & Karachi, Pakistan",
      period: "2023 - Present",
      description: "Dedicated on-site and remote hardware, software, and systems configuration specialist.",
      bullets: [
        "Installed and configured enterprise Windows operating systems, ensuring optimal patch security and system integrity.",
        "Diagnosed and repaired desktop/laptop motherboards, memory modules, and physical storage drives.",
        "Replaced memory (RAM), storage drives (HDD/SSD), and other mission-critical internal system parts.",
        "Recovered files, folders, and partitions from corrupted drives, logical errors, and bad sectors.",
        "Fixed critical boot sequences, system startup freezes, and BIOS configuration settings.",
        "Set up printers, configured local network routers, and managed remote client support sessions.",
      ]
    },
    {
      title: "Freelance MS Word & Excel Specialist",
      company: "Remote Operations",
      location: "Worldwide / Remote",
      period: "2024 - Present",
      description: "Delivering polished corporate spreadsheets, reporting macros, and document structures.",
      bullets: [
        "Designed professional, structured MS Word documentation, reports, and manuals matching client branding.",
        "Developed custom Excel worksheets utilizing complex logical formulas, conditional formats, and dynamic charts.",
        "Completed high-accuracy data sorting, validation audits, and automated formatting scripts.",
        "Structured interactive slides and executive reporting materials for technical presentations.",
      ]
    }
  ];

  const certifications = [
    {
      name: "Google Technical Support Fundamentals",
      provider: "Google Career Certificates",
      score: "Score: 95%",
      icon: Award
    },
    {
      name: "AI Prompt Engineer | Computer Operator | Python Learner",
      provider: "Professional Training Suite",
      score: "Verified Portfolio",
      icon: Cpu
    },
    {
      name: "AI Emergency Course",
      provider: "Rohan School",
      score: "Certified Graduate",
      icon: Award
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="resume-section-container">
      {/* Left Column: Work Experience & Summary */}
      <div className="lg:col-span-2 space-y-8">
        {/* Professional Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8" id="career-summary-card">
          <h3 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-slate-900 rounded-full" />
            Professional Summary
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed" id="career-summary-text">
            Dedicated and results-driven IT Support Specialist with hands-on experience in Windows installations, desktop troubleshooting, hardware diagnostics, data recovery, and remote technical support. Highly skilled in Microsoft Office suites, Excel automation, basic networking, and system maintenance. Passionate about Artificial Intelligence, prompt engineering, automation, and modern technologies, with a strong commitment to delivering efficient technical solutions with clean professional service.
          </p>
        </div>

        {/* Work Experience */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8" id="experience-card">
          <h3 className="text-lg font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-slate-900 rounded-full" />
            Professional Experience
          </h3>

          <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
            {experiences.map((exp, idx) => (
              <div key={idx} className="relative pl-8 group" id={`experience-item-${idx}`}>
                {/* Timeline node */}
                <div className="absolute left-1 top-1.5 w-4 h-4 rounded-full border-2 border-slate-900 bg-white group-hover:bg-slate-900 transition-colors" />
                
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-base font-bold text-slate-800 font-display">
                      {exp.title}
                    </h4>
                    <span className="text-xs font-semibold font-mono text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.period}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
                    <span>{exp.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 italic">
                    {exp.description}
                  </p>

                  <ul className="grid grid-cols-1 gap-2 pt-2">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-xs text-slate-600 flex items-start gap-2.5 leading-relaxed">
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Skills, Education & Certifications */}
      <div className="space-y-8">
        {/* Interactive Skills Grid */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6" id="skills-card">
          <h3 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-slate-900 rounded-full" />
            Skills Sandbox
          </h3>

          {/* Quick Filter Category Carousel */}
          <div className="flex flex-wrap gap-1.5 mb-4" id="skills-filter-tabs">
            {skillCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedSkillCategory(cat)}
                className={`px-2.5 py-1 text-[10px] font-semibold tracking-wide rounded-md transition-all cursor-pointer ${
                  selectedSkillCategory === cat
                    ? "bg-slate-950 text-white shadow-xs"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Render Skills */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1" id="skills-list">
            {filteredSkills.map((skill, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">{skill.name}</span>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  skill.level === "Expert" 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                    : skill.level === "Advanced"
                    ? "bg-sky-50 text-sky-600 border border-sky-100"
                    : "bg-amber-50 text-amber-600 border border-amber-100"
                }`}>
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6" id="certifications-card">
          <h3 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-slate-900 rounded-full" />
            Certifications
          </h3>
          <div className="space-y-3" id="certifications-list">
            {certifications.map((cert, idx) => {
              const Icon = cert.icon;
              return (
                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <span className="p-2 bg-white text-slate-700 rounded-lg border border-slate-100 shrink-0">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{cert.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{cert.provider}</p>
                    <span className="inline-block mt-1 text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm">
                      {cert.score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Education & Languages */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6" id="education-languages-card">
          <div>
            <h3 className="text-lg font-display font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-slate-900 rounded-full" />
              Education
            </h3>
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                <GraduationCap className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Secondary School Certificate (SSC)</span>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold font-mono">Computer Science Division</p>
              <p className="text-xs text-slate-600">Govt Shaikh Zaid High School, Larkana</p>
              <span className="inline-block text-[10px] font-mono text-slate-400 bg-slate-100/50 px-2 py-0.5 rounded-sm mt-1">
                Class of 2025 - 2026
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-display font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-slate-900 rounded-full" />
              Languages
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center" id="languages-grid">
              {[
                { name: "English", desc: "Fluent" },
                { name: "Urdu", desc: "Native" },
                { name: "Sindhi", desc: "Native" }
              ].map((lang, idx) => (
                <div key={idx} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <div className="text-xs font-bold text-slate-800">{lang.name}</div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">{lang.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
