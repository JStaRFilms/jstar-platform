# Admin API Endpoints Documentation

## Overview

This document outlines the REST API endpoints available for admin functionality in the J StaR Films platform. All endpoints are protected and require admin authentication.

## Base URL
```
/api/admin
```

## Authentication
All admin endpoints require authentication. Authentication is handled via JWT tokens or session-based auth.

## Hero Slides Management

### GET `/api/admin/hero-slides`
Retrieve all active hero slides for the homepage carousel.

**Method**: `GET`  
**Authentication**: Required  
**Response Format**: JSON

**Success Response (200)**:
```json
{
  "status": "success",
  "data": [
    {
      "id": "slide-1",
      "titleLine1": "Elevate Your Story",
      "titleLine2": "With Purpose & Excellence",
      "tagline": "Creative Vision, Technical Excellence",
      "description": "Transform your ideas into stunning visual experiences...",
      "imageUrl": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7",
      "gradient": "from-primary to-accent",
      "buttonGradient": "from-primary to-accent",
      "buttonBorder": "border-primary dark:border-accent",
      "buttonText": "text-primary dark:text-accent",
      "buttonHover": "hover:bg-primary/10 dark:hover:bg-accent/10",
      "altText": "Video Production",
      "projectTitle": "Latest Project",
      "projectDesc": "Brand Storytelling for Tech Startup",
      "sortOrder": 0,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

**Error Response (500)**:
```json
{
  "status": "error",
  "message": "Failed to fetch hero slides"
}
```

---

### POST `/api/admin/hero-slides`
Create a new hero slide.

**Method**: `POST`  
**Authentication**: Required  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "titleLine1": "New Campaign Title",
  "titleLine2": "Second Line Here",
  "tagline": "Campaign Tagline",
  "description": "Detailed description of the campaign or service",
  "imageUrl": "https://example.com/image.jpg",
  "gradient": "from-blue-500 to-purple-600",
  "buttonGradient": "from-blue-500 to-purple-600",
  "buttonBorder": "border-blue-500",
  "buttonText": "text-blue-500",
  "buttonHover": "hover:bg-blue-50",
  "altText": "Alt text for accessibility",
  "projectTitle": "Project Title",
  "projectDesc": "Project Description"
}
```

**Required Fields**:
- `titleLine1`, `titleLine2`, `tagline`, `description`
- `imageUrl`, `gradient`, `buttonGradient`
- `buttonBorder`, `buttonText`, `buttonHover`

**Success Response (201)**:
```json
{
  "status": "success",
  "data": {
    "id": "new-slide-id",
    "titleLine1": "New Campaign Title",
    // ... all slide data
    "sortOrder": 3,
    "createdAt": "2025-01-15T11:00:00.000Z",
    "updatedAt": "2025-01-15T11:00:00.000Z"
  },
  "message": "Hero slide created successfully"
}
```

**Validation Error (400)**:
```json
{
  "status": "error",
  "message": "Missing required field: titleLine1"
}
```

---

### GET `/api/admin/hero-slides/[id]`
Retrieve a specific hero slide by ID.

**Method**: `GET`  
**Authentication**: Required  
**Parameters**: `id` (string) - Slide ID

**Success Response (200)**:
```json
{
  "status": "success",
  "data": {
    "id": "slide-1",
    // ... complete slide object
  }
}
```

**Not Found Error (404)**:
```json
{
  "status": "error",
  "message": "Hero slide not found"
}
```

---

### PUT `/api/admin/hero-slides/[id]`
Update an existing hero slide.

**Method**: `PUT`  
**Authentication**: Required  
**Content-Type**: `application/json`  
**Parameters**: `id` (string) - Slide ID

**Request Body**: Same as POST, all fields optional for partial updates

**Success Response (200)**:
```json
{
  "status": "success",
  "data": {
    "id": "slide-1",
    // ... updated slide object
    "updatedAt": "2025-01-15T11:30:00.000Z"
  },
  "message": "Hero slide updated successfully"
}
```

---

