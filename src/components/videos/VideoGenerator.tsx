
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Wand2, Music, Video, Lightbulb, FileText, AlertTriangle } from "lucide-react";
import { VideoGenerationOptions } from "@/types/video";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VideoGeneratorProps {
  onGenerate: (title: string, script: string, options: VideoGenerationOptions) => Promise<void>;
  initialScript?: string;
  initialTitle?: string;
  isGenerating?: boolean;
}

// GPU requirements for each model
const gpuRequirements = {
  "cartoon": "High (A100 recommended)",
  "anime": "High (16GB+ VRAM)",
  "stock": "Medium to High (12GB+ VRAM)",
  "ai-generated": "Medium (8GB+ VRAM)",
  "realistic": "High (24GB+ VRAM)",
  "ultra-realistic": "Very High (A100 40GB+ recommended)",
  "unreal": "High (16GB+ VRAM)"
};

// Model information
const modelInfo = {
  "cartoon": {
    name: "CogVideo",
    description: "Specialized in generating cartoon-style videos",
    repo: "THUDM/CogVideo"
  },
  "anime": {
    name: "Tune-A-Video",
    description: "Optimized for anime-style content",
    repo: "showlab/Tune-A-Video"
  },
  "stock": {
    name: "VGen",
    description: "Creates stock footage style videos",
    repo: "ali-vilab/VGen"
  },
  "ai-generated": {
    name: "LTX-Video",
    description: "General purpose video generation",
    repo: "Lightricks/LTX-Video"
  },
  "realistic": {
    name: "Mora",
    description: "Creates realistic, high-quality videos",
    repo: "lichao-sun/Mora"
  },
  "ultra-realistic": {
    name: "OpenSora",
    description: "Ultra high-quality realistic videos",
    repo: "hpcaitech/Open-Sora"
  },
  "unreal": {
    name: "StepVideo",
    description: "Stylized, creative video generation",
    repo: "stepfun-ai/Step-Video-TI2V"
  }
};

