# AgroApp — TP DSW 2025 (3k03)

Plataforma que conecta **productores** agropecuarios con **contratistas** rurales: los contratistas publican servicios (siembra, cosecha, pulverización…) con precio por hectárea; los productores registran sus campos, buscan contratistas cercanos y solicitan servicios; el contratista acepta, rechaza o completa cada solicitud y el productor valora el trabajo.

## Grupo
* 53112 - Costantini, Jeremías
* 52911 - Messina, Tiziano Leonel

## Links
* [Propuesta del TP](proposal.md)
* [Documentación de entrega](docs/README.md) — modelo, instalación, API, tests, deploy, minutas
* App: https://tp-dsw-2025-3k03-messina-costantini.vercel.app · API: https://tp-dsw-2025-3k03-messina-costantini.onrender.com · Swagger: https://tp-dsw-2025-3k03-messina-costantini.onrender.com/docs
* Guía detallada de instalación: [docs/instalacion.md](docs/instalacion.md)

## Stack
Monorepo **pnpm + Turborepo**. Backend **Node + Express 5 + TypeScript + Prisma + MySQL** (`apps/server`). Frontend **React 18 + Vite + Tailwind + Framer Motion** (`apps/web`). Schema y migraciones en `packages/database`.

## Ejecución con un solo comando (Docker)

Con Docker Desktop instalado, para ver la aplicación completa funcionando:

```bash
docker compose up --build
```

Levanta MySQL, aplica las migraciones, carga los datos de demostración y deja backend y frontend
andando en http://localhost:8080 y http://localhost:3000. Detalle en [docs/instalacion.md](docs/instalacion.md).

## Instalación y ejecución local (desarrollo)

### Requisitos
* Node.js 20 o superior
* pnpm 8 o superior (`npm i -g pnpm`)
* Docker (para la base MySQL) o un MySQL 8 accesible

### 1. Base de datos
```bash
docker run -d --name agroapp-mysql -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=agro-dsw \
  -e MYSQL_USER=agro-dsw -e MYSQL_PASSWORD=agro-dsw \
  percona/percona-server:8.0
```

### 2. Variables de entorno
Copiar cada `.env.example` a `.env` y completar:
```bash
cp packages/database/.env.example packages/database/.env
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

### 3. Instalar, migrar y cargar datos demo
```bash
pnpm install
pnpm db:migrate     # crea las tablas
pnpm db:seed        # roles, provincias, categorías, insumos, usuarios demo, campos, servicios, solicitudes y valoraciones
```

### 4. Levantar
```bash
pnpm dev            # backend en http://localhost:3000, frontend en http://localhost:5173
```

### 5. Tests
```bash
pnpm test                      # backend (unitarios + integración) y frontend (componentes)
pnpm --filter web test:e2e     # Playwright (la primera vez: pnpm --filter web exec playwright install chromium)
```

## Usuarios demo (creados por el seed)
| Rol | Email | Contraseña |
|:-|:-|:-|
| ADMIN | admin@agroapp.dev | Admin123! |
| PRODUCTOR | productor@agroapp.dev | Productor123! |
| CONTRATISTA | contratista@agroapp.dev | Contratista123! |

Más usuarios en [docs/deploy.md](docs/deploy.md).

## Scripts útiles
| Comando | Qué hace |
|:-|:-|
| `pnpm dev` | server + web en modo desarrollo |
| `pnpm build` | build de todos los paquetes |
| `pnpm test` | tests de todos los paquetes |
| `pnpm db:migrate` | `prisma migrate dev` (desarrollo) |
| `pnpm db:deploy` | `prisma migrate deploy` (producción) |
| `pnpm db:seed` | carga datos iniciales (idempotente) |
| `pnpm --filter server docs:export` | regenera `docs/api/openapi.json` |
