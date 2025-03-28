
import { useState, useEffect } from "react";
import { type Video } from "@/types/video";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Play, Trash2, Video as VideoIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface VideoDetailsProps {
  video: Video | undefined;
}

const VideoDetails = ({ video }: VideoDetailsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { toast } = useToast();

  // Reset video state when video changes
  useEffect(() => {
    setIsPlaying(false);
    setVideoLoaded(false);
  }, [video?.id]);

  const getStatusColor = (status: Video["status"]) => {
    switch (status) {
      case "Published":
        return "bg-green-500/10 text-green-500";
      case "Processing":
        return "bg-yellow-500/10 text-yellow-500";
      case "Ready":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  const handleToggleCaptions = (checked: boolean) => {
    setCaptionsEnabled(checked);
    toast({
      title: checked ? "Captions enabled" : "Captions disabled",
      description: checked ? "Video captions are now showing" : "Video captions are now hidden",
    });
  };

  const getVideoUrl = (video: Video) => {
    if (video.videoUrl) return video.videoUrl;
    
    // Fallback to sample videos if no video URL is provided
    return `https://storage.googleapis.com/gtv-videos-bucket/sample/${
      video.id === "1" ? "ForBiggerBlazes" : 
      video.id === "2" ? "ElephantsDream" : 
      "BigBuckBunny"}.mp4`;
  };

  if (!video) {
    return (
      <Card className="h-full">
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <VideoIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a video to view details</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Video Details</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="aspect-video rounded-lg overflow-hidden bg-card relative">
            {isPlaying ? (
              <div className="relative">
                <video 
                  src={getVideoUrl(video)}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  onEnded={() => setIsPlaying(false)}
                  onLoadedData={() => setVideoLoaded(true)}
                  onError={() => {
                    toast({
                      title: "Video Error",
                      description: "There was an error loading this video. Please try again.",
                      variant: "destructive",
                    });
                    setIsPlaying(false);
                  }}
                >
                  {captionsEnabled && video.captions && (
                    <track 
                      kind="subtitles" 
                      src={video.captions} 
                      label="English" 
                      srcLang="en" 
                      default 
                    />
                  )}
                </video>
                {videoLoaded && (
                  <div className="absolute bottom-16 right-4 flex items-center gap-2 bg-black/70 text-white p-2 rounded-md">
                    <Label htmlFor="captions-toggle" className="text-xs">Captions</Label>
                    <Switch 
                      id="captions-toggle"
                      checked={captionsEnabled}
                      onCheckedChange={handleToggleCaptions}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="relative group">
                <img 
                  src={video.thumbnail}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="gap-2"
                    onClick={handlePlayVideo}
                  >
                    <Play className="h-5 w-5" />
                    Play Video
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">Title</h3>
              <p className="text-muted-foreground">{video.title}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Category</h3>
              <p className="text-muted-foreground">{video.category || "Uncategorized"}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Upload Date</h3>
              <p className="text-muted-foreground">{video.uploadDate}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Status</h3>
              <span className={`text-sm px-2 py-1 rounded-full inline-block ${getStatusColor(video.status)}`}>
                {video.status}
              </span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Duration</h3>
              <p className="text-muted-foreground">{video.duration}</p>
            </div>
            {video.trending && (
              <div>
                <h3 className="font-semibold mb-1">Trending</h3>
                <p className="text-muted-foreground">Trending for {video.trendingPeriod || "day"}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoDetails;
