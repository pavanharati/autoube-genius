import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Stock video APIs configuration
const stockSources = {
  pixabay: {
    apiUrl: "https://pixabay.com/api/videos/",
    apiKey: Deno.env.get("PIXABAY_API_KEY") || "", // Would be set in production
    searchEndpoint: (query: string) => 
      `https://pixabay.com/api/videos/?key=${stockSources.pixabay.apiKey}&q=${encodeURIComponent(query)}&per_page=10`
  },
  unsplash: {
    // Unsplash doesn't have a video API, but we could use a similar service or their image API
    apiUrl: "https://api.unsplash.com/",
    apiKey: Deno.env.get("UNSPLASH_API_KEY") || "", // Would be set in production
    searchEndpoint: (query: string) => 
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&count=5&client_id=${stockSources.unsplash.apiKey}`
  },
  flickr: {
    apiUrl: "https://www.flickr.com/services/rest/",
    apiKey: Deno.env.get("FLICKR_API_KEY") || "", // Would be set in production
    searchEndpoint: (query: string) => 
      `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${stockSources.flickr.apiKey}&text=${encodeURIComponent(query)}&format=json&nojsoncallback=1&extras=url_o`
  }
};

// Function to extract key scenes from a script
function extractScenesFromScript(script: string): string[] {
  // Split script into paragraphs or by punctuation
  const sentences = script.split(/(?<=[.!?])\s+/);
  
  // Filter out short sentences or non-descriptive content
  const significantSentences = sentences.filter(sentence => 
    sentence.trim().length > 20 && 
    !sentence.includes("Introduction:") &&
    !sentence.includes("Conclusion:") &&
    !sentence.match(/^\d+:\d+$/) // Filter out timestamps
  );
  
  // Take a relevant subset to keep scene count reasonable
  // For a 10-minute video, ~30 scenes might be appropriate
  const scenesToExtract = Math.min(30, Math.ceil(significantSentences.length / 3));
  
  const scenes: string[] = [];
  const step = Math.ceil(significantSentences.length / scenesToExtract);
  
  for (let i = 0; i < significantSentences.length; i += step) {
    if (scenes.length < scenesToExtract) {
      scenes.push(significantSentences[i]);
    }
  }
  
  return scenes;
}

// Function to generate search terms from scenes
function generateSearchTerms(scenes: string[]): string[] {
  return scenes.map(scene => {
    // Extract key visual elements from the scene description
    const keywords = scene
      .replace(/[.,;:!?()'"]/g, '')
      .split(' ')
      .filter(word => 
        word.length > 3 && 
        !['this', 'that', 'with', 'from', 'about', 'what', 'when', 'where', 'which', 'would', 'could', 'should'].includes(word.toLowerCase())
      );
    
    // Take the 3-5 most relevant words to form a search query
    const queryWords = keywords.slice(0, Math.min(5, keywords.length));
    return queryWords.join(' ');
  });
}

// Function to estimate video duration based on script length
function estimateVideoDuration(script: string): number {
  // Average reading speed is about 150 words per minute
  const wordCount = script.split(/\s+/).length;
  const durationInMinutes = wordCount / 150;
  
  return durationInMinutes;
}

// Mock function to simulate retrieving stock videos
// In production, this would make actual API calls to stock video services
async function fetchStockVideos(
  searchTerms: string[], 
  source: "pixabay" | "unsplash" | "flickr" | "mixed"
): Promise<string[]> {
  console.log(`Searching for videos with terms: ${searchTerms.join(", ")}`);
  console.log(`Using source: ${source}`);
  
  // For now, return sample videos from a public source
  // In production, we'd make real API calls to stock video services
  const sampleVideos = [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4"
  ];
  
  // Ensure we have enough videos for all search terms
  // by cycling through the sample videos if needed
  const result: string[] = [];
  for (let i = 0; i < searchTerms.length; i++) {
    result.push(sampleVideos[i % sampleVideos.length]);
  }
  
  return result;
}

// Mock function to simulate video composition
// In production, this would use a video editing API or library
async function composeVideo(
  videos: string[], 
  script: string, 
  captionsUrl: string | null,
  musicStyle: string
): Promise<string> {
  console.log(`Composing video with ${videos.length} clips`);
  console.log(`Using music style: ${musicStyle}`);
  console.log(`Captions URL: ${captionsUrl || "none"}`);
  
  // This function would normally do the actual composition
  // For now, we'll just return one of the sample videos as the "composed" result
  // In production, this would use a video editing service or library
  
  // We'll use different videos based on music style to simulate different results
  const musicStyleVideoMap: Record<string, string> = {
    "inspirational": "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "upbeat": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "calm": "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "dramatic": "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "corporate": "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
  };
  
  return musicStyleVideoMap[musicStyle] || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      title, 
      script, 
      stockSource, 
      targetDuration, 
      musicStyle,
      captionsEnabled,
      captionsUrl
    } = await req.json();
    
    if (!title || !script) {
      throw new Error("Title and script are required");
    }

    console.log(`Generating stock video for: ${title}`);
    console.log(`Target duration: ${targetDuration} minutes`);
    console.log(`Stock source: ${stockSource}`);
    console.log(`Music style: ${musicStyle}`);
    
    // 1. Extract key scenes from the script
    const scenes = extractScenesFromScript(script);
    console.log(`Extracted ${scenes.length} scenes from script`);
    
    // 2. Generate search terms for stock footage
    const searchTerms = generateSearchTerms(scenes);
    console.log(`Generated ${searchTerms.length} search terms`);
    
    // 3. Fetch stock videos based on search terms
    const stockVideos = await fetchStockVideos(searchTerms, stockSource);
    console.log(`Retrieved ${stockVideos.length} stock videos`);
    
    // 4. Compose the final video
    const finalVideoUrl = await composeVideo(
      stockVideos, 
      script, 
      captionsEnabled ? captionsUrl : null,
      musicStyle
    );
    
    // Create a descriptive response with the required metadata
    return new Response(
      JSON.stringify({
        videoUrl: finalVideoUrl,
        title,
        processingDetails: {
          status: "completed",
          scenesExtracted: scenes.length,
          stockClipsUsed: stockVideos.length,
          estimatedDuration: `${Math.round(estimateVideoDuration(script) * 60)}s`,
          actualDuration: targetDuration * 60, // seconds
          stockSource: stockSource,
          musicStyle: musicStyle
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error generating stock footage video:', error);
    
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
