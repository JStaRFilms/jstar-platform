# Feature: Rich Message Components

## 1. Purpose

The Rich Message Components feature provides interactive, visually rich content display within JohnGPT chat messages. These components enable enhanced AI responses with color palettes, code blocks, and file previews, creating a professional AI assistant experience that matches the mockup designs in `docs/Mockups/02_JohnGPT_Enhanced/`.

## 2. Component Overview

### ColorPalette Component

**File Location**: `src/components/ui/color-palette.tsx`

- **Purpose**: Displays color swatches in a responsive grid with hex values and clipboard functionality
- **Props**:
  - `colors`: `Array<{ hex: string; name?: string }>` - Array of color objects with hex values and optional names
  - `columns?`: `number` - Number of columns (default: responsive 3 for mobile, 2 for desktop)

### Code Block Component

**File Location**: `src/components/ui/code-block.tsx`

- **Purpose**: Syntax-highlighted code display with copy functionality and language labels
- **Props**:
  - `code`: `string` - The code content to display
  - `language?`: `string` - Programming language for syntax highlighting (default: 'javascript')
  - `showLineNumbers?`: `boolean` - Whether to show line numbers (default: false)

### File Attachment Component

**File Location**: `src/components/ui/file-attachment.tsx`

- **Purpose**: File preview with icon, name, size, and download functionality
- **Props**:
  - `file`: `{ name: string; size: number; type: string; url: string }` - File metadata object
  - `onDownload?`: `(file: FileObject) => void` - Optional download handler

## 3. Implementation Details

### Color Palette Grid
- **Mobile Layout**: 3×3 grid using `grid-cols-3` for maximum color visibility
- **Desktop Layout**: 3×2 grid (`grid-cols-2`) for balanced display
- **Tap-to-Copy**: Each color swatch copies hex value to clipboard with visual feedback
- **Theme Compliance**: Uses CSS custom properties for theme adaptability

### Code Block Styling
- **Background**: Dark theme (`bg-black/50`) for code readability
- **Header**: Language label and copy button in purple-accented header bar
- **Syntax Highlighting**: Integrated with Prism.js or similar library
- **Copy Functionality**: One-click copy with success state feedback

### File Attachments
- **Visual Design**: Preview card with file icon and metadata
- **Security**: Controlled download only for authorized files
- **Accessibility**: Screen reader announcements for file information
- **Error Handling**: Graceful fallback for missing icons or broken downloads

## 4. Theme Integration

All rich components strictly adhere to Tailwind v4 `@theme` token usage:

```css
/* Core tokens used */
--color-background: #171717;    /* Dark mode primary */
--color-foreground: #f5f5f5;    /* High contrast text */
--color-accent-purple: #8B5CF6;  /* AI accent color */
--color-accent-blue: #3B82F6;   /* User accent color */
```

### Responsive Breakpoints
- **Mobile (`< 768px`)**: Optimized for touch interaction with larger tap targets
- **Desktop (`≥ 768px`)**: Hover states and precise positioning
- **Accessibility**: Respects `prefers-reduced-motion` for all animations

## 5. Usage in Chat Messages

Rich components are automatically rendered based on AI message content:

```tsx
<MessageContent message={aiMessage} />
<!-- Internally parses content for:
     - Color mentions (e.g., "#3366cc", "blue")
     - Code blocks (```language\ncode\n```)
     - File attachments (JSON metadata in message)
-->
```

### Message Parsing Logic
1. **Text Analysis**: Scans message content for color hex codes and code fences
2. **Metadata Extraction**: Parses file attachment data from message annotations
3. **Component Injection**: Replaces plain text with interactive rich components
4. **Layout Preservation**: Maintains message flow while enhancing readability

## 6. Accessibility Features

- **Screen Reader Support**: All interactive elements announce their purpose
- **Keyboard Navigation**: Tab order maintains logical message flow
- **High Contrast**: All text and icons meet WCAG AA standards
- **Focus Management**: Proper focus indicators on interactive elements

## 7. Performance Considerations

- **Lazy Loading**: Rich components load only when scrolling into view
- **Animation Optimization**: Uses CSS transforms for smooth transitions
- **Bundle Splitting**: Syntax highlighting library loaded separately
- **Memory Management**: Proper cleanup of clipboard event listeners

## 8. Security Best Practices

- **Input Sanitization**: All code and color inputs validated before rendering
- **Content Security Policy**: Restricted script execution in code blocks
- **Download Validation**: Server-side file type checking before allowing downloads
- **URL Encoding**: Safe handling of special characters in download URIs

## 9. Browser Compatibility

- **Modern Browsers**: Full feature support with Progressive Enhancement
- **Mobile Safari**: Optimized touch interactions and scrolling
- **Clipboard API**: Fallback for older browsers without modern clipboard support
- **Internationalization**: UTF-8 encoding for multilingual code content

## 10. Future Extensions

### Planned Enhancements
- **Interactive Code Editing**: In-place code modification within messages
- **Color Scheme Generation**: AI-suggested color combinations
- **File Preview Modal**: Expanded file viewing for supported formats
- **Message Threading**: Connected message chains for complex conversations

### Integration Points
- **Plugin System**: Third-party extensions for custom rich content types
- **Analytics**: Usage tracking for component effectiveness
- **Performance Monitoring**: Component load time and interaction metrics

This rich message component system transforms basic text responses into interactive, professional AI communications that enhance the overall user experience while maintaining accessibility, performance, and security standards.
