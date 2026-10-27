-- ConnectUni moderation for App Store guideline 1.2: a word filter and bans. Run once, after 20261023120000_init.sql:
-- Supabase dashboard → SQL Editor → New query → paste everything → Run.

-- ── Word filter ─────────────────────────────────────────────────────────────────

-- Insults, slurs, sexual harassment and threats in German and English become *** before anything is saved.
-- Entries ending in \w* also catch longer forms (hure\w* → Hurensohn); the rest only match whole words, so
-- "Fick'sches Gesetz", Cocktail, Fagott, spicken and spastisch stay as they are.
create function public.clean_text(t text) returns text
language sql immutable set search_path = '' as $$
  select regexp_replace(t, '\m(' || array_to_string(array[
    'arschloch\w*', 'fotze\w*', 'hure\w*', 'nutte\w*', 'schlampe\w*', 'wichser\w*', 'wixx?er\w*', 'missgeburt\w*',
    'schwuchtel\w*', 'kanac?ke\w*', 'neger\w*', 'spast', 'spasti', 'spacko\w*', 'pisser\w*', 'drecksau', 'drecksack\w*',
    'dreckschwein\w*', 'ficke', 'ficken', 'fickst', 'fickt', 'fickte\w*', 'gefickt\w*', 'ficker\w*', 'fick\s+dich',
    'bring\s+dich\s+um', 'häng\s+dich\s+auf', 'töte\s+dich', 'kinderporn\w*', 'judensau', 'sieg\s+heil', 'heil\s+hitler',
    'fuck\w*', 'motherfuck\w*', 'cunt\w*', 'bitch\w*', 'whore\w*', 'slut\w*', 'asshole\w*', 'dickhead\w*', 'cock',
    'cocksucker\w*', 'pussy', 'nigg(?:er|a)\w*', 'faggot\w*', 'tranny', 'trannies', 'retarded', 'retards', 'spic', 'chink',
    'kike', 'kys', 'kill\s+(?:yourself|urself|yourselves)'
  ], '|') || ')\M', '***', 'gi')
$$;

-- Everything other students can read: messages, names and bios, hangouts, groups.
create function public.clean_row() returns trigger
language plpgsql set search_path = '' as $$
begin
  case tg_table_name
    when 'messages' then
      new.body := public.clean_text(new.body);
    when 'profiles' then
      new.name := public.clean_text(new.name);
      new.bio := public.clean_text(new.bio);
    when 'hangouts' then
      new.title := public.clean_text(new.title);
      new.place := public.clean_text(new.place);
    when 'groups' then
      new.name := public.clean_text(new.name);
      new.about := public.clean_text(new.about);
  end case;
  return new;
end $$;
create trigger messages_clean before insert or update of body on public.messages for each row execute function public.clean_row();
create trigger profiles_clean before insert or update of name, bio on public.profiles for each row execute function public.clean_row();
create trigger hangouts_clean before insert or update of title, place on public.hangouts for each row execute function public.clean_row();
create trigger groups_clean before insert or update of name, about on public.groups for each row execute function public.clean_row();

-- ── Bans ────────────────────────────────────────────────────────────────────────

create function public.is_banned() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select banned_until > now() from auth.users where id = auth.uid()), false)
$$;

-- A banned student can't make a new profile, not even with a session that is still valid.
create policy "profiles: not banned" on public.profiles as restrictive for insert to authenticated
  with check (not public.is_banned());

-- Removes a student after a report: their profile, messages and hangouts are deleted, and the email can't sign in
-- again. Run in the SQL Editor:  select public.ban_user('name@uni.de');
-- It returns their account ID. Their photo stays in Storage → avatars → <account ID>: delete that folder there.
create function public.ban_user(address text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  target uuid;
begin
  select id into target from auth.users where lower(email) = lower(trim(address));
  if target is null then
    raise exception 'No account with the email %', address;
  end if;
  update auth.users set banned_until = now() + interval '100 years' where id = target;
  delete from public.profiles where id = target;
  return target;
end $$;

revoke execute on function public.ban_user(text) from public, anon, authenticated;
