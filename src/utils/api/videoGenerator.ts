
import { VideoGenerationOptions } from "@/types/video";
import { supabase } from "@/integrations/supabase/client";

// API keys for stock footage services
const API_KEYS = {
  pixabay: "18894960-eeef8808086099125ac0a2e65",
  unsplash: "SuKAF6VfUn-Mbzsk8jy5jtVleOwMG5wyj4lmEriVV0g",
  flickr: "ce68a614b010c2f08d26a88fa05c1e1e",
  pexels: "NB5e7YZoqmI5LScSgIm5xDMTYDdQ7RFzqwmwxdRuexPQDHThpbti1ioE"
};

// This implementation prepares for integration with open-source generation tools
// It will connect to GPU-powered services when they become available
export const generateVideo = async (
  title: string,
  script: string,
  options: VideoGenerationOptions
): Promise<{ videoUrl: string, captionsUrl: string }> => {
  try {
    console.log("Generating video with options:", options);
    
    // First, generate captions from the script
    const captionsResponse = await generateCaptions(script);
    
    // Then, generate the actual video using the selected AI model
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
        style: options?.style || 'ai-generated',
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

// Function to create videos from stock footage with real API integration
export const generateStockFootageVideo = async (
  title: string, 
  script: string,
  options: {
    stockSource: "pixabay" | "unsplash" | "flickr" | "pexels" | "mixed",
    duration: number, // Target duration in minutes
    musicStyle?: string,
    captionsEnabled?: boolean
  }
): Promise<{ videoUrl: string, captionsUrl: string, videoClips?: string[] }> => {
  try {
    console.log("Generating stock footage video:", title);
    console.log("Using stock source:", options.stockSource);
    console.log("Target duration:", options.duration, "minutes");
    
    // Generate captions for the script
    const captionsResponse = await generateCaptions(script);
    
    // Call the stock-video-generator edge function
    const { data, error } = await supabase.functions.invoke("stock-video-generator", {
      body: {
        title,
        script,
        stockSource: options.stockSource,
        targetDuration: options.duration,
        musicStyle: options.musicStyle || "inspirational",
        captionsEnabled: options.captionsEnabled !== false,
        captionsUrl: captionsResponse.captionsUrl
      }
    });
    
    if (error) throw error;
    
    console.log("Stock video generation complete:", data);
    
    return {
      videoUrl: data.videoUrl,
      captionsUrl: captionsResponse.captionsUrl,
      videoClips: data.processingDetails?.videos || []
    };
  } catch (error) {
    console.error("Error generating stock footage video:", error);
    throw new Error("Failed to generate stock footage video: " + (error as Error).message);
  }
};
