# 🛍️ Aivana — AI-Powered Fashion E-Commerce

Aivana is a premium, minimalist fashion e-commerce platform built with the MERN stack. It combines high-end aesthetics with cutting-edge AI features to provide a seamless and personalized shopping experience.

![Aivana Logo](client/public/favicon.svg)

## ✨ Key Features

- **🤖 AI Stylist**: Get personalized style recommendations powered by the Groq Llama 3 model.
- **💎 Premium Design**: Minimalist and elegant UI built with Playfair Display and Inter fonts, featuring smooth Framer Motion animations.
- **⚡ Real-time Updates**: Live stock tracking and order status updates via Socket.io.
- **💳 Secure Payments**: Integrated Razorpay checkout with secure HMAC signature verification.
- **📦 Order Tracking**: Visual shipment tracking and AWB generation.
- **🔒 Secure Auth**: Email/password and Google OAuth 2.0 authentication.
- **📱 Fully Responsive**: Optimized for every device, from desktop to mobile.

## 🚀 Technology Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** (Custom Design System)
- **Zustand** (State Management)
- **React Query** (Server State)
- **Framer Motion** (Animations)
- **React Router 6**

### Backend
- **Node.js** & **Express**
- **MongoDB** (Atlas)
- **Passport.js** (Google OAuth)
- **Socket.io** (Real-time events)
- **Cloudinary** (Image Management)
- **Brevo** (Transactional Emails)

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
npm run dev
```

The frontend will run on `http://localhost:5173` and the backend on `http://localhost:5000`.

## 📄 License
This project is for demonstration purposes. All rights reserved.
