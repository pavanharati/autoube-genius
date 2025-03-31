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
    const { category, period, region = 'US', keyword } = await req.json()
    
    console.log(`Fetching trends for category: ${category}, period: ${period || 'day'}, region: ${region}, keyword: ${keyword || 'none'}`)
    
    // Different time ranges based on period parameter
    const timeRange = period === 'month' ? 'today 1-m' : 
                      period === 'week' ? 'today 7-d' : 
                      'now 1-d'

    let dailyTrends, realtimeTrends, relatedTopics, interestOverTime;

    // Get daily trending searches
    dailyTrends = await googleTrends.dailyTrends({
      geo: region,
      timezone: -240, // EST timezone
    });
    
    // Get real-time trends
    realtimeTrends = await googleTrends.realTimeTrends({
      geo: region,
      category: category || 'all',
    });
    
    // If a keyword is provided, get related topics and interest over time for that keyword
    if (keyword) {
      relatedTopics = await googleTrends.relatedTopics({
        keyword: keyword,
        geo: region,
        hl: 'en-US',
        timezone: -240,
        time: timeRange,
      });
      
      interestOverTime = await googleTrends.interestOverTime({
        keyword: keyword,
        geo: region,
        time: timeRange,
      });
    } else {
      // Otherwise use the default queries
      relatedTopics = await googleTrends.relatedTopics({
        keyword: category || 'content creation',
        geo: region,
        hl: 'en-US',
        timezone: -240,
        time: timeRange,
      });
      
      interestOverTime = await googleTrends.interestOverTime({
        keyword: ['YouTube', 'TikTok', 'Instagram Reels'],
        geo: region,
        time: timeRange,
      });
    }

    console.log('Successfully fetched trends data')

    return new Response(
      JSON.stringify({
        daily: JSON.parse(dailyTrends),
        realtime: JSON.parse(realtimeTrends),
        related: JSON.parse(relatedTopics),
        interest: JSON.parse(interestOverTime),
        timestamp: new Date().toISOString(),
        period: period || 'day',
        region: region,
        keyword: keyword || null,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error fetching trends:', error)
    
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
