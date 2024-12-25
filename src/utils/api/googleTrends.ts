import axios from 'axios';

export interface TrendingTopic {
  topic: string;
  searchVolume: string;
  trend: string;
  engagement: string;
  relatedTopics: string[];
}

export const fetchTrendingTopics = async (category?: string): Promise<TrendingTopic[]> => {
  // In production, this would make a call to your backend which handles Google Trends API
  // For now, returning mock data
  return [
    {
      topic: "AI in Daily Life",
      searchVolume: "850K",
      trend: "+15%",
      engagement: "High",
      relatedTopics: ["Machine Learning", "ChatGPT", "AI Applications"]
    },
    {
      topic: "Future of Work",
      searchVolume: "620K",
      trend: "+8%",
      engagement: "Medium",
      relatedTopics: ["Remote Work", "Digital Nomads", "Work-Life Balance"]
    },
  ];
};

export const getTopicInsights = async (topic: string): Promise<{
  searchVolume: string;
  trend: string;
  relatedQueries: string[];
}> => {
  // Mock implementation
  return {
    searchVolume: "500K",
    trend: "+10%",
    relatedQueries: [
      "How to use AI",
      "AI benefits",
      "AI in business"
    ]
  };
};