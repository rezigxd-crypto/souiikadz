# سويقة ديزاد — Suwaika Dezad

> بورصة الغذاء الذكية في الجزائر — The Smart Food Exchange of Algeria

A digital marketplace connecting Algerian farmers and suppliers with consumers and restaurants to sell surplus food at discounted prices. Powered by **Supabase** (database + auth + realtime) and **Cloudinary** (image uploads).

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Farmer** | `farmer@sk.dz` | `farmer123` |
| **Client** | `client@sk.dz` | `client123` |
| **Admin** | `admin@sk.dz` | `admin123#` |

These are created directly in Supabase → Authentication → Users (with "Auto Confirm" ON), then promoted via SQL.

---

## ✨ Features

### Marketplace
- Browse 11 seeded products (vegetables, fruits, dates, honey, etc.)
- Filter by category, price, **wilaya (58 provinces)**, **delivery availability**, **freshness**
- Live countdown timers on expiring products
- Smart dynamic pricing (price decreases as expiry approaches)
- 4 languages: Arabic (RTL), French, English, Tamazight

### Auth (Supabase-powered)
- Email + password signup/login
- **Google login** (OAuth)
- Phone number, wilaya, and (for farmers) Fellah card + commercial registry questions
- Role-based access: admin / farmer / consumer
- Session persistence + auto-refresh

### Role-Based Dashboards (SECURE)
- Each role sees ONLY their own dashboard
- If a client tries `/dashboard`, they see the client dashboard
- If a non-farmer tries `/subscription`, they're redirected to `/dashboard`
- Protected routes — no URL hijacking possible

### Admin Dashboard
- See all users with phone, wilaya, Fellah card, commercial registry, subscription
- See all products (with farmer email, wilaya, delivery status)
- See all orders (with commission breakdown)
- See total platform commission earned

### Farmer Dashboard
- Add products with **image upload (Cloudinary)**, delivery toggle, wilaya picker
- See own products with smart price (if subscribed)
- See orders with net earnings (after 5% commission)
- See chats with clients
- Manage subscription

### Client Dashboard
- See orders
- See wishlist
- See chats with farmers

### Chat (Realtime)
- Private 1-on-1 chat between client and farmer about a product
- 3 price suggestions: Bold, Smart, Safe
- Accept/reject offers
- Realtime via Supabase channels

### Monetization
- 5% commission on every sale (shown in cart + admin dashboard)
- Dynamic pricing subscription for farmers (monthly/seasonal/annual in DZD)

### Payment Methods
- BaridiMob (Algérie Poste mobile payment)
- Edahabia (national payment card)
- Cash on delivery

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite 5 + Tailwind CSS 3 |
| Database + Auth + Realtime | Supabase (PostgreSQL) |
| Image uploads | Cloudinary |
| Emails (optional) | Resend (via Netlify Functions) |
| Deployment | Netlify |

---

## 🚀 Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env` file

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required values:
- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — your Supabase anon key
- `VITE_CLOUDINARY_CLOUD_NAME` — your Cloudinary cloud name
- `VITE_CLOUDINARY_UPLOAD_PRESET` — an unsigned upload preset (see below)

### 3. Run the dev server

```bash
npm run dev
```

Open http://localhost:5173

---

## 🔥 Supabase Setup

### Create the schema

1. Go to Supabase → SQL Editor → New query
2. Paste the entire SQL schema (provided separately) and Run
3. This creates 5 tables (profiles, products, orders, chat_messages, subscriptions) + RLS + realtime + auto-profile trigger

### Create demo users

1. Supabase → Authentication → Users → Add user
2. Create 3 users: `admin@sk.dz`, `farmer@sk.dz`, `client@sk.dz` (with "Auto Confirm" ON)
3. Run the SQL UPDATE statements to set their roles + phone + wilaya + farmer card info

### Seed products

Run the SQL INSERT block (provided separately) to seed 11 products linked to `farmer@sk.dz`.

---

## 🔗 Enable Google Login (Supabase)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project (or use existing)
3. APIs & Services → Credentials → Create Credentials → **OAuth client ID**
4. Application type: **Web application**
5. Authorized JavaScript origins:
   - `http://localhost:5173` (dev)
   - `https://your-site.netlify.app` (production)
6. Authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
7. Copy the **Client ID** and **Client Secret**
8. Go to Supabase → Authentication → Providers → **Google**
9. Toggle ON
10. Paste the Client ID + Client Secret
11. Save

Now the "Continue with Google" button works in the app.

---

## 📸 Cloudinary Setup (image uploads)

1. Go to [cloudinary.com](https://cloudinary.com) → sign in
2. Copy your **Cloud name** (in Dashboard)
3. Settings → Upload → "Upload presets" → "Add upload preset":
   - Name: `suwaika_products`
   - Signing Mode: **Unsigned** ✅
   - Folder: `products`
   - Save
4. Put the cloud name + preset name in `.env`

---

## ☁️ Deploy to Netlify

1. Push to GitHub
2. Netlify → New site → import repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables (Site settings → Environment variables):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`
6. Deploy

---

## 🔒 Security

- Row Level Security (RLS) is enabled on every table
- Users can only read/update their own profile
- Farmers can only edit their own products
- Clients can only see their own orders
- Chat messages only visible to participants
- Admin role can read all data (enforced by RLS policy checking `role = 'admin'`)
- The `service_role` key is NEVER exposed to the browser (only used in Netlify Functions if needed)

---

## 📄 License

MIT — see [LICENSE](./LICENSE).

> صُنع في الجزائر 🇩🇿
