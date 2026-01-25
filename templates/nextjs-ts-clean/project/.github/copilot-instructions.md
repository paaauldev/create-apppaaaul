# GitHub Copilot - Code Review Instructions

## 🌐 Language / Idioma
**IMPORTANTE:** Todos los comentarios de revisión DEBEN estar en ESPAÑOL.
**IMPORTANT:** All review comments MUST be in SPANISH.

---

# Git & Development Workflow Rules

You MUST follow this workflow strictly:

## Branching
- Never work directly on `dev` or `main`
- Every new feature MUST start by creating a new branch
- Branch naming convention:
  - feature/<short-description>
  - bugfix/<short-description>

## Base branch
- All feature branches MUST be created from `dev`
- All Pull Requests MUST target `dev`

## Git commands
When starting a new feature:
1. Checkout `dev`
2. Pull latest changes
3. Create a new feature branch

Example:
```bash
git checkout dev
git pull
git checkout -b feature/my-feature
```

## Commits
- Use clear and descriptive commit messages
- Prefer small commits
- Use conventional commit format (feat:, fix:, docs:, etc.)

## Pull Requests

### Title Format
```
[<project_name>] Descripción clara y concisa
```

### Requirements
- PRs pequeños y enfocados
- Explicar: qué, por qué, cómo se verificó
- Pre-commit checks passed

### Pre-PR Checklist
```bash
pnpm lint
pnpm test
```

### When the user says the feature is finished:
- Push the branch
- Create a Pull Request to `dev`
- Do NOT merge
- Mention that PR requires approval from another developer

## Restrictions
- Never merge to `dev` or `main`
- Never bypass GitHub Pull Request approvals

---

# Project Setup & Stack

## Package Manager
- **OBLIGATORIO:** pnpm
- **PROHIBIDO:** npm, yarn

## Framework & Core Stack
- **Default:** Next.js para proyectos nuevos
- **TypeScript:** Obligatorio en modo estricto desde el inicio
- **Styling:** Tailwind CSS con integración oficial de Next.js
- **Module System:** ESM y sintaxis moderna del navegador

## Initial Setup Checklist
1. Next.js con TypeScript strict
2. Tailwind CSS oficial
3. ESLint configurado
4. Git configurado (.gitignore)
5. README básico

## Principios
- No añadir dependencias hasta que sean necesarias
- Configurar tooling completo desde el inicio
- Validar configuración antes de continuar

---

# TypeScript Rules

## Type Safety (STRICT)
- **PROHIBIDO:** `any`
- **EVITAR:** `unknown` (usar solo cuando sea estrictamente necesario)
- **PREFERIR:** Inferencia de tipos cuando sea posible

## Decision Making
Si los tipos no están claros:
1. **PARAR**
2. Aclarar con el usuario
3. No continuar con tipos ambiguos

## Best Practices
- Enable strict mode in tsconfig.json
- Usar tipos explícitos en interfaces públicas
- Aprovechar inferencia en implementaciones
- Nunca hacer type casting sin justificación
- Documentar tipos complejos
- Define explicit return types for public functions
- Use type guards for runtime type checking

## Interfaces and Types
- Prefer interfaces for object shapes that may be extended
- Use type aliases for unions, intersections, and utility types
- Export types that are part of the public API

## Null Safety
- Enable strictNullChecks
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Avoid non-null assertions (`!`) unless absolutely necessary

## Functions
- Use arrow functions for callbacks and short functions
- Use function declarations for hoisted functions
- Prefer async/await over raw promises
- Handle both success and error cases in async functions

## Imports
- Use ESM imports (import/export)
- Order imports: external packages, then internal modules
- Use type-only imports when importing only types

## Naming Conventions
- PascalCase for classes, interfaces, types, and enums
- camelCase for variables, functions, and methods
- UPPER_SNAKE_CASE for constants
- Prefix interfaces for implementations (e.g., `ILogger` for interface, `ConsoleLogger` for implementation)

---

# Next.js & React Best Practices

## Code Style and Structure
- Write concise, technical TypeScript code
- Use functional and declarative patterns; avoid classes
- Favor modularization over code duplication
- Descriptive variable names with auxiliary verbs: `isLoading`, `hasError`
- File structure: exported components, subcomponents, helpers, static content, types
- Directory naming: lowercase-with-dashes (`components/auth-wizard`)

## Optimization and Best Practices
- **MINIMIZE** `'use client'`, `useEffect`, `setState`
- **FAVOR** React Server Components (RSC) and Next.js SSR
- Use dynamic imports for code splitting
- Mobile-first responsive design
- **Images:** WebP format, size data, lazy loading

## Component Design
- Componentes pequeños, una sola responsabilidad
- Composición > configuraciones complejas
- Evitar abstracciones prematuras
- Use early returns for readability
- Use consts instead of functions: `const toggle = () => {}`
- Define types when possible

## Error Handling and Validation
- Prioritize error handling and edge cases
- Use early returns for error conditions
- Implement guard clauses for preconditions and invalid states
- Use custom error types for consistency

