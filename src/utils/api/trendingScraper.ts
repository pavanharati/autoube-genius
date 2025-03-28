
import { TrendingTopic } from "@/types/video";
import { supabase } from "@/integrations/supabase/client";

// Function to fetch trending topics from YouTube and Google Trends
export const fetchTrendingTopics = async (
  niche: string = "all",
  period: "day" | "week" | "month" = "day"
): Promise<TrendingTopic[]> => {
  try {
    const { data, error } = await supabase.functions.invoke("fetch-trending-topics", {
      body: { niche, period }
    });
    
    if (error) throw error;
    
    return data.topics;
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    throw new Error("Failed to fetch trending topics");
  }
};

// Function to generate a title based on a trending topic
export const generateCatchyTitle = async (topic: string, niche: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke("generate-title", {
      body: { topic, niche }
    });
    
    if (error) throw error;
    
    return data.title;
  } catch (error) {
    console.error("Error generating title:", error);
    throw new Error("Failed to generate catchy title");
  }
};

// Function to fetch trending content analysis
export const analyzeTopicPotential = async (topic: string): Promise<{
  searchVolume: string;
  competitionLevel: "low" | "medium" | "high";
  estimatedViews: string;
  suggestedKeywords: string[];
}> => {
  try {
    const { data, error } = await supabase.functions.invoke("analyze-topic", {
      body: { topic }
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error analyzing topic:", error);
    throw new Error("Failed to analyze topic potential");
  }
};
