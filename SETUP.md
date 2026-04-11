# 🚀 Axentralab — Quick Setup Guide

## Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Stripe account (test keys)

---

## 1 — Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## 2 — Environment Variables

### backend/.env
Copy `.env.example` → `.env` and fill in:
```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/axentralab
JWT_SECRET=any_long_random_string_here
STRIPE_SECRET_KEY=sk_test_xxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxx   (from Stripe CLI or dashboard)
CLIENT_URL=http://localhost:3000
```

### frontend/.env
Copy `.env.example` → `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxx
```

---

## 3 — Seed the Database

```bash
# From the project root (axentralab/)
node seed.js
```

This creates:
- All 6 services with pricing plans
- Admin account: `admin@axentralab.com` / `admin123!`

---

## 4 — Run Development Servers

### Terminal 1 — Backend
```bash
cd backend
npm run dev
# → http://localhost:5000
```

### Terminal 2 — Frontend
```bash
cd frontend
npm start
# → http://localhost:3000
```

---

## 5 — Access the App

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Public website |
| `http://localhost:3000/services` | Service catalog + pricing |
| `http://localhost:3000/products` | SaaS products |
| `http://localhost:3000/register` | Create account |
| `http://localhost:3000/login` | Sign in |
| `http://localhost:3000/cart` | Shopping cart |
| `http://localhost:3000/checkout` | Stripe checkout |
| `http://localhost:3000/dashboard` | Client dashboard |
| `http://localhost:3000/admin` | Admin panel (admin only) |

---

## 6 — Stripe Test Payments

Use Stripe test card: `4242 4242 4242 4242`
- Expiry: any future date
- CVC: any 3 digits

### Webhooks (optional for local dev)
```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

---

## 7 — API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Create account |
| POST | /api/auth/login | — | Login → JWT |
| GET  | /api/auth/me | ✅ | Get current user |
| GET  | /api/services | — | All services |
| POST | /api/orders | ✅ | Create order |
| GET  | /api/orders/mine | ✅ | My orders |
| POST | /api/payments/checkout | ✅ | Stripe session |
| POST | /api/leads | — | Contact form |
| GET  | /api/leads | 🔐 admin | All leads |
| GET  | /api/users | 🔐 admin | All users |
| GET  | /api/users/stats | 🔐 admin | Dashboard stats |

---

## 8 — Production Deployment

### Backend → Railway / Render / VPS
```bash
npm start
```

### Frontend → Vercel / Netlify
```bash
npm run build
# Upload /build folder
```

Set `REACT_APP_API_URL` to your deployed backend URL.

---

## Folder Structure
```
axentralab/
├── README.md
├── SETUP.md
├── seed.js                    ← run once to populate DB
│
├── backend/
│   ├── server.js              ← Express entry point
│   ├── .env.example
│   ├── config/db.js           ← MongoDB connection
│   ├── models/                ← Mongoose schemas
│   │   ├── User.js
│   │   ├── Service.js
│   │   ├── Order.js
│   │   ├── Lead.js
│   │   └── BlogPost.js
│   ├── controllers/           ← Business logic
│   │   ├── authController.js
│   │   ├── serviceController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── leadController.js
│   │   └── userController.js
│   ├── routes/                ← Express routers
│   │   ├── auth.js
│   │   ├── services.js
│   │   ├── orders.js
│   │   ├── payments.js
│   │   ├── leads.js
│   │   ├── blog.js
│   │   └── users.js
│   └── middleware/
│       └── auth.js            ← JWT protect + adminOnly
│
└── frontend/
    ├── public/index.html
    ├── .env.example
    └── src/
        ├── App.js             ← Routes
        ├── index.js
        ├── styles/global.css
        ├── services/api.js    ← Axios instance
        ├── context/
        │   ├── AuthContext.js ← Login / register state
        │   └── CartContext.js ← Cart state + localStorage
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.js  ← Responsive + mobile drawer
        │   │   └── Footer.js
        │   └── common/
        │       └── ProtectedRoute.js
        └── pages/
            ├── HomePage.js
            ├── ShopPage.js       ← Service catalog + buy
            ├── ProductsPage.js
            ├── PortfolioPage.js
            ├── BlogPage.js
            ├── ContactPage.js
            ├── LoginPage.js
            ├── RegisterPage.js
            ├── CartPage.js
            ├── CheckoutPage.js   ← Stripe redirect
            ├── DashboardPage.js  ← Orders + Profile tabs
            ├── AdminPage.js      ← Leads/Orders/Users mgmt
            ├── OrderSuccessPage.js
            └── NotFoundPage.js
```
