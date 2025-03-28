
export type Video = {
  id: string;
  title: string;
  thumbnail: string;
  status: "Processing" | "Ready" | "Published";
  duration: string;
  uploadDate: string;
  videoUrl?: string;
  captions?: string; // Added captions field
  category?: string; // Added category for better organization
  trending?: boolean; // Flag for trending videos
  trendingPeriod?: "day" | "week" | "month"; // Period for which the video is trending
};

export type VideoGenerationOptions = {
  style: "cartoon" | "anime" | "stock" | "ai-generated" | "realistic" | "ultra-realistic" | "unreal";
  musicStyle?: "upbeat" | "calm" | "dramatic" | "corporate" | "inspirational";
  captionsEnabled: boolean;
  voiceType?: string;
};

export type TrendingTopic = {
  title: string;
  category: string;
  trendingScore: number;
  period: "day" | "week" | "month";
  searchVolume: string;
};
