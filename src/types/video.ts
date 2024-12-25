export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  status: "Processing" | "Ready" | "Published";
  duration: string;
  uploadDate: string;
}