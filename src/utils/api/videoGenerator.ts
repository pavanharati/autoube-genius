
import { VideoGenerationOptions } from "@/types/video";
import { supabase } from "@/integrations/supabase/client";

// This implementation uses the open-source generation tools
// It integrates with our Supabase edge functions for video generation
export const generateVideo = async (
  title: string,
  script: string,
  options: VideoGenerationOptions
): Promise<{ videoUrl: string, captionsUrl: string }> => {
  try {
    console.log("Generating video with options:", options);
    
    // First, generate captions from the script
    const captionsResponse = await generateCaptions(script);
    
    // Then, generate the actual video
    const { data, error } = await supabase.functions.invoke("generate-video", {
      body: {
        title,
        script,
        options,
        captionsUrl: captionsResponse.captionsUrl
      }
    });

    if (error) throw error;

    console.log("Video generation complete:", data);
    
    return {
      videoUrl: data.videoUrl,
      captionsUrl: captionsResponse.captionsUrl
    };
  } catch (error) {
    console.error("Error generating video:", error);
    throw new Error("Failed to generate video: " + (error as Error).message);
  }
};

// Function to generate captions in WebVTT format
const generateCaptions = async (script: string): Promise<{ captionsUrl: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke("generate-captions", {
      body: { script }
    });
    
    if (error) throw error;
    
    return { captionsUrl: data.captionsUrl };
  } catch (error) {
    console.error("Error generating captions:", error);
    throw new Error("Failed to generate captions");
  }
};

// Function to analyze a video from a URL (for scraping content)
export const analyzeVideoFromUrl = async (videoUrl: string): Promise<{
  title: string;
  script: string;
  thumbnailUrl: string;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke("analyze-video", {
      body: { videoUrl }
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error analyzing video:", error);
    throw new Error("Failed to analyze video");
  }
};

// New function to convert text directly to video without requiring a script
export const textToVideo = async (
  prompt: string,
  options?: Partial<VideoGenerationOptions>
): Promise<{ videoUrl: string, captionsUrl: string, title: string }> => {
  try {
    console.log("Converting text to video:", prompt);
    
    // Generate a script from the prompt text
    const { data: scriptData, error: scriptError } = await supabase.functions.invoke("generate-script", {
      body: {
        topic: prompt,
        style: options?.style === 'entertaining' ? 'entertaining' : 'informative',
        targetLength: "medium"
      }
    });
    
    if (scriptError) throw scriptError;
    
    const script = scriptData.script;
    const title = prompt.length > 50 ? prompt.substring(0, 50) + "..." : prompt;
    
    // Now generate the video with the script
    const defaultOptions: VideoGenerationOptions = {
      style: "ai-generated",
      musicStyle: "inspirational",
      captionsEnabled: true,
      voiceType: "natural"
    };
    
    const videoOptions = { ...defaultOptions, ...options };
    
    const videoResult = await generateVideo(title, script, videoOptions);
    
    return {
      ...videoResult,
      title
    };
  } catch (error) {
    console.error("Error in text to video conversion:", error);
    throw new Error("Failed to convert text to video: " + (error as Error).message);
  }
};