const VideoGenerator = ({ 
  onGenerate, 
  initialScript = "", 
  initialTitle = "", 
  isGenerating = false 
}: VideoGeneratorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [script, setScript] = useState(initialScript);
  
  const [options, setOptions] = useState<VideoGenerationOptions>({
    style: "ai-generated",
    musicStyle: "inspirational",
    captionsEnabled: true,
    voiceType: "natural",
  });

  const handleGenerate = async () => {
    if (!title.trim()) {
      alert("Please enter a video title");
      return;
    }
    
    if (!script.trim()) {
      alert("Please enter a video script");
      return;
    }
    
    try {
      await onGenerate(title, script, options);
    } catch (error) {
      console.error("Error generating video:", error);
      alert("Failed to generate video. Please try again.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-accent" />
          Video Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>GPU Resources Required</AlertTitle>
          <AlertDescription>
            Generating AI videos requires GPU resources. Currently using placeholder videos until GPU infrastructure is available.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="style" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Style
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Audio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div>
              <Label htmlFor="title">Video Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a catchy title for your video"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="script">Script</Label>
              <Textarea
                id="script"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Enter your video script here. Include hooks, problems, solutions, and results."
                className="min-h-[200px] mt-1"
              />
            </div>
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  alert("Tips for great scripts: Start with a strong hook, present a problem, offer a solution, and show the results. Keep it engaging!");
                }}
                className="gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                Script Tips
              </Button>
              <div className="flex items-center gap-2">
                <Label htmlFor="captions-enabled" className="text-sm">Enable Captions</Label>
                <Switch 
                  id="captions-enabled"
                  checked={options.captionsEnabled}
                  onCheckedChange={(checked) => setOptions({...options, captionsEnabled: checked})}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <div>
              <Label className="text-sm mb-3 block">Video Style / AI Model</Label>
              <RadioGroup
                value={options.style}
                onValueChange={(value) => setOptions({...options, style: value as any})}
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label 
                        htmlFor="cartoon-style"
                        className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${options.style === 'cartoon' ? 'border-accent bg-accent/10' : 'border-border'}`}
                      >
                        <RadioGroupItem id="cartoon-style" value="cartoon" className="sr-only" />
                        <div className="w-full h-16 rounded bg-gradient-to-r from-blue-400 to-green-400 mb-2"></div>
                        <div className="text-center">
                          <span className="block">Cartoon</span>
                          <span className="text-xs text-muted-foreground">{modelInfo.cartoon.name}</span>
                        </div>
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1 max-w-xs">
                        <p className="font-semibold">{modelInfo.cartoon.name}</p>
                        <p className="text-xs">{modelInfo.cartoon.description}</p>
                        <p className="text-xs font-medium">GPU: {gpuRequirements.cartoon}</p>
                        <p className="text-xs text-muted-foreground">Repo: {modelInfo.cartoon.repo}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label 
                        htmlFor="anime-style"
                        className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${options.style === 'anime' ? 'border-accent bg-accent/10' : 'border-border'}`}
                      >
                        <RadioGroupItem id="anime-style" value="anime" className="sr-only" />
                        <div className="w-full h-16 rounded bg-gradient-to-r from-pink-400 to-purple-400 mb-2"></div>
                        <div className="text-center">
                          <span className="block">Anime</span>
                          <span className="text-xs text-muted-foreground">{modelInfo.anime.name}</span>
                        </div>
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1 max-w-xs">
                        <p className="font-semibold">{modelInfo.anime.name}</p>
                        <p className="text-xs">{modelInfo.anime.description}</p>
                        <p className="text-xs font-medium">GPU: {gpuRequirements.anime}</p>
                        <p className="text-xs text-muted-foreground">Repo: {modelInfo.anime.repo}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label 
                        htmlFor="stock-style"
                        className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${options.style === 'stock' ? 'border-accent bg-accent/10' : 'border-border'}`}
                      >
                        <RadioGroupItem id="stock-style" value="stock" className="sr-only" />
                        <div className="w-full h-16 rounded bg-gradient-to-r from-gray-400 to-gray-600 mb-2"></div>
                        <div className="text-center">
                          <span className="block">Stock</span>
                          <span className="text-xs text-muted-foreground">{modelInfo.stock.name}</span>
                        </div>
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1 max-w-xs">
                        <p className="font-semibold">{modelInfo.stock.name}</p>
                        <p className="text-xs">{modelInfo.stock.description}</p>
                        <p className="text-xs font-medium">GPU: {gpuRequirements.stock}</p>
                        <p className="text-xs text-muted-foreground">Repo: {modelInfo.stock.repo}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label 
                        htmlFor="ai-generated-style"
                        className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${options.style === 'ai-generated' ? 'border-accent bg-accent/10' : 'border-border'}`}
                      >
                        <RadioGroupItem id="ai-generated-style" value="ai-generated" className="sr-only" />
                        <div className="w-full h-16 rounded bg-gradient-to-r from-accent to-accent-foreground mb-2"></div>
                        <div className="text-center">
                          <span className="block">AI Generated</span>
                          <span className="text-xs text-muted-foreground">{modelInfo["ai-generated"].name}</span>
                        </div>
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1 max-w-xs">
                        <p className="font-semibold">{modelInfo["ai-generated"].name}</p>
                        <p className="text-xs">{modelInfo["ai-generated"].description}</p>
                        <p className="text-xs font-medium">GPU: {gpuRequirements["ai-generated"]}</p>
                        <p className="text-xs text-muted-foreground">Repo: {modelInfo["ai-generated"].repo}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label 
                        htmlFor="realistic-style"
                        className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${options.style === 'realistic' ? 'border-accent bg-accent/10' : 'border-border'}`}
                      >
                        <RadioGroupItem id="realistic-style" value="realistic" className="sr-only" />
                        <div className="w-full h-16 rounded bg-gradient-to-r from-amber-500 to-red-500 mb-2"></div>
                        <div className="text-center">
                          <span className="block">Realistic</span>
                          <span className="text-xs text-muted-foreground">{modelInfo.realistic.name}</span>
                        </div>
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1 max-w-xs">
                        <p className="font-semibold">{modelInfo.realistic.name}</p>
                        <p className="text-xs">{modelInfo.realistic.description}</p>
                        <p className="text-xs font-medium">GPU: {gpuRequirements.realistic}</p>
                        <p className="text-xs text-muted-foreground">Repo: {modelInfo.realistic.repo}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label 
                        htmlFor="ultra-realistic-style"
                        className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${options.style === 'ultra-realistic' ? 'border-accent bg-accent/10' : 'border-border'}`}
                      >
                        <RadioGroupItem id="ultra-realistic-style" value="ultra-realistic" className="sr-only" />
                        <div className="w-full h-16 rounded bg-gradient-to-r from-red-600 to-yellow-500 mb-2"></div>
                        <div className="text-center">
                          <span className="block">Ultra Realistic</span>
                          <span className="text-xs text-muted-foreground">{modelInfo["ultra-realistic"].name}</span>
                        </div>
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1 max-w-xs">
                        <p className="font-semibold">{modelInfo["ultra-realistic"].name}</p>
                        <p className="text-xs">{modelInfo["ultra-realistic"].description}</p>
                        <p className="text-xs font-medium">GPU: {gpuRequirements["ultra-realistic"]}</p>
                        <p className="text-xs text-muted-foreground">Repo: {modelInfo["ultra-realistic"].repo}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label 
                        htmlFor="unreal-style"
                        className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${options.style === 'unreal' ? 'border-accent bg-accent/10' : 'border-border'}`}
                      >
                        <RadioGroupItem id="unreal-style" value="unreal" className="sr-only" />
                        <div className="w-full h-16 rounded bg-gradient-to-r from-red-600 to-yellow-500 mb-2"></div>
                        <div className="text-center">
                          <span className="block">Unreal</span>
                          <span className="text-xs text-muted-foreground">{modelInfo.unreal.name}</span>
                        </div>
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1 max-w-xs">
                        <p className="font-semibold">{modelInfo.unreal.name}</p>
                        <p className="text-xs">{modelInfo.unreal.description}</p>
                        <p className="text-xs font-medium">GPU: {gpuRequirements.unreal}</p>
                        <p className="text-xs text-muted-foreground">Repo: {modelInfo.unreal.repo}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="audio" className="space-y-4">
            <div>
              <Label className="text-sm mb-3 block">Voice Type</Label>
              <RadioGroup
                value={options.voiceType}
                onValueChange={(value) => setOptions({...options, voiceType: value})}
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                <Label 
                  htmlFor="natural-voice"
                  className={`cursor-pointer flex items-center justify-between p-3 rounded-lg border ${options.voiceType === 'natural' ? 'border-accent bg-accent/10' : 'border-border'}`}
                >
                  <RadioGroupItem id="natural-voice" value="natural" className="sr-only" />
                  <span>Natural</span>
                </Label>
                <Label 
                  htmlFor="professional-voice"
                  className={`cursor-pointer flex items-center justify-between p-3 rounded-lg border ${options.voiceType === 'professional' ? 'border-accent bg-accent/10' : 'border-border'}`}
                >
                  <RadioGroupItem id="professional-voice" value="professional" className="sr-only" />
                  <span>Professional</span>
                </Label>
                <Label 
                  htmlFor="dramatic-voice"
                  className={`cursor-pointer flex items-center justify-between p-3 rounded-lg border ${options.voiceType === 'dramatic' ? 'border-accent bg-accent/10' : 'border-border'}`}
                >
                  <RadioGroupItem id="dramatic-voice" value="dramatic" className="sr-only" />
                  <span>Dramatic</span>
                </Label>
                <Label 
                  htmlFor="friendly-voice"
                  className={`cursor-pointer flex items-center justify-between p-3 rounded-lg border ${options.voiceType === 'friendly' ? 'border-accent bg-accent/10' : 'border-border'}`}
                >
                  <RadioGroupItem id="friendly-voice" value="friendly" className="sr-only" />
                  <span>Friendly</span>
                </Label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm block">Background Music Style</Label>
              <RadioGroup
                value={options.musicStyle}
                onValueChange={(value) => setOptions({...options, musicStyle: value as any})}
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                <Label 
                  htmlFor="upbeat-music"
                  className={`cursor-pointer flex items-center justify-between p-3 rounded-lg border ${options.musicStyle === 'upbeat' ? 'border-accent bg-accent/10' : 'border-border'}`}
                >
                  <RadioGroupItem id="upbeat-music" value="upbeat" className="sr-only" />
                  <span>Upbeat</span>
                </Label>
                <Label 
                  htmlFor="calm-music"
                  className={`cursor-pointer flex items-center justify-between p-3 rounded-lg border ${options.musicStyle === 'calm' ? 'border-accent bg-accent/10' : 'border-border'}`}
                >
                  <RadioGroupItem id="calm-music" value="calm" className="sr-only" />
                  <span>Calm</span>
                </Label>
                <Label 
                  htmlFor="dramatic-music"
                  className={`cursor-pointer flex items-center justify-between p-3 rounded-lg border ${options.musicStyle === 'dramatic' ? 'border-accent bg-accent/10' : 'border-border'}`}
                >
                  <RadioGroupItem id="dramatic-music" value="dramatic" className="sr-only" />
                  <span>Dramatic</span>
                </Label>
                <Label 
                  htmlFor="corporate-music"
                  className={`cursor-pointer flex items-center justify-between p-3 rounded-lg border ${options.musicStyle === 'corporate' ? 'border-accent bg-accent/10' : 'border-border'}`}
                >
                  <RadioGroupItem id="corporate-music" value="corporate" className="sr-only" />
                  <span>Corporate</span>
                </Label>
                <Label 
                  htmlFor="inspirational-music"
                  className={`cursor-pointer flex items-center justify-between p-3 rounded-lg border ${options.musicStyle === 'inspirational' ? 'border-accent bg-accent/10' : 'border-border'}`}
                >
                  <RadioGroupItem id="inspirational-music" value="inspirational" className="sr-only" />
                  <span>Inspirational</span>
                </Label>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Music Volume</Label>
                <span className="text-sm text-muted-foreground">70%</span>
              </div>
              <Slider defaultValue={[70]} max={100} step={5} />
            </div>
          </TabsContent>
        </Tabs>

        <Button 
          onClick={handleGenerate} 
          className="w-full mt-6 gap-2"
          disabled={isGenerating}
        >
          <Wand2 className="h-4 w-4" />
          {isGenerating ? "Generating Video..." : "Generate Video"}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center mt-2">
          Currently using placeholder videos until GPU infrastructure is ready. The selected model is: {modelInfo[options.style].name}
        </p>
      </CardContent>
    </Card>
  );
};

export default VideoGenerator;
