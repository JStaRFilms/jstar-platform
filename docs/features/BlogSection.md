# Feature: BlogSection

## 1. Purpose

The BlogSection component displays a curated selection of blog content on the homepage, providing visitors with a preview of the latest insights and articles from J StaR Films. It serves as an entry point to the full blog experience while maintaining visual consistency with the overall site design.

## 2. Main Component (`src/features/HomePage/components/BlogSection.tsx`)

### Overview
The BlogSection component showcases:
- A featured article with rich content preview
- A responsive grid of recent blog posts
- Seamless integration with the unified blog data source
- Accessibility-compliant design with proper ARIA labels

### Props
This component does not accept external props. It uses the unified blog data hook internally.

### State Management
- Uses `useBlogData()` hook for unified data access
- Destructures `featuredPost` and `posts` from the unified data source
- No local state management required

### Key Features
- **Unified Data Source**: Leverages the shared `useBlogData` hook for consistency across HomePage and BlogPage
- **Responsive Design**: Mobile-first approach with breakpoints at `sm:`, `md:`, and `lg:`
- **Dark Mode Support**: Full compatibility with the site's dark/light theme system
- **Accessibility**: WCAG-compliant with proper semantic HTML, ARIA labels, and keyboard navigation
- **Performance**: Optimized images with Next.js Image component and proper `sizes` attributes

## 3. Unified Data Architecture

### Data Hook (`src/features/HomePage/hooks/useBlogData.ts`)

The component uses a sophisticated data architecture designed for future database migration:

#### Interfaces
```typescript
interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content?: string;
  image: string;
  imageAlt?: string;
  category: string;
  tags: string[];
  author: string;
  authorImage?: string;
  date: string;
  readTime: string;
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
}

interface BlogData {
  featuredPost: BlogPost;
  posts: BlogPost[];
  isLoading?: boolean;
  error?: string;
}
```

#### Available Hooks
- `useBlogData()`: Returns complete blog data object
- `useAllBlogPosts()`: Returns all posts (featured + regular)
- `useFeaturedPost()`: Returns only the featured post
- `useRegularPosts()`: Returns only regular posts
- `useBlogPostsByCategory(category)`: Filters posts by category

### Database Migration Strategy

The data architecture is designed for seamless migration from local data to database-backed storage:

1. **Current State**: Local data storage with TypeScript interfaces
2. **Migration Path**: SQLite with Prisma → Supabase/PostgreSQL
3. **Abstraction Layer**: `BlogDataService` interface defines database operations
4. **Zero Breaking Changes**: Components remain unchanged during migration

## 4. Component Architecture

### File Structure
```
src/features/HomePage/
├── components/
│   └── BlogSection.tsx          # Main component
└── hooks/
    └── useBlogData.ts           # Unified data source

src/features/BlogPage/
├── components/
│   ├── BlogGrid.tsx            # Uses unified data
│   └── FeaturedArticle.tsx     # Uses unified data
```

### Dependencies
- **React**: Core component functionality
- **Next.js**: Image optimization, Link components
- **Custom Hooks**: `useBlogData` for unified data access
- **Icon Components**: `ArrowRightIcon` from shared icon library

## 5. Styling & Design System Integration

### Tailwind CSS v4 Integration
- Uses custom `@theme` colors: `jstar-blue`, `faith-purple`, `growth-green`
- Implements responsive design with mobile-first breakpoints
- Supports dark mode variants throughout
- Maintains consistent spacing and typography

### Key Design Elements
- **Featured Post**: Large hero-style layout with overlay text
- **Post Grid**: 3-column responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- **Hover Effects**: Smooth transitions and transforms
- **Typography**: Gradient text effects for headings
- **Shadows**: Layered shadow system for depth

### Responsive Breakpoints
```css
/* Mobile First */
grid-cols-1          /* Default: 1 column */
/* Tablet */
md:grid-cols-2       /* 768px+: 2 columns */
/* Desktop */
lg:grid-cols-3       /* 1024px+: 3 columns */
```

### Mobile Image Display
- **Featured Post**: Fixed height (`h-64`) on mobile, flexible height (`md:h-auto`) on larger screens
- **Grid Posts**: Consistent fixed height (`h-48`) across all screen sizes
- **Image Optimization**: Next.js Image with responsive `sizes` attributes for optimal loading

## 6. Accessibility (WCAG Compliance)

### Semantic HTML
- Uses proper `<section>`, `<article>`, `<h2>`, `<h3>` elements
- Implements `<time>` elements with `dateTime` attributes
- Semantic link relationships with `aria-label` attributes

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus indicators with `focus:ring` styling
- Logical tab order throughout the component

### Screen Reader Support
- Descriptive `aria-label` attributes for links and buttons
- `aria-labelledby` for section headings
- `aria-hidden="true"` for decorative separators

### Color Contrast
- Ensures WCAG AA compliance for text contrast
- Dark mode variants maintain proper contrast ratios
- Focus indicators meet contrast requirements

