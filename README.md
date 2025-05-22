
# 🛒 NestJS Shopping Cart API

Este proyecto es una **API RESTful para la gestión de un carrito de compras**, desarrollada con **NestJS**, **Prisma** y **PostgreSQL**. Incluye autenticación con **JWT**, control de acceso por roles (ADMIN y CLIENTE), y persistencia de datos en **Neon DB**.

## 🚀 Tecnologías utilizadas

- **NestJS** (estructura modular, escalable)
- **Prisma ORM**
- **PostgreSQL** (conexión a base de datos en la nube via Neon)
- **Swagger** (documentación interactiva de la API)
- **JWT** (autenticación segura)
- **Roles y Guards** para control de acceso

## 📦 Funcionalidades implementadas

### ✅ Usuarios
- Registro de nuevos usuarios (`POST /auth/register`)
- Login con generación de token JWT (`POST /auth/login`)
- CRUD completo con borrado lógico (`/usuarios`)
- Autenticación y autorización con roles

### ✅ Productos
- CRUD de productos (`/productos`)
- Solo accesible por usuarios ADMIN

### ✅ Facturas
- CRUD de facturas (`/facturas`)
- Relación con usuarios (1:N)
- Cálculo automático del `total` al agregar detalles
- CLIENTE crea su factura, ADMIN puede ver todas

### ✅ Detalle de Factura
- Asociación entre factura y productos (`/detallefacturas`)
- Cálculo automático de `subtotal`
- Actualización automática del `total` en la factura

## 🔐 Seguridad y Control de Acceso

- Autenticación con **JWT**
- Protección de rutas con `@UseGuards(AuthGuard())`
- Control de acceso con roles usando `@Roles('ADMIN')`, `@Roles('CLIENTE')` y `RolesGuard`

## 🧪 Pruebas con Postman

Todas las rutas pueden ser probadas en Postman o Swagger.

> Recordá usar el token en `Bearer Token` para las rutas protegidas.

## 🛠 Configuración del entorno

Variables necesarias en `.env`:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
JWT_SECRET=your_jwt_secret_key
```

## 🧬 Comandos útiles

```bash
# Instalar dependencias
npm install

# Compilar y levantar el proyecto
npm run start:dev

# Validar el esquema de Prisma
npx prisma validate

# Generar migración inicial
npx prisma migrate dev --name init

# Documentación Swagger
http://localhost:3000/api
```

## 📅 Fecha
Última actualización: 21/05/2025

---

Desarrollado por: **Milagros Ranaldi**
