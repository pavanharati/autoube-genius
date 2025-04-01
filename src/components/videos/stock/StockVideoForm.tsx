
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Film, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

interface StockVideoFormProps {
  title: string;
  setTitle: (title: string) => void;
  script: string;
  setScript: (script: string) => void;
  stockSource: "pixabay" | "unsplash" | "flickr" | "pexels" | "mixed";
  setStockSource: (source: "pixabay" | "unsplash" | "flickr" | "pexels" | "mixed") => void;
  targetDuration: number;
  setTargetDuration: (duration: number) => void;
  musicStyle: string;
  setMusicStyle: (style: string) => void;
  captionsEnabled: boolean;
  setCaptionsEnabled: (enabled: boolean) => void;
  isGenerating: boolean;
  generationProgress: number;
  handleGenerate: () => void;
}

const StockVideoForm = ({
  title,
  setTitle,
  script,
  setScript,
  stockSource,
  setStockSource,
  targetDuration,
  setTargetDuration,
  musicStyle,
  setMusicStyle,
  captionsEnabled,
  setCaptionsEnabled,
  isGenerating,
  generationProgress,
  handleGenerate
}: StockVideoFormProps) => {
  
  return (
    <>
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
            Generating Stock Video... {Math.round(generationProgress)}%
          </>
        ) : (
          <>
            <Film className="h-4 w-4" />
            Generate Real Stock Video
          </>
        )}
      </Button>
      
      {isGenerating && (
        <div className="text-center text-sm text-muted-foreground mt-2">
          <Progress value={generationProgress} className="h-2 mb-2" />
          <p>Finding and composing stock footage takes time.</p>
          <p>For a {targetDuration} minute video, this could take 3-5 minutes.</p>
        </div>
      )}
    </>
  );
};

export default StockVideoForm;
