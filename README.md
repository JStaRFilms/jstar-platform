# J StaR Films Personal Platform

A comprehensive, AI-first personal web platform for John Oluleke-Oke (J StaR Films) featuring dynamic content management, admin dashboard, and creator tools.

## 🎯 **What's Implemented**

### ✅ **Phase 1: Admin System & CMS (COMPLETE)**
- **Admin Dashboard** (`/admin`) - Complete system monitoring and management
- **Hero Slides Management** (`/admin/cms/hero-slides`) - Full CRUD for homepage carousel
- **System Diagnostics** (`/admin/system-diagnostic`) - Performance monitoring and troubleshooting
- **Database Integration** - SQLite with Prisma ORM
- **RESTful API** - Complete admin endpoints with authentication
- **Mobile-First UI** - Responsive design with dark mode support

### 🚧 **Phase 2: Public Website (IN PROGRESS)**
- Basic page structure implemented
- Hero section with dynamic slides
- Theme toggle functionality
- Mobile-responsive design

### 📋 **Phase 3: JohnGPT & Creator Tools (PLANNED)**
- AI assistant integration
- Creator growth engine
- Content management system

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+
- npm or yarn
- SQLite (included with Prisma)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd j-star-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
- Public site: [http://localhost:3000](http://localhost:3000)
- Admin Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)
- Hero Slides Management: [http://localhost:3000/admin/cms/hero-slides](http://localhost:3000/admin/cms/hero-slides)
- System Diagnostics: [http://localhost:3000/admin/system-diagnostic](http://localhost:3000/admin/system-diagnostic)

## 📁 **Project Structure**

```
j-star-platform/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin pages
│   │   │   ├── page.tsx       # Main admin dashboard
│   │   │   ├── cms/           # CMS pages
│   │   │   └── system-diagnostic/ # Diagnostics page
│   │   ├── api/               # API routes
│   │   │   └── admin/         # Admin API endpoints
│   │   └── globals.css        # Global styles
│   ├── features/              # Feature-based architecture
│   │   ├── AdminDashboard/    # Admin dashboard feature
│   │   ├── HeroSlidesManagement/ # Hero slides CMS
│   │   └── HomePage/          # Homepage feature
│   └── components/            # Shared components
├── prisma/                    # Database schema & migrations
├── docs/                      # Documentation
└── public/                    # Static assets
```

## 🎨 **Key Features**

### Admin Dashboard (`/admin`)
- **System Status**: Real-time monitoring of database, API, and storage
- **Quick Stats**: Key metrics and performance indicators
- **Quick Actions**: Fast access to common admin functions
- **System Health**: CPU, memory, and network monitoring
- **Recent Activity**: Latest admin actions and system events
- **Module Access**: Available admin modules and their status
- **Emergency Panel**: System recovery and troubleshooting tools

### Hero Slides Management (`/admin/cms/hero-slides`)
- **Full CRUD Operations**: Create, read, update, delete slides
- **Default Slides**: Pre-configured professional slides
- **Live Preview**: Real-time slide preview
- **Mobile-First Design**: Responsive admin interface
- **Drag & Drop**: Intuitive slide management
- **Rich Configuration**: Gradient, button, and styling options

### System Diagnostics (`/admin/system-diagnostic`)
- **Database Health**: Connection status and query performance
- **API Monitoring**: Endpoint health and response times
- **Performance Metrics**: Core Web Vitals and load times
- **System Resources**: CPU, memory, storage utilization
- **Diagnostic Tools**: Automated testing and troubleshooting
- **Real-time Updates**: Live monitoring and alerts

## 🛠 **Technology Stack**

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **State Management**: React Hooks
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: SQLite
- **ORM**: Prisma
- **Authentication**: JWT (planned)

### Development Tools
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript
- **Database**: Prisma Studio

## 📊 **Database Schema**

### Hero Slides Table
```sql
CREATE TABLE hero_slides (
  id          TEXT PRIMARY KEY,
  titleLine1   TEXT NOT NULL,
  titleLine2   TEXT NOT NULL,
  tagline     TEXT NOT NULL,
  description TEXT NOT NULL,
  imageUrl    TEXT NOT NULL,
  gradient    TEXT NOT NULL,
  buttonGradient TEXT NOT NULL,
  buttonBorder TEXT NOT NULL,
  buttonText  TEXT NOT NULL,
  buttonHover TEXT NOT NULL,
  isActive    BOOLEAN DEFAULT TRUE,
  sortOrder   INTEGER DEFAULT 0,
  altText     TEXT,
  projectTitle TEXT,
  projectDesc TEXT,
  createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
  createdBy   TEXT
);
```

## 🔗 **API Endpoints**

### Hero Slides Management
- `GET /api/admin/hero-slides` - Retrieve all slides
- `POST /api/admin/hero-slides` - Create new slide
- `GET /api/admin/hero-slides/[id]` - Get specific slide
- `PUT /api/admin/hero-slides/[id]` - Update slide
- `DELETE /api/admin/hero-slides/[id]` - Delete slide

### System Status
- `GET /api/admin/system/status` - System health status
- `GET /api/admin/system/metrics` - Performance metrics

## 🎨 **Design System**

### Colors (Tailwind v4 @theme)
```css
@theme {
  --color-jstar-blue: #007bff;
  --color-faith-purple: #6f42c1;
  --color-growth-green: #28a745;
  --color-admin-red: #dc3545;
}
```

### Typography
- **Primary Font**: Geist (optimized by Next.js)
- **Headings**: Bold, gradient text for hero elements
- **Body**: Clean, readable text with proper contrast

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Gradient backgrounds, smooth transitions
- **Forms**: Clean inputs with validation feedback
- **Navigation**: Responsive sidebar with active states

## 📱 **Mobile-First Design**

- **Breakpoint System**: sm, md, lg, xl
- **Touch-Friendly**: Proper button sizes and spacing
- **Responsive Grids**: Flexible layouts for all screen sizes
- **Optimized Images**: Next.js Image component with lazy loading
- **Performance**: Optimized bundles and efficient rendering

## 🔒 **Security Features**

- **Admin-Only Access**: Protected routes for admin functionality
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries with Prisma
- **XSS Protection**: Sanitized user inputs and outputs
- **Rate Limiting**: API endpoint protection

## 🚀 **Deployment**

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Production Deployment
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Environment Variables
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 📚 **Documentation**

### Project Documentation
- `docs/J StaR Personal Platform PRD.md` - Product requirements
- `docs/coding_guidelines.md` - Development standards
- `docs/Styling-in-Next-and-Tailwind-v4.md` - Styling guide
- `docs/AdminPageRoutes.md` - API documentation
- `docs/Endpoints.md` - Page routes and navigation

### Feature Documentation
- `docs/features/AdminDashboard.md` - Admin dashboard details
- `docs/features/HeroSlidesManagement.md` - CMS feature guide
- `docs/features/SystemDiagnostic.md` - Diagnostics documentation

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make your changes** following the coding guidelines
4. **Run tests**: `npm run lint && npm run type-check`
5. **Commit your changes**: `git commit -m 'Add your feature'`
6. **Push to the branch**: `git push origin feature/your-feature`
7. **Create a Pull Request**

## 📝 **Development Guidelines**

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with React rules
- **Prettier**: Consistent code formatting
- **Imports**: Organized imports with path aliases

### Component Architecture
- **Feature-Based**: Components organized by feature
- **Reusable**: Shared components in `/components`
- **TypeScript**: Full type safety for all components
- **Testing**: Unit tests for critical components

### Database
- **Migrations**: Version-controlled schema changes
- **Seeding**: Default data for development
- **Backup**: Automated backup procedures

## 🐛 **Troubleshooting**

### Common Issues

#### Database Connection
```bash
# Reset database
npx prisma db push --force-reset

# View database
npx prisma studio
```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Check types
npm run type-check

# Generate types
npx prisma generate
```

## 📞 **Support**

For questions or issues:
- Check the documentation in `/docs`
- Review existing issues on GitHub
- Create a new issue with detailed information

## 📄 **License**

This project is private and proprietary to J StaR Films.

## 🙏 **Acknowledgments**

- **Next.js Team** - For the amazing React framework
- **Prisma Team** - For the excellent database toolkit
- **Tailwind CSS** - For the utility-first CSS framework
- **Vercel** - For hosting and deployment platform

---

**Built with ❤️ for J StaR Films by John Oluleke-Oke**
