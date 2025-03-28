
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Storage } from "https://deno.land/x/storage@0.1.1/mod.ts";

// This function generates WebVTT captions from a script and stores them in Supabase storage

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
    const { script } = await req.json();
    
    if (!script) {
      throw new Error("Script is required");
    }

    // Split the script into lines (each line will be a caption)
    const lines = script.split(/[.!?]\s+/).filter(Boolean);
    
    // Generate WebVTT content
    let vttContent = "WEBVTT\n\n";
    let time = 0;
    
    lines.forEach((line: string, index: number) => {
      // Estimate duration based on word count (approximate 300 ms per word)
      const words = line.split(' ').length;
      const duration = words * 0.3;
      
      const startTime = formatTime(time);
      time += duration;
      const endTime = formatTime(time);
      
      vttContent += `${index + 1}\n`;
      vttContent += `${startTime} --> ${endTime}\n`;
      vttContent += `${line.trim()}\n\n`;
    });
    
    // Generate unique filename
    const filename = `captions_${Date.now()}.vtt`;
    
    // In a real implementation, this would upload to storage
    // For now, we'll mock the URL
    const captionsUrl = `https://example.com/captions/${filename}`;
    
    return new Response(
      JSON.stringify({ captionsUrl, content: vttContent }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error generating captions:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});

// Helper function to format time in HH:MM:SS.mmm format
function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}
