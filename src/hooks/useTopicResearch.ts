import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TrendingTopic, VideoGenerationOptions } from "@/types/video";
import { getTopicInsights } from "@/utils/api/googleTrends";
import { generateScript } from "@/utils/api/openai";
import { useRAG } from "@/hooks/useRAG";
import { useGoogleTrends } from "@/hooks/useGoogleTrends";
import { generateVideo } from "@/utils/api/videoGenerator";
import { generateThumbnail } from "@/utils/api/canva";
import { useNavigate } from "react-router-dom";

export interface SavedScript {
  id: string;
  topic: string;
  content: string;
  date: string;
  videoGenerated?: boolean;
  videoUrl?: string;
  thumbnailUrl?: string;
}

export const useTopicResearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null);
  const [insights, setInsights] = useState<{
    searchVolume: string;
    trend: string;
    relatedQueries: string[];
  } | null>(null);
  const [script, setScript] = useState("");
  const [savedScripts, setSavedScripts] = useState<SavedScript[]>([]);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [selectedRegion, setSelectedRegion] = useState<string>('US');
  const { toast } = useToast();
  const { initialize } = useRAG();
  const navigate = useNavigate();
  
  const { data: trendingTopics = [], isLoading } = useGoogleTrends(undefined, selectedPeriod, selectedRegion);

  useEffect(() => {
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
        metadata: { source: "trending-topics", period: topic.period || 'day', region: topic.region || 'US' }
      }));
      
      initialize(documents).catch(err => {
        console.error("Failed to initialize RAG:", err);
      });
    }
  }, [trendingTopics, initialize, toast]);

  const initializeRagWithKey = async (apiKey: string) => {
    if (trendingTopics.length > 0) {
      const documents = trendingTopics.map(topic => ({
        text: `Topic: ${topic.topic}\nTrend: ${topic.trend}\nEngagement: ${topic.engagement}\nRelated Topics: ${topic.relatedTopics?.join(", ")}`,
        metadata: { source: "trending-topics", period: topic.period || 'day', region: topic.region || 'US' }
      }));
      
      try {
        const success = await initialize(documents, apiKey);
        if (success) {
          toast({
            title: "RAG System Initialized",
            description: "Knowledge base successfully created with your API key",
          });
        } else {
          toast({
            title: "RAG Initialization Failed",
            description: "Could not initialize RAG with the provided API key",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to initialize RAG with API key:", error);
        toast({
          title: "Error",
          description: "Something went wrong during RAG initialization",
          variant: "destructive",
        });
      }
    }
  };

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
    
    const newSavedScript: SavedScript = {
      id: crypto.randomUUID(),
      topic: selectedTopic.topic,
      content: script,
      date: new Date().toISOString(),
      videoGenerated: false
    };
    
    const updatedScripts = [...savedScripts, newSavedScript];
    setSavedScripts(updatedScripts);
    
    localStorage.setItem('saved-scripts', JSON.stringify(updatedScripts));
    
    toast({
      title: "Script Saved",
      description: "Your script has been saved successfully and added to your dashboard",
    });
  };

  const handleCreateVideo = async (title: string, script: string, options: VideoGenerationOptions) => {
    try {
      toast({
        title: "Processing",
        description: "Generating your video and thumbnail. This may take a few moments...",
      });

      const thumbnailUrl = await generateThumbnail({
        title: title,
        imagePrompt: `Thumbnail for a video about ${title}`,
        style: 'modern'
      });

      const result = await generateVideo(title, script, options);
      
      if (selectedTopic) {
        const updatedScripts = savedScripts.map(savedScript => {
          if (savedScript.topic === selectedTopic.topic && savedScript.content === script) {
            return {
              ...savedScript,
              videoGenerated: true,
              videoUrl: result.videoUrl,
              thumbnailUrl
            };
          }
          return savedScript;
        });
        
        setSavedScripts(updatedScripts);
        localStorage.setItem('saved-scripts', JSON.stringify(updatedScripts));
      }
      
      toast({
        title: "Success",
        description: "Video and thumbnail generated successfully! Redirecting to Videos page.",
      });

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
    selectedRegion,
    setSelectedRegion,
    trendingTopics,
    isLoading,
    savedScripts,
    handleTopicSelect,
    handleGenerateScript,
    handleSaveScript,
    handleCreateVideo,
    backToTopics,
    setTopicAndScript,
    initializeRagWithKey
  };
};
