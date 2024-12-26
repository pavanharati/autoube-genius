import { type Video } from "@/types/video";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Play, Trash2, Video as VideoIcon } from "lucide-react";

interface VideoDetailsProps {
  video: Video | undefined;
}

const VideoDetails = ({ video }: VideoDetailsProps) => {
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
          <div className="aspect-video rounded-lg overflow-hidden bg-card relative group">
            <img 
              src={video.thumbnail}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="outline" size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Play Preview
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <div>
              <h3 className="font-semibold mb-1">Title</h3>
              <p className="text-muted-foreground">{video.title}</p>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoDetails;