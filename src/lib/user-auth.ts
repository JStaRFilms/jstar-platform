import { withAuth } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Internal user representation from database
 */
export interface InternalUser {
    id: string;
    workosId: string | null;
}

/**
 * Result of authentication with internal user lookup
 */
export interface AuthResult {
    internalUser: InternalUser;
    workosUser: NonNullable<Awaited<ReturnType<typeof withAuth>>['user']>;
}

/**
 * Authenticate and resolve the internal database user from WorkOS session.
 * This helper eliminates N+1 query patterns by providing a single reusable
 * lookup function for API routes.
 * 
 * @returns AuthResult with both WorkOS user and internal database user, or null if unauthenticated
 * @throws Never throws - returns null for unauthenticated requests
 * 
 * @example
 * ```ts
 * const authResult = await getAuthenticatedUser();
 * if (!authResult) {
 *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 * }
 * const { internalUser, workosUser } = authResult;
 * ```
 */
export async function getAuthenticatedUser(): Promise<AuthResult | null> {
    const { user: workosUser } = await withAuth();

    if (!workosUser) {
        return null;
    }

    const internalUser = await prisma.user.findUnique({
        where: { workosId: workosUser.id },
        select: { id: true, workosId: true },
    });

    if (!internalUser) {
        return null;
    }

    return {
        internalUser,
        workosUser,
    };
}

/**
 * Standard 401 Unauthorized response
 */
export function unauthorizedResponse(): NextResponse {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

/**
 * Standard 403 Forbidden response for ownership violations
 */
export function forbiddenResponse(message = 'Access denied'): NextResponse {
    return NextResponse.json({ error: message }, { status: 403 });
}

/**
 * Standard 404 Not Found response
 */
export function notFoundResponse(resource = 'Resource'): NextResponse {
    return NextResponse.json({ error: `${resource} not found` }, { status: 404 });
}
