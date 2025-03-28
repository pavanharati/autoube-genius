
import { SearchBar } from "@/components/topics/SearchBar";
import TrendingTopicsTabs from "@/components/topics/TrendingTopicsTabs";
import TopicDetailView from "@/components/topics/TopicDetailView";
import { useTopicResearch } from "@/hooks/useTopicResearch";

const TopicResearch = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedTopic,
    script,
    isGeneratingScript,
    selectedPeriod,
    setSelectedPeriod,
    trendingTopics,
    isLoading,
    handleTopicSelect,
    handleGenerateScript,
    handleSaveScript,
    backToTopics,
    setTopicAndScript
  } = useTopicResearch();

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

          <TrendingTopicsTabs
            trendingTopics={trendingTopics}
            isLoading={isLoading}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
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
        />
      )}
    </div>
  );
};

export default TopicResearch;
