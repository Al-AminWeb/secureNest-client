# 🏡 SecureNest 

Welcome to **SecureNest** – a modern, responsive insurance management platform. This is the client-side (frontend) application, built with React and designed for seamless user experience across desktop, tablet, and mobile devices.

---

## 🚀 Overview
SecureNest empowers users to explore, apply for, and manage insurance policies online. It features role-based dashboards for customers, agents, and admins, with real-time policy management, payments, and more.

---

## ✨ Features
- **User Authentication** (Sign Up, Sign In, Google OAuth)
- **Role-Based Dashboards**
  - Customer: Apply for policies, make payments, submit claims, leave reviews
  - Agent: Manage assigned customers, update application statuses
  - Admin: Manage users, policies, transactions, blogs, and agent applications
- **Policy Catalog** with search, filter, and details
- **Quote Estimator** for quick insurance quotes
- **Online Application & Payment** (Stripe integration)
- **Blog System** (create, edit, delete, view blogs)
- **Newsletter Subscription**
- **Customer Reviews** (with Swiper carousel)
- **Agent Consultation Booking**
- **Claim Requests**
- **PDF Policy Download**
- **404 Error Page**
- **Responsive Design** (Mobile, Tablet, Desktop)

---

## 👤 User Roles
- **Customer**
  - Browse and apply for policies
  - Make payments
  - Download policy PDFs
  - Submit reviews and claims
  - Book agent consultations
- **Agent**
  - View assigned customers
  - Update application statuses (Approve/Reject)
  - View customer details
- **Admin**
  - Manage all users, agents, and applications
  - Add/edit/delete policies
  - Manage transactions and blogs
  - Approve/reject agent applications

---

## 🗂️ Main Pages & Components
- **Home** (Banner, Popular Policies, Reviews, Blogs, FAQ, Newsletter)
- **All Policies** (search, filter, pagination)
- **Policy Details** (with quote, consultation booking)
- **Quote Estimator**
- **Sign In / Sign Up**
- **Dashboard** (role-based)
  - My Policies
  - Make Payment
  - Payment Status
  - Assigned Customers (Agent)
  - Manage Users/Policies/Transactions (Admin)
  - Manage Blogs
- **Blog System** (view, create, edit, delete)
- **Profile** (update info, photo)
- **404 Error Page**

---

## 🛠️ Tech Stack & Packages
- **React** (Vite)
- **React Router DOM**
- **Tailwind CSS**
- **Swiper** (carousel for reviews, banner)
- **SweetAlert2** (beautiful alerts)
- **@tanstack/react-query** (data fetching/caching)
- **Axios** (API requests)
- **Firebase Auth** (authentication)
- **Stripe** (payments)
- **@react-pdf/renderer** (PDF downloads)
- **Other:**
  - react-icons
  - classnames

---

## ⚙️ Getting Started

### 1. **Clone the Repository**
```bash
https://github.com/your-username/secureNest-client-side.git
cd secureNest-client-side
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Set Up Environment Variables**
- Create a `.env` file for your Firebase, Stripe, and API endpoints.

### 4. **Run the App**
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or as specified by Vite).

---

## 🤝 Contributing
We welcome contributions! To contribute:
1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and open a Pull Request

---

## 📄 License
This project is licensed under the MIT License.

---

## 💡 Credits
- [SwiperJS](https://swiperjs.com/)
- [SweetAlert2](https://sweetalert2.github.io/)
- [React Query](https://tanstack.com/query/latest)
- [DaisyUI](https://daisyui.com/)
- [React PDF](https://react-pdf.org/)
- [Firebase](https://firebase.google.com/)

---

> Made with ❤️ by the SecureNest Team 