
import { useState, useEffect } from "react";
import { TrendingUp, FileText, ArrowLeft } from "lucide-react";
import { SearchBar } from "@/components/topics/SearchBar";
import { TrendingTopicCard } from "@/components/topics/TrendingTopicCard";
import { useToast } from "@/hooks/use-toast";
import { fetchTrendingTopics, getTopicInsights, TrendingTopic } from "@/utils/api/googleTrends";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateScript } from "@/utils/api/openai";

const TopicResearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null);
  const [insights, setInsights] = useState<{
    searchVolume: string;
    trend: string;
    relatedQueries: string[];
  } | null>(null);
  const [script, setScript] = useState("");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTrendingTopics();
  }, []);

  const loadTrendingTopics = async () => {
    setIsLoading(true);
    try {
      const topics = await fetchTrendingTopics();
      setTrendingTopics(topics);
    } catch (error) {
      console.error("Failed to fetch trending topics:", error);
      toast({
        title: "Error",
        description: "Failed to fetch trending topics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicSelect = async (topic: TrendingTopic) => {
    setSelectedTopic(topic);
    try {
      const topicInsights = await getTopicInsights(topic.topic);
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
        description: "Failed to generate script. Please check your OpenAI API key.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const backToTopics = () => {
    setSelectedTopic(null);
    setInsights(null);
    setScript("");
  };

  // Filter topics based on search query
  const filteredTopics = searchQuery 
    ? trendingTopics.filter(topic => 
        topic.topic.toLowerCase().includes(searchQuery.toLowerCase()))
    : trendingTopics;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Topic Research</h1>
        <p className="text-muted-foreground mt-2">
          Discover trending topics and content ideas for your videos
        </p>
      </div>

      {!selectedTopic ? (
        <>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-semibold">Trending Topics</h2>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">Loading trending topics...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTopics.map((topic, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleTopicSelect(topic)}
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                  >
                    <TrendingTopicCard topic={topic} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <Button 
            variant="outline" 
            onClick={backToTopics} 
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Topics
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{selectedTopic.topic}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Search Volume</p>
                  <p className="font-medium text-lg">{selectedTopic.searchVolume}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trend</p>
                  <p className="font-medium text-lg text-green-500">{selectedTopic.trend}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                  <p className="font-medium text-lg">{selectedTopic.engagement}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Related Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTopic.relatedTopics.map((topic, index) => (
                    <span 
                      key={index} 
                      className="bg-accent/50 text-accent-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Generate Video Script</h3>
                  <Button 
                    onClick={handleGenerateScript} 
                    disabled={isGeneratingScript}
                    className="gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    {isGeneratingScript ? "Generating..." : "Generate Script"}
                  </Button>
                </div>
                
                {script ? (
                  <div className="bg-accent/20 p-4 rounded-md mt-4 whitespace-pre-wrap">
                    {script}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Click the button above to generate a video script based on this topic.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TopicResearch;
