import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GitFork, 
  Star, 
  Search, 
  MapPin, 
  Users, 
  Folder, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle, 
  Terminal,
  Globe,
  Database
} from "lucide-react";
import { GithubProfile, Repository } from "../types";

export default function GithubExplorer() {
  const [username, setUsername] = useState("shujauhyder"); // Defaults to user email handle
  const [currentUsername, setCurrentUsername] = useState("shujauhyder");
  const [profile, setProfile] = useState<GithubProfile | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchMethod, setFetchMethod] = useState<string>("");
  const [source, setSource] = useState<string>("");

  const fetchGithubData = useCallback(async (searchUser: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/github/profile?username=${encodeURIComponent(searchUser)}`);
      if (!response.ok) {
        throw new Error(`Profile fetch failed with status: ${response.status}`);
      }
      const data = await response.json();
      setProfile(data.profile);
      setRepos(data.repos);
      setFetchMethod(data.methodUsed);
      setSource(data.source);
      setCurrentUsername(searchUser);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect to backend GitHub service.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGithubData("shujauhyder");
  }, [fetchGithubData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      fetchGithubData(username.trim());
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 md:p-8" id="github-explorer-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-sky-50 text-sky-600 rounded-lg">
              <Terminal className="w-5 h-5" id="github-icon" />
            </span>
            <h2 className="text-xl font-display font-bold text-slate-900" id="github-section-title">
              GitHub Live Repository Integrator
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            Automatically scrapes pinned items or queries the REST API in real-time.
          </p>
        </div>

        {/* Username Search Form */}
        <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto" id="github-search-form">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              id="github-username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub Username..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors placeholder:text-slate-400"
            />
          </div>
          <button
            id="github-search-button"
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-sm font-medium rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Fetch"}
          </button>
        </form>
      </div>

      {/* Sync Status Badge */}
      <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-slate-100 text-xs">
        <span className="text-slate-400 font-mono">Sync Status:</span>
        {isLoading ? (
          <span className="px-2.5 py-1 bg-amber-50 text-amber-600 font-mono rounded-full flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
            Synchronizing...
          </span>
        ) : error ? (
          <span className="px-2.5 py-1 bg-red-50 text-red-600 font-mono rounded-full flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Offline / Error
          </span>
        ) : (
          <>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 font-mono rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Live Connected
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500 font-mono">
              Method: <span className="text-slate-700 font-medium capitalize">{fetchMethod}</span>
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500 font-mono">
              Data: <span className="text-slate-700 font-medium capitalize">{source}</span>
            </span>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          /* Skeleton Loader */
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Profile Card Skeleton */}
            <div className="md:col-span-1 p-6 border border-slate-100 rounded-2xl space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-100 rounded-md w-3/4 animate-pulse" />
                  <div className="h-3 bg-slate-100 rounded-md w-1/2 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-slate-100 rounded-md w-full animate-pulse" />
                <div className="h-3 bg-slate-100 rounded-md w-5/6 animate-pulse" />
              </div>
            </div>

            {/* Repos Grid Skeleton */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 4, 6].map((i) => (
                <div key={i} className="p-5 border border-slate-100 rounded-2xl space-y-3">
                  <div className="h-4 bg-slate-100 rounded-md w-1/2 animate-pulse" />
                  <div className="h-3 bg-slate-100 rounded-md w-full animate-pulse" />
                  <div className="h-3 bg-slate-100 rounded-md w-3/4 animate-pulse" />
                  <div className="flex justify-between pt-2">
                    <div className="h-3 bg-slate-100 rounded-md w-1/4 animate-pulse" />
                    <div className="h-3 bg-slate-100 rounded-md w-1/4 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : error ? (
          /* Error Fallback Notice */
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 bg-red-50/50 border border-red-100 rounded-2xl flex items-start gap-4"
          >
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-red-800">Connection Interrupted</h4>
              <p className="text-xs text-red-600">
                {error}. Showing Zshan Hyder's premium offline-cached portfolio projects. Enter another username or try refreshing in a few moments.
              </p>
              <button
                id="retry-fetch-btn"
                onClick={() => fetchGithubData(currentUsername)}
                className="mt-2 text-xs font-semibold text-red-800 hover:text-red-900 underline underline-offset-2 cursor-pointer"
              >
                Retry Sync Connection
              </button>
            </div>
          </motion.div>
        ) : (
          /* Main Content */
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Profile Info Sidebar */}
            {profile && (
              <div className="lg:col-span-1 p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col justify-between" id="github-profile-card">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      id="github-profile-avatar"
                      src={profile.avatarUrl}
                      alt={profile.name}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full border-2 border-white shadow-xs object-cover"
                    />
                    <div>
                      <h3 className="font-display font-bold text-slate-900 leading-tight" id="github-profile-name">
                        {profile.name}
                      </h3>
                      <a
                        id="github-profile-link"
                        href={profile.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 mt-1 font-mono"
                      >
                        @{currentUsername}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed italic" id="github-profile-bio">
                    "{profile.bio}"
                  </p>

                  <div className="space-y-2 pt-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2" id="github-profile-location">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{profile.location}</span>
                    </div>
                    {profile.company && (
                      <div className="flex items-center gap-2" id="github-profile-company">
                        <Database className="w-3.5 h-3.5 text-slate-400" />
                        <span>{profile.company}</span>
                      </div>
                    )}
                    {profile.blog && (
                      <div className="flex items-center gap-2" id="github-profile-blog">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <a
                          href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-slate-900 truncate max-w-full"
                        >
                          {profile.blog}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Followers Stats */}
                <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-slate-100 text-center" id="github-profile-stats">
                  <div>
                    <div className="text-base font-bold text-slate-900">{profile.followers}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Followers</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-slate-900">{profile.following}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Following</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-slate-900">{profile.publicRepos}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Repos</div>
                  </div>
                </div>
              </div>
            )}

            {/* Repositories Grid Feed */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Featured Repositories ({repos.length})
                </span>
                {fetchMethod === "mock" && (
                  <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-md">
                    Showing Default Portfolio
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="repos-grid">
                {repos.map((repo, idx) => (
                  <motion.a
                    key={`${repo.owner}-${repo.name}-${idx}`}
                    href={repo.url !== "#" ? repo.url : undefined}
                    target={repo.url !== "#" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    whileHover={{ y: -4, borderColor: "#cbd5e1" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`p-5 bg-slate-50/30 hover:bg-white border border-slate-100 rounded-2xl flex flex-col justify-between transition-shadow hover:shadow-xs group ${repo.url === "#" ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 min-width-0">
                          <Folder className="w-4 h-4 text-slate-400 shrink-0" />
                          <h4 className="text-sm font-semibold text-slate-800 font-mono truncate group-hover:text-slate-950">
                            {repo.name}
                          </h4>
                        </div>
                        {repo.isPinned ? (
                          <span className="text-[10px] font-medium font-sans px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full shrink-0">
                            Pinned
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium font-sans px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded-full shrink-0">
                            Popular
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                        {repo.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100/50 text-xs font-mono text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: repo.languageColor }}
                        />
                        <span>{repo.language}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 hover:text-slate-800">
                          <Star className="w-3.5 h-3.5" />
                          {repo.stars}
                        </span>
                        <span className="flex items-center gap-1 hover:text-slate-800">
                          <GitFork className="w-3.5 h-3.5" />
                          {repo.forks}
                        </span>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
