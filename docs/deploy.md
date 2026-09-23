# Deploy

| Componente | Proveedor | URL |
|:-|:-|:-|
| Frontend (React + Vite) | Vercel | https://agroapp.dev |
| Backend (Express + Prisma) | Render (web service, plan free) | https://api.agroapp.dev |
| Base de datos (MySQL 8) | Aiven (plan free) | `mysql-agroapp-agroapp.h.aivencloud.com:12600`, base `defaultdb`, SSL requerido |
| Dominio | Name.com | `agroapp.dev` |
| Docs de la API | Swagger UI servido por el backend | https://api.agroapp.dev/docs |

## Credenciales de demo

| Rol | Email | Contraseña | Quién es |
|:-|:-|:-|:-|
| ADMIN | admin@agroapp.dev | Admin123! | Ana Administradora |
| PRODUCTOR | productor@agroapp.dev | Productor123! | Carlos Ferreyra (Pergamino), 2 campos |
| PRODUCTOR | productora2@agroapp.dev | Productor123! | Lucía Bianchi (Rafaela), 1 campo |
| CONTRATISTA | contratista@agroapp.dev | Contratista123! | Pedro Molina (Venado Tuerto), siembra y cosecha |
| CONTRATISTA | contratista2@agroapp.dev | Contratista123! | Marta Giménez (Río Cuarto), pulverización y fertilización |
| CONTRATISTA | contratista3@agroapp.dev | Contratista123! | Julián Sosa (Pergamino), laboreo y rollos |

Las crea el seed (`packages/database/prisma/seed.ts`), junto con solicitudes en los cinco estados y dos valoraciones.

## 1. Base de datos (Aiven)

1. Crear el servicio MySQL en Aiven y copiar la **Service URI** (`mysql://avnadmin:...@host:port/defaultdb?ssl-mode=REQUIRED`).
2. Aplicar migraciones y seed desde una máquina local, pasando la URL solo para ese comando (así el `.env` local sigue apuntando a Docker):

```bash
DATABASE_URL="mysql://avnadmin:...@...aivencloud.com:12600/defaultdb?ssl-mode=REQUIRED" pnpm db:deploy
DATABASE_URL="mysql://avnadmin:...@...aivencloud.com:12600/defaultdb?ssl-mode=REQUIRED" pnpm db:seed
```

En PowerShell:

```powershell
$env:DATABASE_URL="mysql://avnadmin:...?ssl-mode=REQUIRED"; pnpm db:deploy; pnpm db:seed; Remove-Item Env:DATABASE_URL
```

### Recrear la base desde cero

El rediseño de septiembre de 2026 reemplazó las migraciones anteriores por una única migración `0001_init`. Una base creada con las migraciones viejas no se puede migrar hacia adelante: hay que vaciarla y volver a aplicar. Como no hay datos reales, es seguro. Con el cliente `mysql` (o desde la consola de Aiven):

```sql
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS _prisma_migrations, admin_profile, campo, categoria, cliente_profile, insumo, localidad, precio,
  prestamista_profile, provincia, roles, servicio, solicitud, solicitud_insumo, user_roles, users, valoracion,
  productor_profile, contratista_profile;
SET FOREIGN_KEY_CHECKS = 1;
```

Después, `pnpm db:deploy` y `pnpm db:seed` con la URL de Aiven como arriba.

> `packages/database/.env` lo lee Prisma CLI **y** el backend en desarrollo (si no existe `apps/server/.env`). Dejarlo apuntando a la base local de Docker; la URL de Aiven va solo en Render y en los comandos puntuales de arriba.

## 2. Backend (Render)

Opción A, con blueprint: **New → Blueprint**, elegir el repo; Render lee `render.yaml` de la raíz y crea el servicio `agroapp-api`. Luego cargar a mano `DATABASE_URL` (marcada `sync: false`).

Opción B, a mano (**New → Web Service**):

