# Teach & Grow Tutoring Platform

Role-based tutoring platform dashboard for admins, tutors, and students using React, Supabase, and Tailwind CSS.

## Overview

Teach & Grow is a comprehensive tutoring management dashboard designed to provide tailored experiences based on user roles. The platform securely separates routing and data access for administrators, tutors, and students. By leveraging Supabase for authentication and database management alongside a modern React/Vite frontend, it delivers a fast, secure, and intuitive user experience.

## Tech Stack

TypeScript · React · Vite · Supabase · Tailwind CSS · shadcn/ui

## Key Features

- **Role-Based Access Control:** Distinct dashboard views and capabilities based on user roles (Admin, Tutor, Student).
- **Secure Authentication:** Integrated with Supabase for robust user management and service role validation.
- **Modern Dashboard UI:** Built with shadcn/ui and Tailwind CSS for a clean, accessible, and responsive interface.
- **Fast Development Workflow:** Optimized with Vite for instant server start and lightning-fast HMR.

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase Project & Credentials

### Installation

```bash
# Clone the repository
git clone <url>
cd teach-grow-tutoring-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

### Demo Setup

To quickly seed demo users for each role, configure your `.env` with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, then run:

```bash
npm run demo:users
```
