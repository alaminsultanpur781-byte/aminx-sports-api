# AminX Sports API (Render PostgreSQL)

Node.js + Express API using a managed Render PostgreSQL database.

## 1. Create the database
1. In the Render Dashboard choose **New + → PostgreSQL**.
2. Name it `aminx-sports-db`. Choose a region that you will also use for the Web Service.
3. Create the database and wait until its status is **Available**.
4. Open its **Connect** tab and copy the **External Database URL** for the one-time schema setup. Keep it private.

## 2. Deploy the API
The API automatically creates the required tables from `database/schema.sql` when it starts, so you do not need to paste SQL manually.

1. Push this project to GitHub.
2. In Render choose **New + → Web Service** and connect the repository.
3. Runtime: Node. Build command: `npm install`. Start command: `npm start`.
4. Choose the same region as the database.
5. Add environment variables:
   - `DATABASE_URL`: use the database's **Internal Database URL** from the Connect tab.
   - `JWT_SECRET`: a long random secret.
   - `ADMIN_EMAIL`: your admin email.
   - `ADMIN_PASSWORD_HASH`: bcrypt hash of your admin password.
   - `NODE_ENV`: `production`.
6. Deploy.

## 4. Test
Open `https://YOUR-SERVICE.onrender.com/api/health`. Expected response includes `"api":"online"` and `"database":"connected"`. API docs: `/api/docs`.

## Important
- Never commit `.env`, database URLs, passwords, JWT secrets, or provider keys.
- Use the Internal Database URL from a Render service in the same region. External URLs require TLS.
- Live scores need a licensed sports-data provider or admin updates. Live streams must be streams you own or are licensed to distribute. This API does not provide TV channel feeds.
- Configure a strong admin password hash before using `/api/auth/admin-login`.
