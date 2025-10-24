import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  "/",
  "/login",
  "/marketplace",
  "/politica-cookies",
  "/politica-privacidad",
  "/terminos-condiciones",
  "/api/auth",
];

// Rutas que requieren autenticación de usuario (role: user)
const userRoutes = ["/dashboard"];

// Rutas que requieren autenticación de admin (role: admin)
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si la ruta es pública
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // Si es una ruta pública, permitir acceso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Obtener sesión
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Si no hay sesión, redirigir al login
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRole = session.user.role;

  // Verificar si el usuario está baneado y perfil incompleto en una sola consulta
  // Solo verificar si no está ya en la página de perfil, resumen o login para evitar bucles
  if (pathname !== "/dashboard" && pathname !== "/login") {
    try {
      const userData = await auth.api.getUser({ query: { id: session.user.id } });

      if (!userData) {
        // Si no se puede obtener los datos del usuario, redirigir al login
        console.error("User data not found for session:", session.user.id);

        return NextResponse.redirect(new URL("/login?error=user_not_found", request.url));
      }
    } catch (error) {
      // Si hay error obteniendo los datos del usuario, log detallado y permitir continuar
      console.error("Error checking user status in middleware:", {
        error: error instanceof Error ? error.message : error,
        userId: session.user.id,
        pathname,
      });
    }
  }

  // Verificar rutas de admin
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isAdminRoute && userRole !== "admin") {
    // Si no es admin, redirigir al panel de usuario
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Verificar rutas de usuario
  const isUserRoute = userRoutes.some((route) => pathname.startsWith(route));

  if (isUserRoute && userRole !== "user" && userRole !== "admin") {
    // Si no es usuario ni admin, redirigir al login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si es admin y está intentando acceder a rutas de usuario, permitir
  if (userRole === "admin") {
    return NextResponse.next();
  }

  // Si es usuario normal, verificar que no esté intentando acceder a rutas de admin
  if (userRole === "user" && isAdminRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    // Aplicar middleware a todas las rutas excepto archivos estáticos
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
