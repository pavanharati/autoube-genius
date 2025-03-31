
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowUpRight, ExternalLink, Calendar } from "lucide-react";
import { TrendingTopic } from "@/utils/api/googleTrends";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, parseISO } from 'date-fns';

interface GoogleTrendingCardProps {
  topic: TrendingTopic;
  rank: number;
  onClick: () => void;
}

const GoogleTrendingCard: React.FC<GoogleTrendingCardProps> = ({ topic, rank, onClick }) => {
  // Parse date if available
  const formattedDate = topic.pubDate ? 
    formatDistanceToNow(new Date(topic.pubDate), { addSuffix: true }) : 
    undefined;

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="text-xl font-bold text-muted-foreground mr-2">
            {rank}
          </div>
          
          <div className="space-y-2 flex-1">
            {/* Topic title */}
            <h3 className="font-medium text-lg line-clamp-1">{topic.topic}</h3>
            
            {/* Traffic and trend data */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {(topic.formattedTraffic || topic.searchVolume) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {topic.formattedTraffic || topic.searchVolume}
                </Badge>
              )}
              
              {topic.trend && (
                <Badge 
                  variant="outline" 
                  className={`
                    ${topic.trend.startsWith('+') ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}
                    flex items-center gap-1
                  `}
                >
                  <TrendingUp className="h-3 w-3" />
                  {topic.trend}
                </Badge>
              )}
              
              {formattedDate && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formattedDate}
                </Badge>
              )}
            </div>
            
            {/* Related article */}
            {topic.articles && topic.articles.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-1">Related Articles:</p>
                <div className="text-sm overflow-hidden text-ellipsis">
                  <a 
                    href={topic.articles[0].url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {topic.articles[0].title.length > 60 
                      ? topic.articles[0].title.substring(0, 60) + '...'
                      : topic.articles[0].title}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
            
            {/* Display picture if available */}
            {topic.picture && (
              <div className="mt-3">
                <img 
                  src={topic.picture} 
                  alt={topic.topic}
                  className="w-full max-h-32 object-cover rounded-md"
                />
                {topic.pictureSource && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Source: {topic.pictureSource}
                  </p>
                )}
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="ml-auto"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleTrendingCard;
