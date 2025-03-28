
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { title, imagePrompt, style } = await req.json();
    
    if (!title) {
      throw new Error("Title is required");
    }

    console.log(`Generating thumbnail for: ${title}, style: ${style}`);

    // Enhance prompt based on style
    let enhancedPrompt = imagePrompt || `Thumbnail for a YouTube video about "${title}"`;
    
    if (style === 'modern') {
      enhancedPrompt += ". Modern, clean design with bold text overlay. Professional look, vibrant colors.";
    } else if (style === 'minimal') {
      enhancedPrompt += ". Minimalist design with simple elements, lots of whitespace, subtle colors.";
    } else if (style === 'bold') {
      enhancedPrompt += ". Bold, attention-grabbing design with vibrant colors and dynamic elements.";
    } else if (style === 'playful') {
      enhancedPrompt += ". Playful, fun design with colorful elements, casual style.";
    }

    // Make API call to DALL-E for image generation
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        model: "dall-e-3",
        n: 1,
        size: "1792x1024" // Standard YouTube thumbnail size ratio
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }
    
    const imageUrl = data.data && data.data[0] ? data.data[0].url : null;
    
    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    return new Response(
      JSON.stringify({ thumbnailUrl: imageUrl, title }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
