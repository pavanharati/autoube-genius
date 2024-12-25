export interface ThumbnailParams {
  title: string;
  imagePrompt: string;
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
  // This would need to be implemented with Canva API integration
  console.log('Thumbnail generation params:', params);
  return 'mock-thumbnail-url';
};

export const getThumbnailTemplates = async (): Promise<ThumbnailTemplate[]> => {
  // Mock implementation
  return [
    {
      id: '1',
      name: 'Modern Tech',
      previewUrl: 'https://example.com/template1.jpg'
    },
    {
      id: '2',
      name: 'Minimal Style',
      previewUrl: 'https://example.com/template2.jpg'
    }
  ];
};