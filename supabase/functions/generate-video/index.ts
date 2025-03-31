
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configurations for different video styles
const styleConfigs = {
  'cartoon': {
    model: 'stabilityai/stable-video-diffusion',
    params: {
      motion_bucket_id: 20,
      fps: 24,
      style: 'cartoon',
    }
  },
  'anime': {
    model: 'stabilityai/stable-video-diffusion',
    params: {
      motion_bucket_id: 20,
      fps: 24,
      style: 'anime',
    }
  },
  'stock': {
    model: 'stabilityai/stable-video-diffusion',
    params: {
      motion_bucket_id: 127,
      fps: 24,
      style: 'naturalistic',
    }
  },
  'realistic': {
    model: 'stabilityai/stable-video-diffusion',
    params: {
      motion_bucket_id: 127,
      fps: 24,
      style: 'cinematic',
    }
  },
  'ultra-realistic': {
    model: 'stabilityai/stable-video-diffusion',
    params: {
      motion_bucket_id: 127,
      fps: 30,
      style: 'cinematic',
    }
  },
  'ai-generated': {
    model: 'stability/stable-video-diffusion-img2vid-xt',
    params: {
      fps: 24,
      num_inference_steps: 25,
    }
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, script, options, captionsUrl } = await req.json();
    
    if (!title || !script) {
      throw new Error("Title and script are required");
    }

    console.log(`Generating video for: ${title}`);
    console.log(`Using style: ${options.style}`);
    console.log(`Using music style: ${options.musicStyle}`);
    console.log(`Using voice type: ${options.voiceType || 'default'}`);
    console.log(`Captions enabled: ${options.captionsEnabled}`);
    
    // Convert script to a set of key scenes to visualize
    const scenes = await generateScenesFromScript(script, options.style);
    
    // Generate video from scenes using the specified style
    const videoUrl = await generateAiVideo(scenes, options.style);
    
    // Add audio track with voiceover and background music
    const finalVideoUrl = await addAudioToVideo(videoUrl, script, options.voiceType, options.musicStyle);
    
    // Text analysis for additional metadata
    const textAnalysis = analyzeText(script);

    return new Response(
      JSON.stringify({ 
        videoUrl: finalVideoUrl,
        captionsUrl: options.captionsEnabled ? captionsUrl : null,
        title,
        processing: {
          status: "completed",
          duration: estimateVideoDuration(script),
          textSentiment: textAnalysis.sentiment,
          dominantTopics: textAnalysis.topics
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error generating video:', error);
    
    // Fallback to a sample video for demonstration when in development
    const sampleVideoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        videoUrl: sampleVideoUrl, // Fallback sample video
        captionsUrl: null,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});

// Function to generate scenes from the script
async function generateScenesFromScript(script: string, style: string): Promise<string[]> {
  // In a production environment, this would use an AI model to generate visual scenes
  // For now, we'll implement a basic scene extraction
  const sentences = script.split(/[.!?]/).filter(sentence => sentence.trim().length > 0);
  const scenes = sentences.map(sentence => sentence.trim());
  
  console.log(`Generated ${scenes.length} scenes from script`);
  
  return scenes;
}

// Function to generate AI video from scenes
async function generateAiVideo(scenes: string[], style: string): Promise<string> {
  try {
    // This is where we would integrate with our video generation model
    // Since we don't have access to the actual generation API in this edge function,
    // we'll simulate the process and return a sample URL
    
    const styleConfig = styleConfigs[style] || styleConfigs['ai-generated'];
    console.log(`Using model: ${styleConfig.model} with style configuration:`, styleConfig.params);
    
    // In a production environment, this would be an actual API call
    // const response = await fetch('https://api.videoai.example/generate', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    //   body: JSON.stringify({
    //     model: styleConfig.model,
    //     scenes: scenes,
    //     params: styleConfig.params
    //   })
    // });
    
    // For now, we'll return a mock video URL
    // In production, this would be the URL of the generated video
    const mockVideoUrls = {
      'cartoon': "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      'anime': "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      'stock': "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      'realistic': "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      'ultra-realistic': "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      'ai-generated': "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
    };
    
    return mockVideoUrls[style] || mockVideoUrls['ai-generated'];
  } catch (error) {
    console.error('Error in AI video generation:', error);
    throw new Error('Failed to generate AI video');
  }
}

// Function to add audio to video
async function addAudioToVideo(
  videoUrl: string, 
  script: string, 
  voiceType: string = 'natural', 
  musicStyle: string = 'inspirational'
): Promise<string> {
  // In a production environment, this would:
  // 1. Generate voiceover using a TTS service
  // 2. Select appropriate background music
  // 3. Mix the audio with the video
  
  console.log(`Adding audio to video: voice type=${voiceType}, music style=${musicStyle}`);
  
  // For now, we return the original video URL
  return videoUrl;
}

// Helper to estimate video duration based on script length
function estimateVideoDuration(script: string): string {
  // Rough estimate: average speaking rate is about 150 words per minute
  const wordCount = script.split(/\s+/).length;
  const durationInMinutes = wordCount / 150;
  const minutes = Math.floor(durationInMinutes);
  const seconds = Math.floor((durationInMinutes - minutes) * 60);
  
  return `00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Simple text analysis function to mimic AI analysis of script content
function analyzeText(text: string) {
  // This is a simplified mock of what would be a more sophisticated AI analysis
  const lowerText = text.toLowerCase();
  let sentiment = "neutral";
  
  // Simple sentiment analysis
  const positiveWords = ["happy", "great", "excellent", "good", "best", "wonderful", "amazing"];
  const negativeWords = ["bad", "terrible", "worst", "horrible", "sad", "unfortunate"];
  
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) sentiment = "positive";
  else if (negativeCount > positiveCount) sentiment = "negative";
  
  // Simple topic extraction
  const topics = [];
  const topicKeywords = {
    "technology": ["tech", "computer", "digital", "software", "hardware", "internet", "app"],
    "business": ["business", "company", "finance", "market", "industry", "startup"],
    "health": ["health", "medical", "fitness", "wellness", "exercise", "diet"],
    "entertainment": ["movie", "music", "game", "film", "entertainment", "actor", "artist"],
    "science": ["science", "research", "study", "discovery", "scientist", "lab"]
  };
  
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      topics.push(topic);
    }
  }
  
  return {
    sentiment,
    topics: topics.length > 0 ? topics : ["general"]
  };
}
