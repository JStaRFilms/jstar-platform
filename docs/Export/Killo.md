# Project Autopsy Report: J StaR Films Personal Platform

## 1. Project Elevator Pitch
A comprehensive, AI-first personal web platform for John Oluleke-Oke (J StaR Films) that combines dynamic content management, an admin dashboard, and creator tools to showcase professional video production, app development, and faith-inspired creative services.

## 2. Core Technology Stack
- **Frontend Framework**: Next.js 14 (App Router) with React 19
- **Language**: TypeScript (strict type checking enabled)
- **Styling**: Tailwind CSS v4 with custom theme colors (jstar-blue, faith-purple, growth-green, admin-red)
- **Database**: SQLite with Prisma ORM
- **State Management**: React Hooks and TanStack React Query (SWR)
- **UI Components**: Radix UI primitives, Lucide React icons, Motion for animations
- **Backend**: Next.js API Routes with Node.js
- **Authentication**: JWT-based admin authentication (development stage)
- **Development Tools**: ESLint (Next.js config), TypeScript compiler
- **Additional Libraries**: Gray-matter for MDX, Resend for email, Next-MDX-Remote for content

## 3. Inferred Architecture
Feature-based modular architecture where components are organized by business domains rather than technical layers. Each feature (AdminDashboard, HomePage, HeroSlidesManagement, etc.) contains its own components/, hooks/, types/, and contexts/ directories. This promotes:
- High cohesion within features
- Loose coupling between features  
- Easy feature isolation and testing
- Scalable codebase organization
- Clear separation of concerns with dedicated hooks for data fetching and state management

## 4. Key Modules & Responsibilities

| Module/File | Responsibility |
|-------------|----------------|
| `src/app/layout.tsx` | Root layout with metadata, theme provider, and conditional routing |
| `src/app/page.tsx` | Homepage composition of all main sections |
| `src/features/AdminDashboard/` | Complete admin interface with system monitoring, quick actions, and module access |
| `src/features/HeroSlidesManagement/` | CMS for managing dynamic homepage carousel slides with CRUD operations |
| `src/features/HomePage/components/HeroSection.tsx` | Dynamic hero section with slideshow, statistics, and call-to-action buttons |
| `src/features/SystemDiagnostic/` | Performance monitoring, hardware profiling, and automated diagnostics |
| `src/lib/admin-auth.ts` | Authentication middleware for admin routes with role-based access |
| `prisma/schema.prisma` | Database schema with models for contacts, slides, file storage, and diagnostics |
| `src/app/api/admin/hero-slides/` | RESTful API endpoints for hero slide management |

## 5. Inferred Coding Conventions

### Naming
- **Variables/Functions**: camelCase (e.g., `useHeroSlides`, `fetchSlides`)
- **Components/Types**: PascalCase (e.g., `HeroSection`, `DatabaseHeroSlide`)
- **Files**: kebab-case for components, camelCase for utilities (e.g., `hero-section.tsx`, `adminAuth.ts`)
- **Directories**: PascalCase for features (e.g., `AdminDashboard`, `HomePage`)

### Formatting
- Consistent 2-space indentation
- Extensive JSDoc comments for all interfaces, functions, and complex components
- TypeScript interfaces defined before component usage
- Import organization with path aliases (`@/features/`, `@/lib/`)
- 'use client' directive at top of client components
- Proper line breaks and spacing for readability

### Error Handling
- `try/catch` blocks in async operations (API calls, data fetching)
- Graceful fallbacks to default data when APIs fail
- Console warnings/errors for debugging
- Loading states with user feedback
- Error boundaries for component-level error isolation

## 6. Dependency Analysis
Run `npm list --depth=0` or `cat package.json` to view all dependencies. Key production dependencies include Next.js ecosystem packages, Prisma for database, UI libraries (Radix, Lucide), and utility libraries for content processing and email.

## 7. Potential Entry Points
- **Main Application**: `src/app/page.tsx` - The homepage that composes all public sections
- **Admin Dashboard**: `src/app/admin/page.tsx` - Administrative interface entry point  
- **API Routes**: `src/app/api/` directory containing all backend endpoints
- **Development Server**: `npm run dev` starts on port 5782