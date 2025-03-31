
import { SearchBar } from "@/components/topics/SearchBar";
import TrendingTopicsTabs from "@/components/topics/TrendingTopicsTabs";
import TopicDetailView from "@/components/topics/TopicDetailView";
import { useTopicResearch } from "@/hooks/useTopicResearch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { DocumentUploader } from "@/components/rag/DocumentUploader";

const TopicResearch = () => {
  const [showRagError, setShowRagError] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  const {
    searchQuery,
    setSearchQuery,
    selectedTopic,
    script,
    isGeneratingScript,
    selectedPeriod,
    setSelectedPeriod,
    selectedRegion,
    setSelectedRegion,
    trendingTopics,
    isLoading,
    handleTopicSelect,
    handleGenerateScript,
    handleSaveScript,
    handleCreateVideo,
    backToTopics,
    setTopicAndScript,
    initializeRagWithKey,
    handleSearch
  } = useTopicResearch();

  // Check console for RAG initialization errors
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(' ');
      if (errorMessage.includes('Failed to initialize RAG')) {
        setShowRagError(true);
      }
      originalConsoleError.apply(console, args);
    };
    
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (apiKey && apiKey.trim()) {
      initializeRagWithKey(apiKey.trim());
      setShowRagError(false);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Topic Research</h1>
        <p className="text-muted-foreground mt-2">
          Discover trending topics and content ideas for your videos
        </p>
      </div>

      {showRagError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>RAG Initialization Issue</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>We've detected an issue with the Retrieval-Augmented Generation system.
            Using fallback search methods for now.</p>
            
            <form onSubmit={handleApiKeySubmit} className="flex gap-2">
              <input
                type="password"
                value={apiKey || ''}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter OpenAI API Key"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <button 
                type="submit"
                className="bg-primary text-primary-foreground h-10 px-4 py-2 rounded-md text-sm font-medium"
              >
                Apply
              </button>
            </form>
          </AlertDescription>
        </Alert>
      )}

      {!selectedTopic ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <form onSubmit={handleSearchSubmit}>
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </form>
            </div>
            <div>
              <DocumentUploader />
            </div>
          </div>

          <TrendingTopicsTabs
            trendingTopics={trendingTopics}
            isLoading={isLoading}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            searchQuery={searchQuery}
            onTopicSelect={handleTopicSelect}
            onGenerateScript={setTopicAndScript}
          />
        </>
      ) : (
        <TopicDetailView
          selectedTopic={selectedTopic}
          script={script}
          isGeneratingScript={isGeneratingScript}
          onGenerateScript={handleGenerateScript}
          onSaveScript={handleSaveScript}
          onBackToTopics={backToTopics}
          onCreateVideo={handleCreateVideo}
        />
      )}
    </div>
  );
};

export default TopicResearch;
