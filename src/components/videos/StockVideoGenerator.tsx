
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Video, FileVideo, Music, Loader2, Film } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateStockFootageVideo } from "@/utils/api/videoGenerator";
import { Slider } from "@/components/ui/slider";

interface StockVideoGeneratorProps {
  onComplete?: (result: { videoUrl: string; captionsUrl: string; title: string }) => void;
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
  const [stockSource, setStockSource] = useState<"pixabay" | "unsplash" | "flickr" | "pexels" | "mixed">("mixed");
  const [targetDuration, setTargetDuration] = useState(10); // Default 10 minutes
  const [musicStyle, setMusicStyle] = useState("inspirational");
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [generatedVideoClips, setGeneratedVideoClips] = useState<string[]>([]);
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
    
    try {
      toast({
        title: "Processing",
        description: `Generating your stock footage video. This may take a few minutes...`,
      });
      
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
          title
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
        <div>
          <Label htmlFor="title">Video Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your video"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="script">Script</Label>
          <Textarea
            id="script"
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Enter your video script here. The script will be used to find relevant stock footage."
            className="min-h-[200px] mt-1"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stock-source">Stock Footage Source</Label>
            <Select 
              value={stockSource} 
              onValueChange={(value) => setStockSource(value as typeof stockSource)}
            >
              <SelectTrigger id="stock-source" className="mt-1">
                <SelectValue placeholder="Select a stock footage source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pixabay">Pixabay</SelectItem>
                <SelectItem value="pexels">Pexels</SelectItem>
                <SelectItem value="unsplash">Unsplash</SelectItem>
                <SelectItem value="flickr">Flickr</SelectItem>
                <SelectItem value="mixed">Mixed Sources</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="music-style">Background Music</Label>
            <Select 
              value={musicStyle} 
              onValueChange={setMusicStyle}
            >
              <SelectTrigger id="music-style" className="mt-1">
                <SelectValue placeholder="Select music style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inspirational">Inspirational</SelectItem>
                <SelectItem value="upbeat">Upbeat</SelectItem>
                <SelectItem value="calm">Calm</SelectItem>
                <SelectItem value="dramatic">Dramatic</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="target-duration">Target Duration: {targetDuration} minutes</Label>
          </div>
          <Slider
            id="target-duration"
            min={1}
            max={30}
            step={1}
            value={[targetDuration]}
            onValueChange={(value) => setTargetDuration(value[0])}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="captions"
            checked={captionsEnabled}
            onCheckedChange={setCaptionsEnabled}
          />
          <Label htmlFor="captions">Enable captions</Label>
        </div>
        
        <Button 
          onClick={handleGenerate} 
          className="w-full mt-6 gap-2"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Stock Video...
            </>
          ) : (
            <>
              <Film className="h-4 w-4" />
              Generate Real Stock Video
            </>
          )}
        </Button>
        
        {isGenerating ? (
          <div className="text-center text-sm text-muted-foreground mt-2">
            <p>Finding and composing stock footage takes time.</p>
            <p>For a {targetDuration} minute video, this could take 3-5 minutes.</p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Creates videos using footage from {stockSource === "mixed" ? "multiple sources" : stockSource}
          </p>
        )}

        {generatedVideoClips.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Generated Video Clips</h3>
            <div className="grid grid-cols-1 gap-2">
              {generatedVideoClips.map((clip, index) => (
                <div key={index} className="text-xs text-blue-500 truncate hover:text-blue-700">
                  <a href={clip} target="_blank" rel="noopener noreferrer">
                    Clip {index + 1}: {clip.substring(0, 50)}...
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockVideoGenerator;