## State Management and Data Fetching
- Use Zustand or TanStack React Query for global state
- Use Zod for schema validation

## Architecture
- Follow clean architecture principles with clear separation of concerns
- Keep business logic separate from infrastructure code
- Use dependency injection for external services
- Each component should have a single responsibility
- Use interfaces to define contracts between layers

---

# Code Organization

## Folder Structure
Código compartido debe vivir en:
- `components/` - Componentes reutilizables
- `layouts/` - Layouts de página
- `lib/` - Utilidades y lógica de negocio
- `utils/` - Funciones auxiliares puras

## File Organization
- Group files by feature/domain, not by type
- Keep related files close together
- Avoid circular dependencies between modules

## Best Practices
- Nombres descriptivos y claros
- Archivos pequeños y enfocados
- Importaciones explícitas (no barrels)
- Separación clara de concerns

---

# UI & Styling

## CSS Framework
- **ÚNICO PERMITIDO:** Tailwind CSS
- **PROHIBIDO:** CSS-in-JS, CSS modules, styled-components
- Always use Tailwind classes for styling
- Avoid custom CSS or `<style>` tags

## Icons
- **LIBRERÍA:** tabler-icons
- **IMPORTACIÓN:** Explícita, nunca barrels
```typescript
// ✅ Correcto
import { IconHome } from '@tabler/icons-react';

// ❌ Incorrecto
import * as Icons from '@tabler/icons-react';
```

## Component Libraries Priority Order
1. **Magic UI** (preferido)
2. **Hero UI**
3. **Yai Bars**
4. **ShadCN** (solo como base)

### Rules
- No mezclar estilos incompatibles
- Coherencia > creatividad
- No depender solo de ShadCN

## Component Extraction
- No duplicar clases Tailwind
- Si se repite → extraer componente
- Legibilidad > micro-optimizaciones

## Accessibility (NO OPCIONAL)
- HTML semántico obligatorio
- Add `tabindex="0"` to interactive elements
- Include `aria-label` attributes
- Implement keyboard handlers: `onClick` + `onKeyDown`
- Roles ARIA cuando aplique
- Gestión de foco (teclado)
- Contraste de colores adecuado

---

# Brand & UI System - Visual Identity

## Color Palette Selection

### Palette Gallery

#### A — SaaS Confiable
```
Primary:   #6366F1 (Indigo)
Secondary: #22D3EE (Cyan)
```

#### B — Creativo Premium
```
Primary:   #8B5CF6 (Violet)
Secondary: #F472B6 (Pink)
```

#### C — Indie Founder
```
Primary:   #F97316 (Orange)
Secondary: #FDBA74 (Light orange)
```

#### D — Herramienta Potente
```
Primary:   #22C55E (Green)
Secondary: #4ADE80 (Light green)
```

## Automatic Selection Logic
1. Si `globals.css` contiene `--color-primary` → usar existente
2. Si NO existe → elegir paleta de la galería
3. Si usuario pide "define color" → elegir de galería
4. Guardar resultado en `globals.css`

## Color Variants (HSL)
Desde color primario generar:

### Light Variant
- Saturación: -20
- Luminosidad: +5

### Dark Variant
- Saturación: +20
- Luminosidad: -5

**OBLIGATORIO** para mantener armonía visual.

## Theme Settings

### Default Theme
- Dark mode por defecto

### Tailwind Backgrounds
#### Dark Mode
- `slate-950` (más oscuro)
- `slate-900`
- `slate-800` (menos oscuro)

#### Light Mode
- `slate-50` (más claro)
- `slate-100`
- `slate-200` (menos claro)

## Color Usage Rule

### 60-20-20 Rule (OBLIGATORIO)
- 60% color primario
- 20% color secundario
- 20% acentos

### PROHIBIDO
- Paletas arcoíris
- Múltiples colores sin coherencia
- Si más colores necesarios → bajar saturación

## Visual Style Guidelines

### Objetivo
Evitar "vibe-coding UI" - UI debe parecer diseñada a mano, no por IA.

### Depth & Elevation
- **OBLIGATORIO:** Profundidad (sombras + capas)
- **EVITAR:** Look plano de ShadCN
- Mínimo 3 niveles de elevación
- Botones: luz + sombra

### Border Radius Standards
```css
Botones: 10px
Inputs:  10px
Cards:   14px
Modals:  16px
```

### Layout Constraints
- Desktop: `max-w-7xl` obligatorio
- **PROHIBIDO:** contenido full-width sin márgenes

## AI UI Generation Rules

Cuando generes UI:
- ✅ Usar SOLO colores definidos/elegidos
- ❌ NUNCA Tailwind default colors
- ✅ Añadir siempre profundidad y luz
- ❌ Evitar dashboards genéricos
- ✅ Objetivo: parecer diseñado a mano, no por IA

---

# Testing & Quality Standards

