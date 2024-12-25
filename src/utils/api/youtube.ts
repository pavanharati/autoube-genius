import { supabase } from "@/integrations/supabase/client";

export interface VideoUploadParams {
  title: string;
  description: string;
  tags: string[];
  videoFile: File;
  thumbnail?: File;
  privacyStatus?: 'private' | 'unlisted' | 'public';
}

export interface VideoAnalytics {
  views: number;
  likes: number;
  comments: number;
  engagement: number;
}

export const initiateYouTubeAuth = async () => {
  const { data: { url }, error } = await supabase.functions.invoke('youtube-auth', {
    body: { action: 'getAuthUrl' }
  });

  if (error) throw error;
  window.location.href = url;
};

export const handleYouTubeCallback = async (code: string) => {
  const { error } = await supabase.functions.invoke('youtube-auth', {
    body: { action: 'getToken', code }
  });

  if (error) throw error;
  return true;
};

export const uploadVideo = async (params: VideoUploadParams): Promise<string> => {
  const formData = new FormData();
  formData.append('video', params.videoFile);
  formData.append('title', params.title);
  formData.append('description', params.description);
  formData.append('tags', JSON.stringify(params.tags));
  formData.append('privacyStatus', params.privacyStatus || 'private');
  
  if (params.thumbnail) {
    formData.append('thumbnail', params.thumbnail);
  }

  const { data, error } = await supabase.functions.invoke('youtube-upload', {
    body: formData
  });

  if (error) throw error;
  return data.videoId;
};

export const getVideoAnalytics = async (videoId: string): Promise<VideoAnalytics> => {
  const { data, error } = await supabase.functions.invoke('youtube-analytics', {
    body: { videoId }
  });

  if (error) throw error;
  return data;
};

export const getChannelAnalytics = async (): Promise<{
  subscribers: number;
  totalViews: number;
  averageEngagement: number;
}> => {
  const { data, error } = await supabase.functions.invoke('youtube-channel-analytics', {
    body: {}
  });

  if (error) throw error;
  return data;
};