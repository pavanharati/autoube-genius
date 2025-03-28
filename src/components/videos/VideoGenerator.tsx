
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Wand2, Music, Video, Lightbulb, FileText } from "lucide-react";
import { VideoGenerationOptions } from "@/types/video";
import { Slider } from "@/components/ui/slider";

interface VideoGeneratorProps {
  onGenerate: (title: string, script: string, options: VideoGenerationOptions) => Promise<void>;
  initialScript?: string;
  initialTitle?: string;
  isGenerating?: boolean;
}

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
              <Label className="text-sm mb-3 block">Video Style</Label>
              <RadioGroup
                value={options.style}
                onValueChange={(value) => setOptions({...options, style: value as any})}
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                <Label 
                  htmlFor="cartoon-style"
                  className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${options.style === 'cartoon' ? 'border-accent bg-accent/10' : 'border-border'}`}
                >
                  <RadioGroupItem id="cartoon-style" value="cartoon" className="sr-only" />
                  <div className="w-full h-16 rounded bg-gradient-to-r from-blue-400 to-green-400 mb-2"></div>
                  <span>Cartoon</span>
                </Label>
                <Label 
                  htmlFor="anime-style"
                  className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${options.style === 'anime' ? 'border-accent bg-accent/10' : 'border-border'}`}
                >
                  <RadioGroupItem id="anime-style" value="anime" className="sr-only" />
                  <div className="w-full h-16 rounded bg-gradient-to-r from-pink-400 to-purple-400 mb-2"></div>
                  <span>Anime</span>
                </Label>
                <Label 
                  htmlFor="stock-style"
                  className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${options.style === 'stock' ? 'border-accent bg-accent/10' : 'border-border'}`}
                >
                  <RadioGroupItem id="stock-style" value="stock" className="sr-only" />
                  <div className="w-full h-16 rounded bg-gradient-to-r from-gray-400 to-gray-600 mb-2"></div>
                  <span>Stock</span>
                </Label>
                <Label 
                  htmlFor="ai-generated-style"
                  className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${options.style === 'ai-generated' ? 'border-accent bg-accent/10' : 'border-border'}`}
                >
                  <RadioGroupItem id="ai-generated-style" value="ai-generated" className="sr-only" />
                  <div className="w-full h-16 rounded bg-gradient-to-r from-accent to-accent-foreground mb-2"></div>
                  <span>AI Generated</span>
                </Label>
                <Label 
                  htmlFor="realistic-style"
                  className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${options.style === 'realistic' ? 'border-accent bg-accent/10' : 'border-border'}`}
                >
                  <RadioGroupItem id="realistic-style" value="realistic" className="sr-only" />
                  <div className="w-full h-16 rounded bg-gradient-to-r from-amber-500 to-red-500 mb-2"></div>
                  <span>Realistic</span>
                </Label>
                <Label 
                  htmlFor="ultra-realistic-style"
                  className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${options.style === 'ultra-realistic' ? 'border-accent bg-accent/10' : 'border-border'}`}
                >
                  <RadioGroupItem id="ultra-realistic-style" value="ultra-realistic" className="sr-only" />
                  <div className="w-full h-16 rounded bg-gradient-to-r from-red-600 to-yellow-500 mb-2"></div>
                  <span>Ultra Realistic</span>
                </Label>
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
      </CardContent>
    </Card>
  );
};

export default VideoGenerator;
