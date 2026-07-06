import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  Cpu, 
  Lightbulb, 
  ChevronRight,
  Zap,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { OptimizedPromptResponse } from "../types";

export default function PromptOptimizer() {
  const [userPrompt, setUserPrompt] = useState("");
  const [category, setCategory] = useState("IT Hardware Troubleshooting");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<OptimizedPromptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;

    setIsOptimizing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/optimize-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userPrompt, category }),
      });

      if (!response.ok) {
        throw new Error("Prompt optimization failed.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.optimizedPrompt) {
      navigator.clipboard.writeText(result.optimizedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const samplePrompts: Record<string, string> = {
    "IT Hardware Troubleshooting": "My laptop won't turn on and has a blinking amber light. What should I check?",
    "Windows OS Deployment": "Give me a batch script to clean up Windows 11 updates and temp files automatically.",
    "Data Analysis & Recovery": "How do I recover files from a USB drive that shows as RAW in Windows disk manager?",
    "Advanced Excel & Macros": "I need an Excel macro to search for duplicates in Column A and highlight them in red.",
    "Client Technical Support": "Help me draft a polite email response to a customer whose printer is still not working after we repaired it.",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 md:p-8" id="prompt-optimizer-section">
      <div className="flex items-center gap-2 mb-2">
        <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
          <Sparkles className="w-5 h-5 animate-pulse" id="prompt-optimizer-icon" />
        </span>
        <h2 className="text-xl font-display font-bold text-slate-900" id="prompt-optimizer-title">
          Zshan's AI Prompt Engineering Sandbox
        </h2>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        As a certified AI Prompt Engineer, I've designed this widget using server-side Gemini 3.5 Flash to automatically rebuild your raw prompts into highly structured, expert-level commands.
      </p>

      <form onSubmit={handleOptimize} className="space-y-4" id="prompt-optimizer-form">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Dropdown */}
          <div className="md:col-span-1">
            <label htmlFor="category-select" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Expertise Context
            </label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                // Pre-populate raw prompt if empty
                if (!userPrompt.trim()) {
                  setUserPrompt(samplePrompts[e.target.value] || "");
                }
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-900/10 focus:border-slate-400 text-slate-700 font-medium"
            >
              <option value="IT Hardware Troubleshooting">IT Hardware Troubleshooting</option>
              <option value="Windows OS Deployment">Windows OS Deployment</option>
              <option value="Data Analysis & Recovery">Data & File Recovery</option>
              <option value="Advanced Excel & Macros">Advanced Excel & Macros</option>
              <option value="Client Technical Support">Help Desk Technical Support</option>
            </select>
          </div>

          {/* Quick-fill Button helper */}
          <div className="md:col-span-2 flex items-end">
            <button
              type="button"
              id="fill-sample-prompt"
              onClick={() => setUserPrompt(samplePrompts[category])}
              className="px-3 py-2 bg-slate-50 border border-dashed border-slate-200 hover:bg-slate-100 text-xs text-indigo-600 font-medium rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              Auto-fill standard template prompt
            </button>
          </div>
        </div>

        {/* Input Textarea */}
        <div>
          <label htmlFor="raw-prompt-input" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
            Raw Instruction Prompt
          </label>
          <div className="relative">
            <textarea
              id="raw-prompt-input"
              rows={3}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Type your raw query or problem description here..."
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-900/10 focus:border-slate-400 transition-colors placeholder:text-slate-400 resize-none"
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            id="optimize-prompt-submit"
            disabled={isOptimizing || !userPrompt.trim()}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-xs shadow-indigo-600/10 transition-colors"
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Engineering Prompt Structures...
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4" />
                Optimize with Gemini AI
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error notice */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-center gap-2 animate-fade-in">
          <span className="font-semibold">Engineering Error:</span> {error}
        </div>
      )}

      {/* Output results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="optimizer-result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mt-8 pt-8 border-t border-slate-100 space-y-6"
            id="prompt-result-container"
          >
            {/* Structured/Optimized Output Block */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Engineered Prompt Output
                </span>
                <button
                  id="copy-optimized-prompt-btn"
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-600 font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Engineered Prompt
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs leading-relaxed max-h-80 overflow-y-auto whitespace-pre-wrap border border-slate-800 shadow-inner" id="optimized-prompt-codeblock">
                {result.optimizedPrompt}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Added Enhancements */}
              <div className="p-5 bg-indigo-50/30 border border-indigo-100/50 rounded-2xl space-y-3" id="prompt-enhancements-card">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 uppercase tracking-wider font-mono">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  Engineering Enhancements
                </div>
                <ul className="space-y-2">
                  {result.enhancements.map((enhancement, index) => (
                    <li key={index} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{enhancement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expert Tips */}
              <div className="p-5 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl space-y-3" id="prompt-tips-card">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider font-mono">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  Zshan's Advisory Note
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{result.expertTips}"
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
