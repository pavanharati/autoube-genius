
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileVideo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateStockFootageVideo } from "@/utils/api/videoGenerator";
import StockVideoForm from "./stock/StockVideoForm";
import StockVideoClips from "./stock/StockVideoClips";

interface StockVideoGeneratorProps {
  onComplete?: (result: { videoUrl: string; captionsUrl: string; title: string; durationInSeconds?: number }) => void;
  initialScript?: string;
  initialTitle?: string;
}

const StockVideoGenerator = ({ 
  onComplete, 
  initialScript = "", 
  initialTitle = "" 
}: StockVideoGeneratorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [script, setScript] = useState(initialScript);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stockSource, setStockSource] = useState<"pixabay" | "unsplash" | "flickr" | "pexels" | "mixed">("pixabay");
  const [targetDuration, setTargetDuration] = useState(10); // Default 10 minutes
  const [musicStyle, setMusicStyle] = useState("upbeat");
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [generatedVideoClips, setGeneratedVideoClips] = useState<string[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a video title",
        variant: "destructive",
      });
      return;
    }
    
    if (!script.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a video script",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      toast({
        title: "Processing",
        description: `Generating your stock footage video. This may take a few minutes...`,
      });
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 3000);
      
      const result = await generateStockFootageVideo(
        title,
        script,
        {
          stockSource,
          duration: targetDuration,
          musicStyle,
          captionsEnabled
        }
      );
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      // Store any returned video clips for display
      if (result.videoClips && result.videoClips.length > 0) {
        setGeneratedVideoClips(result.videoClips);
      }
      
      toast({
        title: "Success",
        description: "Stock footage video created successfully!",
      });
      
      if (onComplete) {
        onComplete({
          videoUrl: result.videoUrl,
          captionsUrl: result.captionsUrl,
          title,
          durationInSeconds: result.durationInSeconds
        });
      }
    } catch (error) {
      console.error("Error generating video:", error);
      toast({
        title: "Error",
        description: "Failed to generate video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileVideo className="h-5 w-5 text-accent" />
          Stock Footage Video Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <StockVideoForm
          title={title}
          setTitle={setTitle}
          script={script}
          setScript={setScript}
          stockSource={stockSource}
          setStockSource={setStockSource}
          targetDuration={targetDuration}
          setTargetDuration={setTargetDuration}
          musicStyle={musicStyle}
          setMusicStyle={setMusicStyle}
          captionsEnabled={captionsEnabled}
          setCaptionsEnabled={setCaptionsEnabled}
          isGenerating={isGenerating}
          generationProgress={generationProgress}
          handleGenerate={handleGenerate}
        />
        
        {!isGenerating && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Creates videos using footage from {stockSource === "mixed" ? "multiple sources" : stockSource}
          </p>
        )}

        <StockVideoClips videoClips={generatedVideoClips} />
      </CardContent>
    </Card>
  );
};

export default StockVideoGenerator;
