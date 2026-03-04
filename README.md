# Jazba Basketball

> Official website and e-commerce platform for Jazba Basketball — Toronto's premier basketball program.

Built with Next.js 16, TypeScript, Tailwind CSS, Prisma, PostgreSQL, Stripe, and NextAuth.

---

## Features

- **One-page landing** — Hero carousel, mission, documentary, offerings, sponsor showcase, shop preview, donation CTA, contact form
- **Full shop** — Product listing with badges (PRE-ORDER / NEW / LIMITED), product detail with size selector
- **Cart drawer** — Slide-in from right, qty stepper, localStorage persistence, ESC/backdrop close
- **Stripe Checkout** — Server-side price validation, CAD currency, Canada-only shipping
- **Apple Pay & Google Pay** — Express checkout buttons via Stripe ExpressCheckoutElement (device-dependent)
- **Stripe webhooks** — Signature-verified, creates orders on `checkout.session.completed`
- **Auth** — Email/password via NextAuth CredentialsProvider, JWT sessions, role-based access
- **Admin dashboard** — Product CRUD, variant management, image reordering, order summary
- **Responsive** — Mobile-first, tested at 375px – 1440px
- **Accessible** — ARIA labels, focus management, semantic HTML, skip-to-content

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js (Credentials) |
| Payments | Stripe Checkout + Webhooks |
| State | Zustand (persisted cart) |
| Deployment | Any Node.js server (VPS, Docker, etc.) |

---

## Prerequisites

- **Node.js** 18.17+ (LTS recommended)
- **npm** 9+
- **PostgreSQL** 14+ (local or hosted)
- **Stripe account** (test mode is fine for development)
- **Stripe CLI** (optional, for local webhook testing)

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/jazba` |
| `NEXTAUTH_SECRET` | Random secret for JWT signing (generate with `openssl rand -base64 32`) | `abc123...` |
| `NEXTAUTH_URL` | App URL (no trailing slash) | `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | Stripe secret key (starts with `sk_test_` or `sk_live_`) | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (starts with `whsec_`) | `whsec_...` |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe publishable key (starts with `pk_test_` or `pk_live_`) | `pk_test_...` |
| `GOFUNDME_URL` | GoFundMe donation page URL (server-side) | `https://gofundme.com/jazba` |
| `NEXT_PUBLIC_GOFUNDME_URL` | GoFundMe donation page URL (client-side) | `https://gofundme.com/jazba` |
| `CONTACT_EMAIL` | Contact email displayed on site | `info@jazbabasketball.com` |
| `CONTACT_PHONE` | Contact phone number | `+16475550123` |
| `INSTAGRAM_URL` | Instagram profile URL | `https://instagram.com/jazbabasketball` |
| `WHATSAPP_URL` | WhatsApp link | `https://wa.me/16475550123` |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

Make sure PostgreSQL is running, then:

```bash
# Push schema to database (creates tables)
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed with sample products
npx prisma db seed
```

This creates 6 sample products with S/M/L/XL variants.

### 3. Create an admin user

After seeding, register a user at `/account`, then promote them to admin:

```bash
# Option A: Via Prisma Studio
npx prisma studio
# → Open Users table → change role to "admin"

# Option B: Via SQL
psql $DATABASE_URL -c "UPDATE \"User\" SET role = 'admin' WHERE email = 'your@email.com';"
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/shop` | Product listing |
| `/shop/[slug]` | Product detail |
| `/account` | Login / Register |
| `/admin` | Admin dashboard (requires admin role) |
| `/success` | Post-checkout confirmation |

---

## Stripe Setup

