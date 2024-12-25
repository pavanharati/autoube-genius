import { useState } from "react"
import { TrendingUp } from "lucide-react"
import { useGoogleTrends } from "@/hooks/useGoogleTrends"
import { SearchBar } from "@/components/topics/SearchBar"
import { TrendingTopicCard } from "@/components/topics/TrendingTopicCard"
import { useToast } from "@/hooks/use-toast"

const TopicResearch = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const { data: trendingTopics, isLoading, error } = useGoogleTrends()

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch trending topics",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Topic Research</h1>
        <p className="text-muted-foreground mt-2">
          Discover trending topics and content ideas for your videos
        </p>
      </div>

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
            {trendingTopics?.map((topic, index) => (
              <TrendingTopicCard key={index} topic={topic} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TopicResearch