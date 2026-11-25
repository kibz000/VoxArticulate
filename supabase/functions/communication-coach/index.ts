import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const instructions = `
You are VoxArticulate, a supportive professional communication and speaking coach.
Coach the learner in the selected mode: Speech Practice, Conversation Simulator, or Articulation Coach.
Respond naturally as a conversation partner first. Then give one concise, practical observation about clarity, structure, concision, vocabulary or the next useful step.
Ask at most one follow-up question so the learner can continue speaking.
Never claim to measure accent, pronunciation, confidence, emotion or vocal quality from a text transcript. You only receive the words recognised by the browser.
Be encouraging, specific and honest. Do not overpraise. Keep replies concise enough to be spoken aloud.
`.trim()

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
  const model = Deno.env.get('OPENAI_MODEL') || 'gpt-5.5'

  if (!supabaseUrl || !supabaseAnonKey || !openAiApiKey) {
    return json(503, {
      error: 'The speaking coach is not configured yet. Add the server-side OpenAI API secret in Supabase Edge Function secrets.',
    })
  }

  const authorization = request.headers.get('Authorization')
  if (!authorization?.startsWith('Bearer ')) {
    return json(401, { error: 'Sign in to use the speaking coach.' })
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) {
    return json(401, { error: 'Your session is invalid or expired. Please sign in again.' })
  }

  let payload: {
    mode?: string
    transcript?: string
    history?: { role?: string; content?: string }[]
  }

  try {
    payload = await request.json()
  } catch {
    return json(400, { error: 'The request body must be valid JSON.' })
  }

  const allowedModes = [
    'Speech Practice',
    'Conversation Simulator',
    'Articulation Coach',
  ]
  const mode = payload.mode
  const transcript = payload.transcript?.trim() ?? ''

  if (!mode || !allowedModes.includes(mode)) {
    return json(400, { error: 'Choose a valid speaking practice mode.' })
  }
  if (!transcript || transcript.length > 5000) {
    return json(400, { error: 'Your speaking turn must contain between 1 and 5,000 characters.' })
  }

  const previousTurns = (payload.history ?? [])
    .slice(-8)
    .filter(
      item =>
        (item.role === 'assistant' || item.role === 'user') &&
        typeof item.content === 'string' &&
        item.content.length > 0 &&
        item.content.length <= 2000,
    )
    .map(item => ({ role: item.role as 'assistant' | 'user', content: item.content! }))

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        instructions: `${instructions}\nPractice mode: ${mode}.`,
        input: [
          ...previousTurns,
          { role: 'user', content: transcript },
        ],
        max_output_tokens: 220,
        store: false,
      }),
    })

    const result = await response.json()
    if (!response.ok) {
      console.error('OpenAI Responses API error:', response.status, result?.error?.type)
      return json(502, {
        error: 'The speaking coach could not respond right now. Please try again shortly.',
      })
    }

    const reply = (result.output ?? [])
      .filter((item: { type?: string }) => item.type === 'message')
      .flatMap((item: { content?: { type?: string; text?: string }[] }) => item.content ?? [])
      .filter((item: { type?: string }) => item.type === 'output_text')
      .map((item: { text?: string }) => item.text ?? '')
      .join('\n')
      .trim()

    if (!reply) {
      return json(502, { error: 'The speaking coach returned an empty response. Please try again.' })
    }

    return json(200, { reply })
  } catch (error) {
    console.error('Speaking coach request failed:', error)
    return json(502, { error: 'We could not reach the speaking coach. Check your connection and try again.' })
  }
})
