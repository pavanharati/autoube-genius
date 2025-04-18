
import { useState, useEffect } from "react";
import { type Video } from "@/types/video";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Play, Trash2, Video as VideoIcon, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface VideoDetailsProps {
  video: Video | undefined;
}

const VideoDetails = ({ video }: VideoDetailsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showAllClips, setShowAllClips] = useState(false);
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

  // Only use the video URL if it's a valid URL
  const isValidUrl = (url?: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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

  // Use the actual video URL
  const videoUrl = video.videoUrl || "";
  
  // Determine if captions are available
  const hasCaptions = isValidUrl(video.captions);
  
  // Check if we have stock footage clips
  const hasStockClips = video.videoClips && video.videoClips.length > 0;

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
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  onEnded={() => setIsPlaying(false)}
                  onLoadedData={() => setVideoLoaded(true)}
                  onError={(e) => {
                    console.error("Video error:", e);
                    toast({
                      title: "Video Error",
                      description: "There was an error loading this video. Please try again.",
                      variant: "destructive",
                    });
                    setIsPlaying(false);
                  }}
                >
                  {captionsEnabled && hasCaptions && (
                    <track 
                      kind="subtitles" 
                      src={video.captions} 
                      label="English" 
                      srcLang="en" 
                      default 
                    />
                  )}
                </video>
                {videoLoaded && hasCaptions && (
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
                {isValidUrl(video.thumbnail) ? (
                  <img 
                    src={video.thumbnail}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 bg-muted">
                    <VideoIcon className="h-12 w-12 opacity-50" />
                  </div>
                )}
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
            {hasStockClips && (
              <div className="md:col-span-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold mb-1">Stock Footage</h3>
                  <Dialog open={showAllClips} onOpenChange={setShowAllClips}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        View All Clips ({video.videoClips?.length})
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Stock Footage Clips</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {video.videoClips?.map((clip, index) => (
                          <div key={index} className="aspect-video rounded overflow-hidden">
                            <video
                              src={clip}
                              className="w-full h-full object-cover"
                              controls
                              preload="metadata"
                            ></video>
                            <p className="text-xs mt-1 text-center text-muted-foreground">Clip {index + 1}</p>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-muted-foreground">Generated using {video.videoClips?.length} stock clips</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoDetails;