## Pre-commit Checklist
```bash
pnpm lint    # Sin errores
pnpm test    # Todos pasando
```

## Running Tests

### Global
```bash
pnpm test
pnpm turbo run test --filter <project_name>
```

### Vitest (specific test)
```bash
pnpm vitest run -t "<nombre del test>"
```

## After File Changes
Tras mover archivos o cambiar imports:
```bash
pnpm lint
```

## Quality Rules
- **PROHIBIDO:** Código con errores de tipos
- **PROHIBIDO:** Código con errores de lint
- **PROHIBIDO:** Tests fallidos
- **OBLIGATORIO:** Añadir/actualizar tests al cambiar comportamiento

## Testing Best Practices
- Write tests for all business logic
- Follow the AAA pattern (Arrange, Act, Assert)
- Use descriptive test names that explain the scenario
- Mock external dependencies

## CI/CD
Revisar workflows en `.github/workflows` antes de hacer cambios

---

# Code Conventions

## General
- Write self-documenting code with clear names
- Keep functions small and focused (max 30 lines preferred)
- Avoid magic numbers and strings - use named constants
- Delete dead code - don't comment it out

## Comments
- Write comments that explain WHY, not WHAT
- Use JSDoc for public API documentation
- Keep comments up to date with code changes
- Avoid TODO comments in production code

## Formatting
- Use consistent indentation (2 spaces)
- Keep lines under 100 characters
- Use trailing commas in multiline structures
- Add blank lines between logical sections

## Event Handlers Naming
- Event handlers: `handle` prefix (`handleClick`, `handleKeyDown`)
- Variables: descriptive with context (`isModalOpen`, `hasError`)

---

# Performance & Technical Decisions

## Measurement First
- **NO ADIVINAR:** rendimiento, bundle size, load times
- **MEDIR PRIMERO:** instrumentar antes de optimizar
- **VALIDAR:** probar en pequeño antes de escalar

## Optimization Process
1. Identificar problema real (con métricas)
2. Añadir instrumentación
3. Medir baseline
4. Implementar mejora
5. Medir impacto
6. Validar en producción similar

## Anti-patterns
- ❌ Optimizar sin medir
- ❌ Asumir cuellos de botella
- ❌ Escalar cambios sin validar
- ❌ Micro-optimizaciones prematuras

---

# Error Handling & Security

## Error Handling
- Use typed errors with clear error codes
- Handle errors at the appropriate level
- Log errors with sufficient context for debugging
- Use Bootstrap's built-in form validation styles (if using Bootstrap)
- Display errors with appropriate UI components

## Configuration
- All configuration should come from environment variables
- Never hardcode sensitive values
- Provide sensible defaults where appropriate

## Security
- Never log sensitive data (passwords, tokens, PII)
- Validate and sanitize all user input
- Use parameterized queries for database operations
- Keep dependencies updated for security patches

---

# AI Agent Behavior Rules

## Decision Making

### When to Ask
Si la petición NO está clara:
- Hacer preguntas concretas
- No asumir requisitos implícitos
- Esperar confirmación antes de ejecutar

### When to Execute
Tareas simples y bien definidas:
- Ejecutar directamente
- No pedir confirmación innecesaria

### Complex Changes
Refactors, features nuevas, decisiones de arquitectura:
1. Confirmar entendimiento
2. Explicar approach
3. Esperar aprobación
4. Ejecutar

## Information Gathering
- Si falta información → preguntar
- No asumir contexto que no existe
- Mejor sobre-comunicar que sub-comunicar

## Execution Principles
- Claridad antes que velocidad
- Preguntas específicas > adivinanzas
- Confirmación en cambios grandes
- Autonomía en cambios pequeños

---

# Documentation

Si introduces nueva restricción ("nunca X", "siempre Y"):
- Documentar en archivo de reglas correspondiente
- Explicar el porqué

---

# Review Checklist

Al revisar código, verificar:

## ✅ TypeScript
- [ ] No hay uso de `any`
- [ ] Tipos explícitos en APIs públicas
- [ ] Modo estricto habilitado

## ✅ Styling
- [ ] Solo Tailwind CSS (no CSS custom)
- [ ] Iconos de tabler-icons con importación explícita
- [ ] Cumple reglas de color y profundidad visual

## ✅ Code Quality
- [ ] Componentes pequeños y enfocados
- [ ] Sin código duplicado
- [ ] Nombres descriptivos
- [ ] Imports ordenados y explícitos

## ✅ Testing
- [ ] Tests pasando
- [ ] Sin errores de lint
- [ ] Sin errores de tipos

## ✅ Performance
- [ ] Minimiza `use client`
- [ ] Usa RSC cuando es posible
- [ ] Lazy loading de imágenes

## ✅ Accessibility
- [ ] HTML semántico
- [ ] ARIA labels donde necesario
- [ ] Navegación por teclado

## ✅ Git
- [ ] Commits descriptivos
- [ ] Branch desde `dev`
- [ ] PR apunta a `dev`