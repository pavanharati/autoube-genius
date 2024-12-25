import { Video } from "@/types/video";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VideoListProps {
  videos: Video[];
  selectedVideo: string | null;
  onSelectVideo: (videoId: string) => void;
}

const VideoList = ({ videos, selectedVideo, onSelectVideo }: VideoListProps) => {
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

  return (
    <ScrollArea className="h-[700px] pr-4">
      <div className="space-y-4">
        {videos.map((video) => (
          <Card 
            key={video.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md
              ${selectedVideo === video.id ? 'border-accent' : ''}`}
            onClick={() => onSelectVideo(video.id)}
          >
            <CardContent className="p-3">
              <div className="aspect-video mb-3 overflow-hidden rounded-lg">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold line-clamp-1">{video.title}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{video.duration}</span>
                  <span className={`px-2 py-1 rounded-full ${getStatusColor(video.status)}`}>
                    {video.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default VideoList;