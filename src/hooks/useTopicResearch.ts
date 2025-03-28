
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TrendingTopic, VideoGenerationOptions } from "@/types/video";
import { getTopicInsights } from "@/utils/api/googleTrends";
import { generateScript } from "@/utils/api/openai";
import { useRAG } from "@/hooks/useRAG";
import { useGoogleTrends } from "@/hooks/useGoogleTrends";
import { generateVideo } from "@/utils/api/videoGenerator";
import { useNavigate } from "react-router-dom";

export const useTopicResearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null);
  const [insights, setInsights] = useState<{
    searchVolume: string;
    trend: string;
    relatedQueries: string[];
  } | null>(null);
  const [script, setScript] = useState("");
  const [savedScripts, setSavedScripts] = useState<{topic: string, content: string, date: string}[]>([]);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');
  const { toast } = useToast();
  const { initialize } = useRAG();
  const navigate = useNavigate();
  
  const { data: trendingTopics = [], isLoading } = useGoogleTrends(undefined, selectedPeriod);

  useEffect(() => {
    // Load saved scripts from localStorage
    const savedScriptsFromStorage = localStorage.getItem('saved-scripts');
    if (savedScriptsFromStorage) {
      try {
        setSavedScripts(JSON.parse(savedScriptsFromStorage));
      } catch (error) {
        console.error("Failed to parse saved scripts:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (trendingTopics.length > 0) {
      const documents = trendingTopics.map(topic => ({
        text: `Topic: ${topic.topic}\nTrend: ${topic.trend}\nEngagement: ${topic.engagement}\nRelated Topics: ${topic.relatedTopics?.join(", ")}`,
        metadata: { source: "trending-topics", period: topic.period || 'day' }
      }));
      
      initialize(documents).catch(err => {
        console.error("Failed to initialize RAG:", err);
        toast({
          title: "RAG Initialization",
          description: "Using fallback search methods instead of RAG",
          variant: "default",
        });
      });
    }
  }, [trendingTopics, initialize, toast]);

  const handleTopicSelect = async (topic: TrendingTopic) => {
    setSelectedTopic(topic);
    try {
      const topicInsights = await getTopicInsights(topic.topic, topic.period);
      setInsights(topicInsights);
    } catch (error) {
      console.error("Failed to get topic insights:", error);
      toast({
        title: "Error",
        description: "Failed to load topic insights",
        variant: "destructive",
      });
    }
  };

  const handleGenerateScript = async () => {
    if (!selectedTopic) return;
    
    setIsGeneratingScript(true);
    try {
      const generatedScript = await generateScript({
        topic: selectedTopic.topic,
        style: "informative",
        targetLength: "medium",
      });
      
      setScript(generatedScript);
      toast({
        title: "Success",
        description: "Script generated successfully",
      });
    } catch (error) {
      console.error("Failed to generate script:", error);
      toast({
        title: "Error",
        description: "Failed to generate script. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleSaveScript = () => {
    if (!selectedTopic || !script) return;
    
    const newSavedScript = {
      topic: selectedTopic.topic,
      content: script,
      date: new Date().toISOString()
    };
    
    const updatedScripts = [...savedScripts, newSavedScript];
    setSavedScripts(updatedScripts);
    
    // Save to localStorage
    localStorage.setItem('saved-scripts', JSON.stringify(updatedScripts));
    
    toast({
      title: "Script Saved",
      description: "Your script has been saved successfully",
    });
  };

  const handleCreateVideo = async (title: string, script: string, options: VideoGenerationOptions) => {
    try {
      toast({
        title: "Processing",
        description: "Generating your video. This may take a few moments...",
      });

      const result = await generateVideo(title, script, options);
      
      toast({
        title: "Success",
        description: "Video generated successfully! Redirecting to Videos page.",
      });

      // Wait a moment before redirecting to allow the toast to be seen
      setTimeout(() => {
        navigate("/videos");
      }, 2000);

      return result;
    } catch (error) {
      console.error("Failed to generate video:", error);
      toast({
        title: "Error",
        description: "Failed to generate video. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const backToTopics = () => {
    setSelectedTopic(null);
    setInsights(null);
    setScript("");
  };

  const setTopicAndScript = (topic: TrendingTopic, generatedScript: string) => {
    setSelectedTopic(topic);
    setScript(generatedScript);
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedTopic,
    insights,
    script,
    isGeneratingScript,
    selectedPeriod,
    setSelectedPeriod,
    trendingTopics,
    isLoading,
    handleTopicSelect,
    handleGenerateScript,
    handleSaveScript,
    handleCreateVideo,
    backToTopics,
    setTopicAndScript
  };
};
