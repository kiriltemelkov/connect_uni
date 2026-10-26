-- ConnectUni push notifications: one row per phone. The "push" Edge Function (supabase/functions/push) reads this table.
-- Run once: Supabase dashboard → SQL Editor → New query → paste everything → Run.

create table public.push_tokens (
  token text primary key check (char_length(token) between 32 and 400),
  user_id uuid not null references auth.users (id) on delete cascade,
  lang text not null default 'de' check (lang in ('de', 'en')),
  updated_at timestamptz not null default now()
);
create index push_tokens_user_idx on public.push_tokens (user_id);

-- No policies on purpose: the app only goes through the two functions below, and the Edge Function uses the service role.
alter table public.push_tokens enable row level security;

-- A phone that signs in with another account moves to that account.
create function public.save_push_token(device_token text, language text) returns void
language sql security definer set search_path = '' as $$
  insert into public.push_tokens (token, user_id, lang)
  values (device_token, auth.uid(), case when language = 'en' then 'en' else 'de' end)
  on conflict (token) do update set user_id = auth.uid(), lang = excluded.lang, updated_at = now()
$$;

create function public.delete_push_token(device_token text) returns void
language sql security definer set search_path = '' as $$
  delete from public.push_tokens where token = device_token and user_id = auth.uid()
$$;

revoke execute on function public.save_push_token(text, text), public.delete_push_token(text) from public, anon;
grant execute on function public.save_push_token(text, text), public.delete_push_token(text) to authenticated;
