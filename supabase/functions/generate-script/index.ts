
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { topic, style, targetLength } = await req.json();
    
    if (!topic) {
      throw new Error("Topic is required");
    }

    console.log(`Generating script for topic: ${topic}, style: ${style}, length: ${targetLength}`);

    // Prepare system message based on style and length
    let systemMessage = 'You are a professional YouTube script writer.';
    
    if (style === 'entertaining') {
      systemMessage += ' Create an engaging, entertaining script with humor and personality.';
    } else if (style === 'educational') {
      systemMessage += ' Create an informative, educational script that teaches the audience about the topic.';
    } else {
      systemMessage += ' Create a balanced, informative script that engages the audience.';
    }

    // Prepare target length guidance
    let lengthGuidance = '';
    if (targetLength === 'short') {
      lengthGuidance = 'Create a short 3-5 minute script (about 500-800 words).';
    } else if (targetLength === 'long') {
      lengthGuidance = 'Create a detailed 15-20 minute script (about 2000-3000 words).';
    } else {
      lengthGuidance = 'Create a medium-length 8-10 minute script (about 1200-1500 words).';
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `${systemMessage} ${lengthGuidance}` },
          { 
            role: 'user', 
            content: `Write a YouTube script about "${topic}". Include an attention-grabbing introduction, 
                     key points with engaging examples, and a strong call-to-action conclusion.
                     Format with sections for INTRO, MAIN CONTENT (with timestamps), and OUTRO.`
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const generatedScript = data.choices[0].message.content;

    console.log('Script generated successfully');

    return new Response(
      JSON.stringify({ script: generatedScript }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error generating script:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
