Spixo – Hyperlocal Grocery Delivery Platform (MERN)

Spixo is a full-stack hyperlocal grocery delivery web application inspired by platforms like Blinkit.
It is built using the MERN stack and supports role-based access for Users, Admins, and Delivery Partners, with secure authentication and real-time order management.

🚀 Features
👤 User Panel

User registration and login with JWT authentication

Browse grocery products by category

Add/remove products from cart

Checkout with Cash on Delivery (COD) option

Delivery slot selection:

30-minute delivery

Evening delivery

Dynamic delivery charges:

Free delivery for orders above ₹500

Configurable delivery fee below ₹500

Order tracking and order history

Fully responsive UI (mobile, tablet, desktop)

🧑‍💼 Admin Panel

Secure admin login (no public registration)

Add, update, and delete products

Manage stock quantity (units / kg)

Automatic out-of-stock handling

View and manage all orders

Assign orders to delivery partners

Control:

Delivery radius (in km)

Delivery charges

Offers & discounts

Dashboard with:

Total orders

Delivered orders

Revenue overview

🚴 Delivery Partner Panel

Secure login (created by admin only)

View assigned orders

Access customer contact and address details

Update order delivery status

Receive new order notifications

🧩 Tech Stack

Frontend

React.js (Vite)

Tailwind CSS

Axios

React Router DOM

Backend

Node.js

Express.js

MongoDB (MongoDB Atlas)

JWT Authentication

bcrypt.js

🔐 Authentication & Security

JWT-based authentication

Role-based access control (User / Admin / Delivery)

Password hashing using bcrypt

Protected routes using middleware

Separate admin and delivery authentication flow

🏗️ Project Structure
Spixo/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend-user/
│   ├── pages/
│   ├── components/
│   └── context/
│
├── frontend-admin/
│   ├── pages/
│   ├── components/
│   └── api/
│
├── frontend-delivery/
│   ├── pages/
│   └── api/

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/spixo.git
cd spixo

2️⃣ Backend Setup
cd backend
npm install


Create .env file:

PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/spixo_db
JWT_SECRET=your_secret_key


Start backend:

npm run dev

3️⃣ Frontend Setup (User / Admin / Delivery)

Repeat for each frontend:

cd frontend-user   # or frontend-admin / frontend-delivery
npm install
npm run dev

🌐 API Endpoints Overview
Admin

POST /api/admin/login

Orders

POST /api/orders – Place order

GET /api/orders – View all orders (admin)

POST /api/orders/assign – Assign order

POST /api/orders/status – Update order status

Delivery

GET /api/delivery – Get delivery partners

📦 Database

MongoDB Atlas

Separate collections for:

Users

Admins

Delivery Partners

Products

Orders

🎯 Key Learnings

Full-stack MERN development

RESTful API design

Role-based authentication & authorization

Real-world debugging of API routing issues

Scalable project architecture

Secure admin-only workflows

🔮 Future Enhancements

Online payment integration (UPI / Cards)

Push notifications (SMS / WhatsApp)

Live order tracking with maps

Ratings & reviews

Analytics dashboard

👨‍💻 Author

Vikash Kumar
B.Tech Computer Science & Engineering
Full-Stack Developer (MERN)

⭐ If you like this project

Give it a ⭐ on GitHub — it motivates me to build more!
