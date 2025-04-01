
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileVideo, Upload, ExternalLink, Beaker, ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import ModelCodeSnippets from "./ModelCodeSnippets";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface ColabVideoGeneratorProps {
  onComplete?: (result: { videoUrl: string; captionsUrl?: string; title: string }) => void;
}

const ColabVideoGenerator = ({ onComplete }: ColabVideoGeneratorProps) => {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [isColabOpen, setIsColabOpen] = useState(false);
  const { toast } = useToast();

  // Colab notebook URL with pre-configured template
  const getColabNotebookUrl = () => {
    // Base Colab URL
    let url = "https://colab.research.google.com/";
    
    // If a model is selected, we can potentially add parameters to open a pre-configured notebook
    // For now, we just open a blank notebook, but this could be enhanced to open specific templates
    return url;
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setCurrentStep(2);
  };

  const handleOpenColab = () => {
    setIsColabOpen(true);
    setCurrentStep(3);
  };

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
      
      // Reset workflow for next time
      setCurrentStep(1);
      setSelectedModel("");
      setIsColabOpen(false);
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ModelCodeSnippets onSelectSnippet={handleModelSelect} />
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="bg-accent/20 p-4 rounded-md space-y-3">
              <h3 className="font-medium">Generate Video with {selectedModel}</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Click the "Open Embedded Colab" button below</li>
                <li>Copy the {selectedModel} code into the notebook</li>
                <li>Run the notebook cells (press play button or Shift+Enter)</li>
                <li>The generated video will be saved to your Google Drive</li>
              </ol>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button 
                  variant="default" 
                  className="w-full gap-2"
                  onClick={handleOpenColab}
                >
                  <Beaker className="h-4 w-4" />
                  Open Embedded Colab
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => window.open(getColabNotebookUrl(), "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-accent/20 p-4 rounded-md space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                Almost Done!
              </h3>
              <p className="text-sm">
                After your video has finished generating in Colab:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Open your Google Drive</li>
                <li>Find your newly created video file</li>
                <li>Right-click and select "Get link"</li>
                <li>Set the sharing to "Anyone with the link"</li>
                <li>Copy the link and paste it below</li>
              </ol>
              
              <div className="space-y-3 pt-2">
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
                  <Label htmlFor="video-url">Video URL from Google Drive</Label>
                  <Input
                    id="video-url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the shareable link to your Colab-generated video
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
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-accent" />
            Google Colab Video Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between mb-2">
            <Badge variant={currentStep >= 1 ? "default" : "outline"} className="flex gap-1">
              <span>1.</span> Select Model
            </Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <Badge variant={currentStep >= 2 ? "default" : "outline"} className="flex gap-1">
              <span>2.</span> Run in Colab
            </Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <Badge variant={currentStep >= 3 ? "default" : "outline"} className="flex gap-1">
              <span>3.</span> Import Video
            </Badge>
          </div>
          
          <Separator className="my-2" />
          
          {renderStepContent()}

          {currentStep > 1 && (
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </Button>
          )}
        </CardContent>
      </Card>

      <Sheet open={isColabOpen} onOpenChange={setIsColabOpen}>
        <SheetContent side="bottom" className="h-[80vh] w-full p-0 sm:max-w-none">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-accent" />
              Google Colab - {selectedModel}
            </SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100%-60px)] w-full">
            <iframe 
              src={getColabNotebookUrl()} 
              className="w-full h-full" 
              title="Google Colab Notebook"
              allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ColabVideoGenerator;
