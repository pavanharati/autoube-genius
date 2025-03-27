
import { supabase } from "@/integrations/supabase/client";

export interface ScriptGenerationParams {
  topic: string;
  style?: 'informative' | 'entertaining' | 'educational';
  targetLength?: 'short' | 'medium' | 'long';
}

export const generateScript = async (params: ScriptGenerationParams): Promise<string> => {
  try {
    // If we have the Supabase client set up, use our edge function
    if (supabase) {
      const { data, error } = await supabase.functions.invoke("generate-script", {
        body: params,
      });

      if (error) throw error;
      return data.script;
    } else {
      // Fallback to using the OpenAI API directly
      const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
      const response = await fetch(OPENAI_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a professional YouTube script writer.'
            },
            {
              role: 'user',
              content: `Write a ${params.style || 'informative'} script about ${params.topic}. 
                       Make it ${params.targetLength || 'medium'} length.`
            }
          ],
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content;
    }
  } catch (error) {
    console.error('Error generating script:', error);
    throw new Error('Failed to generate script');
  }
};
