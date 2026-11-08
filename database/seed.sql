INSERT INTO public.matches
(title, sport, tournament, team_a, team_b, team_a_score, team_b_score, start_time, status, venue)
VALUES
(
  'Demo Cricket Match',
  'cricket',
  'Demo Tournament',
  'Bangladesh',
  'India',
  NULL,
  NULL,
  now() + interval '2 hours',
  'upcoming',
  'Demo Stadium'
);

INSERT INTO public.channels
(name, category, stream_url, description, status)
VALUES
(
  'Demo Authorized Sports Stream',
  'sports',
  'https://example.com/authorized-stream.m3u8',
  'Replace with a stream you own or are licensed to distribute.',
  'inactive'
);

INSERT INTO public.app_settings (key, value)
VALUES
('app_name', '"AminX Sports"'::jsonb),
('maintenance_mode', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;
