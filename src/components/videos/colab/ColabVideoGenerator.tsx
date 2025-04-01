
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileVideo, Upload, ExternalLink, Beaker, ArrowRight, CheckCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import ModelCodeSnippets from "./ModelCodeSnippets";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ColabVideoGeneratorProps {
  onComplete?: (result: { videoUrl: string; captionsUrl?: string; title: string }) => void;
}

const ColabVideoGenerator = ({ onComplete }: ColabVideoGeneratorProps) => {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedModel, setSelectedModel] = useState<string>("");
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
    window.open(getColabNotebookUrl(), "_blank");
    setCurrentStep(3);
    
    toast({
      title: "Google Colab Opened",
      description: "Continue your workflow in the Colab tab and come back when your video is ready.",
    });
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
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-500" />
              <p className="text-sm text-muted-foreground">
                You can use Google Colab's free GPU resources to generate AI videos.
                Select a method below to get started.
              </p>
            </div>
            <Tabs defaultValue="premade">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="premade">Pre-made Templates</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Method</TabsTrigger>
              </TabsList>
              
              <TabsContent value="premade" className="space-y-4">
                <ModelCodeSnippets onSelectSnippet={handleModelSelect} />
              </TabsContent>
              
              <TabsContent value="advanced">
                <div className="space-y-4 bg-accent/10 p-4 rounded-md">
                  <h3 className="text-lg font-medium">Step-by-Step: AI Video Generation for Free</h3>
                  <p className="text-sm">
                    Follow these instructions to use Google Colab's free GPU resources and open-source
                    models to generate AI videos. Click each step to expand.
                  </p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="step1">
                      <AccordionTrigger>
                        Step 1: Set Up Google Colab with Free GPU
                      </AccordionTrigger>
                      <AccordionContent className="text-sm">
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Open Google Colab</li>
                          <li>Go to Runtime → Change runtime type → Select GPU</li>
                          <li>Run this to check if GPU is active:</li>
                        </ol>
                        <pre className="bg-secondary/50 p-2 rounded-md my-2 text-xs overflow-auto">
                          import torch{'\n'}
                          print("GPU Available:", torch.cuda.is_available())
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="step2">
                      <AccordionTrigger>
                        Step 2: Install Dependencies & AI Model
                      </AccordionTrigger>
                      <AccordionContent className="text-sm">
                        <p>Run this in Colab to install Stable Video Diffusion:</p>
                        <pre className="bg-secondary/50 p-2 rounded-md my-2 text-xs overflow-auto">
                          !pip install diffusers transformers accelerate torch torchvision torchaudio ffmpeg-python{'\n'}
                          !pip install imageio[ffmpeg] moviepy
                        </pre>
                        <p className="mt-2">Now, download the AI video model (Stable Video Diffusion):</p>
                        <pre className="bg-secondary/50 p-2 rounded-md my-2 text-xs overflow-auto">
                          from diffusers import StableVideoDiffusionPipeline{'\n'}
                          import torch{'\n\n'}
                          model_id = "stabilityai/stable-video-diffusion-img2vid"{'\n'}
                          pipe = StableVideoDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16){'\n'}
                          pipe.to("cuda")
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="step3">
                      <AccordionTrigger>
                        Step 3: Generate AI Video from an Image
                      </AccordionTrigger>
                      <AccordionContent className="text-sm">
                        <pre className="bg-secondary/50 p-2 rounded-md my-2 text-xs overflow-auto">
                          from PIL import Image{'\n\n'}
                          image = Image.open("your_image.png")  # Replace with any image from Google Drive{'\n'}
                          video = pipe(image, num_frames=24)  # 24 frames for 1 second of video{'\n\n'}
                          video.save("output.mp4")
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="step4">
                      <AccordionTrigger>
                        Step 4: Add AI Voiceover (Text-to-Speech)
                      </AccordionTrigger>
                      <AccordionContent className="text-sm">
                        <pre className="bg-secondary/50 p-2 rounded-md my-2 text-xs overflow-auto">
                          !pip install TTS{'\n'}
                          from TTS.api import TTS{'\n\n'}
                          tts = TTS("tts_models/en/ljspeech/tacotron2-DDC", gpu=True){'\n'}
                          tts.tts_to_file(text="This is your AI-generated video", file_path="voiceover.wav")
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="step5">
                      <AccordionTrigger>
                        Step 5: Merge AI Video & Voiceover
                      </AccordionTrigger>
                      <AccordionContent className="text-sm">
                        <pre className="bg-secondary/50 p-2 rounded-md my-2 text-xs overflow-auto">
                          !ffmpeg -i output.mp4 -i voiceover.wav -c:v copy -c:a aac final_video.mp4
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="step6">
                      <AccordionTrigger>
                        Step 6: Save to Google Drive & Import
                      </AccordionTrigger>
                      <AccordionContent className="text-sm">
                        <pre className="bg-secondary/50 p-2 rounded-md my-2 text-xs overflow-auto">
                          from google.colab import drive{'\n'}
                          drive.mount('/content/drive'){'\n\n'}
                          # Copy the final video to Google Drive{'\n'}
                          !cp final_video.mp4 /content/drive/My\ Drive/
                        </pre>
                        <p className="mt-2">After running the code above:</p>
                        <ol className="list-decimal list-inside space-y-2">
                          <li>Open your Google Drive</li>
                          <li>Right-click on the video and select "Get link"</li>
                          <li>Set to "Anyone with the link"</li>
                          <li>Copy the link and paste it in the import step here</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <Button 
                    variant="default" 
                    className="w-full mt-2"
                    onClick={handleOpenColab}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Google Colab
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="bg-accent/20 p-4 rounded-md space-y-3">
              <h3 className="font-medium">Generate Video with {selectedModel}</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Click the "Open Google Colab" button below</li>
                <li>Copy the {selectedModel} code into the notebook</li>
                <li>Run the notebook cells (press play button or Shift+Enter)</li>
                <li>The generated video will be saved to your Google Drive</li>
              </ol>
              
              <Button 
                variant="default" 
                className="w-full gap-2"
                onClick={handleOpenColab}
              >
                <ExternalLink className="h-4 w-4" />
                Open Google Colab
              </Button>
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
            <span>1.</span> Select Method
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
  );
};

export default ColabVideoGenerator;
