# AminX Sports API

Node.js + Express backend for a sports app with match fixtures, manually/provider-updated scores, channel metadata, authorized streaming links, news, user accounts and admin CRUD.

## Requirements
- Node.js 18+
- Supabase project
- GitHub repository
- Render Web Service

## Local setup
1. Run `npm install`.
2. Copy `.env.example` to `.env` and fill in the values.
3. In Supabase SQL Editor, run `database/schema.sql`.
4. Optionally run `database/seed.sql` for sample data.
5. Run `npm start`.
6. Test `GET /api/health` and `GET /api/docs`.

## Render
- Create a **Web Service** from your GitHub repository.
- Build command: `npm install`
- Start command: `npm start`
- Add every required variable from `.env.example` in Render Environment.
- Never commit `.env` or expose the Supabase service-role key in an Android app.

## Main endpoints
- `GET /api/health`
- `GET /api/docs`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/admin-login`
- `GET /api/matches`, `GET /api/live`, `GET /api/matches/:id`
- `GET /api/channels`, `GET /api/news`, `GET /api/teams`, `GET /api/players`
- Admin CRUD: `/api/admin/{matches|channels|news|teams|players|settings}`

For admin endpoints, send `Authorization: Bearer <admin-token>`.

## Important
This backend does not create sports data or broadcast video by itself. Connect a licensed sports-data provider for automatic scores, or manage scores from the admin panel. Only add video streams you own or are authorized to distribute. A REST API stores and serves stream metadata; actual video delivery requires a lawful origin/CDN/provider.
