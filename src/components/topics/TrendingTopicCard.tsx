
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TrendingTopicProps {
  topic: {
    topic: string
    searchVolume: string
    trend: string
    engagement: string
    relatedTopics?: string[]
  }
}

export const TrendingTopicCard = ({ topic }: TrendingTopicProps) => {
  return (
    <Card className="h-full">
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
  )
}
