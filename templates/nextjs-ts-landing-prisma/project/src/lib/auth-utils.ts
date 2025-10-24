import { headers } from "next/headers";

import { auth } from "./auth";
import { rateLimiters } from "./rate-limit";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  banned: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export interface AuthorizationOptions {
  requireAuth?: boolean;
  allowedRoles?: string[];
  allowSelf?: boolean; // Para permitir acceso a recursos propios
  resourceOwnerId?: string; // ID del propietario del recurso
}

/**
 * Verifica la autenticación del usuario actual
 */
export async function verifyAuth(): Promise<AuthResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // Verificar si el usuario está baneado
    if (session.user.banned) {
      return {
        success: false,
        error: "Account banned",
      };
    }

    return {
      success: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role ?? "user",
        banned: session.user.banned ?? false,
      },
    };
  } catch (error) {
    console.error("Authentication error:", error);

    return {
      success: false,
      error: "Authentication failed",
    };
  }
}

/**
 * Verifica autorización basada en opciones
 */
export async function verifyAuthorization(options: AuthorizationOptions = {}): Promise<AuthResult> {
  const { requireAuth = true, allowedRoles = [], allowSelf = false, resourceOwnerId } = options;

  if (!requireAuth) {
    return { success: true };
  }

  const authResult = await verifyAuth();

  if (!authResult.success || !authResult.user) {
    return authResult;
  }

  const user = authResult.user;

  // Verificar roles permitidos
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Si se permite acceso propio, verificar si es el propietario del recurso
    if (allowSelf && resourceOwnerId && user.id === resourceOwnerId) {
      return { success: true, user };
    }

    return {
      success: false,
      error: "Insufficient permissions",
    };
  }

  return { success: true, user };
}

/**
 * Aplica rate limiting basado en el usuario
 */
export function checkRateLimit(
  limitType: keyof typeof rateLimiters,
  userId?: string,
): { success: boolean; error?: string } {
  const identifier = userId ?? "anonymous";
  const result = rateLimiters[limitType].check(identifier);

  if (!result.success) {
    return {
      success: false,
      error: "Rate limit exceeded. Please try again later.",
    };
  }

  return { success: true };
}

/**
 * Middleware de seguridad combinado para server actions
 */
export function withSecurityMiddleware<T extends unknown[], R>(
  action: (...args: T) => Promise<R>,
  options: AuthorizationOptions & {
    rateLimitType?: keyof typeof rateLimiters;
  } = {},
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    // Verificar autorización
    const authResult = await verifyAuthorization(options);

    if (!authResult.success) {
      throw new Error(authResult.error ?? "Authorization failed");
    }

    // Aplicar rate limiting si está especificado
    if (options.rateLimitType && authResult.user) {
      const rateLimitResult = checkRateLimit(options.rateLimitType, authResult.user.id);

      if (!rateLimitResult.success) {
        throw new Error(rateLimitResult.error ?? "Rate limit exceeded");
      }
    }

    // Ejecutar la acción
    return await action(...args);
  };
}

/**
 * Verifica si el usuario es admin
 */
export async function requireAdmin(): Promise<AuthUser> {
  const result = await verifyAuthorization({
    allowedRoles: ["admin"],
  });

  if (!result.success || !result.user) {
    throw new Error(result.error ?? "Admin access required");
  }

  return result.user;
}

/**
 * Verifica si el usuario está autenticado
 */
export async function requireAuth(): Promise<AuthUser> {
  const result = await verifyAuth();

  if (!result.success || !result.user) {
    throw new Error(result.error ?? "Authentication required");
  }

  return result.user;
}

/**
 * Verifica si el usuario puede acceder a un recurso (admin o propietario)
 */
export async function requireOwnershipOrAdmin(resourceOwnerId: string): Promise<AuthUser> {
  const result = await verifyAuthorization({
    allowedRoles: ["admin"],
    allowSelf: true,
    resourceOwnerId,
  });

  if (!result.success || !result.user) {
    throw new Error(result.error ?? "Access denied");
  }

  return result.user;
}
