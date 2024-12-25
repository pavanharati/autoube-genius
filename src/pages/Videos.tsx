import { useState } from "react";
import { Video, Upload, Play, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  status: "Processing" | "Ready" | "Published";
  duration: string;
  uploadDate: string;
}

const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  // Mock videos data (in a real app, this would come from an API)
  const videos: VideoItem[] = [
    {
      id: "1",
      title: "How AI is Changing Our Daily Lives",
      thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
      status: "Published",
      duration: "10:23",
      uploadDate: "2024-02-20",
    },
    {
      id: "2",
      title: "The Future of Remote Work",
      thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      status: "Processing",
      duration: "08:45",
      uploadDate: "2024-02-19",
    },
    {
      id: "3",
      title: "Tech Trends 2024",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      status: "Ready",
      duration: "12:30",
      uploadDate: "2024-02-18",
    },
  ];

  const getStatusColor = (status: VideoItem["status"]) => {
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Videos</h1>
          <p className="text-muted-foreground mt-2">
            Manage your YouTube videos
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Video
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Videos List */}
        <div className="lg:col-span-1">
          <ScrollArea className="h-[700px] pr-4">
            <div className="space-y-4">
              {videos.map((video) => (
                <Card 
                  key={video.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md
                    ${selectedVideo === video.id ? 'border-accent' : ''}`}
                  onClick={() => setSelectedVideo(video.id)}
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
        </div>

        {/* Video Details */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            {selectedVideo ? (
              <>
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
                  {videos.find(v => v.id === selectedVideo) && (
                    <div className="space-y-6">
                      <div className="aspect-video rounded-lg overflow-hidden bg-card relative group">
                        <img 
                          src={videos.find(v => v.id === selectedVideo)?.thumbnail}
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
                          <p className="text-muted-foreground">
                            {videos.find(v => v.id === selectedVideo)?.title}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Upload Date</h3>
                          <p className="text-muted-foreground">
                            {videos.find(v => v.id === selectedVideo)?.uploadDate}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Status</h3>
                          <span className={`text-sm px-2 py-1 rounded-full inline-block
                            ${getStatusColor(videos.find(v => v.id === selectedVideo)?.status || "Processing")}`}>
                            {videos.find(v => v.id === selectedVideo)?.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a video to view details</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Videos;