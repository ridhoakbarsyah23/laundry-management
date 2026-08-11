# 💧 LaundryHub

LaundryHub is a modern, full-stack POS (Point of Sale) and management dashboard designed specifically for laundry businesses. Built with a premium, glassmorphism UI, it streamlines day-to-day operations from order creation to revenue tracking.

## ✨ Features

- **📊 Smart Dashboard:** Real-time overview of today's transactions, revenue, and active laundry status (washing, ready for pickup).
- **🛍️ Point of Sale (POS):** Fast and intuitive order creation with inline new customer registration and dynamic service selection.
- **👥 Customer Management:** Easily track and manage your customer database.
- **🏷️ Service Configuration:** Manage your laundry services, pricing, and units (e.g., kg, pcs).
- **💸 Expense Tracking:** Keep track of operational costs to maintain a healthy cash flow.
- **🔒 Secure Authentication:** Protected routes and secure login powered by Supabase Auth.
- **🎨 Premium UI/UX:** Built with Tailwind CSS and Shadcn UI, featuring modern glassmorphism, fluid animations, and beautiful gradients.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database:** PostgreSQL (Hosted on [Supabase](https://supabase.com/))
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase account with a PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ridhoakbarsyah23/laundry-management.git
   cd laundry-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables by creating a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   DATABASE_URL=your_database_connection_string
   ```

4. Push the database schema using Drizzle:
   ```bash
   npx drizzle-kit push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
