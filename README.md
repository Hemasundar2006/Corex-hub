# 🚀 Corex Projects Hub

> **Electronics Components E-Commerce Website with WhatsApp Ordering Platform & Custom Admin Panel**  
> **Theme:** Peach • **Version:** 1.0 • **Prepared:** September 2026

Corex Projects Hub is a mobile-first catalogue and ordering platform built for selling electronics components (microcontrollers, sensors, ICs, modules, tools, and project kits). Instead of an intimidating online checkout, customers place orders directly through **WhatsApp** with pre-filled product specifications, prices, and links.

The store owner manages the entire inventory—products, categories, combo offers, and top announcement banner—through a custom **Admin Panel**.

---

## 🎨 Peach Design System & Brand Identity

| Token | Hex | Role | Usage |
| :--- | :--- | :--- | :--- |
| **Primary Accent** | `#D96F4C` | Deep Peach / Terracotta | Action buttons, active category tabs, badges, brand headers |
| **Primary Hover** | `#C05C3A` | Darkened Terracotta | Hover states on buttons |
| **Secondary Accent** | `#F4A88A` | Medium Peach | Secondary buttons, card borders, banner gradient |
| **Section Fill** | `#FDE6DA` | Light Peach | Feature backgrounds, pill badges, active states |
| **Page Background** | `#FFF8F5` | Soft Warm Tint | Page backgrounds, subtle card surfaces |
| **Card Surface** | `#FFFFFF` | Pure White | Component cards, modals, admin tables |
| **Primary Text** | `#3A2A22` | Warm Dark Brown | High-contrast headings and body text |
| **Muted Text** | `#6B6B6B` | Neutral Grey | Specs, secondary metadata, helper text |
| **WhatsApp Accent**| `#25D366` | WhatsApp Green | High-contrast "Order on WhatsApp" CTA buttons |

---

## 🛠️ Technology Stack

- **Frontend:** Next.js (App Router), React 19, Tailwind CSS v4, Lucide React icons
- **Backend:** Node.js, Express.js REST API
- **Database:** MongoDB (Mongoose ODM) with resilient in-memory fallback for immediate zero-config testing
- **Image Storage:** Cloudinary CDN with local disk fallback
- **Authentication:** JWT + bcrypt password hashing
- **Ordering Channel:** WhatsApp Click-to-Chat API (`wa.me` links) with customizable phone number in Admin settings

---

## 📁 Project Structure

```
h:/Electronics Project/
├── package.json                   # Root orchestrator scripts
├── README.md                      # Comprehensive guide
├── backend/
│   ├── server.js                  # Express entry point & route registration
│   ├── .env                       # Environment variables
│   ├── config/
│   │   ├── db.js                  # Resilient Mongoose connection (with fallback)
│   │   └── cloudinary.js          # Cloudinary SDK configuration
│   ├── models/                    # Product, Category, Promotion, Discount, Settings, Admin
│   ├── middleware/                # JWT auth guard, Multer upload & image handler
│   ├── controllers/               # Business logic for all resources
│   ├── routes/                    # Public & Admin endpoints (/api/* and /api/admin/*)
│   └── seed/                      # Auto-seeding script with 24 components & 5 bundles
└── frontend/
    ├── next.config.mjs            # Remote image patterns & proxy rewrites
    ├── tailwind.config.js
    └── src/
        ├── app/
        │   ├── layout.js          # Global layout with AuthProvider & StoreShell
        │   ├── page.js            # Home: Hero, categories, combos, trending components
        │   ├── products/page.js   # Products catalogue: live search & category filters
        │   ├── promotions/page.js # Combo Offers & starter kits page
        │   ├── about/page.js      # About store, contact info, FAQ, physical location
        │   └── admin/             # Admin Panel: Login, Dashboard, Products, Categories, Combos, Discounts, Settings
        ├── components/            # ProductCard, PromoCard, PromoSidebar, CategoryTabs, Navbar, Footer, WhatsAppFloat
        └── lib/                   # API client, WhatsApp URL generator, AuthContext
```

---

## ⚡ Getting Started (Run Locally)

### 1. Install All Dependencies
```bash
npm run install:all
```

### 2. Start Both Backend & Frontend Simultaneously
```bash
npm run dev
```
- **Storefront (Public):** [http://localhost:3000](http://localhost:3000)
- **Admin Panel:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Backend REST API:** [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔐 Admin Credentials

- **URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email:** `admin@corex.com`
- **Password:** `admin123`

---

## 📲 How WhatsApp Ordering Works

1. Visitors browse the catalogue by category or search for specific parts.
2. Clicking **"Order on WhatsApp"** triggers a `wa.me` link with a formatted message:
   ```
   Hello Corex Projects Hub! 👋
   I would like to place an order for:
   📦 Product: Arduino Uno R3 Compatible Board
   💰 Price: ₹549
   🏷️ Category: Microcontrollers & Dev Boards
   🔗 Link: http://localhost:3000/products?id=...
   Please confirm stock availability and payment / delivery details! Thank you.
   ```
3. Store staff reply directly on WhatsApp to confirm delivery, address, and payment options (UPI, GPay, Bank Transfer).
4. Store owner can update the business WhatsApp phone number anytime in **Admin → Settings** without touching code!
