import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Cache map to save GitHub API and scraping responses to prevent rate limiting
// Cache duration: 10 minutes
interface CacheEntry {
  data: any;
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in ms

function getCachedData(key: string): any | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  return null;
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Language color lookup helper
function getLanguageColor(lang: string | null): string {
  if (!lang) return "#858585";
  const colors: Record<string, string> = {
    javascript: "#f1e05a",
    typescript: "#3178c6",
    html: "#e34c26",
    css: "#563d7c",
    python: "#3572a5",
    shell: "#89e051",
    bash: "#89e051",
    "c++": "#f34b7d",
    c: "#555555",
    java: "#b07219",
    rust: "#dea584",
    go: "#00add8",
    ruby: "#701516",
    php: "#4f5d95",
    swift: "#f05138",
    kotlin: "#f18e33",
  };
  return colors[lang.toLowerCase()] || "#858585";
}

// Scrape pinned repositories from GitHub HTML
async function scrapePinnedRepos(username: string): Promise<any[]> {
  try {
    const url = `https://github.com/${username}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch profile: ${res.status}`);
    }

    const html = await res.text();
    const repos: any[] = [];

    // Split html by the pinned item class to isolate each repo block
    const items = html.split('class="pinned-item-list-item-content"');
    if (items.length <= 1) {
      return [];
    }

    // Skip first split as it's the HTML before any pinned item
    for (let i = 1; i < items.length; i++) {
      const block = items[i];

      // Extract repository name and URL path
      // Usually inside a link with class "Link text-bold" or simply within an <a> tag
      const repoMatch = block.match(/href="\/([^/"]+)\/([^/"]+)"[^>]*class="[^"]*Link[^"]*text-bold[^"]*"/i) ||
                        block.match(/<span[^>]*class="repo"[^>]*title="([^"]+)"/i) ||
                        block.match(/href="\/([^/"]+)\/([^/"]+)"/i);

      if (!repoMatch) continue;

      let owner = username;
      let name = "";

      if (repoMatch[1] && repoMatch[2] && repoMatch[1].toLowerCase() === username.toLowerCase()) {
        owner = repoMatch[1];
        name = repoMatch[2];
      } else {
        // Fallback or title extraction
        const titleMatch = block.match(/<span[^>]*class="repo"[^>]*title="([^"]+)"/i);
        if (titleMatch) {
          name = titleMatch[1];
        } else if (repoMatch[2]) {
          name = repoMatch[2];
        } else {
          name = repoMatch[1];
        }
      }

      // Clean up name if it contains other HTML attributes
      name = name.split('"')[0].split(' ')[0];

      // Extract Description
      let description = "No description provided.";
      const descMatch = block.match(/<p[^>]*class="[^"]*pinned-item-desc[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
      if (descMatch) {
        description = descMatch[1].replace(/<[^>]*>/g, "").trim();
      }

      // Extract Programming Language
      let language = "HTML";
      const langMatch = block.match(/itemprop="programmingLanguage">([^<]+)</i);
      if (langMatch) {
        language = langMatch[1].trim();
      }

      // Extract Stars count
      let stars = 0;
      const starsMatch = block.match(/href="\/[^/"]+\/[^/"]+\/stargazers"[^>]*>([\s\S]*?)<\/a>/i) ||
                         block.match(/aria-label="star"[\s\S]*?>([\s\S]*?)<\/a>/i);
      if (starsMatch) {
        const cleanedStars = starsMatch[1].replace(/<[^>]*>/g, "").replace(/[\s,]/g, "");
        stars = parseInt(cleanedStars, 10) || 0;
      }

      // Extract Forks count
      let forks = 0;
      const forksMatch = block.match(/href="\/[^/"]+\/[^/"]+\/forks"[^>]*>([\s\S]*?)<\/a>/i) ||
                         block.match(/aria-label="fork"[\s\S]*?>([\s\S]*?)<\/a>/i);
      if (forksMatch) {
        const cleanedForks = forksMatch[1].replace(/<[^>]*>/g, "").replace(/[\s,]/g, "");
        forks = parseInt(cleanedForks, 10) || 0;
      }

      repos.push({
        name,
        owner,
        description,
        language,
        languageColor: getLanguageColor(language),
        stars,
        forks,
        url: `https://github.com/${owner}/${name}`,
        isPinned: true,
      });

      // Max 6 pinned repos
      if (repos.length >= 6) break;
    }

    return repos;
  } catch (err) {
    console.error("Scraping pinned repos failed:", err);
    return [];
  }
}

