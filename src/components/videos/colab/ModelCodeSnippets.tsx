
import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const CodeSnippets = {
  deepDream: `!git clone https://github.com/google/deepdream.git
%cd deepdream
!pip install -r requirements.txt

import numpy as np
import tensorflow as tf
from IPython.display import clear_output, Image, display
import PIL.Image
import os

# Download sample image
!wget -O input.jpg https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/1121098-pink-nature-backgrounds-1920x1080-for-ios.jpg/1200px-1121098-pink-nature-backgrounds-1920x1080-for-ios.jpg

# Generate DeepDream frames
frames = []
num_frames = 30
for i in range(num_frames):
    # Process code goes here
    
# Create video from frames
!pip install moviepy
from moviepy.editor import ImageSequenceClip
clip = ImageSequenceClip(frames, fps=24)
clip.write_videofile("deepdream_video.mp4")

# Upload to Google Drive
from google.colab import drive
drive.mount('/content/drive')
!cp deepdream_video.mp4 /content/drive/My\\ Drive/
print("Video saved to your Google Drive!")`,

  t2v: `!pip install git+https://github.com/huggingface/diffusers.git
!pip install transformers accelerate safetensors gradio

import torch
from diffusers import DiffusionPipeline, DPMSolverMultistepScheduler
from diffusers.utils import export_to_video

# Load model
pipe = DiffusionPipeline.from_pretrained("damo-vilab/text-to-video-ms-1.7b", torch_dtype=torch.float16, variant="fp16")
pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)
pipe.enable_model_cpu_offload()

# Generate video
prompt = "A panda eating bamboo on a rock"
video_frames = pipe(prompt, num_inference_steps=25, num_frames=24).frames
export_to_video(video_frames, "text2video_output.mp4")

# Upload to Google Drive
from google.colab import drive
drive.mount('/content/drive')
!cp text2video_output.mp4 /content/drive/My\\ Drive/
print("Video saved to your Google Drive!")`,

  firstOrderMotion: `!git clone https://github.com/AliaksandrSiarohin/first-order-model
%cd first-order-model
!pip install -r requirements.txt

# Download checkpoints
!wget -O vox-cpk.pth.tar https://drive.google.com/uc?id=1PyQJmkdCsAkOYwUyaj_l-l0as-iLDgeH

# Upload source image
from google.colab import files
uploaded = files.upload()  # Will prompt you to upload a file

# Upload driving video
driving_video = files.upload()  # Will prompt you to upload another file

# Run the model
import imageio
import numpy as np
import matplotlib.pyplot as plt
import torch
from skimage.transform import resize
from IPython.display import HTML
from base64 import b64encode
from demo import load_checkpoints, make_animation

source_image = list(uploaded.keys())[0]
driving_video = list(driving_video.keys())[0]

generator, kp_detector = load_checkpoints('vox-cpk.pth.tar', device='cuda')

source = imageio.imread(source_image)
driving = imageio.mimread(driving_video)

# Resize if needed
source = resize(source, (256, 256))[..., :3]
driving = [resize(frame, (256, 256))[..., :3] for frame in driving]

# Generate video
predictions = make_animation(source, driving, generator, kp_detector, relative=True)
imageio.mimsave('animated_output.mp4', [np.array(255 * frame) for frame in predictions], fps=30)

# Upload to Google Drive
from google.colab import drive
drive.mount('/content/drive')
!cp animated_output.mp4 /content/drive/My\\ Drive/
print("Video saved to your Google Drive!")`,

  stableDiffusion: `!git clone https://github.com/CompVis/stable-diffusion.git
%cd stable-diffusion
!pip install -r requirements.txt

import torch
from torchvision import transforms
import torch.nn.functional as F
from diffusers import StableDiffusionPipeline
import os
from PIL import Image
import numpy as np

# Load model
model_id = "CompVis/stable-diffusion-v1-4"
pipe = StableDiffusionPipeline.from_pretrained(model_id, use_auth_token=True)
pipe = pipe.to("cuda")

# Generate frames for video
prompt = "A beautiful sunset over mountains, photorealistic"
num_frames = 30
frames = []

for i in range(num_frames):
    # Vary seed or prompt slightly for each frame
    seed = 1000 + i
    generator = torch.Generator("cuda").manual_seed(seed)
    image = pipe(prompt, generator=generator).images[0]
    frames.append(np.array(image))

# Create video from frames
!pip install moviepy
from moviepy.editor import ImageSequenceClip
clip = ImageSequenceClip(frames, fps=24)
clip.write_videofile("stable_diffusion_video.mp4")

# Upload to Google Drive
from google.colab import drive
drive.mount('/content/drive')
!cp stable_diffusion_video.mp4 /content/drive/My\\ Drive/
print("Video saved to your Google Drive!")`
};

interface ModelCodeSnippetsProps {
  onSelectSnippet?: (code: string) => void;
}

const ModelNames = {
  deepDream: "DeepDream Video Generator",
  t2v: "Text-to-Video Generator",
  firstOrderMotion: "First Order Motion Model",
  stableDiffusion: "Stable Diffusion"
};

const ModelDescriptions = {
  deepDream: "Create trippy, dream-like visual effects and animations",
  t2v: "Generate videos directly from text descriptions",
  firstOrderMotion: "Animate still images using motion from a driving video",
  stableDiffusion: "Create high-quality video frames with stable diffusion"
};

const ModelCodeSnippets = ({ onSelectSnippet }: ModelCodeSnippetsProps) => {
  const [selectedModel, setSelectedModel] = useState<string>("deepDream");
  const [viewMode, setViewMode] = useState<"grid" | "code">("grid");
  const { toast } = useToast();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CodeSnippets[selectedModel as keyof typeof CodeSnippets]);
    toast({
      title: "Code Copied",
      description: "The code snippet has been copied to your clipboard",
    });
  };

  const handleModelClick = (modelKey: string) => {
    setSelectedModel(modelKey);
    if (viewMode === "grid" && onSelectSnippet) {
      onSelectSnippet(modelKey);
    } else {
      setViewMode("code");
    }
  };

  if (viewMode === "grid") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(Object.keys(ModelNames) as Array<keyof typeof ModelNames>).map((modelKey) => (
            <Card 
              key={modelKey} 
              className="cursor-pointer hover:border-accent transition-colors"
              onClick={() => handleModelClick(modelKey)}
            >
              <CardContent className="p-4">
                <h3 className="font-medium">{ModelNames[modelKey]}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {ModelDescriptions[modelKey]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Select a model to start generating your video
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Select 
          value={selectedModel} 
          onValueChange={setSelectedModel}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deepDream">DeepDream Video Generator</SelectItem>
            <SelectItem value="t2v">Text-to-Video Generator</SelectItem>
            <SelectItem value="firstOrderMotion">First Order Motion Model</SelectItem>
            <SelectItem value="stableDiffusion">Stable Diffusion</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative">
        <Textarea
          className="font-mono text-xs h-60 pr-12"
          value={CodeSnippets[selectedModel as keyof typeof CodeSnippets]}
          readOnly
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={handleCopyCode}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setViewMode("grid")}
        >
          Back to Models
        </Button>
        
        {onSelectSnippet && (
          <Button
            variant="default"
            onClick={() => onSelectSnippet(selectedModel)}
          >
            Use This Model
          </Button>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Run this code in Google Colab to generate a video using the {ModelNames[selectedModel as keyof typeof ModelNames]} model,
        then upload it to your videos collection.
      </p>
    </div>
  );
};

export default ModelCodeSnippets;
