# Feature: System Diagnostic

## 1. Purpose

The `SystemDiagnostic` feature provides comprehensive system monitoring and diagnostic capabilities for the J StaR Films platform. It enables administrators to monitor system health, performance metrics, AI model status, and run automated diagnostics to ensure optimal platform operation.

## 2. Main Component (`SystemDiagnostic.tsx`)

This is the primary container component for the system diagnostics feature.

### Props

| Prop     | Type     | Required | Description                              |
|----------|----------|----------|------------------------------------------|
| `className` | `string` | No       | Additional CSS classes for styling       |

### State

- Manages `diagnosticRefreshTrigger` state for coordinating diagnostic history updates
- Uses custom hooks for data fetching and mutations

## 3. Custom Hooks

### `useSystemMetrics.ts`
- **Purpose:** Fetches and caches system metrics data using React Query
- **Returns:** `{ data, isLoading, error }` with automatic caching and background refetching

### `useDiagnostics.ts`
- **Purpose:** Handles running full system diagnostics with proper error handling
- **Returns:** Mutation object with loading states and success callbacks

## 4. Component Breakdown

### `DiagnosticHeader.tsx`
- **Purpose:** Displays the page header with title, description, and action buttons
- **Props:**
  - `isRunningDiagnostics: boolean` - Whether diagnostics are currently running
  - `onRunDiagnostics: () => void` - Callback to run diagnostics
  - `onExportReport: () => void` - Callback to export diagnostic report

### `QuickStats.tsx`
- **Purpose:** Displays key system metrics in a responsive grid layout
- **Props:**
  - `data: QuickStatsData` - The metrics data to display
  - `isLoading: boolean` - Loading state for skeleton display

### Child Components
- `SystemStatus.tsx` - Overall system health indicator
- `HardwareProfiler.tsx` - Hardware performance profiling
- `AIModelHealth.tsx` - AI model and service monitoring
- `DiagnosticHistory.tsx` - Historical diagnostic results
- `SystemMetrics.tsx` - Detailed system metrics
- `PerformanceBenchmarks.tsx` - Performance benchmarking tools
- `SystemRecommendations.tsx` - System optimization recommendations
- `EmergencyTools.tsx` - Emergency system management tools

## 5. API Integration

### Endpoints Used
- `GET /api/admin/system-metrics` - Fetches current system metrics
- `POST /api/admin/diagnostics` - Runs full system diagnostics
- `GET /api/admin/diagnostics` - Fetches diagnostic history

### Caching Strategy
- Server-side caching with TTL (2 minutes for system metrics)
- Client-side React Query caching with background refetching
- Request deduplication to prevent duplicate API calls

## 6. Performance Optimizations

### Implemented Optimizations
- **Parallel Processing:** System metrics are fetched in parallel (CPU, memory, disk, AI health)
- **Intelligent Caching:** Server-side caching prevents redundant system calls
- **Request Deduplication:** Multiple identical requests are automatically deduplicated
- **Background Refetching:** Data refreshes automatically without blocking UI
- **Lazy Loading:** Components load data only when needed

### Performance Improvements
- System metrics load time: Reduced from 12+ seconds to <2 seconds
- Eliminated duplicate API calls through deduplication
- Smart caching prevents unnecessary refetches
- Parallel processing for independent operations

## 7. Usage Example

```tsx
import SystemDiagnostic from '@/features/SystemDiagnostic';

// Basic usage
function SystemDiagnosticPage() {
  return <SystemDiagnostic />;
}

// With custom styling
function CustomDiagnosticPage() {
  return <SystemDiagnostic className="custom-theme" />;
}
```

## 8. Architecture Benefits

### Component-Driven Design
- Each diagnostic aspect is a separate, reusable component
- Single Responsibility Principle maintained throughout
- Easy to extend with new diagnostic capabilities

### Data Flow
- Data flows down from hooks to presentational components
- Actions flow up through callback props
- Clean separation between data fetching and presentation

### Error Handling
- Comprehensive error boundaries and fallbacks
- Graceful degradation when services are unavailable
- User-friendly error messages and retry mechanisms

## 9. Future Enhancements

### Potential Additions
- Real-time monitoring with WebSocket connections
- Advanced AI model performance analytics
- Automated alert system for critical issues
- Historical trend analysis and reporting
- Custom diagnostic rule engine

### Scalability Considerations
- Modular component architecture supports easy feature additions
- Hook-based data management allows for easy testing and mocking
- API caching layer can be extended for additional endpoints
