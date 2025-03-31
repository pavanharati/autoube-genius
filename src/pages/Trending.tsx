
import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Filter, 
  ChevronRight, 
  ArrowUpRight, 
  Calendar, 
  PieChart,
  Target,
  Search,
  Copy,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { TrendingTopic } from "@/utils/api/googleTrends";
import { fetchTrendingTopics, analyzeTopicPotential, generateCatchyTitle } from "@/utils/api/trendingScraper";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { SearchBar } from "@/components/topics/SearchBar";
import { useGoogleTrends } from "@/hooks/useGoogleTrends";
import GoogleTrendingCard from "@/components/topics/GoogleTrendingCard";
import { Badge } from "@/components/ui/badge";

const Trending = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month">("day");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("US");
  const { toast } = useToast();

  const { data: trendingData, isLoading: isTrendsLoading, refetch } = useGoogleTrends(
    selectedCategory === "all" ? undefined : selectedCategory, 
    selectedPeriod, 
    selectedRegion, 
    searchKeyword
  );

  useEffect(() => {
    if (trendingData) {
      setTrendingTopics(trendingData);
      setIsLoading(false);
    }
  }, [trendingData]);

  useEffect(() => {
    refetch();
  }, [selectedCategory, selectedPeriod, selectedRegion, refetch]);

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "entertainment", name: "Entertainment" },
    { id: "business", name: "Business" },
    { id: "technology", name: "Technology" },
    { id: "sports", name: "Sports" },
    { id: "health", name: "Health" },
  ];

  const regions = [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "IN", name: "India" },
    { code: "JP", name: "Japan" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
  ];

  const handleTopicSelect = async (topic: TrendingTopic) => {
    setSelectedTopic(topic);
    try {
      const analysisData = await analyzeTopicPotential(topic.topic);
      setAnalysis(analysisData);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Failed to analyze topic:", error);
      toast({
        title: "Error",
        description: "Failed to analyze topic",
        variant: "destructive",
      });
    }
  };

  const handleGenerateTitles = async () => {
    if (!selectedTopic) return;
    
    setIsGeneratingTitles(true);
    try {
      const titles = [];
      
      for (let i = 0; i < 5; i++) {
        const title = await generateCatchyTitle(selectedTopic.topic, selectedCategory);
        titles.push(title);
      }
      
      setGeneratedTitles(titles);
    } catch (error) {
      console.error("Failed to generate titles:", error);
      toast({
        title: "Error",
        description: "Failed to generate titles",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTitles(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The title has been copied to your clipboard",
    });
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchKeyword(searchQuery);
    
    try {
      await refetch();
      
      toast({
        title: "Search complete",
        description: `Showing results for "${searchQuery}"`,
      });
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search error",
        description: "Failed to search for trending topics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setSearchKeyword("");
    refetch();
  };

  const filteredTopics = trendingTopics || [];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-accent" />
          <h1 className="text-4xl font-bold">Google Trending Topics</h1>
        </div>
        <p className="text-muted-foreground mt-2">
          Discover what's trending on Google and create content aligned with popular searches
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full md:w-auto md:flex-1 max-w-xl">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearchSubmit}
            placeholder="Search for trending topics..."
            isLoading={isSearching}
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {categories.find(c => c.id === selectedCategory)?.name || "All Categories"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuItem 
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                {selectedPeriod === 'day' ? 'Past 24 Hours' : 
                 selectedPeriod === 'week' ? 'Past Week' : 'Past Month'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedPeriod("day")}>
                Past 24 Hours
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("week")}>
                Past Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("month")}>
                Past Month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Globe className="h-4 w-4" />
                {regions.find(r => r.code === selectedRegion)?.name || "United States"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {regions.map((region) => (
                <DropdownMenuItem 
                  key={region.code}
                  onClick={() => setSelectedRegion(region.code)}
                >
                  {region.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {searchKeyword && (
            <Button variant="outline" onClick={resetSearch}>
              Clear Search
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              {searchKeyword ? `Results for "${searchKeyword}"` : "Top Trending Searches"}
              
              <Badge variant="outline" className="ml-2">
                {regions.find(r => r.code === selectedRegion)?.name || "United States"}
              </Badge>
              
              <Badge variant="outline">
                {selectedPeriod === 'day' ? 'Past 24 Hours' : 
                  selectedPeriod === 'week' ? 'Past Week' : 'Past Month'}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {(isLoading || isTrendsLoading) ? (
              Array.from({ length: 10 }).map((_, i) => (
                <Card key={i} className="h-[100px] flex items-center justify-center">
                  <Spinner size="lg" />
                </Card>
              ))
            ) : filteredTopics.length > 0 ? (
              filteredTopics.map((topic, index) => (
                <GoogleTrendingCard
                  key={index}
                  topic={topic}
                  rank={topic.rank || index + 1}
                  onClick={() => handleTopicSelect(topic)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No trending topics found for the selected filters.</p>
                {searchKeyword && (
                  <Button onClick={resetSearch} className="mt-4">
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Topic Analysis Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedTopic?.topic}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="insights">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Topic Insights
              </TabsTrigger>
              <TabsTrigger value="titles" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Generate Titles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="insights">
              {analysis ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Search Volume</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">{analysis.searchVolume}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Monthly searches
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Competition Level</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold capitalize">{analysis.competitionLevel}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {analysis.competitionLevel === 'low' 
                            ? 'Great opportunity!' 
                            : analysis.competitionLevel === 'medium' 
                              ? 'Good balance' 
                              : 'Highly competitive'}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Estimated Views</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">{analysis.estimatedViews}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Average for first 30 days
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Suggested Keywords</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.suggestedKeywords.map((keyword: string, i: number) => (
                          <div 
                            key={i} 
                            className="px-3 py-1 bg-accent/20 text-accent-foreground rounded-full text-sm"
                          >
                            {keyword}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleGenerateTitles()}
                      className="gap-2"
                    >
                      <Target className="h-4 w-4" />
                      Generate Catchy Titles
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Spinner size="lg" className="mx-auto" />
                  <p className="mt-4 text-muted-foreground">
                    Analyzing topic potential...
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="titles">
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <p className="text-muted-foreground">
                    Generate catchy titles for your video based on this trending topic.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-2 block">Title Style</Label>
                      <RadioGroup defaultValue="engaging" className="grid grid-cols-1 gap-2">
                        <Label
                          htmlFor="engaging"
                          className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent/10"
                        >
                          <RadioGroupItem value="engaging" id="engaging" />
                          <span>Engaging & Click-worthy</span>
                        </Label>
                        <Label
                          htmlFor="listicle"
                          className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent/10"
                        >
                          <RadioGroupItem value="listicle" id="listicle" />
                          <span>Listicle Style</span>
                        </Label>
                        <Label
                          htmlFor="how-to"
                          className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent/10"
                        >
                          <RadioGroupItem value="how-to" id="how-to" />
                          <span>How-To Guide</span>
                        </Label>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Include Elements</Label>
                      <div className="space-y-2">
                        <Label
                          htmlFor="include-numbers"
                          className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent/10"
                        >
                          <input type="checkbox" id="include-numbers" className="rounded" defaultChecked />
                          <span>Numbers</span>
                        </Label>
                        <Label
                          htmlFor="include-questions"
                          className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent/10"
                        >
                          <input type="checkbox" id="include-questions" className="rounded" />
                          <span>Questions</span>
                        </Label>
                        <Label
                          htmlFor="include-emotion"
                          className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent/10"
                        >
                          <input type="checkbox" id="include-emotion" className="rounded" defaultChecked />
                          <span>Emotional Words</span>
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full gap-2"
                  onClick={handleGenerateTitles}
                  disabled={isGeneratingTitles}
                >
                  {isGeneratingTitles ? (
                    <>
                      <Spinner size="sm" />
                      <span>Generating Titles...</span>
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4" />
                      <span>Generate Titles</span>
                    </>
                  )}
                </Button>

                {generatedTitles.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h3 className="font-medium">Generated Titles:</h3>
                    {generatedTitles.map((title, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/5"
                      >
                        <p className="font-medium">{title}</p>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyToClipboard(title)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              toast({
                                title: "Title selected",
                                description: "The title has been selected for your new video",
                              });
                            }}
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Trending;
