
import { useQuery } from "@tanstack/react-query"
import { fetchTrendingTopics, TrendingTopic } from "@/utils/api/googleTrends"

export const useGoogleTrends = (category?: string, period?: 'day' | 'week' | 'month', region: string = 'US') => {
  return useQuery({
    queryKey: ["google-trends", category, period, region],
    queryFn: async (): Promise<TrendingTopic[]> => {
      return fetchTrendingTopics(category, period, region);
    },
    staleTime: period === 'day' ? 1000 * 60 * 30 : // 30 minutes for daily trends
              period === 'week' ? 1000 * 60 * 60 * 2 : // 2 hours for weekly trends
              1000 * 60 * 60 * 6, // 6 hours for monthly trends
    retry: 2,
    onError: (error) => {
      console.error("Failed to fetch Google Trends:", error);
    }
  })
}
