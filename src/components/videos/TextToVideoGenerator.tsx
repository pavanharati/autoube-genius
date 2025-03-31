
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Wand2, Video, Loader2 } from "lucide-react";
import { VideoGenerationOptions } from "@/types/video";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { textToVideo } from "@/utils/api/videoGenerator";

interface TextToVideoGeneratorProps {
  onComplete?: (result: { videoUrl: string; captionsUrl: string; title: string }) => void;
}

const TextToVideoGenerator = ({ onComplete }: TextToVideoGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<VideoGenerationOptions["style"]>("ai-generated");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a prompt to generate a video",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      toast({
        title: "Processing",
        description: "Converting your text to video using AI. This may take a few moments...",
      });
      
      const options: Partial<VideoGenerationOptions> = {
        style,
        captionsEnabled: true,
      };
      
      const result = await textToVideo(prompt, options);
      
      toast({
        title: "Success",
        description: "AI-generated video created successfully!",
      });
      
      if (onComplete) {
        onComplete(result);
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
          <Video className="h-5 w-5 text-accent" />
          AI Text to Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="prompt">What would you like to create a video about?</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a topic or description for your video. For example: 'The history of artificial intelligence' or 'Top 5 productivity tips for remote workers'"
            className="min-h-[120px] mt-1"
          />
        </div>
        
        <div>
          <Label className="text-sm mb-3 block">Video Style</Label>
          <RadioGroup
            value={style}
            onValueChange={(value) => setStyle(value as VideoGenerationOptions["style"])}
            className="grid grid-cols-2 md:grid-cols-3 gap-3"
          >
            <Label 
              htmlFor="ai-generated-style"
              className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${style === 'ai-generated' ? 'border-accent bg-accent/10' : 'border-border'}`}
            >
              <RadioGroupItem id="ai-generated-style" value="ai-generated" className="sr-only" />
              <div className="w-full h-16 rounded bg-gradient-to-r from-accent to-accent-foreground mb-2"></div>
              <span>AI Generated</span>
            </Label>
            <Label 
              htmlFor="realistic-style"
              className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${style === 'realistic' ? 'border-accent bg-accent/10' : 'border-border'}`}
            >
              <RadioGroupItem id="realistic-style" value="realistic" className="sr-only" />
              <div className="w-full h-16 rounded bg-gradient-to-r from-amber-500 to-red-500 mb-2"></div>
              <span>Realistic</span>
            </Label>
            <Label 
              htmlFor="cartoon-style"
              className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${style === 'cartoon' ? 'border-accent bg-accent/10' : 'border-border'}`}
            >
              <RadioGroupItem id="cartoon-style" value="cartoon" className="sr-only" />
              <div className="w-full h-16 rounded bg-gradient-to-r from-blue-400 to-green-400 mb-2"></div>
              <span>Cartoon</span>
            </Label>
            <Label 
              htmlFor="anime-style"
              className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${style === 'anime' ? 'border-accent bg-accent/10' : 'border-border'}`}
            >
              <RadioGroupItem id="anime-style" value="anime" className="sr-only" />
              <div className="w-full h-16 rounded bg-gradient-to-r from-purple-400 to-pink-400 mb-2"></div>
              <span>Anime</span>
            </Label>
            <Label 
              htmlFor="stock-style"
              className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${style === 'stock' ? 'border-accent bg-accent/10' : 'border-border'}`}
            >
              <RadioGroupItem id="stock-style" value="stock" className="sr-only" />
              <div className="w-full h-16 rounded bg-gradient-to-r from-gray-400 to-gray-600 mb-2"></div>
              <span>Stock</span>
            </Label>
            <Label 
              htmlFor="ultra-realistic-style"
              className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${style === 'ultra-realistic' ? 'border-accent bg-accent/10' : 'border-border'}`}
            >
              <RadioGroupItem id="ultra-realistic-style" value="ultra-realistic" className="sr-only" />
              <div className="w-full h-16 rounded bg-gradient-to-r from-red-600 to-yellow-500 mb-2"></div>
              <span>Ultra Realistic</span>
            </Label>
          </RadioGroup>
        </div>
        
        <Button 
          onClick={handleGenerate} 
          className="w-full mt-6 gap-2"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating AI Video...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              Generate AI Video
            </>
          )}
        </Button>

        {isGenerating && (
          <div className="text-center text-sm text-muted-foreground mt-2">
            <p>AI video generation may take 2-3 minutes depending on complexity.</p>
            <p>You'll be notified when your video is ready.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TextToVideoGenerator;
