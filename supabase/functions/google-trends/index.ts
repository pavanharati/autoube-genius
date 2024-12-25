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
    const { category } = await req.json()
    
    console.log('Fetching trends for category:', category)
    
    // Get real-time trends
    const trendData = await googleTrends.realTimeTrends({
      geo: 'US',
      category: category || 'all',
    })
    
    // Get related topics
    const relatedTopics = await googleTrends.relatedTopics({
      keyword: category || 'content creation',
      geo: 'US',
    })

    console.log('Successfully fetched trends data')

    return new Response(
      JSON.stringify({
        trends: JSON.parse(trendData),
        related: JSON.parse(relatedTopics),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error fetching trends:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})