| Campo | Valor |
|:-|:-|
| Root directory | *(vacío, raíz del monorepo)* |
| Runtime | Node |
| Build command | `corepack enable && pnpm install --frozen-lockfile --prod=false && pnpm --filter @repo/db build && pnpm --filter server build` |
| Start command | `node apps/server/dist/index.js` |
| Health check path | `/health` |

Variables de entorno:

| Variable | Valor |
|:-|:-|
| `NODE_ENV` | `production` |
| `NODE_VERSION` | `22` |
| `DATABASE_URL` | URI de Aiven con `?ssl-mode=REQUIRED` |
| `JWT_SECRET` | cadena aleatoria larga (Render → *Generate*) |
| `JWT_EXPIRES_IN` | `8h` |
| `CORS_ORIGIN` | `https://agroapp.dev,https://www.agroapp.dev` |
| `SUPABASE_URL` | Project URL de Supabase (ver § Supabase Storage abajo) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key de Supabase (nunca la `anon`/pública) |
| `SUPABASE_AVATARS_BUCKET` | `avatars` (opcional; es el valor por defecto) |

`PORT` la define Render. Dominio: **Settings → Custom domains → Add** `api.agroapp.dev`.

> Plan free: el servicio se duerme tras 15 minutos sin tráfico y la primera request tarda ~30 s. Abrir `/health` antes de la defensa.

> Las tres variables de Supabase son solo para la foto de perfil (`POST/DELETE /auth/me/foto`): sin ellas, ese endpoint responde 500 pero el resto de la app funciona igual.

### Supabase Storage (fotos de perfil)

La foto de perfil de productores y contratistas se guarda en un bucket de [Supabase Storage](https://supabase.com); la base de datos solo guarda la URL pública (`users.foto_url`). Pasos, una única vez:

1. Crear una cuenta en [supabase.com](https://supabase.com) y un proyecto nuevo (plan free).
2. **Storage → New bucket**: nombre `avatars`, marcado como **Public bucket**. Así `getPublicUrl()` devuelve una URL servible directo, sin firmar cada request.
3. **Settings → API**: copiar la **Project URL** (`SUPABASE_URL`) y la **service_role key** (`SUPABASE_SERVICE_ROLE_KEY`, en "Project API keys" — no la `anon`/`public`, esa es la que se puede exponer al cliente y esta no).
4. Cargar esas dos variables (más `SUPABASE_AVATARS_BUCKET=avatars`, opcional) en Render como se detalla arriba, y redesplegar el servicio.
5. No hace falta nada en Vercel: el frontend nunca habla con Supabase directamente, solo con el backend.

## 3. Frontend (Vercel)

| Campo | Valor |
|:-|:-|
| Framework preset | Vite |
| Root directory | `apps/web` |
| Build command | `pnpm build` |
| Output directory | `dist` |

Variable de entorno (Production y Preview): `VITE_API_URL=https://api.agroapp.dev`. `apps/web/vercel.json` tiene el rewrite SPA. Dominios: `agroapp.dev` y `www.agroapp.dev`.

## 4. DNS (Name.com)

| Host | Tipo | Valor | Para |
|:-|:-|:-|:-|
| `@` | A | `76.76.21.21` | Vercel |
| `www` | CNAME | `cname.vercel-dns.com` | Vercel |
| `api` | CNAME | `<nombre>.onrender.com` | Render |

## 5. Smoke test de producción

```bash
curl https://api.agroapp.dev/health
curl -X POST https://api.agroapp.dev/auth/login -H "Content-Type: application/json" \
  -d '{"email":"productor@agroapp.dev","password":"Productor123!"}'
curl "https://api.agroapp.dev/contratistas?pageSize=1"
```

Desde el navegador: entrar a https://agroapp.dev como productor, abrir un servicio y solicitarlo; entrar como contratista y aceptarlo.

## Actualizar producción

- Cada push a `main` redeploya backend (Render) y frontend (Vercel). Si Render y Vercel apuntan a un fork, sincronizarlo primero.
- Si hay una migración nueva, correr `pnpm db:deploy` contra Aiven **antes** del push.