### DELETE `/api/admin/hero-slides/[id]`
Soft delete a hero slide (sets `isActive` to false).

**Method**: `DELETE`  
**Authentication**: Required  
**Parameters**: `id` (string) - Slide ID

**Success Response (200)**:
```json
{
  "status": "success",
  "message": "Hero slide deleted successfully"
}
```

## Usage Examples

### JavaScript/TypeScript

```javascript
// Fetch all slides
const response = await fetch('/api/admin/hero-slides');
const data = await response.json();

// Create new slide
const newSlide = {
  titleLine1: "Holiday Special",
  titleLine2: "Festive Offers",
  tagline: "Seasonal Promotions",
  description: "Special holiday pricing on all services",
  imageUrl: "/images/holiday-banner.jpg",
  gradient: "from-red-500 to-green-600",
  buttonGradient: "from-red-500 to-green-600",
  buttonBorder: "border-red-500",
  buttonText: "text-red-500",
  buttonHover: "hover:bg-red-50"
};

const createResponse = await fetch('/api/admin/hero-slides', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(newSlide)
});

// Update slide
const updateResponse = await fetch('/api/admin/hero-slides/slide-1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ titleLine1: "Updated Title" })
});

// Delete slide
const deleteResponse = await fetch('/api/admin/hero-slides/slide-1', {
  method: 'DELETE'
});
```

### cURL Examples

```bash
# Get all slides
curl -X GET http://localhost:3000/api/admin/hero-slides

# Create new slide
curl -X POST http://localhost:3000/api/admin/hero-slides \
  -H "Content-Type: application/json" \
  -d '{
    "titleLine1": "New Slide",
    "titleLine2": "Second Line",
    "tagline": "Tagline",
    "description": "Description",
    "imageUrl": "https://example.com/image.jpg",
    "gradient": "from-blue-500 to-purple-600",
    "buttonGradient": "from-blue-500 to-purple-600",
    "buttonBorder": "border-blue-500",
    "buttonText": "text-blue-500",
    "buttonHover": "hover:bg-blue-50"
  }'

# Update slide
curl -X PUT http://localhost:3000/api/admin/hero-slides/slide-1 \
  -H "Content-Type: application/json" \
  -d '{"titleLine1": "Updated Title"}'

# Delete slide
curl -X DELETE http://localhost:3000/api/admin/hero-slides/slide-1
```

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "status": "error",
  "message": "Descriptive error message"
}
```

### Common Error Codes
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **404**: Not Found (slide doesn't exist)
- **500**: Internal Server Error (server/database issues)

## Rate Limiting

Admin endpoints are rate-limited to prevent abuse:
- **GET requests**: 100 requests per minute
- **POST/PUT/DELETE**: 30 requests per minute

## Data Validation

### Required Fields
All required fields are validated on creation and update:
- String fields cannot be empty
- URLs must be valid format
- Sort order must be a non-negative integer

### Data Sanitization
- All text inputs are sanitized to prevent XSS
- HTML tags are stripped from text fields
- URLs are validated for proper format

## Database Schema

The hero slides are stored in the `HeroSlide` table with the following structure:

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

## Integration Notes

### Frontend Integration
The hero slides are automatically fetched by the `useHeroSlides` hook in the `HeroSection` component. No manual API calls are needed for basic usage.

### Admin Dashboard
These endpoints are designed to be consumed by an admin dashboard interface for managing hero content.

### Caching
Consider implementing caching for GET requests to improve performance, especially for frequently accessed slides.

## Future Enhancements

### Planned Features
- **Bulk Operations**: Create/update multiple slides at once
- **Image Upload**: Direct image upload to cloud storage
- **Version History**: Track changes to slides over time
- **A/B Testing**: Test different slide variations
- **Scheduling**: Schedule slides to be active during specific time periods

### API Extensions
- **Search & Filter**: Query slides by various criteria
- **Sorting**: Custom sort orders and drag-and-drop reordering
- **Analytics**: Track slide performance metrics
- **Backup/Restore**: Export/import slide configurations
