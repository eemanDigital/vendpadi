# VendPadi - WhatsApp Storefront SaaS

Your products. One link. Orders on WhatsApp.

A multi-tenant SaaS platform that lets Nigerian vendors create a public storefront and receive structured orders via WhatsApp — no coding required.

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Setup

1. **Clone and install dependencies:**
```bash
cd vendPadi
cd server && npm install
cd ../client && npm install
```

2. **Configure environment variables:**

Create `server/.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/vendpadi
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

3. **Start development servers:**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

4. Open http://localhost:5173

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Image Storage | Cloudinary |
| Auth | JWT |

## Features

- **Multi-tenant**: Each vendor gets a unique store URL
- **Product Management**: Add, edit, delete products with images
- **WhatsApp Orders**: Customers tap to order — pre-filled WhatsApp message
- **Plan System**: Free (5 products), Basic (₦1,500/mo, 20 products), Premium (₦3,000/mo, unlimited)
- **Mobile-first**: Optimized for WhatsApp browsing

## API Endpoints

### Auth
- `POST /api/auth/register` - Register vendor
- `POST /api/auth/login` - Login vendor

### Vendor (Protected)
- `GET /api/vendor/me` - Get profile
- `PUT /api/vendor/me` - Update profile
- `PUT /api/vendor/me/logo` - Upload logo

### Products (Protected)
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/images` - Upload images

### Public Store
- `GET /api/store/:slug` - Get store & products
- `POST /api/store/:slug/order` - Log order

## Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Navy | #1A1A2E | Headers, nav |
| Padi Green | #25C866 | CTA buttons |
| Gold | #F5A623 | Premium badges |

## Deploy

**Frontend**: Vercel
```bash
cd client && vercel
```

**Backend**: Render/Railway
```bash
cd server && vercel
```

Update `CLIENT_URL` in server/.env to your Vercel URL.

---

Built for the Nigerian market. Optimized for WhatsApp commerce.
