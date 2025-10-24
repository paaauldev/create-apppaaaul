"use client";

import Link from "next/link";
import { Brain, Home, Search, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-background relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden p-6">
      {/* Contenido principal */}
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        {/* Logo y marca */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          className="flex items-center gap-3 text-2xl font-bold"
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="from-primary to-accent text-primary-foreground flex size-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg">
            <Brain className="size-7" />
          </div>
          <span className="from-foreground to-primary bg-gradient-to-r bg-clip-text text-transparent">
         Nuvace
          </span>
        </motion.div>

        {/* Número 404 animado */}
        <motion.div
          animate={{
            rotateY: [0, 180, 360],
            scale: [1, 1.05, 1],
          }}
          className="relative"
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <h1 className="text-8xl font-black tracking-tighter sm:text-9xl">
            <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
              404
            </span>
          </h1>
        </motion.div>

        {/* Mensaje principal */}
        <div className="space-y-4">
          <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
            ¡Ups! Esta página no existe
          </h2>
          <p className="text-muted-foreground max-w-md text-lg">
            La página que buscas no se encuentra disponible. Es posible que haya sido movida o
            eliminada.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex w-full max-w-sm flex-col gap-4 sm:flex-row">
          <Button asChild className="flex-1 gap-2" size="lg">
            <Link href="/">
              <Home className="size-4" />
              Ir al inicio
            </Link>
          </Button>
        </div>

        {/* Enlace para volver atrás */}
        <Button
          className="text-muted-foreground hover:text-foreground gap-2"
          variant="ghost"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="size-4" />
          Volver atrás
        </Button>

        {/* Información adicional */}
        <div className="border-muted/20 bg-muted/10 mt-8 rounded-lg border p-6 backdrop-blur-sm">
          <p className="text-muted-foreground text-sm">
            Si crees que esto es un error, por favor{" "}
            <Link className="text-primary font-medium hover:underline" href="/panel/resumen">
              contacta con soporte
            </Link>{" "}
            para que podamos ayudarte.
          </p>
        </div>
      </div>

      {/* Partículas flotantes adicionales para el efecto 404 */}
      <div className="pointer-events-none fixed inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 200, 0],
              y: [0, -200, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            className="bg-accent absolute h-2 w-2 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            transition={{
              duration: 5 + i * 0.5,
              ease: "easeInOut",
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
