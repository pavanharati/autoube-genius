
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Wand2, Video, Loader2, Info, AlertTriangle } from "lucide-react";
import { VideoGenerationOptions } from "@/types/video";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { textToVideo } from "@/utils/api/videoGenerator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TextToVideoGeneratorProps {
  onComplete?: (result: { videoUrl: string; captionsUrl: string; title: string }) => void;
}

// Model information - maps to the GitHub repos
const modelInfo = {
  'cartoon': {
    name: 'CogVideo',
    repo: 'THUDM/CogVideo',
    description: 'Cartoon-style video generation',
    gpu: 'High (A100 recommended)'
  },
  'anime': {
    name: 'Tune-A-Video',
    repo: 'showlab/Tune-A-Video',
    description: 'Anime-style video generation',
    gpu: 'High (16GB+ VRAM)'
  },
  'stock': {
    name: 'VGen',
    repo: 'ali-vilab/VGen',
    description: 'Stock footage style',
    gpu: 'Medium to High (12GB+ VRAM)'
  },
  'realistic': {
    name: 'Mora',
    repo: 'lichao-sun/Mora',
    description: 'Realistic video generation',
    gpu: 'High (24GB+ VRAM)'
  },
  'ultra-realistic': {
    name: 'Open-Sora',
    repo: 'hpcaitech/Open-Sora',
    description: 'Ultra-realistic high quality',
    gpu: 'Very High (A100 40GB+ recommended)'
  },
  'ai-generated': {
    name: 'LTX-Video',
    repo: 'Lightricks/LTX-Video',
    description: 'General purpose video generation',
    gpu: 'Medium (8GB+ VRAM)'
  },
  'unreal': {
    name: 'Step-Video',
    repo: 'stepfun-ai/Step-Video-TI2V',
    description: 'Stylized video generation',
    gpu: 'High (16GB+ VRAM)'
  }
};

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
        description: `Converting your text to video using ${modelInfo[style].name} model. This may take a few minutes...`,
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
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>GPU Resources Required</AlertTitle>
          <AlertDescription>
            AI video generation requires significant GPU resources. Currently using placeholder videos until GPU infrastructure is available.
          </AlertDescription>
        </Alert>

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
          <div className="flex items-center mb-3">
            <Label className="text-sm mr-2">Video Style / AI Model</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Each style uses a different AI model optimized for that type of content</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RadioGroup
            value={style}
            onValueChange={(value) => setStyle(value as VideoGenerationOptions["style"])}
            className="grid grid-cols-2 md:grid-cols-3 gap-3"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label 
                    htmlFor="ai-generated-style"
                    className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${style === 'ai-generated' ? 'border-accent bg-accent/10' : 'border-border'}`}
                  >
                    <RadioGroupItem id="ai-generated-style" value="ai-generated" className="sr-only" />
                    <div className="w-full h-16 rounded bg-gradient-to-r from-accent to-accent-foreground mb-2"></div>
                    <div className="text-center">
                      <span className="block">LTX-Video</span>
                      <span className="text-xs text-muted-foreground">General Purpose</span>
                    </div>
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 max-w-xs">
                    <p className="font-medium">{modelInfo["ai-generated"].name}</p>
                    <p className="text-xs">{modelInfo["ai-generated"].description}</p>
                    <p className="text-xs text-amber-500">GPU: {modelInfo["ai-generated"].gpu}</p>
                    <p className="text-xs text-muted-foreground">Repository: {modelInfo["ai-generated"].repo}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label 
                    htmlFor="cartoon-style"
                    className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${style === 'cartoon' ? 'border-accent bg-accent/10' : 'border-border'}`}
                  >
                    <RadioGroupItem id="cartoon-style" value="cartoon" className="sr-only" />
                    <div className="w-full h-16 rounded bg-gradient-to-r from-blue-400 to-green-400 mb-2"></div>
                    <div className="text-center">
                      <span className="block">CogVideo</span>
                      <span className="text-xs text-muted-foreground">Cartoon Style</span>
                    </div>
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 max-w-xs">
                    <p className="font-medium">{modelInfo.cartoon.name}</p>
                    <p className="text-xs">{modelInfo.cartoon.description}</p>
                    <p className="text-xs text-amber-500">GPU: {modelInfo.cartoon.gpu}</p>
                    <p className="text-xs text-muted-foreground">Repository: {modelInfo.cartoon.repo}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label 
                    htmlFor="anime-style"
                    className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${style === 'anime' ? 'border-accent bg-accent/10' : 'border-border'}`}
                  >
                    <RadioGroupItem id="anime-style" value="anime" className="sr-only" />
                    <div className="w-full h-16 rounded bg-gradient-to-r from-purple-400 to-pink-400 mb-2"></div>
                    <div className="text-center">
                      <span className="block">Tune-A-Video</span>
                      <span className="text-xs text-muted-foreground">Anime Style</span>
                    </div>
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 max-w-xs">
                    <p className="font-medium">{modelInfo.anime.name}</p>
                    <p className="text-xs">{modelInfo.anime.description}</p>
                    <p className="text-xs text-amber-500">GPU: {modelInfo.anime.gpu}</p>
                    <p className="text-xs text-muted-foreground">Repository: {modelInfo.anime.repo}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label 
                    htmlFor="stock-style"
                    className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${style === 'stock' ? 'border-accent bg-accent/10' : 'border-border'}`}
                  >
                    <RadioGroupItem id="stock-style" value="stock" className="sr-only" />
                    <div className="w-full h-16 rounded bg-gradient-to-r from-gray-400 to-gray-600 mb-2"></div>
                    <div className="text-center">
                      <span className="block">VGen</span>
                      <span className="text-xs text-muted-foreground">Stock Footage</span>
                    </div>
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 max-w-xs">
                    <p className="font-medium">{modelInfo.stock.name}</p>
                    <p className="text-xs">{modelInfo.stock.description}</p>
                    <p className="text-xs text-amber-500">GPU: {modelInfo.stock.gpu}</p>
                    <p className="text-xs text-muted-foreground">Repository: {modelInfo.stock.repo}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label 
                    htmlFor="realistic-style"
                    className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${style === 'realistic' ? 'border-accent bg-accent/10' : 'border-border'}`}
                  >
                    <RadioGroupItem id="realistic-style" value="realistic" className="sr-only" />
                    <div className="w-full h-16 rounded bg-gradient-to-r from-amber-500 to-red-500 mb-2"></div>
                    <div className="text-center">
                      <span className="block">Mora</span>
                      <span className="text-xs text-muted-foreground">Realistic</span>
                    </div>
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 max-w-xs">
                    <p className="font-medium">{modelInfo.realistic.name}</p>
                    <p className="text-xs">{modelInfo.realistic.description}</p>
                    <p className="text-xs text-amber-500">GPU: {modelInfo.realistic.gpu}</p>
                    <p className="text-xs text-muted-foreground">Repository: {modelInfo.realistic.repo}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label 
                    htmlFor="ultra-realistic-style"
                    className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${style === 'ultra-realistic' ? 'border-accent bg-accent/10' : 'border-border'}`}
                  >
                    <RadioGroupItem id="ultra-realistic-style" value="ultra-realistic" className="sr-only" />
                    <div className="w-full h-16 rounded bg-gradient-to-r from-red-600 to-yellow-500 mb-2"></div>
                    <div className="text-center">
                      <span className="block">Open-Sora</span>
                      <span className="text-xs text-muted-foreground">High Quality</span>
                    </div>
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 max-w-xs">
                    <p className="font-medium">{modelInfo["ultra-realistic"].name}</p>
                    <p className="text-xs">{modelInfo["ultra-realistic"].description}</p>
                    <p className="text-xs text-amber-500">GPU: {modelInfo["ultra-realistic"].gpu}</p>
                    <p className="text-xs text-muted-foreground">Repository: {modelInfo["ultra-realistic"].repo}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label 
                    htmlFor="unreal-style"
                    className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${style === 'unreal' ? 'border-accent bg-accent/10' : 'border-border'}`}
                  >
                    <RadioGroupItem id="unreal-style" value="unreal" className="sr-only" />
                    <div className="w-full h-16 rounded bg-gradient-to-r from-blue-600 to-purple-500 mb-2"></div>
                    <div className="text-center">
                      <span className="block">Step-Video</span>
                      <span className="text-xs text-muted-foreground">Stylized</span>
                    </div>
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 max-w-xs">
                    <p className="font-medium">{modelInfo.unreal.name}</p>
                    <p className="text-xs">{modelInfo.unreal.description}</p>
                    <p className="text-xs text-amber-500">GPU: {modelInfo.unreal.gpu}</p>
                    <p className="text-xs text-muted-foreground">Repository: {modelInfo.unreal.repo}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
              Generating with {modelInfo[style].name}...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              Generate AI Video
            </>
          )}
        </Button>

        {isGenerating ? (
          <div className="text-center text-sm text-muted-foreground mt-2">
            <p>AI video generation using {modelInfo[style].name} would normally take 2-3 minutes.</p>
            <p>Currently using placeholder videos until GPU infrastructure is available.</p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Selected model: {modelInfo[style].name} • GPU Requirement: {modelInfo[style].gpu}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TextToVideoGenerator;
