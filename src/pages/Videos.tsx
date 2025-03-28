
import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateScript } from "@/utils/api/openai";
import { generateVoiceover } from "@/utils/api/elevenlabs";
import { uploadVideo } from "@/utils/api/youtube";
import { generateThumbnail } from "@/utils/api/canva";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import VideoList from "@/components/videos/VideoList";
import VideoDetails from "@/components/videos/VideoDetails";
import { Video } from "@/types/video";

const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>("1"); // Set default selected video
  const { toast } = useToast();
  
  // Mock videos data with sample video URLs
  const videos: Video[] = [
    {
      id: "1",
      title: "How AI is Changing Our Daily Lives",
      thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
      status: "Published",
      duration: "10:23",
      uploadDate: "2024-02-20",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    },
    {
      id: "2",
      title: "The Future of Remote Work",
      thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      status: "Processing",
      duration: "08:45",
      uploadDate: "2024-02-19",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    },
    {
      id: "3",
      title: "Tech Trends 2024",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      status: "Ready",
      duration: "12:30",
      uploadDate: "2024-02-18",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
  ];

  const handleUploadVideo = async (file: File) => {
    try {
      // 1. Generate script
      const script = await generateScript({
        topic: file.name.split('.')[0],
        style: 'informative',
      });

      // 2. Generate voiceover
      const voiceover = await generateVoiceover({
        text: script,
      });

      // 3. Generate thumbnail
      const thumbnail = await generateThumbnail({
        title: file.name.split('.')[0],
        imagePrompt: "Create an engaging thumbnail for " + file.name,
      });

      // 4. Upload to YouTube
      const videoId = await uploadVideo({
        title: file.name.split('.')[0],
        description: script.slice(0, 500), // First 500 chars as description
        tags: [],
        videoFile: file,
      });

      // 5. Save to Supabase
      const { error } = await supabase.from('videos').insert({
        title: file.name.split('.')[0],
        description: script.slice(0, 500),
        script_content: script,
        thumbnail_url: thumbnail,
        video_url: `https://youtube.com/watch?v=${videoId}`,
        status: 'Processing',
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video processing started successfully",
      });
    } catch (error) {
      console.error('Error processing video:', error);
      toast({
        title: "Error",
        description: "Failed to process video",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Videos</h1>
          <p className="text-muted-foreground mt-2">
            Manage your YouTube videos
          </p>
        </div>
        <Button 
          className="gap-2"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'video/*';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleUploadVideo(file);
            };
            input.click();
          }}
        >
          <Upload className="h-4 w-4" />
          Upload Video
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Videos List */}
        <div className="lg:col-span-1">
          <VideoList 
            videos={videos}
            selectedVideo={selectedVideo}
            onSelectVideo={setSelectedVideo}
          />
        </div>

        {/* Video Details */}
        <div className="lg:col-span-2">
          <VideoDetails video={videos.find(v => v.id === selectedVideo)} />
        </div>
      </div>
    </div>
  );
};

export default Videos;
