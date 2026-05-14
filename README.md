# 🛍️ Aivana — Premium AI-Powered Fashion E-Commerce

Aivana is a state-of-the-art, minimalist fashion e-commerce platform built with the MERN stack. It combines high-end aesthetics, cutting-edge AI integrations, and a streamlined, headless-ready architecture to deliver a seamless shopping experience.

![Aivana Logo](client/public/favicon.svg)

## ✨ Key Features

- **🔍 Universal AI Search**: Intelligent, real-time debounced product suggestions with a centralized, responsive search architecture.
- **🎬 Cinematic Storytelling**: Immersive About page and Home page experiences featuring parallax backgrounds and high-end scroll-driven video reveal sections.
- **📈 Handpicked Trending Collections**: Dedicated backend-driven trending system allowing explicit control over home page featured items via specialized API endpoints.
- **🛡️ Data Resilience & Sync**: Self-healing cart and wishlist engines that automatically synchronize with live database states, filtering out stale or deleted products.
- **🤖 AI Stylist**: Personalized style recommendations powered by the Groq Llama 3 model directly from the interactive floating widget.
- **👋 Personalized Experience**: Dynamic, name-based authentication flows with session recognition and welcoming UI toasts.
- **🛍️ Intelligent Cart Normalization**: Optimized uniqueness logic that prevents duplicate entries by normalizing product specifications (Size/Color), ensuring seamless merging between direct-add and detail-page interactions.
- **🛒 Cinematic Fly-To-Cart**: High-end micro-interaction that animates product images directly into the shopping cart icon upon addition, providing instant visual feedback.
- **💎 Premium Dynamic Design**: Minimalist UI built with Playfair Display & Inter fonts. Features fluid typography, interactive hover states, and smooth staggered data-loading transitions powered by Framer Motion.
- **📱 Touch-First Responsiveness**: Flawless layout scaling across all devices, ensuring perfect touch targets and fluid product grids on mobile and tablet displays.

## 🚀 Technology Stack

### Frontend Architecture
- **React 18** + **Vite** (Ultra-fast HMR)
- **Tailwind CSS** (Custom Design System & Fluid Utility Classes)
- **Zustand** (Predictable Global State)
- **TanStack Query** (Server State & Caching)
- **Framer Motion** (Layout Animations & Layout Transitions)
- **Swiper** (Touch-friendly Carousels)

### Backend Architecture
- **Node.js** & **Express**
- **MongoDB** (Atlas) + **Mongoose**
- **Streamlined Auth** (Google OAuth + JWT for users, API Keys for admin/data ops)
- **Socket.io** (Real-time events)
- **Cloudinary** (Optimized Image Management)
- **Brevo** (Transactional Email Automation)

## 🛠️ Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Akhil07-ctrl/Aivana.git
cd Aivana
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install Client dependencies
cd client && npm install

# Install Server dependencies
cd ../server && npm install
```

### 3. Environment Variables

Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
RAZORPAY_KEY_ID=your_id
RAZORPAY_KEY_SECRET=your_secret
BREVO_API_KEY=your_brevo_key
GROQ_API_KEY=your_groq_key
API_KEY=aivana_secret_key_2026
```

### 4. Run the application
```bash
# From the root directory
npm run dev:all
```
*(Alternatively, run `npm run dev` in the client directory and `npm run dev` in the server directory).*

The frontend will run on `http://localhost:5173` and the backend on `http://localhost:5000`.

## 📄 License
This project is for demonstration purposes. All rights reserved.
