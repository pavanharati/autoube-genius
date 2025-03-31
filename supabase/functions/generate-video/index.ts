
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    
    // In a production environment, here you would:
    // 1. Generate a voiceover using a text-to-speech service
    // 2. Generate visuals based on the script and chosen style
    // 3. Combine audio and visuals into a video
    // 4. Add captions if requested
    
    // Simulated processing time based on script length and complexity
    const processingTime = Math.min(5000, script.length * 5);
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // Select an appropriate video style based on the options
    let videoUrl;
    let processingDuration;
    
    switch (options.style) {
      case 'cartoon':
        videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4";
        processingDuration = "00:02:15";
        break;
      case 'anime':
        videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4";
        processingDuration = "00:01:57";
        break;
      case 'stock':
        videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
        processingDuration = "00:03:20";
        break;
      case 'realistic':
      case 'ultra-realistic':
        videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        processingDuration = "00:04:30";
        break;
      case 'ai-generated':
      default:
        videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";
        processingDuration = "00:03:45";
    }
    
    // For text-to-video generation, we could adjust style parameters based on text analysis
    const textAnalysis = analyzeText(script);
    
    return new Response(
      JSON.stringify({ 
        videoUrl,
        captionsUrl: options.captionsEnabled ? captionsUrl : null,
        title,
        processing: {
          status: "completed",
          duration: processingDuration,
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
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});

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
