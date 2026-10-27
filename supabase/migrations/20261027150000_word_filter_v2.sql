-- ConnectUni word filter, version 2 (App Store guideline 1.2). Run once, after 20261027130000_moderation.sql:
-- Supabase dashboard → SQL Editor → New query → paste everything → Run.
--
-- What changes:
-- • The words live in a table (public.blocked_words) instead of the function, so you can add one later without code:
--   Table Editor → blocked_words → Insert row (lowercase, whole_word = true if longer words must stay untouched).
-- • Common ways around a filter are caught too: capitals, repeated letters (fuuuck), digits and symbols for letters
--   (4rschl0ch, $chlampe, f*ck), dots or spaces between the letters of longer words (h u r e n s o h n, f.u.c.k) and
--   ß/ss, ä/ae, ö/oe, ü/ue.
-- • Texts saved before the filter existed are cleaned at the end of this script.
-- The triggers from the moderation migration keep calling public.clean_text, so they pick up the new version as is.
-- Running the script a second time does no harm.

-- ── The list ─────────────────────────────────────────────────────────────────────────────────────────────────────────

create table if not exists public.blocked_words (
  word text primary key check (word = lower(word) and char_length(word) between 3 and 60),
  -- false: also longer words that start with it ("hure" → "Hurensohn"); true: only the word itself ("spast", not "Spastik")
  whole_word boolean not null default false,
  note text
);
-- Only the filter reads it; nobody can list it through the API.
alter table public.blocked_words enable row level security;
revoke all on public.blocked_words from anon, authenticated;

insert into public.blocked_words (word, whole_word, note) values
  -- German insults
  ('arsch', false, null), ('arschloch', false, null), ('hure', false, null), ('hurensohn', false, null), ('huso', true, null), ('nutte', false, null),
  ('schlampe', false, null), ('fotze', false, null), ('wichs', false, null), ('wixer', false, null),
  ('missgeburt', false, null), ('mistgeburt', false, null), ('bastard', false, null), ('idiot', false, null),
  ('vollidiot', false, null), ('trottel', false, null), ('depp', true, null), ('penner', false, null),
  ('spast', true, null), ('spasti', true, null), ('spacko', false, null), ('pisser', false, null), ('piss', false, null),
  ('drecksau', false, null), ('drecksack', false, null), ('dreckskerl', false, null), ('dreckstück', false, null),
  ('schwanzlutscher', false, null), ('fresse', true, null), ('scheiß', false, null),
  ('du opfer', true, null), ('du opfa', true, null), ('du behinderter', true, null), ('du bist behindert', true, null),
  ('bist du behindert', true, null), ('verpiss dich', true, null), ('halt dein maul', true, null),
  ('halt''s maul', true, null), ('halt maul', true, null),
  -- Sexual
  ('fick', false, 'ficken, Ficker, fick dich'), ('gefickt', false, null), ('titte', false, null), ('pimmel', false, null),
  ('lutsch meinen', true, null), ('nacktbild', false, null), ('nacktfoto', false, null), ('dickpic', false, null),
  ('nudes', true, null), ('kinderporn', false, null), ('pädo', false, null),
  -- Slurs and hate
  ('schwuchtel', false, null), ('kanake', false, null), ('kanacke', false, null), ('neger', false, null),
  ('zigeuner', false, null), ('kümmeltürke', false, null), ('polacke', false, null), ('judensau', false, null),
  ('sieg heil', true, null), ('heil hitler', true, null),
  -- Threats and self-harm
  ('bring dich um', true, null), ('ich bring dich um', true, null), ('häng dich auf', true, null), ('töte dich', true, null),
  ('ich töte dich', true, null), ('ich stech dich ab', true, null), ('ich mach dich kalt', true, null),
  ('geh sterben', true, null), ('verreck', false, null),
  -- English
  ('fuck', false, null), ('motherfuck', false, null), ('fck', true, null), ('fuk', true, null), ('shit', true, null),
  ('shitty', false, null), ('shithead', false, null), ('bullshit', false, null), ('bitch', false, null),
  ('cunt', false, null), ('whore', false, null), ('slut', false, null), ('asshole', false, null), ('dickhead', false, null),
  ('cocksucker', false, null), ('pussy', true, null), ('wanker', false, null), ('twat', true, null), ('douche', false, null),
  ('moron', false, null), ('dumbass', false, null), ('jackass', false, null), ('retarded', true, null), ('retards', true, null), ('faggot', false, null), ('nigg', false, null), ('tranny', true, null),
  ('trannies', true, null), ('spic', true, null), ('chink', true, null), ('kike', true, null), ('rape', true, null),
  ('raped', true, null), ('rapist', true, null), ('suck my dick', true, null), ('suck my cock', true, null), ('send nudes', true, null), ('kys', true, null),
  ('kill yourself', true, null), ('kill urself', true, null), ('kill yourselves', true, null), ('go die', true, null),
  ('i will kill you', true, null), ('i''ll kill you', true, null)
