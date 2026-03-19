# Spixo: Hyperlocal Grocery Delivery Ecosystem

Spixo is a comprehensive grocery delivery platform built on the MERN stack. The system is designed as a three-app ecosystem to handle end-to-end hyperlocal operations, from consumer orders to administrative management and fleet fulfillment. All three frontends are configured as Progressive Web Apps (PWAs) with offline support and integrated installation features.

## Project Structure

The repository is organized into four main directories:

*   **backend**: Node.js and Express server handling the API, Socket.IO real-time updates, and MongoDB integration.
*   **frontend-user**: The consumer-facing application where users can browse products, manage their cart, and place orders.
*   **frontend-admin**: A centralized management console for store owners to manage inventory, track orders, and coordinate delivery partners.
*   **frontend-delivery**: A specialized interface for delivery partners to manage their active tasks, track earnings, and update delivery statuses.

## Technology Stack

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Security**: Helmet, CORS, and JWT-based authentication
*   **Real-time Output**: Socket.IO for live order tracking
*   **Optimization**: Gzip compression for high-performance API responses

### Frontends (Common Architecture)
*   **Framework**: React (Vite-powered)
*   **Styling**: Tailwind CSS
*   **PWA**: Vite PWA Plugin for offline reliability and mobile installation
*   **Routing**: React Router with protected route logic
*   **API Client**: Axios with global interceptors for token management

## Deployment Configuration

### Static Hosting (Netlify/Vercel)
The frontends include specific configurations to ensure stability on cloud platforms:
*   **vercel.json**: Catch-all rewrites to handle client-side routing and prevent 404 errors on page refresh.
*   **_redirects**: Fallback rules for Netlify hosting.
*   **_headers**: Cache control rules to ensure the Service Worker and manifest remain up-to-date.

### Environment Variables
Production builds utilize `.env.production` files. Ensure the `VITE_API_URL` points to your deployed backend (e.g., on Render) and `MONGO_URI` is correctly set in the backend environment.

## Setup and Installation

1.  Clone the repository.
2.  Install dependencies for all segments:
    ```bash
    cd backend && npm install
    cd ../frontend-user && npm install
    cd ../frontend-admin && npm install
    cd ../frontend-delivery && npm install
    ```
3.  Configure your environment variables following the provided `.env.sample` patterns in each directory.
4.  Start the development servers:
    *   **Backend**: `npm run dev` in the `backend` folder.
    *   **Frontends**: `npm run dev` in the respective frontend folders.

## Progressive Web App Features
All applications include integrated "Install App" buttons that appear automatically once the browser verifies PWA suitability. This ensures a mobile-native experience for consumers, admins, and delivery partners without requiring a dedicated mobile app store.
