# 🕌 SIAmanah – Fundraising Platform (Frontend)

A modern, high-performance fundraising frontend designed for SIAmanah. Built with React 18, TypeScript, and Vite, featuring a premium UI/UX that is fully optimized for all devices from 320px to 1440px+.

## 🚀 Tech Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS (v3), Lucide React (Icons), Radix UI / Shadcn UI
- **State Management**: Zustand / React Context
- **Data Fetching**: TanStack Query (React Query) v5
- **HTTP Client**: Axios (with centralized Interceptors for Auth/Refresh)
- **Forms**: React Hook Form, Zod

## 🏗 System Architecture

The project follows a **Feature-driven Architecture**, grouping logic by domain rather than file type.

- **Features**: Located in `src/features/`, containing domain-specific components, hooks, and API logic.
- **Components**: Shared UI components (Atomic design via Shadcn UI).
- **Services**: Centralized API services for public and payment-related data.
- **Layouts**: Standardized shells for Public and Dashboard views.

## 📱 Premium Responsive Design

- **Mobile-First**: Every component designed for mobile before scaling to desktop.
- **Breakpoints**: Robust support for `320px` (xs), `768px` (md), `1024px` (lg), and `1440px+` (xl/2xl).
- **Fluid Typography**: Uses `clamp()` for headings that scale smoothly without layout shifts.
- **Optimized UI**: Features localized skeleton loaders (`Skeleton.tsx`) and responsive optimized images (`OptimizedImage.tsx`).

## 👥 Core Features

- **Responsive Campaign Explorer**: Adaptive grid for listing and detailed campaign views.
- **Smart Donation Checkout**: Multi-step donation flow with Midtrans Snap integration.
- **User Dashboard**: Real-time stats and profile management for Donors and Fundraisers.
- **Campaign Creation**: Intuitive multi-step form for fundraisers to launch new initiatives.

## 📂 Folder Structure

```text
fundraising-fe/
├── src/
│   ├── app/                # Router and global provider setup
│   ├── components/         # Shared shadcn/ui components
│   ├── features/           # Domain-driven features
│   │   ├── auth/           # Login, Register, Google OAuth, OTP
│   │   ├── campaigns/      # Listing, Details, Creation steps
│   │   ├── dashboard/      # Reports, My Campaigns, Profile
│   │   ├── landing/        # Home page sections
│   │   └── donations/      # Checkout and Payment status
│   ├── layouts/            # Main and Dashboard Shells
│   ├── lib/                # Axios instance and API configs
│   ├── services/           # Data services (public APIs)
│   └── utils/              # Helper utilities (Schema, Formatting)
```

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_ENABLE_MOCKS=false
VITE_MIDTRANS_CLIENT_KEY=your_client_key
```

## 🛠 Installation & Setup

1. **Install dependencies**: `npm install`
2. **Start Dev Server**: `npm run dev`
3. **Build Production**: `npm run build`

## 🛡 Performance & SEO

- **Image Optimization**: Auto-scaling and lazy loading for campaign thumbnails.
- **SEO Ready**: Dynamic JSON-LD schema generation for campaigns and organizations.
- **Fast Interactions**: Minimal re-renders through targeted React Query caching.

## 📄 License

Distributed under the MIT License.
