# Client Logo Management System

## Overview

The Client Logo Management System provides a flexible, reusable solution for displaying client logos across the J StaR Films platform. The system supports multiple logo formats (PNG, JPG, SVG) with automatic fallbacks to elegant placeholders when logos are not available.

## Architecture

### Core Components

#### `ClientLogoPlaceholder` Component
**Location:** `src/components/ui/ClientLogoPlaceholder.tsx`

A flexible React component that handles different types of logo content with consistent styling and behavior.

### File Structure

```
public/
├── logos/                          # Logo assets directory
│   ├── clients/                    # Client logos
│   │   ├── techcorp.png
│   │   ├── designstudio.svg
│   │   └── creativeagency.jpg
│   ├── partners/                   # Partner logos
│   └── testimonials/               # Testimonial logos

src/
├── components/
│   └── ui/
│       └── ClientLogoPlaceholder.tsx
└── features/
    └── [FeatureName]/
        └── components/
            └── [ComponentUsingLogos].tsx
```

## Component API

### Props Interface

```typescript
interface ClientLogoProps {
  /** Custom CSS classes */
  className?: string;
  /** Logo source - can be SVG string, image URL, or undefined for placeholder */
  src?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Logo name for placeholder text */
  name?: string;
  /** Logo type - 'svg', 'png', 'jpg', etc. */
  type?: 'svg' | 'image';
}
```

### Usage Examples

#### Basic Image Logo
```tsx
<ClientLogoPlaceholder
  src="/logos/techcorp.png"
  alt="TechCorp logo"
  name="TechCorp"
/>
```

#### SVG String Logo
```tsx
<ClientLogoPlaceholder
  src={`<svg viewBox="0 0 24 24"><path d="..."/></svg>`}
  type="svg"
  name="Design Studio"
/>
```

#### Placeholder (No Logo)
```tsx
<ClientLogoPlaceholder
  name="Media Group"
/>
```

#### With Custom Styling
```tsx
<ClientLogoPlaceholder
  src="/logos/client.png"
  className="w-16 h-16 opacity-50 hover:opacity-100"
  name="Client Name"
/>
```

## Data Structure

### Client Data Format

```typescript
interface Client {
  name: string;
  logo?: string;        // Path to logo file or SVG string
  alt: string;
  website?: string;     // Optional link to client website
  category?: string;    // e.g., 'tech', 'design', 'media'
}

// Example usage in components
const clients: Client[] = [
  {
    name: 'TechCorp',
    logo: '/logos/clients/techcorp.png',
    alt: 'TechCorp - Technology Solutions',
    website: 'https://techcorp.com',
    category: 'tech'
  },
  {
    name: 'DesignStudio',
    logo: '/logos/clients/designstudio.svg',
    alt: 'Design Studio - Creative Agency',
    category: 'design'
  },
  {
    name: 'MediaGroup',
    // No logo - will show placeholder
    alt: 'Media Group - Content Production',
    category: 'media'
  }
];
```

## Implementation Guide

### 1. Setting Up Logo Assets

#### Directory Structure
```
public/logos/
├── clients/           # Client logos
├── partners/          # Partner/Sponsor logos
├── testimonials/      # Logos for testimonials
└── awards/           # Award/certification logos
```

#### File Naming Convention
- Use lowercase with hyphens: `tech-corp.png`
- Include company name: `design-studio-logo.svg`
- Add size suffix if multiple sizes: `client-logo-200x100.png`

#### Supported Formats
- **PNG**: Best for logos with transparency
- **JPG**: Good for photographic logos
- **SVG**: Ideal for vector logos, scalable, small file size

### 2. Adding Logos to Components

#### In AboutSection
```tsx
import ClientLogoPlaceholder from '../../../components/ui/ClientLogoPlaceholder';

const clients = [
  { name: 'TechCorp', logo: '/logos/clients/techcorp.png', alt: 'TechCorp logo' },
  { name: 'DesignStudio', logo: '/logos/clients/designstudio.svg', alt: 'Design Studio logo' },
  { name: 'MediaGroup', logo: undefined, alt: 'Media Group logo' },
];

export default function AboutSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {clients.map((client, index) => (
        <div key={index} className="flex justify-center">
          <ClientLogoPlaceholder
            src={client.logo}
            alt={client.alt}
            name={client.name}
            type={client.logo?.endsWith('.svg') ? 'svg' : 'image'}
          />
        </div>
      ))}
    </div>
  );
}
```

#### In Footer
```tsx
const partners = [
  { name: 'Partner A', logo: '/logos/partners/partner-a.png' },
  { name: 'Partner B', logo: '/logos/partners/partner-b.svg' },
];

export default function Footer() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {partners.map((partner, index) => (
        <ClientLogoPlaceholder
          key={index}
          src={partner.logo}
          name={partner.name}
          className="w-20 h-8" // Smaller size for footer
        />
      ))}
    </div>
  );
}
```

### 3. Styling and Theming

#### Default Styling
The component includes sensible defaults:
- Height: `h-12` (48px)
- Grayscale filter for consistency
- Hover opacity effects
- Responsive scaling

