# Spixo: Hyperlocal Grocery Delivery Ecosystem

Spixo is a professional-grade, full-stack grocery delivery platform built using the MERN stack (MongoDB, Express, React, Node.js). The system is architected as a cohesive three-app ecosystem designed to handle complex hyperlocal logistics—from the initial consumer discovery and purchase to administrative oversight and final-mile fleet fulfillment.

All three frontends are modern, high-performance Progressive Web Apps (PWAs) featuring offline support, custom install triggers, and glassmorphism-inspired UI components.

## Applications Overview

### 1. Consumer Application (frontend-user)
The flagship interface for end-users, optimized for conversion and speed.
*   **Dynamic Discovery**: Browse products by category with real-time availability updates.
*   **Intuitive Cart Management**: Seamlessly add items and manage quantities with persistent state.
*   **Secure Checkout**: Integrated ordering system with support for delivery slots and address management.
*   **Live Order Tracking**: Real-time status updates via Socket.IO.
*   **Interactive Support**: "My Support" dashboard for tracking customer service inquiries.

### 2. Management Console (frontend-admin)
A powerful command center for store operations and oversight.
*   **Operational Control**: Global "Store Open/Closed" toggle that updates all frontends instantly.
*   **Inventory Management**: Comprehensive CRUD operations for product catalogs, including image handling and unit settings.
*   **Fleet Oversight**: Recruit and manage delivery partners, monitor active shifts, and assign orders.
*   **Analytics Dashboard**: Visual revenue trends and performance metrics powered by Recharts.
*   **Service Inbox**: Manage customer support messages and resolve inquiries.

### 3. Fleet Application (frontend-delivery)
A specialized, mobile-first utility for delivery partners.
*   **Shift Management**: Start and terminate delivery shifts with a single tap.
*   **Task Optimization**: View and prioritize active assignments with integrated "Call Customer" shortcuts.
*   **Status Updates**: Simple, stage-based workflow (Assigned > Picked > On the Way > Delivered).
*   **Earnings Tracking**: Detailed history of completed tasks and daily payouts.

## Technical Architecture

### Core Backend
*   **Security Layers**: Integrated Helmet middleware for secure headers and CORS policies tailored for multi-platform (Netlify/Vercel) hosting.
*   **Performance**: Gzip compression implemented for all API responses to ensure sub-second latency.
*   **Data Integrity**: Mongoose schemas with robust validation and established relational logic between Users, Orders, and Products.
*   **Authentication**: Secure JWT-based auth flow with hashed password storage (Bcrypt).

### Progressive Web App (PWA) Implementation
Each frontend utilizes the `vite-plugin-pwa` for elite mobile performance:
*   **Offline Mode**: Custom `offline.html` fallbacks for when the user loses connectivity.
*   **Integrated Installation**: Custom "Install App" buttons in each dashboard that prompt users to add Spixo to their home screens.
*   **Branding**: High-contrast, high-resolution PNG and SVG icons designed for visibility on both light and dark system themes.

## Deployment and Optimization

### Environment Configuration
The project uses environment-specific files to separate development and production logic:
*   **VITE_API_URL**: Points to the backend API endpoint (`/api` suffix is automatically handled).
*   **VITE_SOCKET_URL**: Defines the base URL for the Socket.IO server.

### Hosting Readiness
*   **Vercel/Netlify Rewrites**: Includes `vercel.json` and `_redirects` to handle SPA routing and eliminate 404 errors during page refreshes.
*   **Code Splitting**: Implemented Rollup manual chunks to split large vendor libraries and maintain small, high-performance initial bundles.

## Setup and Installation

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Local or Atlas)
*   Cloudinary or similar (if file uploads are configured)

### Installation Steps
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Vikashh08/Spixo-Grocery-Delivery-WebApp-MERN-
    ```
2.  **Install Global Dependencies**:
    ```bash
    # Backend
    cd backend && npm install
    # User Frontend
    cd ../frontend-user && npm install
    # Admin Frontend
    cd ../frontend-admin && npm install
    # Delivery Frontend
    cd ../frontend-delivery && npm install
    ```
3.  **Local Development**:
    *   Initialize the backend: `npm run dev` in `/backend` (Runs on port 5001).
    *   Initialize frontends: `npm run dev` in each respective folder.

### Production Build
To generate the optimized production bundles for deployment:
```bash
npm run build
```
This will create a `dist` folder in each project directory suitable for static web hosting.
