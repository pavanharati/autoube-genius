import { useState } from "react";
import { Upload, TrendingUp, Plus, MessageSquareText, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoList from "@/components/videos/VideoList";
import VideoDetails from "@/components/videos/VideoDetails";
import VideoGenerator from "@/components/videos/VideoGenerator";
import TextToVideoGenerator from "@/components/videos/TextToVideoGenerator";
import StockVideoGenerator from "@/components/videos/StockVideoGenerator";
import { Video, VideoGenerationOptions } from "@/types/video";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>("1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showTextToVideo, setShowTextToVideo] = useState(false);
  const [showStockVideoGenerator, setShowStockVideoGenerator] = useState(false);
  
  // Mock videos data with sample video URLs and captions
  const [videos, setVideos] = useState<Video[]>([
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
  ]);

  const handleUploadVideo = async (file: File) => {
    try {
      console.log("Uploading video:", file.name);
      
      setTimeout(() => {
        console.log("Video uploaded successfully");
      }, 2000);
    } catch (error) {
      console.error('Error processing video:', error);
    }
  };

  const handleGenerateVideo = async (title: string, script: string, options: VideoGenerationOptions) => {
    setIsGenerating(true);
    try {
      console.log("Generating video with title:", title);
      console.log("Script:", script);
      console.log("Options:", options);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log("Video generated successfully");
      
      const newVideo: Video = {
        id: (videos.length + 1).toString(),
        title,
        thumbnail: "https://images.unsplash.com/photo-1677442135968-6d89b6808134",
        status: "Ready",
        duration: "03:45",
        uploadDate: new Date().toISOString().split('T')[0],
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        captions: "https://raw.githubusercontent.com/andrewnester/sample-webvtt/master/captions-basic.vtt",
        category: "Generated",
      };
      
      setVideos([...videos, newVideo]);
      setSelectedVideo(newVideo.id);
      setShowGenerator(false);
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleTextToVideoComplete = (result: { videoUrl: string; captionsUrl: string; title: string }) => {
    const newVideo: Video = {
      id: (videos.length + 1).toString(),
      title: result.title,
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      status: "Ready",
      duration: "02:30",
      uploadDate: new Date().toISOString().split('T')[0],
      videoUrl: result.videoUrl,
      captions: result.captionsUrl,
      category: "Generated",
    };
    
    setVideos([...videos, newVideo]);
    setSelectedVideo(newVideo.id);
    setShowTextToVideo(false);
  };

  const handleStockVideoComplete = (result: { videoUrl: string; captionsUrl: string; title: string }) => {
    const newVideo: Video = {
      id: (videos.length + 1).toString(),
      title: result.title,
      thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      status: "Ready",
      duration: "10:00",
      uploadDate: new Date().toISOString().split('T')[0],
      videoUrl: result.videoUrl,
      captions: result.captionsUrl,
      category: "Stock Footage",
    };
    
    setVideos([...videos, newVideo]);
    setSelectedVideo(newVideo.id);
    setShowStockVideoGenerator(false);
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
          
          <Dialog open={showTextToVideo} onOpenChange={setShowTextToVideo}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <MessageSquareText className="h-4 w-4" />
                Text to Video
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Video from Text</DialogTitle>
              </DialogHeader>
              <TextToVideoGenerator onComplete={handleTextToVideoComplete} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showStockVideoGenerator} onOpenChange={setShowStockVideoGenerator}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FileVideo className="h-4 w-4" />
                Stock Video
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Stock Footage Video</DialogTitle>
              </DialogHeader>
              <StockVideoGenerator onComplete={handleStockVideoComplete} />
            </DialogContent>
          </Dialog>
          
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
              <VideoGenerator onGenerate={handleGenerateVideo} isGenerating={isGenerating} />
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
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <VideoList 
                videos={videos}
                selectedVideo={selectedVideo}
                onSelectVideo={setSelectedVideo}
              />
            </div>

            <div className="lg:col-span-2">
              <VideoDetails video={videos.find(v => v.id === selectedVideo)} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="trending">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <VideoList 
                videos={videos.filter(v => v.trending)}
                selectedVideo={selectedVideo}
                onSelectVideo={setSelectedVideo}
              />
            </div>
            <div className="lg:col-span-2">
              <VideoDetails video={videos.find(v => v.id === selectedVideo)} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="published">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <VideoList 
                videos={videos.filter(v => v.status === "Published")}
                selectedVideo={selectedVideo}
                onSelectVideo={setSelectedVideo}
              />
            </div>
            <div className="lg:col-span-2">
              <VideoDetails video={videos.find(v => v.id === selectedVideo)} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="processing">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <VideoList 
                videos={videos.filter(v => v.status === "Processing")}
                selectedVideo={selectedVideo}
                onSelectVideo={setSelectedVideo}
              />
            </div>
            <div className="lg:col-span-2">
              <VideoDetails video={videos.find(v => v.id === selectedVideo)} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Videos;