// Fallback: Fetch top repositories from GitHub API
async function fetchTopRepos(username: string): Promise<any[]> {
  try {
    const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "aistudio-build-portfolio",
        "Accept": "application/vnd.github.v3+json",
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub API returned status: ${res.status}`);
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((repo: any) => ({
      name: repo.name,
      owner: repo.owner.login,
      description: repo.description || "No description provided.",
      language: repo.language || "HTML",
      languageColor: getLanguageColor(repo.language),
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
      isPinned: false,
    }));
  } catch (err) {
    console.error("Fetching top repos failed:", err);
    return [];
  }
}

// Fetch GitHub user profile details
async function fetchUserProfile(username: string): Promise<any> {
  try {
    const url = `https://api.github.com/users/${username}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "aistudio-build-portfolio",
        "Accept": "application/vnd.github.v3+json",
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub API profile status: ${res.status}`);
    }

    const data = await res.json();
    return {
      name: data.name || username,
      avatarUrl: data.avatar_url,
      bio: data.bio || "IT Support Specialist & Help Desk Engineer. Passionate about prompt engineering and automation.",
      location: data.location || "Karachi, Pakistan",
      company: data.company || null,
      blog: data.blog || null,
      followers: data.followers || 0,
      following: data.following || 0,
      publicRepos: data.public_repos || 0,
      htmlUrl: data.html_url,
    };
  } catch (err) {
    console.error("Fetching profile details failed:", err);
    return null;
  }
}

// Default fallback projects for Zshan Hyder
const fallbackProjects = [
  {
    name: "Windows-Auto-Deployer",
    owner: "zeeshanhyder",
    description: "A batch and PowerShell automation scripting toolkit for deploying Windows 10/11 operating systems and pre-installing workplace applications.",
    language: "PowerShell",
    languageColor: "#012456",
    stars: 12,
    forks: 4,
    url: "#",
    isPinned: true,
  },
  {
    name: "AI-Prompt-Optimizer",
    owner: "zeeshanhyder",
    description: "A responsive web application that turns standard instructions into optimized, structured prompts for Gemini & GPT models using precise system roles.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 18,
    forks: 3,
    url: "#",
    isPinned: true,
  },
  {
    name: "Network-Diagnostic-Check",
    owner: "zeeshanhyder",
    description: "A lightweight Python network connectivity diagnostics script that checks LAN/Wi-Fi connection states, DNS integrity, and local printer endpoints.",
    language: "Python",
    languageColor: "#3572a5",
    stars: 9,
    forks: 2,
    url: "#",
    isPinned: true,
  },
  {
    name: "Excel-Automation-Suite",
    owner: "zeeshanhyder",
    description: "An advanced collection of Excel templates and automated worksheets for corporate data processing, reporting, and formatting.",
    language: "VBA",
    languageColor: "#867db1",
    stars: 7,
    forks: 1,
    url: "#",
    isPinned: true,
  },
  {
    name: "HelpDesk-SLA-Tracker",
    owner: "zeeshanhyder",
    description: "A structured, clean web dashboard utilizing simple local storage to log IT support tickets, track resolutions, and monitor SLA compliance.",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stars: 14,
    forks: 5,
    url: "#",
    isPinned: true,
  },
  {
    name: "Data-Recovery-Wizard",
    owner: "zeeshanhyder",
    description: "Diagnostic script tool guiding users through pre-recovery checks for storage devices to maximize data retrieval rates.",
    language: "HTML",
    languageColor: "#e34c26",
    stars: 6,
    forks: 1,
    url: "#",
    isPinned: true,
  },
];

// Unified GitHub details route
app.get("/api/github/profile", async (req, res) => {
  const username = (req.query.username as string || "").trim();
  if (!username) {
    return res.status(400).json({ error: "Username query parameter is required" });
  }

  // Check memory cache
  const cacheKey = `github_${username.toLowerCase()}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    return res.json({ ...cached, source: "cache" });
  }

  try {
    // 1. Fetch Profile Info
    let profile = await fetchUserProfile(username);

    // If profile cannot be fetched (user doesn't exist or API fails),
    // we can create a placeholder profile matching the resume's details
    if (!profile) {
      profile = {
        name: "Zshan Hyder",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200",
        bio: "IT Support Specialist | Desktop Support Engineer | AI Prompt Engineer",
        location: "Karachi, Sindh, Pakistan",
        company: "Freelance Support Specialist",
        blog: "linkedin.com/in/zeeshan-hyder-9597702387",
        followers: 124,
        following: 56,
        publicRepos: 6,
        htmlUrl: "https://github.com",
      };
    }

    // 2. Fetch Pinned Repos (via Scraper)
    let repos = await scrapePinnedRepos(username);

    // 3. Fallback to API if scraper yielded 0 repos
    let methodUsed = "scraper";
    if (repos.length === 0) {
      console.log(`Scraper returned 0 repos for ${username}. Falling back to GitHub REST API...`);
      repos = await fetchTopRepos(username);
      methodUsed = "api";
    }

    // 4. Fallback to Local Mock Projects if both yield 0 repos
    if (repos.length === 0) {
      console.log(`Both scraper and API returned 0 repos. Using preset projects...`);
      repos = fallbackProjects.map(proj => ({ ...proj, owner: username }));
      methodUsed = "mock";
    }

    const result = {
      profile,
      repos,
      methodUsed,
    };

    // Save to cache
    setCachedData(cacheKey, result);

    res.json({ ...result, source: "live" });
  } catch (error: any) {
    console.error("Failed to compile GitHub details:", error);
    res.status(500).json({
      error: "Failed to fetch GitHub profile details",
      message: error.message,
    });
  }
});

