-- Optional demo records. Run after schema.sql.
insert into public.matches
(title, sport, tournament, team_a, team_b, team_a_score, team_b_score, start_time, status, venue)
values
('Demo Cricket Match', 'cricket', 'Demo Tournament', 'Bangladesh', 'India', null, null, now() + interval '2 hours', 'upcoming', 'Demo Stadium')
on conflict do nothing;

insert into public.channels (name, category, stream_url, description, status)
values
('Demo Authorized Sports Stream', 'sports', 'https://example.com/authorized-stream.m3u8', 'Replace with a stream you own or are licensed to distribute.', 'inactive')
on conflict do nothing;

insert into public.app_settings (key, value)
values
('app_name', '"AminX Sports"'::jsonb),
('maintenance_mode', 'false'::jsonb)
on conflict (key) do nothing;
