
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
  const { generateEnhancedScript, isInitialized, isLoading } = useRAG();
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
      
      if (onGenerateScript && script) {
        onGenerateScript(script);
      }
      
      toast({
        title: isInitialized ? "Smart Script Generated" : "Script Generated",
        description: isInitialized 
          ? "Your enhanced script is ready using our RAG system" 
          : "Script generated successfully (Knowledge base not initialized)",
      });
    } catch (error) {
      console.error("Error generating script:", error);
      toast({
        title: "Error",
        description: "Failed to generate script. Please try again.",
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
            className={`w-full mt-2 gap-2 ${isInitialized 
              ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20" 
              : ""}`}
            onClick={handleGenerateSmartScript}
            disabled={generating || isLoading}
          >
            {generating || isLoading ? (
              <>
                <Spinner size="sm" className="text-blue-500" />
                {isInitialized ? "Generating Smart Script..." : "Generating Script..."}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-blue-500" />
                {isInitialized ? "Generate Smart Script" : "Generate Script"}
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
