const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export interface ScriptGenerationParams {
  topic: string;
  style?: 'informative' | 'entertaining' | 'educational';
  targetLength?: 'short' | 'medium' | 'long';
}

export const generateScript = async (params: ScriptGenerationParams): Promise<string> => {
  try {
    const response = await fetch(OPENAI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
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
  } catch (error) {
    console.error('Error generating script:', error);
    throw new Error('Failed to generate script');
  }
};