### Test Mode

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Copy your **test** API keys from the [Dashboard](https://dashboard.stripe.com/test/apikeys)
3. Set `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` in `.env`

### Apple Pay & Google Pay

Apple Pay and Google Pay appear automatically on Stripe Checkout when enabled:

1. Go to **Stripe Dashboard → Settings → Payment Methods**
2. Enable **Apple Pay** and **Google Pay**
3. For Apple Pay: register your domain under **Apple Pay → Add Domain**
   - For local dev, Apple Pay won't work on `localhost` — test on a deployed domain or use Stripe's test cards
4. Google Pay works automatically in test mode on Chrome

The `ExpressCheckoutElement` in the cart drawer renders Apple/Google Pay buttons on supported devices. On unsupported devices, it's hidden — the regular "Checkout" button remains the primary flow.

### Local Webhook Testing

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward events to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret (`whsec_...`) printed by the CLI and set it as `STRIPE_WEBHOOK_SECRET` in `.env`.

To trigger a test event:

```bash
stripe trigger checkout.session.completed
```

### Test Card Numbers

| Card | Number |
|------|--------|
| Success | `4242 4242 4242 4242` |
| Declined | `4000 0000 0000 0002` |
| 3D Secure | `4000 0025 0000 3155` |

Use any future expiry, any 3-digit CVC, any postal code.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout (Navbar, Footer, Providers)
│   ├── shop/
│   │   ├── page.tsx                # Product listing
│   │   └── [slug]/
│   │       ├── page.tsx            # Product detail (server wrapper)
│   │       └── ProductDetail.tsx   # Product detail (client component)
│   ├── account/page.tsx            # Login / Register
│   ├── success/page.tsx            # Post-checkout
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout + auth guard
│   │   ├── page.tsx                # Dashboard summary
│   │   ├── components/
│   │   │   └── AdminSidebar.tsx
│   │   ├── products/               # Product CRUD
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   └── orders/page.tsx         # Order list
│   └── api/
│       ├── auth/                   # NextAuth + register
│       │   ├── [...nextauth]/route.ts
│       │   └── register/route.ts
│       ├── checkout/
│       │   └── create-session/route.ts   # Stripe session creation
│       ├── stripe/
│       │   └── webhook/route.ts          # Stripe webhook handler
│       └── admin/products/               # Admin product API
│           └── [id]/
│               ├── route.ts
│               └── variants/route.ts
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── CartDrawer.tsx
│   ├── CartItemRow.tsx
│   ├── ProductCard.tsx
│   ├── SizeSelector.tsx
│   ├── ExpressCheckout.tsx
│   ├── StripeProvider.tsx
│   ├── Providers.tsx
│   └── landing/                    # Landing page sections
│       ├── Hero.tsx
│       ├── VideoModal.tsx
│       ├── SponsorStrip.tsx
│       ├── Mission.tsx
│       ├── Documentary.tsx
│       ├── Offerings.tsx
│       ├── SponsorShowcase.tsx
│       ├── ShopPreview.tsx
│       ├── Donation.tsx
│       └── Contact.tsx
├── store/
│   └── cart.ts                     # Zustand cart store
├── lib/
│   ├── prisma.ts                   # Prisma singleton
│   ├── stripe.ts                   # Stripe server singleton
│   ├── stripe-client.ts            # Stripe client loader
│   ├── auth.ts                     # NextAuth config
│   └── products.ts                 # Product data layer
├── types/
│   ├── cart.ts
│   └── next-auth.d.ts
└── middleware.ts                   # Route protection (admin guard)
prisma/
├── schema.prisma                   # 5 models: User, Product, Variant, Order, OrderItem
└── seed.ts                         # 6 products, 24 variants
```

---

## Deployment (VPS)

### Build

```bash
npm run build
```

### Run with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the app
pm2 start npm --name "jazba" -- start

# Auto-restart on reboot
pm2 startup
pm2 save
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL with Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Stripe Webhook (Production)

1. Go to **Stripe Dashboard → Developers → Webhooks**
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select event: `checkout.session.completed`
4. Copy the signing secret → set as `STRIPE_WEBHOOK_SECRET`

### Environment

Set all env vars on your server. Update:
- `NEXTAUTH_URL` to your production domain
- `STRIPE_SECRET_KEY` to your live key (if going live)
- `STRIPE_WEBHOOK_SECRET` to the production webhook secret
- `DATABASE_URL` to your production database

---

## TODOs

The following placeholders need to be replaced before going live:

- [ ] **Hero images** — Replace placeholder gradients with real DSLR photos
- [ ] **Documentary video** — Replace YouTube placeholder with actual Jazba documentary URL
- [ ] **Sponsor logos** — Replace placeholder blocks with real sponsor logos (SVG/PNG)
- [ ] **Product images** — Replace `/images/products/*-placeholder.jpg` with real product photos
- [ ] **Contact info** — Update email, phone, Instagram, WhatsApp with real values in `.env`
- [ ] **GoFundMe URL** — Set `NEXT_PUBLIC_GOFUNDME_URL` to real donation page
- [ ] **Contact form backend** — Wire form to an email service (SendGrid, Resend, etc.)
- [ ] **Order management** — Build out `/admin/orders` with fulfillment tracking
- [ ] **Email notifications** — Send order confirmation emails to customers
- [ ] **Apple Pay domain** — Register production domain in Stripe Dashboard

---

## License

Private — All rights reserved. © 2026 Jazba Basketball.
