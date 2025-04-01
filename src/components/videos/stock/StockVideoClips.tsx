
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface StockVideoClipsProps {
  videoClips: string[];
}

const StockVideoClips = ({ videoClips }: StockVideoClipsProps) => {
  const [showAllClips, setShowAllClips] = useState(false);
  
  if (videoClips.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Generated Video Clips</h3>
      <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
        {videoClips.slice(0, 3).map((clip, index) => (
          <div key={index} className="text-xs text-blue-500 truncate hover:text-blue-700">
            <a href={clip} target="_blank" rel="noopener noreferrer">
              Clip {index + 1}: {clip.substring(0, 50)}...
            </a>
          </div>
        ))}
        
        {videoClips.length > 3 && (
          <Dialog open={showAllClips} onOpenChange={setShowAllClips}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 mt-2">
                <Eye className="h-4 w-4" />
                View All Clips ({videoClips.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Stock Footage Clips</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {videoClips.map((clip, index) => (
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
        )}
      </div>
    </div>
  );
};

export default StockVideoClips;
