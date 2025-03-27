
import { useQuery } from "@tanstack/react-query"
import { fetchTrendingTopics, TrendingTopic } from "@/utils/api/googleTrends"

export const useGoogleTrends = (category?: string) => {
  return useQuery({
    queryKey: ["google-trends", category],
    queryFn: async (): Promise<TrendingTopic[]> => {
      return fetchTrendingTopics(category);
    },
  })
}
