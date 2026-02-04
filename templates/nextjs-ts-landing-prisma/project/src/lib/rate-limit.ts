/**
 * Rate Limiter simple basado en memoria
 * Limita el número de solicitudes por identificador en una ventana de tiempo
 */

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private cache: Map<string, RateLimitEntry> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(config: RateLimitConfig) {
    this.maxRequests = config.maxRequests;
    this.windowMs = config.windowMs;
  }

  check(identifier: string): RateLimitResult {
    const now = Date.now();
    const entry = this.cache.get(identifier);

    // Si no existe entrada o la ventana expiró, crear nueva
    if (!entry || now >= entry.resetTime) {
      const resetTime = now + this.windowMs;
      this.cache.set(identifier, { count: 1, resetTime });
      return {
        success: true,
        remaining: this.maxRequests - 1,
        resetTime,
      };
    }

    // Si existe entrada y está dentro de la ventana
    if (entry.count >= this.maxRequests) {
      return {
        success: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Incrementar contador
    entry.count++;
    this.cache.set(identifier, entry);

    return {
      success: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  reset(identifier: string): void {
    this.cache.delete(identifier);
  }
}

/**
 * Rate limiters predefinidos para diferentes casos de uso
 */
export const rateLimiters = {
  // Rate limiter general para API
  api: new RateLimiter({
    maxRequests: 100,
    windowMs: 60 * 1000, // 100 requests por minuto
  }),

  // Rate limiter para autenticación (más restrictivo)
  auth: new RateLimiter({
    maxRequests: 10,
    windowMs: 60 * 1000, // 10 intentos por minuto
  }),

  // Rate limiter para operaciones sensibles
  sensitive: new RateLimiter({
    maxRequests: 5,
    windowMs: 60 * 1000, // 5 por minuto
  }),

  // Rate limiter para búsquedas
  search: new RateLimiter({
    maxRequests: 30,
    windowMs: 60 * 1000, // 30 por minuto
  }),

  // Rate limiter para uploads
  upload: new RateLimiter({
    maxRequests: 10,
    windowMs: 60 * 1000, // 10 por minuto
  }),
} as const;

export type RateLimitType = keyof typeof rateLimiters;