#### Custom Styling
```tsx
// Different sizes
<ClientLogoPlaceholder className="w-8 h-8" />    // Small (32px)
<ClientLogoPlaceholder className="w-12 h-12" />  // Medium (48px) - default
<ClientLogoPlaceholder className="w-16 h-16" />  // Large (64px)

// Custom effects
<ClientLogoPlaceholder
  className="grayscale hover:grayscale-0 transition-all duration-300"
/>

// Dark mode specific
<ClientLogoPlaceholder
  className="dark:brightness-90 dark:contrast-110"
/>
```

## Features

### Automatic Format Detection
The component automatically detects logo type:
- `.svg` files → Treated as SVG strings
- Other extensions → Treated as images
- No extension → Fallback to placeholder

### Fallback System
When no logo is provided:
1. Shows elegant SVG placeholder
2. Uses company name as text
3. Maintains consistent dimensions
4. Includes proper accessibility attributes

### Performance Optimizations
- Next.js `<Image>` component for PNG/JPG (automatic optimization)
- SVG strings rendered inline (no HTTP requests)
- Lazy loading for images
- Proper sizing to prevent layout shift

### Accessibility
- Proper `alt` text for screen readers
- ARIA labels for complex interactions
- Semantic HTML structure
- Keyboard navigation support

## Best Practices

### Logo Preparation
1. **Consistent Sizing**: Aim for logos around 200x100px
2. **Format Selection**:
   - Use SVG for vector logos (scalable, small files)
   - Use PNG for logos with transparency
   - Use JPG for photographic logos
3. **Optimization**: Compress images without quality loss
4. **Naming**: Use descriptive, consistent naming

### Component Usage
1. **Always provide alt text** for accessibility
2. **Use semantic names** for placeholders
3. **Group related logos** in arrays
4. **Handle missing logos** gracefully
5. **Test across devices** for responsive behavior

### Maintenance
1. **Regular cleanup**: Remove unused logo files
2. **Version control**: Track logo changes
3. **Backup strategy**: Keep original high-res versions
4. **Documentation**: Update client data when logos change

## Integration Examples

### With CMS
```typescript
// Fetch from headless CMS
const clients = await cms.getClients();

return clients.map(client => (
  <ClientLogoPlaceholder
    src={client.logo.url}
    alt={client.logo.alt}
    name={client.name}
  />
));
```

### With API
```typescript
// Dynamic logo loading
const [logos, setLogos] = useState([]);

useEffect(() => {
  fetch('/api/logos')
    .then(res => res.json())
    .then(setLogos);
}, []);

return logos.map(logo => (
  <ClientLogoPlaceholder
    src={logo.url}
    alt={logo.alt}
    name={logo.name}
  />
));
```

## Troubleshooting

### Common Issues

#### Logo Not Displaying
```typescript
// Check file path
<ClientLogoPlaceholder src="/logos/client.png" />

// Ensure file exists at: public/logos/client.png
```

#### Wrong Dimensions
```tsx
// Override default sizing
<ClientLogoPlaceholder
  src="/logos/client.png"
  className="w-24 h-12" // Custom dimensions
/>
```

#### SVG Not Rendering
```tsx
// For SVG files, ensure they're accessible
<ClientLogoPlaceholder
  src="/logos/client.svg"
  type="svg"
/>
```

#### Accessibility Issues
```tsx
// Always provide descriptive alt text
<ClientLogoPlaceholder
  src="/logos/client.png"
  alt="Client Company Name - Logo"
  name="Client Company Name"
/>
```

## Migration Guide

### From Static Images
```tsx
// Before
<img src="/logos/client.png" alt="Client" className="h-12" />

// After
<ClientLogoPlaceholder
  src="/logos/client.png"
  alt="Client logo"
  name="Client"
/>
```

### From Placeholder Text
```tsx
// Before
<div className="h-12 flex items-center justify-center bg-gray-100">
  Client Logo
</div>

// After
<ClientLogoPlaceholder name="Client" />
```

## Future Enhancements

### Planned Features
1. **Logo Upload Interface**: Admin panel for logo management
2. **Automatic Optimization**: Resize and compress logos
3. **Logo Variations**: Light/dark mode versions
4. **Lazy Loading**: Intersection Observer for performance
5. **CMS Integration**: Direct connection to content management systems

### Extensibility
The component is designed to be easily extended:
- Add new logo formats
- Implement custom loading states
- Add animation effects
- Integrate with design systems

---

## Quick Reference

### File Locations
- **Component**: `src/components/ui/ClientLogoPlaceholder.tsx`
- **Assets**: `public/logos/`
- **Usage**: Any component that displays client logos

### Key Props
- `src`: Logo file path or SVG string
- `alt`: Accessibility text
- `name`: Company name for placeholder
- `type`: 'svg' or 'image'
- `className`: Custom styling

### Supported Formats
- PNG, JPG (via Next.js Image)
- SVG strings and files
- Automatic fallback to placeholder

This system provides a robust, flexible foundation for managing client logos across your entire platform.
