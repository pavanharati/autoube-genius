
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { niche, period } = await req.json();
    
    // In a production environment, this would connect to Google Trends API
    // and scrape real trending topics. For now, we'll return mock data
    
    // Mock trending topics based on niche and period
    const topics = generateMockTrendingTopics(niche, period);
    
    return new Response(
      JSON.stringify({ topics }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});

function generateMockTrendingTopics(niche: string, period: string) {
  // Various mock trending topics by category
  const topicsByCategory: Record<string, Array<{title: string, trendingScore: number}>> = {
    technology: [
      { title: "AI Tools for Content Creators", trendingScore: 95 },
      { title: "Web Development Trends 2024", trendingScore: 88 },
      { title: "Best Coding Practices", trendingScore: 82 },
      { title: "Cloud Computing Solutions", trendingScore: 79 },
      { title: "Cybersecurity Tips", trendingScore: 75 }
    ],
    business: [
      { title: "Remote Work Strategies", trendingScore: 92 },
      { title: "Digital Marketing Tips", trendingScore: 87 },
      { title: "Startup Funding Guide", trendingScore: 84 },
      { title: "Financial Planning for Entrepreneurs", trendingScore: 81 },
      { title: "E-commerce Success Stories", trendingScore: 78 }
    ],
    education: [
      { title: "Learning Programming Fast", trendingScore: 90 },
      { title: "Study Techniques That Work", trendingScore: 86 },
      { title: "Online Course Creation", trendingScore: 83 },
      { title: "Educational Technology Tools", trendingScore: 80 },
      { title: "Teaching Skills Improvement", trendingScore: 77 }
    ],
    fitness: [
      { title: "15-Minute Workout Routines", trendingScore: 93 },
      { title: "Nutrition Tips for Athletes", trendingScore: 89 },
      { title: "Home Fitness Equipment", trendingScore: 85 },
      { title: "Weight Loss Success Stories", trendingScore: 82 },
      { title: "Mental Health and Exercise", trendingScore: 79 }
    ],
    all: [
      { title: "AI Tools Revolutionizing Industries", trendingScore: 98 },
      { title: "Work-Life Balance Tips", trendingScore: 94 },
      { title: "Financial Freedom Strategies", trendingScore: 91 },
      { title: "Health and Wellness Trends", trendingScore: 88 },
      { title: "Personal Development Hacks", trendingScore: 85 }
    ]
  };
  
  // Use the specified niche or default to 'all'
  const selectedNiche = niche && topicsByCategory[niche] ? niche : 'all';
  
  // Adjust trending score based on period
  const periodMultiplier = period === 'day' ? 1.2 : period === 'week' ? 1 : 0.8;
  
  return topicsByCategory[selectedNiche].map(topic => ({
    title: topic.title,
    category: selectedNiche,
    trendingScore: Math.min(Math.floor(topic.trendingScore * periodMultiplier), 100),
    period: period || 'day',
    searchVolume: `${Math.floor(Math.random() * 900) + 100}K`,
  }));
}
