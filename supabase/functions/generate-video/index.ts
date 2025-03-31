
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Model configurations for different video styles
const modelConfigurations = {
  'cartoon': {
    model: 'CogVideo',  // THUDM/CogVideo
    params: {
      num_inference_steps: 50,
      seed: 42,
      style: 'cartoon',
    }
  },
  'anime': {
    model: 'TuneAVideo',  // showlab/Tune-A-Video
    params: {
      num_inference_steps: 50,
      guidance_scale: 7.5,
      style: 'anime',
    }
  },
  'stock': {
    model: 'VGen',  // ali-vilab/VGen
    params: {
      num_inference_steps: 30,
      fps: 24,
      resolution: 256,
    }
  },
  'realistic': {
    model: 'Mora',  // lichao-sun/Mora
    params: {
      num_inference_steps: 50,
      guidance_scale: 7.5,
      fps: 24,
    }
  },
  'ultra-realistic': {
    model: 'OpenSora',  // hpcaitech/Open-Sora
    params: {
      num_inference_steps: 50,
      guidance_scale: 9.0,
      fps: 30,
    }
  },
  'ai-generated': {
    model: 'LTX-Video',  // Lightricks/LTX-Video
    params: {
      num_inference_steps: 30,
      guidance_scale: 7.0,
      fps: 24,
    }
  },
  'unreal': {
    model: 'StepVideo',  // stepfun-ai/Step-Video-TI2V
    params: {
      num_inference_steps: 50,
      guidance_scale: 7.5,
      fps: 30,
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
    
    // Get the selected model configuration
    const modelConfig = modelConfigurations[options.style] || modelConfigurations['ai-generated'];
    console.log(`Using model: ${modelConfig.model} with parameters:`, modelConfig.params);
    
    // Convert script to scenes for visualization
    const scenes = await generateScenesFromScript(script, options.style);
    
    // Generate video using the selected AI model
    // Note: In a production environment, this would involve more complex API calls
    // to the actual AI video generation services
    try {
      // For now, we'll simulate the AI video generation process using sample videos
      // This would be replaced with actual API calls to the chosen model
      const videoUrl = await generateAIVideo(scenes, options.style, modelConfig);
      
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
            model: modelConfig.model,
            textSentiment: textAnalysis.sentiment,
            dominantTopics: textAnalysis.topics
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    } catch (generationError) {
      console.error('Error in AI video generation:', generationError);
      throw new Error(`AI video generation failed: ${generationError.message}`);
    }
  } catch (error) {
    console.error('Error generating video:', error);
    
    // We need to return a proper error response
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: "failed"
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

// Function to generate AI video from scenes using the selected model
async function generateAIVideo(scenes: string[], style: string, modelConfig: any): Promise<string> {
  try {
    // This is where we would integrate with the actual AI video generation model
    // Each model would have different API parameters and endpoints
    
    console.log(`Using model: ${modelConfig.model} for style ${style}`);
    
    // For now, we'll use sample videos as placeholders
    // In production, this would be replaced with actual API calls
    const mockVideoUrls = {
      'cartoon': "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      'anime': "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      'stock': "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      'realistic': "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      'ultra-realistic': "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      'ai-generated': "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      'unreal': "https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4"
    };
    
    // IMPORTANT: This is a placeholder for demonstration purposes
    // In a real implementation, this would call the specific AI model's API
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
