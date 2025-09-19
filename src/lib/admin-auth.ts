import { NextRequest, NextResponse } from 'next/server';

/**
 * Admin Authentication Middleware
 * Simple authentication check for admin endpoints
 * In production, this should be replaced with proper JWT/session authentication
 */

// Admin user type
interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';
}

// Mock admin user for development
// In production, this should come from a database or JWT token
const ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-1',
    email: 'admin@jstarfilms.com',
    name: 'J StaR Admin',
    role: 'SUPER_ADMIN',
  },
];

/**
 * Check if the request has valid admin authentication
 * This is a simplified version for development
 * In production, implement proper JWT token validation
 */
export function requireAdmin(request: NextRequest): { user: AdminUser } | null {
  try {
    // Check for Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return null;
    }

    // Simple token check (replace with proper JWT validation)
    const token = authHeader.replace('Bearer ', '');

    // For development, accept any token that starts with 'admin-'
    // In production, validate JWT token properly
    if (token.startsWith('admin-')) {
      // Mock user lookup
      const user = ADMIN_USERS[0]; // Return first admin user
      return { user };
    }

    // Check for API key in header (alternative authentication method)
    const apiKey = request.headers.get('x-api-key');
    if (apiKey === process.env.ADMIN_API_KEY) {
      const user = ADMIN_USERS[0];
      return { user };
    }

    return null;
  } catch (error) {
    console.error('Admin authentication error:', error);
    return null;
  }
}

/**
 * Middleware wrapper for admin-only API routes
 * Returns 401 if authentication fails
 */
export function withAdminAuth<T extends { params?: Record<string, string> }>(
  handler: (request: NextRequest, context?: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: T): Promise<NextResponse> => {
    try {
      const authResult = requireAdmin(request);

      if (!authResult) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Admin authentication required',
          },
          { status: 401 }
        );
      }

      // Add admin user to request for use in handlers
      (request as NextRequest & { adminUser: AdminUser }).adminUser = authResult.user;

      return await handler(request, context);
    } catch (error) {
      console.error('Admin auth middleware error:', error);
      return NextResponse.json(
        {
          status: 'error',
          message: 'Authentication error',
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Check if user has required role
 * Simple role-based access control
 */
export function hasRole(user: AdminUser, requiredRole: string): boolean {
  if (!user || !user.role) return false;

  const roleHierarchy = {
    'USER': 1,
    'MODERATOR': 2,
    'ADMIN': 3,
    'SUPER_ADMIN': 4,
  };

  const userRoleLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 999;

  return userRoleLevel >= requiredRoleLevel;
}

/**
 * Development helper: Generate admin token
 * This is for testing purposes only
 */
export function generateAdminToken(): string {
  // In production, this should generate a proper JWT
  return `admin-${Date.now()}`;
}
