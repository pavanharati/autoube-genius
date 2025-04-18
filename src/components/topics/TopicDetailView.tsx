
import { FileText, ArrowLeft, Save, Video } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingTopic, VideoGenerationOptions } from "@/types/video";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import VideoGenerator from "@/components/videos/VideoGenerator";
import { useState } from "react";

interface TopicDetailViewProps {
  selectedTopic: TrendingTopic;
  script: string;
  isGeneratingScript: boolean;
  onGenerateScript: () => Promise<void>;
  onSaveScript: () => void;
  onBackToTopics: () => void;
  onCreateVideo: (title: string, script: string, options: VideoGenerationOptions) => Promise<{ videoUrl: string; captionsUrl: string; }>;
}

const TopicDetailView = ({
  selectedTopic,
  script,
  isGeneratingScript,
  onGenerateScript,
  onSaveScript,
  onBackToTopics,
  onCreateVideo
}: TopicDetailViewProps) => {
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  const handleCreateVideo = async (title: string, videoScript: string, options: VideoGenerationOptions) => {
    setIsGeneratingVideo(true);
    try {
      await onCreateVideo(title, videoScript, options);
      setIsVideoDialogOpen(false);
    } catch (error) {
      console.error("Error creating video:", error);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={onBackToTopics} 
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Topics
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{selectedTopic.topic}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Search Volume</p>
              <p className="font-medium text-lg">{selectedTopic.searchVolume}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trend</p>
              <p className="font-medium text-lg text-green-500">{selectedTopic.trend}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Engagement</p>
              <p className="font-medium text-lg">{selectedTopic.engagement}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTopic.relatedTopics.map((topic, index) => (
                <Badge 
                  key={index} 
                  className="bg-accent/50 text-accent-foreground px-3 py-1 rounded-full text-sm"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Video Script</h3>
              <div className="flex gap-2">
                {script && (
                  <>
                    <Button 
                      onClick={onSaveScript} 
                      variant="outline"
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Script
                    </Button>
                    
                    <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          className="gap-2"
                        >
                          <Video className="h-4 w-4" />
                          Create Video
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Create Video from Script</DialogTitle>
                        </DialogHeader>
                        <VideoGenerator 
                          onGenerate={handleCreateVideo} 
                          isGenerating={isGeneratingVideo}
                          initialScript={script}
                          initialTitle={selectedTopic.topic}
                        />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
                <Button 
                  onClick={onGenerateScript} 
                  disabled={isGeneratingScript}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {isGeneratingScript ? "Generating..." : script ? "Regenerate" : "Generate Script"}
                </Button>
              </div>
            </div>
            
            {script ? (
              <div className="bg-accent/20 p-4 rounded-md mt-4 whitespace-pre-wrap">
                {script}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Click the button above to generate a video script based on this topic.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopicDetailView;
