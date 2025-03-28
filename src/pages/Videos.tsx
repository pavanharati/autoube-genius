
import { useState } from "react";
import { Upload, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import VideoList from "@/components/videos/VideoList";
import VideoDetails from "@/components/videos/VideoDetails";
import VideoGenerator from "@/components/videos/VideoGenerator";
import { Video, VideoGenerationOptions } from "@/types/video";
import { generateVideo } from "@/utils/api/videoGenerator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>("1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const { toast } = useToast();
  
  // Mock videos data with sample video URLs and captions
  const videos: Video[] = [
    {
      id: "1",
      title: "10 AI Tools That Will Change Your Life in 2024",
      thumbnail: "https://images.unsplash.com/photo-1677442135968-6d89b6808134",
      status: "Published",
      duration: "10:23",
      uploadDate: "2024-02-20",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      captions: "https://raw.githubusercontent.com/andrewnester/sample-webvtt/master/captions-basic.vtt",
      category: "Technology",
      trending: true,
      trendingPeriod: "day",
    },
    {
      id: "2",
      title: "Remote Work Productivity Hacks That Actually Work",
      thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      status: "Processing",
      duration: "08:45",
      uploadDate: "2024-02-19",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      captions: "https://raw.githubusercontent.com/andrewnester/sample-webvtt/master/captions-basic.vtt",
      category: "Productivity",
    },
    {
      id: "3",
      title: "Tech Trends Reshaping Industries in 2024",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      status: "Ready",
      duration: "12:30",
      uploadDate: "2024-02-18",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      captions: "https://raw.githubusercontent.com/andrewnester/sample-webvtt/master/captions-basic.vtt",
      category: "Business",
      trending: true,
      trendingPeriod: "week",
    },
  ];

  const handleUploadVideo = async (file: File) => {
    try {
      toast({
        title: "Video Upload Started",
        description: "Your video is being processed...",
      });
      
      // In a real app, this would upload and process the video
      setTimeout(() => {
        toast({
          title: "Video Uploaded",
          description: "Your video has been uploaded and is being processed.",
        });
      }, 2000);
    } catch (error) {
      console.error('Error processing video:', error);
      toast({
        title: "Error",
        description: "Failed to process video",
        variant: "destructive",
      });
    }
  };

  const handleGenerateVideo = async (title: string, script: string, options: VideoGenerationOptions) => {
    setIsGenerating(true);
    try {
      // In a real app, this would generate a video
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Video Generated",
        description: "Your video has been successfully generated.",
      });
      
      setShowGenerator(false);
    } catch (error) {
      console.error('Error generating video:', error);
      toast({
        title: "Error",
        description: "Failed to generate video",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">Videos</h1>
          <p className="text-muted-foreground mt-2">
            Create, manage and publish your YouTube videos
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline"
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
          
          <Dialog open={showGenerator} onOpenChange={setShowGenerator}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Video
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Video</DialogTitle>
              </DialogHeader>
              <VideoGenerator onGenerate={handleGenerateVideo} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Videos</TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
        </TabsList>
      </Tabs>

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
