
import { useQuery } from "@tanstack/react-query"
import { fetchTrendingTopics, TrendingTopic } from "@/utils/api/googleTrends"

export const useGoogleTrends = (category?: string, period?: 'day' | 'week' | 'month') => {
  return useQuery({
    queryKey: ["google-trends", category, period],
    queryFn: async (): Promise<TrendingTopic[]> => {
      return fetchTrendingTopics(category, period);
    },
    staleTime: period === 'day' ? 1000 * 60 * 30 : // 30 minutes for daily trends
              period === 'week' ? 1000 * 60 * 60 * 2 : // 2 hours for weekly trends
              1000 * 60 * 60 * 6, // 6 hours for monthly trends
  })
}