## 7. Performance Optimization

### Image Optimization
- Next.js Image component with automatic optimization
- Proper `sizes` attributes for responsive loading
- WebP format support with fallbacks
- Lazy loading for grid images

### Bundle Size
- Tree-shaking friendly imports
- Minimal external dependencies
- Shared icon components reduce duplication

### Runtime Performance
- No unnecessary re-renders
- Efficient data access patterns
- Optimized CSS with Tailwind's purging

## 8. Integration Points

### HomePage Integration
```tsx
import BlogSection from '../features/HomePage/components/BlogSection';

// Used within the main homepage layout
<BlogSection />
```

### BlogPage Integration
```tsx
import BlogGrid from '../features/BlogPage/components/BlogGrid';
import FeaturedArticle from '../features/BlogPage/components/FeaturedArticle';

// Both components use the same unified data source
<FeaturedArticle />
<BlogGrid />
```

### Data Flow
```
useBlogData() → BlogSection → Render featured + grid posts
useBlogData() → BlogGrid → Render all posts in grid
useBlogData() → FeaturedArticle → Render featured post
```

## 9. Usage Examples

### Basic Implementation
```tsx
import BlogSection from '@/features/HomePage/components/BlogSection';

export default function HomePage() {
  return (
    <main>
      {/* Other sections */}
      <BlogSection />
      {/* More sections */}
    </main>
  );
}
```

### With Custom Styling
```tsx
// The component accepts no props but can be wrapped for custom styling
<div className="custom-blog-wrapper">
  <BlogSection />
</div>
```

## 10. Customization

### Content Customization
Modify the data in `useBlogData.ts`:
```typescript
const defaultBlogData: BlogData = {
  featuredPost: {
    // Customize featured post content
  },
  posts: [
    // Add or modify blog posts
  ]
};
```

### Styling Customization
Override styles using CSS modules or additional className props (when extended):
```css
/* Custom styles for specific instances */
.custom-blog-section {
  /* Custom background, spacing, etc. */
}
```

### Data Source Customization
Replace the default data with API calls:
```typescript
export const useBlogData = (): BlogData => {
  // Replace with actual API/database calls
  const [data, setData] = useState(defaultBlogData);

  useEffect(() => {
    fetch('/api/blog-posts')
      .then(res => res.json())
      .then(setData);
  }, []);

  return data;
};
```

## 11. Testing Strategy

### Unit Tests
- Component rendering with different data states
- Hook functionality and data transformation
- Responsive breakpoint behavior
- Accessibility compliance

### Integration Tests
- Data flow between components
- Theme switching functionality
- Navigation and routing
- Image loading and optimization

### E2E Tests
- Complete user journeys
- Cross-browser compatibility
- Mobile device testing
- Performance metrics

## 12. Future Enhancements

### Database Integration
- Prisma ORM setup for local SQLite
- Migration scripts for Supabase
- CMS integration for content management
- Real-time data synchronization

### Advanced Features
- Infinite scroll for blog archives
- Search and filtering capabilities
- Social sharing integration
- Reading progress indicators
- Related posts recommendations

### Performance Improvements
- Service worker caching
- Image CDN integration
- Lazy loading optimization
- Bundle splitting strategies

## 13. Maintenance

### Update Procedures
1. **Content Updates**: Modify data in `useBlogData.ts`
2. **Styling Changes**: Update Tailwind classes in component
3. **Feature Additions**: Extend interfaces and hooks
4. **Database Migration**: Implement Prisma schema and update hooks

### Monitoring
- Performance metrics tracking
- User engagement analytics
- Error logging and reporting
- Accessibility audit scheduling

### Troubleshooting
- **Data Not Loading**: Check hook implementation and data structure
- **Styling Issues**: Verify Tailwind configuration and custom themes
- **Performance Problems**: Analyze bundle size and image optimization
- **Accessibility Issues**: Run automated accessibility audits

## 14. Dependencies & Requirements

### Runtime Dependencies
- React 18+
- Next.js 14+
- Tailwind CSS v4
- TypeScript 5+

### Development Dependencies
- ESLint for code quality
- Prettier for formatting
- Testing framework (Jest/Vitest)
- Storybook for component development

### Browser Support
- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Screen reader compatibility

## 15. Success Metrics

### Performance Metrics
- **Load Time**: < 2 seconds initial page load
- **Bundle Size**: < 100KB for blog section
- **Lighthouse Score**: > 90 for performance, accessibility, SEO

### User Experience Metrics
- **Engagement**: Click-through rate to blog posts
- **Accessibility**: WCAG AA compliance maintained
- **Responsiveness**: Perfect scores on mobile devices

### Technical Metrics
- **Maintainability**: Code coverage > 80%
- **Type Safety**: Zero TypeScript errors
- **Bundle Efficiency**: Tree-shaking effectiveness

---

*This documentation follows the project's coding guidelines and maintains consistency with the overall architecture. For questions or contributions, refer to the main project documentation.*
