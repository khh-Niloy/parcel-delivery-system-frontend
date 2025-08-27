# Parcel Delivery System – Frontend (React + TypeScript + Vite)

A modern, responsive frontend for a parcel delivery platform built with React, TypeScript, Vite, RTK Query, and Shadcn UI components.

## Features

- Authentication-aware navigation with role-based sidebars (Admin, Sender, Receiver, Delivery Agent)
- Data tables with responsive columns and action buttons
  - Admin: All Parcels, Users (Senders/Receivers), Delivery Agents
  - Sender: Create Parcel, Manage Parcels (update/cancel rules based on status)
  - Receiver: Incoming Parcels, Delivered/Confirmed Parcels with expandable tracking events
- Track Parcel page with live lookup, overview, delivery summary, and timeline
- Consistent design system using Shadcn UI primitives and TailwindCSS
- Toast feedback on actions (logout, tracking fetch success/error, status updates)

## Tech Stack

- React 18, TypeScript, Vite
- Redux Toolkit + RTK Query
- Shadcn UI + TailwindCSS
- Axios (API calls in some pages)

## Getting Started

1) Install dependencies

```bash
npm install
```

2) Configure environment

Create a `.env` file (or `.env.local`) at the project root:

```bash
VITE_BASE_URL=https://api.example.com/
```

3) Run the dev server

```bash
npm run dev
```

4) Build for production

```bash
npm run build
```

5) Preview production build

```bash
npm run preview
```

## Key Pages

- `src/pages/HomePage.tsx`: Marketing landing
- `src/pages/TrackParcelPage.tsx`: Track parcel by ID; shows overview, route, summary, and timeline
- `src/pages/sender/CreateParcel.tsx`: Guided parcel creation with fee estimate
- `src/pages/sender/SenderAllParcel.tsx`: Sender parcel management with update/cancel rules
- `src/pages/receiver/ReceiverIncomingParcel.tsx`: Table styled like admin with status updates and events
- `src/pages/receiver/ReceiverDeliveredAndConfirmedParcel.tsx`: Delivered/confirmed list with timeline
- `src/pages/admin/AllParcelsAdmin.tsx`: Full parcel list with status updates and agent assignment
- `src/pages/admin/AllSenderAndReceiver.tsx`: Compact users table (merged columns, responsive)
- `src/pages/admin/AllDeliveryAgent.tsx`: Delivery agents table (availability, metrics, actions)

## Routing

Route definitions live under `src/routes/` and are generated per role. Utility helpers in `src/utils/` aid role checks and dynamic route generation.

## API Layer

- RTK Query endpoints in `src/redux/features/**` wrap REST endpoints
- Axios helper used in `TrackParcelPage` for direct fetch

Ensure `VITE_BASE_URL` is set correctly and the backend supports CORS with credentials if needed.

## Code Style

- TypeScript-first with explicit types on exported APIs
- Clear, readable names and early-return control flow
- Shadcn UI components for consistent tables, forms, and layout

## Linting

```bash
npm run lint
```

## Folder Structure (high-level)

```
src/
  components/         # UI primitives and shared components
  pages/              # Route pages by role/feature
  redux/              # RTK store and RTK Query APIs
  utils/              # Role checks, route generators, misc utils
  lib/                # Axios config, env, helpers
  assets/             # Icons and images
```

## Contributing

1. Create a feature branch
2. Implement changes with clear, small commits
3. Ensure lint passes and UI stays consistent
4. Open a PR describing changes and screenshots where helpful

## License

MIT
