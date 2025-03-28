
import { useState, useEffect } from "react";
import { TrendingUp, FileText, ArrowLeft, Clock, Save } from "lucide-react";
import { SearchBar } from "@/components/topics/SearchBar";
import TrendingTopicCard from "@/components/topics/TrendingTopicCard";
import { useToast } from "@/hooks/use-toast";
import { fetchTrendingTopics, getTopicInsights, TrendingTopic } from "@/utils/api/googleTrends";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateScript } from "@/utils/api/openai";
import { useRAG } from "@/hooks/useRAG";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [savedScripts, setSavedScripts] = useState<{topic: string, content: string, date: string}[]>([]);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');
  const { toast } = useToast();
  const { initialize } = useRAG();

  useEffect(() => {
    loadTrendingTopics(selectedPeriod);
  }, [selectedPeriod]);

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
  }, [trendingTopics]);

  const loadTrendingTopics = async (period: 'day' | 'week' | 'month') => {
    setIsLoading(true);
    try {
      const topics = await fetchTrendingTopics(undefined, period);
      setTrendingTopics(topics);
    } catch (error) {
      console.error("Failed to fetch trending topics:", error);
      toast({
        title: "Error",
        description: "Failed to fetch trending topics",
        variant: "destructive",
      });
      // Set some fallback data
      setTrendingTopics([
        {
          topic: "AI Video Creation",
          searchVolume: "750K",
          trend: "+18%",
          engagement: "High",
          relatedTopics: ["Faceless YouTube", "AI Tools", "Content Creation"],
          period: period
        },
        {
          topic: "Passive Income YouTube",
          searchVolume: "620K",
          trend: "+12%",
          engagement: "Medium",
          relatedTopics: ["YouTube Monetization", "Side Hustle", "Content Strategy"],
          period: period
        },
      ]);
    } finally {
      setIsLoading(false);
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

  const backToTopics = () => {
    setSelectedTopic(null);
    setInsights(null);
    setScript("");
  };

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

          <Tabs defaultValue="day" onValueChange={(value) => setSelectedPeriod(value as 'day' | 'week' | 'month')}>
            <TabsList className="mb-4">
              <TabsTrigger value="day" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Today
              </TabsTrigger>
              <TabsTrigger value="week" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                This Week
              </TabsTrigger>
              <TabsTrigger value="month" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                This Month
              </TabsTrigger>
            </TabsList>

            <TabsContent value="day">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-semibold">Today's Trending Topics</h2>
                </div>
                
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((_, index) => (
                      <Card key={index} className="h-64">
                        <CardContent className="p-6">
                          <Skeleton className="h-4 w-1/4 mb-4" />
                          <Skeleton className="h-6 w-3/4 mb-6" />
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                              <Skeleton className="h-3 w-2/3 mb-2" />
                              <Skeleton className="h-4 w-1/3" />
                            </div>
                            <div>
                              <Skeleton className="h-3 w-2/3 mb-2" />
                              <Skeleton className="h-4 w-1/3" />
                            </div>
                          </div>
                          <Skeleton className="h-3 w-1/2 mb-2" />
                          <div className="flex gap-2 mt-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                          <Skeleton className="h-10 w-full mt-6" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTopics.filter(t => t.period === 'day').map((topic, index) => (
                      <div 
                        key={index} 
                        onClick={() => handleTopicSelect(topic)}
                        className="cursor-pointer transition-transform hover:scale-[1.02]"
                      >
                        <TrendingTopicCard 
                          topic={topic} 
                          onGenerateScript={(generatedScript) => {
                            setSelectedTopic(topic);
                            setScript(generatedScript);
                          }} 
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="week">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-semibold">This Week's Trending Topics</h2>
                </div>
                
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((_, index) => (
                      <Card key={index} className="h-64">
                        <CardContent className="p-6">
                          <Skeleton className="h-4 w-1/4 mb-4" />
                          <Skeleton className="h-6 w-3/4 mb-6" />
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                              <Skeleton className="h-3 w-2/3 mb-2" />
                              <Skeleton className="h-4 w-1/3" />
                            </div>
                            <div>
                              <Skeleton className="h-3 w-2/3 mb-2" />
                              <Skeleton className="h-4 w-1/3" />
                            </div>
                          </div>
                          <Skeleton className="h-10 w-full mt-6" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTopics.filter(t => t.period === 'week').map((topic, index) => (
                      <div 
                        key={index} 
                        onClick={() => handleTopicSelect(topic)}
                        className="cursor-pointer transition-transform hover:scale-[1.02]"
                      >
                        <TrendingTopicCard 
                          topic={topic} 
                          onGenerateScript={(generatedScript) => {
                            setSelectedTopic(topic);
                            setScript(generatedScript);
                          }} 
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="month">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <h2 className="text-xl font-semibold">This Month's Trending Topics</h2>
                </div>
                
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((_, index) => (
                      <Card key={index} className="h-64">
                        <CardContent className="p-6">
                          <Skeleton className="h-4 w-1/4 mb-4" />
                          <Skeleton className="h-6 w-3/4 mb-6" />
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                              <Skeleton className="h-3 w-2/3 mb-2" />
                              <Skeleton className="h-4 w-1/3" />
                            </div>
                            <div>
                              <Skeleton className="h-3 w-2/3 mb-2" />
                              <Skeleton className="h-4 w-1/3" />
                            </div>
                          </div>
                          <Skeleton className="h-10 w-full mt-6" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTopics.filter(t => t.period === 'month').map((topic, index) => (
                      <div 
                        key={index} 
                        onClick={() => handleTopicSelect(topic)}
                        className="cursor-pointer transition-transform hover:scale-[1.02]"
                      >
                        <TrendingTopicCard 
                          topic={topic} 
                          onGenerateScript={(generatedScript) => {
                            setSelectedTopic(topic);
                            setScript(generatedScript);
                          }} 
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
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
                  <h3 className="text-lg font-medium">Video Script</h3>
                  <div className="flex gap-2">
                    {script && (
                      <Button 
                        onClick={handleSaveScript} 
                        variant="outline"
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Script
                      </Button>
                    )}
                    <Button 
                      onClick={handleGenerateScript} 
                      disabled={isGeneratingScript}
                      className="gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      {isGeneratingScript ? "Generating..." : script ? "Regenerate" : "Generate Script"}
                    </Button>
                  </div>
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
