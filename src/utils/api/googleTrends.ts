import axios from 'axios';

export interface TrendingTopic {
  topic: string;
  searchVolume: string;
  trend: string;
  engagement: string;
}

export const fetchTrendingTopics = async (): Promise<TrendingTopic[]> => {
  // For now, return mock data as Google Trends API requires backend proxy
  // In production, this would make a call to your backend which handles Google Trends API
  return [
    {
      topic: "AI in Daily Life",
      searchVolume: "850K",
      trend: "+15%",
      engagement: "High",
    },
    {
      topic: "Future of Work",
      searchVolume: "620K",
      trend: "+8%",
      engagement: "Medium",
    },
  ];
};