
import { supabase } from "@/integrations/supabase/client";

export interface ThumbnailParams {
  title: string;
  imagePrompt?: string;
  style?: 'modern' | 'minimal' | 'bold' | 'playful';
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface ThumbnailTemplate {
  id: string;
  name: string;
  previewUrl: string;
}

export const generateThumbnail = async (params: ThumbnailParams): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke("generate-thumbnail", {
      body: params,
    });

    if (error) throw error;
    
    return data.thumbnailUrl;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    // Return a placeholder if thumbnail generation fails
    return `https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1792&h=1024&fit=crop`;
  }
};

export const getThumbnailTemplates = async (): Promise<ThumbnailTemplate[]> => {
  // Mock implementation
  return [
    {
      id: '1',
      name: 'Modern Tech',
      previewUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'Minimal Style',
      previewUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop'
    },
    {
      id: '3',
      name: 'Bold Impact',
      previewUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop'
    },
    {
      id: '4',
      name: 'Playful Design',
      previewUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop'
    }
  ];
};
