import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TopicResearch = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock trending topics data (in a real app, this would come from an API)
  const trendingTopics = [
    {
      topic: "AI in Daily Life",
      searchVolume: "850K",
      trend: "+15%",
      engagement: "High",
    },
    {
      topic: "Future of Work",
      searchVolume: "620K",
      trend: "+8%",
      engagement: "Medium",
    },
    {
      topic: "Sustainable Living",
      searchVolume: "450K",
      trend: "+12%",
      engagement: "High",
    },
    {
      topic: "Digital Privacy",
      searchVolume: "380K",
      trend: "+5%",
      engagement: "Medium",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Topic Research</h1>
        <p className="text-muted-foreground mt-2">
          Discover trending topics and content ideas for your videos
        </p>
      </div>

      {/* Search Section */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <input
          type="text"
          placeholder="Search for topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background"
        />
      </div>

      {/* Trending Topics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-semibold">Trending Topics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trendingTopics.map((topic, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{topic.topic}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Search Volume</p>
                    <p className="font-medium">{topic.searchVolume}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trend</p>
                    <p className="font-medium text-green-500">{topic.trend}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement</p>
                    <p className="font-medium">{topic.engagement}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicResearch;