# VoxArticulate Supabase setup

## Database migrations

Run the SQL files in `migrations/` in filename order in the Supabase SQL Editor:

1. `202611250001_profiles.sql`
2. `202611250002_communication_sessions.sql`
3. `202611250003_assessments.sql`

The application also uses existing `courses`, `course_modules`, `lessons`, `enrollments`, and `lesson_progress` tables. These migrations do not recreate those existing application tables.

## AI speaking coach

The browser calls the `communication-coach` Supabase Edge Function. The function verifies the caller's Supabase access token and keeps the OpenAI API key on the server.

From the repository root, link the Supabase CLI to the existing project and deploy the function:

```powershell
supabase login
supabase link --project-ref YOUR_SUPABASE_PROJECT_REF
supabase secrets set OPENAI_API_KEY=YOUR_OPENAI_API_KEY
supabase secrets set OPENAI_MODEL=gpt-5.5
supabase functions deploy communication-coach
```

Replace the placeholders with your own project reference and API key. Do not put the OpenAI key in `client/.env.local`, Vite variables, GitHub source files, or browser code.

The Edge Function uses the OpenAI Responses API. API usage may incur charges under the OpenAI API account. The browser's built-in speech recognition and speech synthesis are separate browser capabilities and availability varies by browser and device.

## Local browser support

Use a current version of Chrome or Edge and grant microphone permission when prompted. If browser speech recognition is unavailable, the learner can type into the transcript field and submit the text to the coach.
