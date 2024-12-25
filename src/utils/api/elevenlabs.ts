export interface VoiceoverParams {
  text: string;
  voiceId?: string;
}

export const generateVoiceover = async (params: VoiceoverParams): Promise<ArrayBuffer> => {
  const ELEVEN_LABS_API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${params.voiceId || 'EXAVITQu4vr4xnSDxMaL'}/stream`;

  try {
    const response = await fetch(ELEVEN_LABS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': `${import.meta.env.VITE_ELEVEN_LABS_API_KEY}`,
      },
      body: JSON.stringify({
        text: params.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error generating voiceover:', error);
    throw new Error('Failed to generate voiceover');
  }
};