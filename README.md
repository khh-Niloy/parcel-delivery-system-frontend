# Parcel Delivery System – Frontend

A modern, responsive frontend for a comprehensive parcel delivery platform built with React, TypeScript, and Vite. This application provides a complete solution for managing parcel deliveries with role-based access control for administrators, senders, receivers, and delivery agents.

## 🚀 Project Overview

The Parcel Delivery System Frontend is a full-featured web application that streamlines the entire parcel delivery process. It offers:

- **Multi-role Dashboard**: Tailored interfaces for different user types (Admin, Sender, Receiver, Delivery Agent)
- **Real-time Tracking**: Live parcel tracking with detailed status updates and timeline
- **Smart Status Management**: Automated status transitions based on business rules
- **Responsive Design**: Mobile-first approach with consistent UI/UX across all devices
- **Modern Architecture**: Built with React 18, TypeScript, and modern tooling

### Key Features

- **Authentication & Authorization**: Secure login with role-based access control
- **Parcel Management**: Create, update, track, and manage parcels throughout their lifecycle
- **User Management**: Admin tools for managing users, delivery agents, and system settings
- **Real-time Updates**: Live status updates with toast notifications
- **Responsive Tables**: Smart, responsive data tables with collapsible details
- **Tracking System**: Comprehensive parcel tracking with detailed event history

## 🛠 Technology Stack

### Frontend Framework
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with strict configuration
- **Vite** - Fast build tool and development server

### State Management & API
- **Redux Toolkit** - Predictable state management
- **RTK Query** - Powerful data fetching and caching
- **Axios** - HTTP client for direct API calls

### UI & Styling
- **Shadcn UI** - High-quality, accessible component library
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **Prettier** - Code formatting
- **Sonner** - Toast notifications

## 📋 Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd parcel-delivery-system-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the project root:
   ```bash
   VITE_BASE_URL=https://your-api-domain.com/
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Build & Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Preview Production Build**
   ```bash
   npm run preview
   ```

3. **Lint Code**
   ```bash
   npm run lint
   ```

## 🌐 Live URL

**Development**: `http://localhost:5173`

**Production**: [Deploy to your preferred hosting platform]

### Deployment Options
- **Vercel**: Zero-config deployment with automatic builds
- **Netlify**: Drag-and-drop deployment with form handling
- **AWS S3 + CloudFront**: Static hosting with CDN
- **Firebase Hosting**: Google's hosting solution

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn UI primitives
│   ├── layout/          # Layout components (Navbar, Sidebar, etc.)
│   └── modules/         # Feature-specific components
├── pages/               # Route pages organized by role
│   ├── admin/           # Admin-specific pages
│   ├── sender/          # Sender-specific pages
│   ├── receiver/        # Receiver-specific pages
│   └── deliveryAgent/   # Delivery agent pages
├── redux/               # State management
│   ├── features/        # RTK Query APIs
│   └── store.ts         # Redux store configuration
├── routes/              # Route definitions
├── utils/               # Utility functions
├── lib/                 # Configuration and helpers
└── assets/              # Static assets
```

## 🔐 Authentication & Roles

The system supports four distinct user roles:

### Admin
- Manage all parcels and users
- Assign delivery agents
- View system analytics
- Block/unblock users

### Sender
- Create new parcels
- Track parcel status
- Update parcel details (before dispatch)
- Cancel parcels (before dispatch)

### Receiver
- View incoming parcels
- Confirm delivery
- Track parcel progress
- View delivery history

### Delivery Agent
- View assigned parcels
- Update parcel status
- Mark parcels as delivered
- Add delivery notes

## 📊 API Integration

The frontend integrates with a RESTful backend API:

- **Base URL**: Configured via `VITE_BASE_URL` environment variable
- **Authentication**: JWT-based with secure cookie storage
- **CORS**: Configured for cross-origin requests
- **Error Handling**: Comprehensive error handling with user-friendly messages

### Key Endpoints
- `/auth/*` - Authentication endpoints
- `/parcel/*` - Parcel management
- `/user/*` - User management
- `/admin/*` - Administrative functions

## 🎨 Design System

The application uses a consistent design system built on:

- **Color Palette**: Blue primary theme with semantic colors
- **Typography**: Inter font family with consistent sizing
- **Spacing**: 4px base unit system
- **Components**: Reusable, accessible UI components
- **Responsive**: Mobile-first responsive design

## 🚀 Performance Features

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Caching**: RTK Query provides intelligent caching
- **Optimized Builds**: Vite provides fast builds and HMR

## 🔧 Development Notes

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for consistent formatting
- Conventional commit messages

### Testing
- Unit tests for utility functions
- Integration tests for API calls
- E2E tests for critical user flows

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive Web App (PWA) ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
