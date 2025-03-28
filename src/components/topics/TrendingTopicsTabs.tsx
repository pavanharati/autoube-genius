
import { useState } from "react";
import { TrendingUp, Clock, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TrendingTopicCard from "@/components/topics/TrendingTopicCard";
import { TrendingTopic } from "@/types/video";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TrendingTopicsTabsProps {
  trendingTopics: TrendingTopic[];
  isLoading: boolean;
  selectedPeriod: 'day' | 'week' | 'month';
  setSelectedPeriod: (period: 'day' | 'week' | 'month') => void;
  selectedRegion?: string;
  setSelectedRegion?: (region: string) => void;
  searchQuery: string;
  onTopicSelect: (topic: TrendingTopic) => void;
  onGenerateScript: (topic: TrendingTopic, script: string) => void;
}

const TrendingTopicsTabs = ({
  trendingTopics,
  isLoading,
  selectedPeriod,
  setSelectedPeriod,
  selectedRegion = 'US',
  setSelectedRegion,
  searchQuery,
  onTopicSelect,
  onGenerateScript
}: TrendingTopicsTabsProps) => {
  
  const regions = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'IN', name: 'India' },
    { code: 'JP', name: 'Japan' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
  ];

  const filteredTopics = searchQuery 
    ? trendingTopics.filter(topic => 
        topic.topic.toLowerCase().includes(searchQuery.toLowerCase()))
    : trendingTopics;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <Tabs defaultValue={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as 'day' | 'week' | 'month')} className="mr-4">
          <TabsList>
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
        </Tabs>
        
        {setSelectedRegion && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {regions.find(r => r.code === selectedRegion)?.name || 'United States'}
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
        )}
      </div>

      {["day", "week", "month"].map((period) => (
        <div key={period} className={period === selectedPeriod ? 'block' : 'hidden'}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold">
              {period === 'day' ? "Today's" : 
              period === 'week' ? "This Week's" : 
              "This Month's"} Trending Topics in {regions.find(r => r.code === selectedRegion)?.name || 'United States'}
            </h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((_, index) => (
                <Card key={index} className="h-64">
                  <SkeletonTopicCard />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTopics.length > 0 ? (
                filteredTopics.filter(t => t.period === period).map((topic, index) => (
                  <div 
                    key={index} 
                    onClick={() => onTopicSelect(topic)}
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                  >
                    <TrendingTopicCard 
                      topic={topic} 
                      onGenerateScript={(generatedScript) => {
                        onGenerateScript(topic, generatedScript);
                      }} 
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  No trending topics found matching your search. Try adjusting your search query.
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const SkeletonTopicCard = () => (
  <div className="p-6">
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
  </div>
);

export default TrendingTopicsTabs;
