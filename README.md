# Zuri Marketplace - API

A full-stack marketplace platform built with NestJS, Prisma, and PostgreSQL.

## Features

- Product catalog with categories, brands, and SKU variations
- Shopping cart and checkout
- Order management with timeline
- Payment integration (Paystack/Flutterwave)
- Vendor orders and fulfillment
- Escrow and commission system
- KYC onboarding
- Product moderation
- Double-entry ledger for financial audit
- Shipping zones and calculation
- Inventory management with reservations
- Admin dashboard

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your credentials
npx prisma migrate dev
npx prisma generate
npm run start:dev
```

## Project Structure
apps/api/
├── src/modules/
│ ├── catalog/ # Categories, Brands, Products, SKU Variations
│ ├── cart/ # Shopping Cart
│ ├── checkout/ # Checkout Process
│ ├── orders/ # Order Management
│ ├── payments/ # Payment Gateway
│ ├── vendor-orders/ # Vendor Order Management
│ ├── fulfillment/ # Fulfillment Tracking
│ ├── escrow/ # Escrow & Commission
│ ├── warehouses/ # Warehouse Management
│ ├── inventory/ # Inventory Management
│ ├── reservations/ # Stock Reservations
│ ├── shipping-zones/ # Shipping Zones
│ ├── general-ledger/ # Double-Entry Ledger
│ ├── kyc/ # KYC Onboarding
│ ├── product-moderation/ # Product Moderation
│ ├── commission-config/ # Commission Rules
│ ├── financial-audit/ # Financial Dashboard
│ ├── system-config/ # System Configuration
│ └── prisma/ # Prisma Service
├── jobs/ # Cron Jobs (SLA, Low-Stock Alerts)
├── guards/ # Authorization Guards
├── app.module.ts
└── main.ts


## API Endpoints

### Catalog
- `POST /catalog/categories`
- `GET /catalog/categories`
- `GET /catalog/products?q=&categoryId=&brandId=`
- `POST /catalog/products`
- `POST /catalog/products/images`

### Cart & Checkout
- `POST /cart/items`
- `GET /cart/:userId`
- `POST /checkout`

### Orders
- `GET /orders`
- `GET /orders/:id`
- `PATCH /orders/:id/status`

### Payments
- `POST /payments/initialize`
- `POST /payments/webhook`

### Admin
- `GET /admin/kyc/pending`
- `POST /admin/kyc/approve`
- `GET /admin/moderation/queue`
- `GET /admin/financial/dashboard`

