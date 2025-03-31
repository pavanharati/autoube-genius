
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
  videoClips?: string[]; // Array of video clip URLs used in the video
};

export type VideoGenerationOptions = {
  style: "cartoon" | "anime" | "stock" | "ai-generated" | "realistic" | "ultra-realistic" | "unreal";
  musicStyle?: "upbeat" | "calm" | "dramatic" | "corporate" | "inspirational";
  captionsEnabled: boolean;
  voiceType?: string;
};

export type TrendingTopic = {
  title?: string;
  topic: string;
  category?: string;
  trendingScore?: number;
  period?: "day" | "week" | "month";
  region?: string; // Added region property to fix the type error
  searchVolume: string;
  trend: string;
  engagement: string;
  relatedTopics: string[];
};

export type GeneratedScript = {
  id: string;
  topic: string;
  content: string;
  createdAt: string;
  videoGenerated?: boolean;
};

export type GeneratedVideo = {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  captions?: string;
  scriptId?: string;
  createdAt: string;
  status: "Processing" | "Ready" | "Published";
  style: VideoGenerationOptions["style"];
};

export type ThumbnailOptions = {
  title: string;
  style: "modern" | "minimal" | "bold" | "playful";
  textColor?: string;
  backgroundColor?: string;
  imagePrompt?: string;
};
