create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.assessment_questions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  prompt text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array'),
  position integer not null,
  is_published boolean not null default true,
  unique (assessment_id, position)
);

-- Answer keys are deliberately separated from the learner-readable questions.
create table if not exists public.assessment_answer_keys (
  question_id uuid primary key references public.assessment_questions(id) on delete cascade,
  correct_option_index integer not null check (correct_option_index >= 0),
  explanation text not null default ''
);

create table if not exists public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null check (score >= 0),
  total_questions integer not null check (total_questions > 0),
  percentage integer not null check (percentage between 0 and 100),
  submitted_at timestamptz not null default now()
);

create index if not exists assessment_attempts_user_submitted_idx
  on public.assessment_attempts(user_id, submitted_at desc);

create table if not exists public.assessment_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.assessment_attempts(id) on delete cascade,
  question_id uuid not null references public.assessment_questions(id) on delete restrict,
  selected_option_index integer not null check (selected_option_index >= 0),
  is_correct boolean not null,
  unique (attempt_id, question_id)
);

alter table public.assessments enable row level security;
alter table public.assessment_questions enable row level security;
alter table public.assessment_answer_keys enable row level security;
revoke all on public.assessment_answer_keys from anon, authenticated;
alter table public.assessment_attempts enable row level security;
alter table public.assessment_answers enable row level security;

drop policy if exists "Learners can view published assessments" on public.assessments;
create policy "Learners can view published assessments"
  on public.assessments for select to authenticated
  using (is_published = true);

drop policy if exists "Learners can view questions for published assessments" on public.assessment_questions;
create policy "Learners can view questions for published assessments"
  on public.assessment_questions for select to authenticated
  using (
    is_published = true
    and exists (
      select 1 from public.assessments a
      where a.id = assessment_id and a.is_published = true
    )
  );

drop policy if exists "Learners can view their own assessment attempts" on public.assessment_attempts;
create policy "Learners can view their own assessment attempts"
  on public.assessment_attempts for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Learners can view answers from their own attempts" on public.assessment_answers;
create policy "Learners can view answers from their own attempts"
  on public.assessment_answers for select to authenticated
  using (
    exists (
      select 1 from public.assessment_attempts a
      where a.id = attempt_id and a.user_id = auth.uid()
    )
  );

grant select on public.assessments, public.assessment_questions,
  public.assessment_attempts, public.assessment_answers to authenticated;

create or replace function public.submit_assessment(
  p_assessment_id uuid,
  p_answers jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_total integer;
  v_unique_answers integer;
  v_score integer := 0;
  v_attempt_id uuid;
  v_answer jsonb;
  v_question_id uuid;
  v_selected integer;
  v_correct integer;
  v_options jsonb;
begin
  if v_user_id is null then
    raise exception 'Authentication is required.';
  end if;

  if p_answers is null or jsonb_typeof(p_answers) is distinct from 'array' then
    raise exception 'Answers must be supplied as an array.';
  end if;

  if not exists (
    select 1 from public.assessments a
    where a.id = p_assessment_id and a.is_published = true
  ) then
    raise exception 'This assessment is unavailable.';
  end if;

  select count(*) into v_total
  from public.assessment_questions q
  where q.assessment_id = p_assessment_id and q.is_published = true;

  select count(distinct value ->> 'question_id') into v_unique_answers
  from jsonb_array_elements(p_answers);

  if v_total = 0 or jsonb_array_length(p_answers) <> v_total
     or v_unique_answers <> v_total then
    raise exception 'Submit exactly one answer for every assessment question.';
  end if;

  for v_answer in select value from jsonb_array_elements(p_answers)
  loop
    v_question_id := (v_answer ->> 'question_id')::uuid;
    v_selected := (v_answer ->> 'selected_option_index')::integer;

    select q.options, k.correct_option_index
      into v_options, v_correct
    from public.assessment_questions q
    join public.assessment_answer_keys k on k.question_id = q.id
    where q.id = v_question_id
      and q.assessment_id = p_assessment_id
      and q.is_published = true;

    if not found then
      raise exception 'An answer refers to an invalid assessment question.';
    end if;

    if v_selected < 0 or v_selected >= jsonb_array_length(v_options) then
      raise exception 'An answer contains an invalid option.';
    end if;

    if v_selected = v_correct then
      v_score := v_score + 1;
    end if;
  end loop;

  insert into public.assessment_attempts (
    assessment_id, user_id, score, total_questions, percentage
  )
  values (
    p_assessment_id,
    v_user_id,
    v_score,
    v_total,
    round((v_score::numeric / v_total) * 100)::integer
  )
  returning id into v_attempt_id;

  for v_answer in select value from jsonb_array_elements(p_answers)
  loop
    v_question_id := (v_answer ->> 'question_id')::uuid;
    v_selected := (v_answer ->> 'selected_option_index')::integer;

    select k.correct_option_index into v_correct
    from public.assessment_answer_keys k
    where k.question_id = v_question_id;

    insert into public.assessment_answers (
      attempt_id, question_id, selected_option_index, is_correct
    )
    values (
      v_attempt_id, v_question_id, v_selected, v_selected = v_correct
    );
  end loop;

  return jsonb_build_object(
    'attempt_id', v_attempt_id,
    'score', v_score,
    'total_questions', v_total,
    'percentage', round((v_score::numeric / v_total) * 100)::integer
  );
end;
$$;

revoke all on function public.submit_assessment(uuid, jsonb) from public;
grant execute on function public.submit_assessment(uuid, jsonb) to authenticated;

insert into public.assessments (id, slug, title, description, is_published)
values (
  '00000000-0000-4000-8000-000000000001',
  'communication-foundations',
  'Communication Foundations Assessment',
  'Check your understanding of the core principles of effective communication.',
  true
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  is_published = excluded.is_published;

insert into public.assessment_questions (id, assessment_id, prompt, options, position, is_published)
values
(
  '00000000-0000-4000-8000-000000000011',
  '00000000-0000-4000-8000-000000000001',
  'Which statement best describes communication?',
  '["The process of exchanging information and meaning.","The act of speaking loudly.","The process of memorising information.","The ability to write long messages."]'::jsonb,
  1, true
),
(
  '00000000-0000-4000-8000-000000000012',
  '00000000-0000-4000-8000-000000000001',
  'Which element allows a receiver to respond to a message?',
  '["Encoding","Feedback","Noise","Channel"]'::jsonb,
  2, true
),
(
  '00000000-0000-4000-8000-000000000013',
  '00000000-0000-4000-8000-000000000001',
  'Which of the following is an example of non-verbal communication?',
  '["Writing an email","Giving a speech","Maintaining eye contact","Reading a book"]'::jsonb,
  3, true
)
on conflict (assessment_id, position) do update set
  prompt = excluded.prompt,
  options = excluded.options,
  is_published = excluded.is_published;

insert into public.assessment_answer_keys (question_id, correct_option_index, explanation)
values
  ('00000000-0000-4000-8000-000000000011', 0, 'Communication involves exchanging information and meaning between participants.'),
  ('00000000-0000-4000-8000-000000000012', 1, 'Feedback allows the receiver to respond to the sender.'),
  ('00000000-0000-4000-8000-000000000013', 2, 'Eye contact is a form of non-verbal communication.')
on conflict (question_id) do update set
  correct_option_index = excluded.correct_option_index,
  explanation = excluded.explanation;