on conflict (word) do nothing;

-- ── Turning a word into a pattern ────────────────────────────────────────────────────────────────────────────────────

-- Each letter accepts its usual stand-ins and repeats; longer single words also accept one dot, dash, star or space
-- between letters. Spaces in phrases mean "any whitespace", an apostrophe may be left out ("halts maul").
create or replace function public.word_pattern(word text, whole_word boolean) returns text
language plpgsql immutable set search_path = '' as $$
declare
  letter text;
  parts text[] := '{}';
  spaced boolean;
begin
  word := replace(word, 'ss', 'ß'); -- one unit that matches ss, ß and s: Missgeburt, Mißgeburt, Misgeburt
  spaced := position(' ' in word) = 0 and char_length(word) >= 4;
  foreach letter in array regexp_split_to_array(word, '') loop
    parts := parts || case letter
      when ' ' then '[[:space:]]+'
      when '''' then '[''’]?'
      when 'a' then '[a4@*]+'
      when 'b' then '[b8]+'
      when 'c' then '[ck]+'
      when 'e' then '[e3€*]+'
      when 'g' then '[g9]+'
      when 'i' then '[i1!|*]+'
      when 'l' then '[l1|]+'
      when 'o' then '[o0*]+'
      when 's' then '[s5$ß]+'
      when 't' then '[t7]+'
      when 'u' then '[uv*]+'
      when 'ä' then '(?:[äÄ]|ae)+'
      when 'ö' then '(?:[öÖ]|oe)+'
      when 'ü' then '(?:[üÜ]|ue)+'
      when 'ß' then '(?:ß|[s5$]+)'
      else regexp_replace(letter, '([^[:alnum:]])', '\\\1', 'g') || '+'
    end;
  end loop;
  return array_to_string(parts, case when spaced then '[[:space:]._*+-]?' else '' end)
    || case when whole_word then '(?![[:alnum:]_äöüÄÖÜß])' else '[[:alnum:]_äöüÄÖÜß]*' end;
end $$;

-- Same name and arguments as in the moderation migration, so its triggers (messages, profiles, hangouts, groups) use this.
-- Longer entries come first, so "hurensohn" wins over "hure" and the whole word is masked.
create or replace function public.clean_text(t text) returns text
language sql stable security definer set search_path = '' as $$
  select case when t is null or w.pattern is null then t else regexp_replace(t, w.pattern, '***', 'gi') end
  from (
    select '(?<![[:alnum:]_äöüÄÖÜß])(?:' || string_agg(public.word_pattern(word, whole_word), '|' order by char_length(word) desc, word) || ')' as pattern
    from public.blocked_words
  ) w
$$;

-- ── Clean what was saved before ──────────────────────────────────────────────────────────────────────────────────────

update public.messages set body = public.clean_text(body) where body <> public.clean_text(body);
update public.profiles set name = public.clean_text(name), bio = public.clean_text(bio)
  where name <> public.clean_text(name) or bio is distinct from public.clean_text(bio);
update public.hangouts set title = public.clean_text(title), place = public.clean_text(place)
  where title <> public.clean_text(title) or place <> public.clean_text(place);
update public.groups set name = public.clean_text(name), about = public.clean_text(about)
  where name <> public.clean_text(name) or about is distinct from public.clean_text(about);