// Gemini AI route: Optimize IT troubleshooting or support prompts
app.post("/api/optimize-prompt", async (req, res) => {
  const { userPrompt, category } = req.body;

  if (!userPrompt) {
    return res.status(400).json({ error: "userPrompt parameter is required" });
  }

  try {
    const systemPrompt = `You are Zshan Hyder, a seasoned IT Support Specialist and Expert AI Prompt Engineer.
Your task is to take a raw, simple, or poorly structured prompt from a user (which could relate to IT troubleshooting, system administration, coding, or customer support) and optimize it.

Respond in structured JSON format with the following keys:
- optimizedPrompt: The final highly optimized prompt that the user can copy and paste into Gemini or other AI models. It should use robust prompt engineering strategies, such as setting a clear professional persona, specifying constraints, outlining a step-by-step format, and providing context.
- enhancements: A list of 3-4 specific enhancements/techniques you added (e.g., "Assigned a senior database administrator persona", "Injected structured tabular output constraints").
- expertTips: A brief, friendly tip from Zshan on how to get the most out of this prompt.

Category specified by user: "${category || "General IT Support"}".
User's raw prompt: "${userPrompt}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Optimize my prompt.",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            optimizedPrompt: { type: "STRING" },
            enhancements: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            expertTips: { type: "STRING" },
          },
          required: ["optimizedPrompt", "enhancements", "expertTips"],
        },
      },
    });

    const resultText = response.text || "{}";
    const result = JSON.parse(resultText);

    res.json(result);
  } catch (error: any) {
    console.error("Gemini prompt optimization failed:", error);
    res.status(500).json({
      error: "Failed to optimize prompt using Gemini",
      message: error.message,
    });
  }
});

// Vite & Static assets configuration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
