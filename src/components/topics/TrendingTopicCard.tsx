
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRAG } from "@/hooks/useRAG"
import { Spinner } from "@/components/ui/spinner"

interface TrendingTopicProps {
  topic: {
    topic: string
    searchVolume: string
    trend: string
    engagement: string
    relatedTopics?: string[]
  }
  onGenerateScript?: (script: string) => void
}

export const TrendingTopicCard = ({ topic, onGenerateScript }: TrendingTopicProps) => {
  const { generateEnhancedScript, isLoading } = useRAG();
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const handleGenerateSmartScript = async () => {
    if (generating) return;
    
    setGenerating(true);
    try {
      const script = await generateEnhancedScript({
        topic: topic.topic,
        style: 'informative',
        targetLength: 'medium'
      });
      
      if (onGenerateScript) {
        onGenerateScript(script);
      }
      
      toast({
        title: "Smart Script Generated",
        description: "Your enhanced script is ready using our RAG system",
      });
    } catch (error) {
      console.error("Error generating smart script:", error);
      toast({
        title: "Error",
        description: "Failed to generate smart script. Falling back to standard generation.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{topic.topic}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
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
        {onGenerateScript && (
          <Button 
            variant="outline" 
            className="w-full mt-2 gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20"
            onClick={handleGenerateSmartScript}
            disabled={generating}
          >
            {generating ? (
              <>
                <Spinner size="sm" className="text-blue-500" />
                Generating Smart Script...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-blue-500" />
                Generate Smart Script
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
