
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import googleTrends from 'npm:google-trends-api'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { topic, period } = await req.json()
    
    if (!topic) {
      throw new Error("Topic is required")
    }
    
    console.log(`Getting insights for topic: ${topic}, period: ${period || 'day'}`)
    
    // Different time ranges based on period parameter
    const timeRange = period === 'month' ? 'today 1-m' : 
                     period === 'week' ? 'today 7-d' : 
                     'now 1-d'
    
    // Get related queries
    const relatedQueries = await googleTrends.relatedQueries({
      keyword: topic,
      geo: 'US',
      hl: 'en-US',
      time: timeRange
    })
    
    // Get interest over time
    const interestOverTime = await googleTrends.interestOverTime({
      keyword: topic,
      geo: 'US',
      time: timeRange
    })
    
    console.log('Successfully fetched topic insights')

    // Process the data
    const relatedQueriesData = JSON.parse(relatedQueries);
    const interestData = JSON.parse(interestOverTime);
    
    // Extract related queries
    let queries = [];
    try {
      if (relatedQueriesData.default && relatedQueriesData.default.rankedList) {
        const rankedList = relatedQueriesData.default.rankedList[0];
        if (rankedList && rankedList.rankedKeyword) {
          queries = rankedList.rankedKeyword.slice(0, 5).map(item => item.query);
        }
      }
    } catch (e) {
      console.error('Error parsing related queries:', e);
      queries = [`${topic} tutorial`, `${topic} guide`, `${topic} for beginners`];
    }
    
    // Calculate trend percentage
    let trendPercentage = "+10%"; // Default value
    try {
      if (interestData.default && interestData.default.timelineData) {
        const timeline = interestData.default.timelineData;
        if (timeline.length >= 2) {
          const current = parseInt(timeline[timeline.length - 1].value[0]);
          const previous = parseInt(timeline[0].value[0]);
          
          if (previous > 0) {
            const percentage = Math.round(((current - previous) / previous) * 100);
            trendPercentage = (percentage >= 0 ? "+" : "") + percentage + "%";
          }
        }
      }
    } catch (e) {
      console.error('Error calculating trend percentage:', e);
    }
    
    // Generate search volume (mock)
    const volumeBase = Math.floor(Math.random() * 900) + 100;
    const searchVolume = `${volumeBase}K`;
    
    return new Response(
      JSON.stringify({
        searchVolume,
        trend: trendPercentage,
        relatedQueries: queries,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error getting topic insights:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
