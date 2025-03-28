
import { SearchBar } from "@/components/topics/SearchBar";
import TrendingTopicsTabs from "@/components/topics/TrendingTopicsTabs";
import TopicDetailView from "@/components/topics/TopicDetailView";
import { useTopicResearch } from "@/hooks/useTopicResearch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

const TopicResearch = () => {
  const [showRagError, setShowRagError] = useState(false);
  
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
    setTopicAndScript
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
          <AlertDescription>
            We've detected an issue with the Retrieval-Augmented Generation system.
            Using fallback search methods for now. Your experience won't be affected.
          </AlertDescription>
        </Alert>
      )}

      {!selectedTopic ? (
        <>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

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
