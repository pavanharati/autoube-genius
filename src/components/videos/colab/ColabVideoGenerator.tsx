
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileVideo, Upload, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import ModelCodeSnippets from "./ModelCodeSnippets";

interface ColabVideoGeneratorProps {
  onComplete?: (result: { videoUrl: string; captionsUrl?: string; title: string }) => void;
}

const ColabVideoGenerator = ({ onComplete }: ColabVideoGeneratorProps) => {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  // Colab notebook URL that creates a blank notebook
  const colabNotebookUrl = "https://colab.research.google.com/";

  const handleImportVideo = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your video",
        variant: "destructive",
      });
      return;
    }

    if (!videoUrl.trim() || !videoUrl.startsWith("http")) {
      toast({
        title: "Valid URL Required",
        description: "Please enter a valid video URL",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onComplete) {
        onComplete({
          videoUrl,
          title,
        });
      }
      
      toast({
        title: "Success",
        description: "Video imported successfully!",
      });
    } catch (error) {
      console.error("Error importing video:", error);
      toast({
        title: "Error",
        description: "Failed to import video",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileVideo className="h-5 w-5 text-accent" />
          Google Colab Video Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-accent/20 p-4 rounded-md space-y-3">
          <h3 className="font-medium">Generate AI Videos with Google Colab's Free GPU</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click the button below to open Google Colab</li>
            <li>Copy your chosen model code (from the Code Snippets tab) into the notebook</li>
            <li>Run the notebook cells (press play button or Shift+Enter)</li>
            <li>The generated video will be saved to your Google Drive</li>
            <li>Get a shareable link from Google Drive and paste it below</li>
          </ol>
          
          <Button 
            variant="outline" 
            className="mt-2 gap-2"
            onClick={() => window.open(colabNotebookUrl, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
            Open Google Colab
          </Button>
        </div>
        
        <Tabs defaultValue="code">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="code">Code Snippets</TabsTrigger>
            <TabsTrigger value="import">Import Video</TabsTrigger>
          </TabsList>
          
          <TabsContent value="code" className="pt-4">
            <ModelCodeSnippets />
          </TabsContent>
          
          <TabsContent value="import" className="pt-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="video-title">Video Title</Label>
                <Input
                  id="video-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your video"
                />
              </div>
              
              <div>
                <Label htmlFor="video-url">Video URL</Label>
                <Input
                  id="video-url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter a public URL where your Colab-generated video is hosted (Google Drive, YouTube, etc.)
                </p>
              </div>
              
              <Button 
                onClick={handleImportVideo} 
                disabled={isImporting}
                className="w-full gap-2"
              >
                {isImporting ? (
                  "Importing..."
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Import Video
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ColabVideoGenerator;
