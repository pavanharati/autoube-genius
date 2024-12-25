import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface TrendingTopic {
  topic: string
  searchVolume: string
  trend: string
  engagement: string
}

export const useGoogleTrends = (category?: string) => {
  return useQuery({
    queryKey: ["google-trends", category],
    queryFn: async (): Promise<TrendingTopic[]> => {
      const { data, error } = await supabase.functions.invoke("google-trends", {
        body: { category },
      })

      if (error) throw error

      // Transform the data into the format we need
      return data.trends.map((trend: any) => ({
        topic: trend.title,
        searchVolume: `${Math.floor(trend.traffic / 1000)}K`,
        trend: `+${trend.trend}%`,
        engagement: trend.engagement > 70 ? "High" : "Medium",
      }))
    },
  })
}