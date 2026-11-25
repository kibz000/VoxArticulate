import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (request.method !== 'POST') {
    return json(405, { error: 'Method not allowed.' })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const openAiApiKey = Deno.env.get('OPENAI_API_KEY')
  const model = Deno.env.get('OPENAI_REALTIME_MODEL') || 'gpt-realtime-2.1'

  if (!supabaseUrl || !supabaseAnonKey || !openAiApiKey) {
    return json(503, { error: 'The live voice service is not configured. Add the OpenAI API key to Supabase Edge Function secrets.' })
  }

  const authorization = request.headers.get('Authorization')
  if (!authorization?.startsWith('Bearer ')) {
    return json(401, { error: 'Sign in to start a live voice session.' })
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) {
    return json(401, { error: 'Your session is invalid or expired. Please sign in again.' })
  }

  const modeInstructions: Record<string, string> = {
    'Speech Practice': 'Coach the learner as they practise a short speech. Help them organise an opening, central message, supporting points and conclusion. Give concise, constructive spoken feedback.',
    'Conversation Simulator': 'Act as a realistic conversation partner. Set a natural scenario, respond to what the learner says, ask one relevant follow-up question, and help the learner communicate naturally.',
    'Articulation Coach': 'Help the learner express ideas precisely and concisely. Encourage clear sentence structure, useful vocabulary and thoughtful pauses. Do not make claims about pronunciation unless audio evidence supports it.',
  }

  let mode = 'Conversation Simulator'
  try {
    const body = await request.json()
    if (typeof body?.mode === 'string' && modeInstructions[body.mode]) {
      mode = body.mode
    }
  } catch {
    // The default conversation mode is safe when the request has no JSON body.
  }

  const userHash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(authData.user.id),
  )
  const safetyIdentifier = Array.from(new Uint8Array(userHash))
    .map(value => value.toString(16).padStart(2, '0'))
    .join('')

  try {
    const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Safety-Identifier': safetyIdentifier,
      },
      body: JSON.stringify({
        expires_after: { seconds: 600 },
        session: {
          type: 'realtime',
          model,
          instructions: `You are VoxArticulate, a warm, intelligent and practical communication coach. ${modeInstructions[mode]} Be natural and conversational. Encourage the learner to speak in complete thoughts, but do not dominate the conversation. Keep feedback specific and supportive. Never infer or claim to measure the learner's confidence, emotions, identity or accent.`,
          audio: {
            input: {
              transcription: { model: 'gpt-4o-mini-transcribe' },
              turn_detection: { type: 'server_vad' },
            },
            output: { voice: 'marin' },
          },
        },
      }),
    })

    const result = await response.json()
    if (!response.ok) {
      console.error('OpenAI Realtime token error:', response.status, result?.error?.type)
      return json(502, { error: 'The live voice service could not start. Please try again shortly.' })
    }

    if (typeof result?.value !== 'string') {
      return json(502, { error: 'The live voice service did not return a session token.' })
    }

    return json(200, {
      value: result.value,
      expires_at: result.expires_at,
      model,
    })
  } catch (error) {
    console.error('Realtime token request failed:', error)
    return json(502, { error: 'We could not start the live voice session. Check your connection and try again.' })
  }
})
