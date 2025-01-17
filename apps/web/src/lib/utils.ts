export const categories = [
  "books",
  "business",
  "developer tools",
  "education",
  "entertainment",
  "finance",
  "food and drink",
  "games",
  "graphics and design",
  "health and fitness",
  "lifestyle",
  "kids",
  "magazines and newspapers",
  "medical",
  "music",
  "navigation",
  "news",
  "photo and video",
  "productivity",
  "reference",
  "shopping",
  "social networking",
  "sports",
  "travel",
  "utilities",
  "weather",
  "defi",
  "nft",
  "gambling",
  "messaging",
  "social media",
  "off-ramping",
  "social",
  "price aggregator",
  "payments",
  "discovery tool",
  "airdrop tool",
  "ecommerce",
  "personalization",
];

export const subCategories: { [key: string]: any } = {
  games: [
    "action",
    "adventure",
    "puzzle",
    "role-playing",
    "strategy",
    "sports",
    "racing",
    "board ",
    "simulation",
    "word",
  ],
  business: [
    "communication",
    "project-management",
    "human-resources",
    "decentralized-business-tools",
  ],
  education: ["learning tools", "Reference", "language-learning", "stem"],
  "health and fitness": [
    "workout-apps",
    "meditation",
    "nutrition",
    "sleep-trackers",
  ],
  books: ["ebooks", "audiobooks", "document-readers"],
  "social networking": ["decentralized-social-networks", "messaging"],
  entertainment: [
    "video-streaming",
    "music-streaming",
    "live-events",
    "nft-marketplaces",
  ],
  productivity: [
    "note-taking",
    "task-management",
    "time-management",
    "calendar",
    "decentralized-collaboration-tools",
  ],
  utilities: ["file-management", "browsers", "security-and-privacy", "wallets"],
  travel: [
    "navigation",
    "accommodation-booking",
    "transportation",
    "trip-planning",
  ],
  shopping: ["ecommerce", "nft-marketplaces"],
  finance: [
    "banking",
    "personal-finance",
    "exchanges",
    "defi",
    "insurance",
    "on-ramping",
    "off-ramping",
  ],
  "magazines and newspapers": ["decentralized-news-platforms"],
  photography: ["photo-editing", "camera-apps", "photo-sharing"],
  "food and drink": ["cooking", "recipes", "restaurant-finding"],
  lifestyle: ["home-automation", "fashion", "Dating"],
  sports: ["sports-news", "team-management", "live-scores"],
  personalization: ["themes", "wallpapers", "customization-tools"],
};

export interface screenShot {
  file?: File;
  id: string;
  url?: string;
}
