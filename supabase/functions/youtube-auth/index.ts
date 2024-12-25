import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { google } from 'npm:googleapis'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const REDIRECT_URL = Deno.env.get('REDIRECT_URL') || 'http://localhost:5173/videos'
const CLIENT_ID = Deno.env.get('YOUTUBE_CLIENT_ID')
const CLIENT_SECRET = Deno.env.get('YOUTUBE_CLIENT_SECRET')

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { code, action } = await req.json()

    if (action === 'getAuthUrl') {
      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/youtube.upload',
          'https://www.googleapis.com/auth/youtube',
        ],
      })

      return new Response(
        JSON.stringify({ url }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'getToken') {
      const { tokens } = await oauth2Client.getToken(code)
      oauth2Client.setCredentials(tokens)

      // Store tokens in Supabase
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const { error } = await supabaseClient
        .from('youtube_tokens')
        .upsert({
          user_id: req.headers.get('x-user-id'),
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expiry_date: tokens.expiry_date,
        })

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})