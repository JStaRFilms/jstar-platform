# Project Autopsy Report: J StaR Personal Platform

## 1. Project Elevator Pitch
A comprehensive, AI-first personal web platform for John Oluleke-Oke (J StaR Films) that combines professional video production services with dynamic content management, admin dashboard capabilities, and creator tools. The platform serves as both a public-facing portfolio/business website and a personal content management system with features for hero slide management, contact forms, file storage, and system diagnostics.

## 2. Core Technology Stack
- **Frontend Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Database**: SQLite with Prisma ORM
- **UI Components**: Radix UI, Lucide React icons, Motion for animations
- **State Management**: React Hooks, TanStack Query for server state
- **Backend**: Next.js API Routes
- **Authentication**: NextAuth.js (planned)
- **Email**: Resend API
- **Development Tools**: ESLint, TypeScript compiler

## 3. Inferred Architecture
The application follows a **feature-based architecture** with clear separation of concerns:

- **Presentation Layer**: Next.js App Router with feature-based page organization
- **Business Logic Layer**: Custom hooks and services within each feature directory
- **Data Access Layer**: Prisma ORM with SQLite database
- **API Layer**: Next.js API routes handling CRUD operations
- **Shared Components**: Reusable UI components in `/components` directory
- **Utilities**: Common functions and configurations in `/lib` directory

The architecture emphasizes:
- Feature isolation (each feature in its own directory)
- Component reusability
- Type safety throughout
- Mobile-first responsive design
- Accessibility compliance

## 4. Key Modules & Responsibilities

| Module | Location | Responsibility |
|--------|----------|----------------|
| **AdminDashboard** | `src/features/AdminDashboard/` | Main admin interface with system monitoring, quick stats, and module access |
| **HeroSlidesManagement** | `src/features/HeroSlidesManagement/` | CRUD operations for dynamic homepage carousel slides |
| **HomePage** | `src/features/HomePage/` | Public homepage with hero section, services, portfolio, and contact sections |
| **SystemDiagnostic** | `src/features/SystemDiagnostic/` | Performance monitoring, health checks, and troubleshooting tools |
| **ContactPage** | `src/features/ContactPage/` | Contact form handling and lead management |
| **BlogPage** | `src/features/BlogPage/` | Blog content display and management |
| **PortfolioPage** | `src/features/PortfolioPage/` | Portfolio showcase and project display |
| **ServicesPage** | `src/features/ServicesPage/` | Services offering presentation |
| **StorePage** | `src/features/StorePage/` | Product/service store interface |
| **CommunicationsInbox** | `src/features/CommunicationsInbox/` | Message and communication management |
| **LeadMagnets** | `src/features/LeadMagnets/` | Lead generation and capture tools |
| **MigrationCenter** | `src/features/MigrationCenter/` | Data migration and system updates |
| **FeatureFlags** | `src/features/FeatureFlags/` | Feature toggle management |
| **CMS** | `src/features/CMS/` | Content management system core functionality |

## 5. Inferred Coding Conventions

### Naming Conventions
- **Components**: `PascalCase` (e.g., `HeroSection`, `AdminDashboard`)
- **Files**: `PascalCase.tsx` for components, `camelCase.ts` for utilities/hooks
- **Functions/Variables**: `camelCase` (e.g., `useSlideshow`, `handleSubmit`)
- **Constants**: `UPPER_SNAKE_CASE` (not extensively used)
- **Directories**: `PascalCase` for features, `camelCase` for utilities

### Formatting & Style
- **Indentation**: 2 spaces (standard for the ecosystem)
- **Quotes**: Single quotes for JSX, double quotes for JSON
- **Semicolons**: Used consistently
- **Line Length**: No strict limit, but components kept under 200 lines per internal guidelines
- **Imports**: Organized with path aliases (`@/components/...`)

### Error Handling
- **API Routes**: Try-catch blocks with proper HTTP status codes
- **Components**: Loading states and error boundaries
- **Database**: Prisma handles SQL errors, custom error responses
- **Validation**: Server-side validation with proper error messages

### React Patterns
- **Hooks**: Custom hooks for business logic (`useHeroSlides`, `useSlideshow`)
- **Components**: Functional components with TypeScript interfaces
- **Props**: Destructured in function signatures with proper typing
- **Effects**: Dependency arrays always provided, cleanup functions where needed
- **Client Components**: Marked with `'use client'` directive when needed

### Documentation
- **JSDoc Comments**: Extensive use for component props and complex functions
- **TypeScript**: Strict typing with interfaces for all data structures
- **Feature Documentation**: Markdown files in `docs/features/` for each major feature

## 6. Dependency Analysis
```bash
npm list --depth=0
# or
cat package.json
```

**Key Dependencies:**
- **Core**: `next`, `react`, `react-dom`, `typescript`
- **Database**: `@prisma/client`, `prisma`
- **Styling**: `tailwindcss`, `tailwind-merge`, `clsx`, `tailwindcss-animate`
- **UI**: `@radix-ui/react-tabs`, `lucide-react`, `motion`
- **State/API**: `@tanstack/react-query`, `swr`
- **Utilities**: `dotenv`, `gray-matter`, `next-mdx-remote`, `remark`, `resend`
- **Development**: ESLint, TypeScript types

## 7. Potential Entry Points
- **Main Application Entry**: `src/app/page.tsx` (homepage)
- **Development Server**: `npm run dev` (starts on port 5782)
- **Production Build**: `npm run build && npm run start`
- **Admin Dashboard**: `/admin` route
- **API Endpoints**: `/api/admin/*`, `/api/contact/*`
- **Database**: SQLite file at `prisma/dev.db`

The application is a full-stack Next.js application with the public website as the primary entry point, admin functionality accessible via `/admin` routes, and API routes handling backend operations.