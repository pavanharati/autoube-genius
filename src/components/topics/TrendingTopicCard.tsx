
import { TrendingTopic } from "@/utils/api/googleTrends";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { generateScript } from "@/utils/api/openai";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TrendingTopicCardProps {
  topic: TrendingTopic;
  onGenerateScript: (script: string) => void;
}

const TrendingTopicCard = ({ topic, onGenerateScript }: TrendingTopicCardProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateScript = async () => {
    setIsGenerating(true);
    try {
      const script = await generateScript({
        topic: topic.topic,
        style: "informative",
        targetLength: "medium",
      });
      
      onGenerateScript(script);
      
      toast({
        title: "Script Generated",
        description: "Your script has been generated successfully",
      });
    } catch (error) {
      console.error("Failed to generate script:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your script. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <div className="flex items-center justify-between mb-4">
          <Badge 
            variant="outline" 
            className={`
              ${topic.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}
              flex items-center gap-1
            `}
          >
            <TrendingUp className="h-3 w-3" />
            {topic.trend}
          </Badge>
          
          {topic.period && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {topic.period === 'day' ? 'Today' : 
               topic.period === 'week' ? 'This Week' : 
               'This Month'}
            </Badge>
          )}
        </div>
        
        <h3 className="font-semibold text-lg mb-2">{topic.topic}</h3>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Search Volume</p>
            <p className="font-medium">{topic.searchVolume}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Engagement</p>
            <p className="font-medium">{topic.engagement}</p>
          </div>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground mb-2">Related Topics</p>
          <div className="flex flex-wrap gap-1">
            {topic.relatedTopics.map((relatedTopic, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {relatedTopic}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 pb-6">
        <Button 
          onClick={handleGenerateScript} 
          className="w-full gap-2" 
          disabled={isGenerating}
        >
          <FileText className="h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate Script"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TrendingTopicCard;
