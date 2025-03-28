
export type Video = {
  id: string;
  title: string;
  thumbnail: string;
  status: "Processing" | "Ready" | "Published";
  duration: string;
  uploadDate: string;
  videoUrl?: string; // Added video URL field
};
