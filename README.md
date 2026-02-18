<div align="center">

# 🎸 MusicStore Pro

### Sistema de Gestión de Inventario

**Aplicación web full-stack** para administrar el inventario de una tienda de instrumentos musicales.  
Construida con **Node.js · Express · PostgreSQL · EJS** bajo arquitectura **MVC**.

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%3E%3D14-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-4.x-B4CA65?style=flat-square)
![License](https://img.shields.io/badge/license-ISC-blue?style=flat-square)

</div>

---

## 📋 Tabla de Contenidos

- [Vista general](#-vista-general)
- [Funcionalidades](#-funcionalidades)
- [Tecnologías](#-tecnologías)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Base de datos](#-base-de-datos)
- [Scripts disponibles](#-scripts-disponibles)
- [Rutas de la API](#-rutas-de-la-api)
- [Seguridad](#-seguridad)

---

## 🎯 Vista General

MusicStore Pro es un sistema CRUD completo que permite a los administradores de una tienda de instrumentos musicales gestionar su catálogo de productos organizado por categorías. Incluye protección de acciones destructivas con contraseña de administrador, validaciones en servidor y una interfaz web limpia y responsiva.

---

## ✨ Funcionalidades

| Módulo | Funcionalidades |
|--------|----------------|
| **Categorías** | Crear, listar, ver, editar y eliminar categorías de instrumentos |
| **Productos** | CRUD completo con precio, stock y categoría asociada |
| **Protección admin** | UPDATE y DELETE requieren contraseña de administrador |
| **Validaciones** | Validaciones en servidor con mensajes de error descriptivos |
| **Protección FK** | No se puede eliminar una categoría que tenga productos asociados |
| **Stock visual** | Indicadores de stock: normal 🟢 / bajo 🟡 / agotado 🔴 |
| **Seed data** | 6 categorías y 25 productos reales pre-cargados |
| **Responsivo** | Diseño adaptable a móviles y escritorio |

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| [Node.js](https://nodejs.org) | ≥ 18 | Runtime de JavaScript |
| [Express](https://expressjs.com) | 5.x | Framework web |
| [PostgreSQL](https://www.postgresql.org) | ≥ 14 | Base de datos relacional |
| [pg](https://node-postgres.com) | 8.x | Driver PostgreSQL para Node |
| [EJS](https://ejs.co) | 4.x | Motor de plantillas HTML |
| [method-override](https://github.com/expressjs/method-override) | 3.x | Soporte PUT/DELETE en formularios HTML |
| [express-validator](https://express-validator.github.io) | 7.x | Validaciones en servidor |
| [dotenv](https://github.com/motdotla/dotenv) | 17.x | Manejo de variables de entorno |

---

## 📁 Estructura del Proyecto

```
gestion-de-invetarios/
 ├── app.js                        # Punto de entrada · configuración Express
 ├── package.json
 ├── .env                          # Variables de entorno (no versionar)
 ├── .gitignore
 ├── README.md
 │
 ├── routes/
 │    ├── categories.js            # Rutas REST de categorías + validaciones
 │    └── items.js                 # Rutas REST de productos + validaciones
 │
 ├── controllers/
 │    ├── categoryController.js    # Lógica CRUD de categorías
 │    └── itemController.js        # Lógica CRUD de productos
 │
 ├── models/
 │    ├── Category.js              # Consultas SQL de categorías (pg)
 │    └── Item.js                  # Consultas SQL de productos (pg)
 │
 ├── views/
 │    ├── partials/
 │    │    ├── header.ejs          # Navbar + flash messages
 │    │    └── footer.ejs
 │    ├── categories/
 │    │    ├── index.ejs           # Grid de categorías
 │    │    ├── show.ejs            # Detalle + tabla de items
 │    │    ├── new.ejs             # Formulario crear
 │    │    └── edit.ejs            # Formulario editar + contraseña admin
 │    ├── items/
 │    │    ├── index.ejs           # Lista de productos por categoría
 │    │    ├── show.ejs            # Detalle de producto
 │    │    ├── new.ejs             # Formulario crear
 │    │    └── edit.ejs            # Formulario editar + contraseña admin
 │    ├── 404.ejs
 │    └── error.ejs
 │
 ├── public/
 │    └── css/
 │         └── style.css           # Estilos globales (CSS variables + responsive)
 │
 └── db/
      ├── pool.js                  # Pool de conexiones PostgreSQL
      ├── schema.sql               # DDL: tablas, triggers, índices
      └── seed.js                  # Datos ficticios de instrumentos musicales
```

---

## 🚀 Instalación

### Requisitos previos

- **Node.js** ≥ 18 → [descargar](https://nodejs.org)
- **PostgreSQL** ≥ 14 → [descargar](https://www.postgresql.org/download/)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/gestion-de-invetarios.git
cd gestion-de-invetarios

# 2. Instalar dependencias
npm install
```

---

## ⚙️ Configuración

Crea o edita el archivo `.env` en la raíz del proyecto:

### Opción A — Base de datos local (PostgreSQL)

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=musicstore_pro
DB_USER=tu_usuario_postgres
DB_PASSWORD=

ADMIN_PASSWORD=super123
```

> **macOS:** si instalaste PostgreSQL con Homebrew o Postgres.app, el usuario suele ser el mismo que el de tu sesión de sistema (`whoami`), no `postgres`.

### Opción B — Neon (PostgreSQL serverless en la nube)

```env
PORT=3000
NODE_ENV=development

DATABASE_URL=postgresql://<user>:<password>@<host>/neondb?sslmode=verify-full&channel_binding=require
DB_SSL=true

ADMIN_PASSWORD=super123
```

> Obtén tu `DATABASE_URL` desde el [dashboard de Neon](https://console.neon.tech) → tu proyecto → **Connection string**.

La app detecta automáticamente `DATABASE_URL` y la usa con SSL habilitado. Si no está definida, usa las variables `DB_*` individuales.

---

## 🗄️ Base de Datos

### Crear la base de datos y aplicar el esquema

**Local:**
```bash
psql postgres -c "CREATE DATABASE musicstore_pro;"
psql musicstore_pro -f db/schema.sql
```

**Neon:**
```bash
psql "<tu DATABASE_URL>" -f db/schema.sql
```

### Cargar datos de prueba

```bash
npm run seed
```

Esto inserta:
- **6 categorías**: Guitarras, Teclados y Pianos, Batería y Percusión, Vientos, Cuerdas, Accesorios
- **25 productos** con nombres, descripciones, precios y stock reales

### Esquema de tablas

```sql
categories
  id          SERIAL PRIMARY KEY
  name        VARCHAR(100) NOT NULL UNIQUE
  description TEXT
  created_at  TIMESTAMP
  updated_at  TIMESTAMP  -- actualizado automáticamente por trigger

items
  id          SERIAL PRIMARY KEY
  name        VARCHAR(200) NOT NULL
  description TEXT
  price       NUMERIC(10,2) NOT NULL  CHECK (price > 0)
  quantity    INTEGER NOT NULL        CHECK (quantity >= 0)
  category_id INTEGER NOT NULL        REFERENCES categories(id) ON DELETE RESTRICT
  created_at  TIMESTAMP
  updated_at  TIMESTAMP  -- actualizado automáticamente por trigger
```

---

## 📜 Scripts Disponibles

```bash
npm start        # Inicia el servidor en modo producción
npm run dev      # Inicia con auto-reload (node --watch)
npm run seed     # Limpia e inserta datos de prueba
```

---

## 🗺️ Rutas de la API

### Categorías

| Método | Ruta | Descripción | 🔒 |
|--------|------|-------------|:--:|
| `GET` | `/categories` | Listado de todas las categorías | |
| `GET` | `/categories/new` | Formulario nueva categoría | |
| `POST` | `/categories` | Crear categoría | |
| `GET` | `/categories/:id` | Detalle de categoría + sus productos | |
| `GET` | `/categories/:id/items` | Lista de productos de una categoría | |
| `GET` | `/categories/:id/edit` | Formulario editar categoría | |
| `PUT` | `/categories/:id` | Actualizar categoría | ✅ |
| `DELETE` | `/categories/:id` | Eliminar categoría | ✅ |

### Productos

| Método | Ruta | Descripción | 🔒 |
|--------|------|-------------|:--:|
| `GET` | `/items/new` | Formulario nuevo producto | |
| `POST` | `/items` | Crear producto | |
| `GET` | `/items/:id` | Detalle de producto | |
| `GET` | `/items/:id/edit` | Formulario editar producto | |
| `PUT` | `/items/:id` | Actualizar producto | ✅ |
| `DELETE` | `/items/:id` | Eliminar producto | ✅ |

> 🔒 Requiere ingresar `ADMIN_PASSWORD` definida en `.env`

---

## 🔒 Seguridad

- **Contraseña de administrador:** todas las operaciones de actualización y eliminación solicitan la contraseña `ADMIN_PASSWORD` definida en `.env`. Si es incorrecta, la acción no se ejecuta y se muestra un error.
- **Protección de integridad referencial:** una categoría no puede eliminarse si tiene productos asociados. El sistema lo bloquea a nivel de aplicación y a nivel de base de datos (`FK ON DELETE RESTRICT`).
- **Validaciones en servidor:** todos los formularios validan con `express-validator` antes de acceder a la base de datos:
  - Categoría: `name` obligatorio, mínimo 3 caracteres, máximo 100
  - Producto: `name` obligatorio, `price > 0`, `quantity >= 0`, `category_id` válido
- **Sin exposición de credenciales:** el archivo `.env` está incluido en `.gitignore`.

---

<div align="center">

Hecho con ❤️ para **MusicStore Pro** &nbsp;·&nbsp; 2026

</div>
