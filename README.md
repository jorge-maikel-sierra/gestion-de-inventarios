# 🎸 MusicStore Pro — Gestión de Inventario

Aplicación web completa de gestión de inventario para una tienda de instrumentos musicales. Construida con **Node.js + Express + PostgreSQL + EJS**, arquitectura **MVC**.

---

## 🚀 Instalación y Configuración

### 1. Requisitos previos
- Node.js ≥ 18
- PostgreSQL ≥ 14

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Edita el archivo `.env` con tus credenciales:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=musicstore_pro
DB_USER=postgres
DB_PASSWORD=tu_password
ADMIN_PASSWORD=super123
```

### 4. Crear base de datos en PostgreSQL
```bash
psql -U postgres -c "CREATE DATABASE musicstore_pro;"
psql -U postgres -d musicstore_pro -f db/schema.sql
```

### 5. Cargar datos de prueba
```bash
npm run seed
```

### 6. Iniciar servidor
```bash
npm start          # Producción
npm run dev        # Desarrollo (con auto-reload)
```

Visita: **http://localhost:3000**

---

## 🗂️ Estructura del Proyecto

```
/inventory-app
 ├── app.js                  # Entrada principal
 ├── package.json
 ├── .env                    # Variables de entorno
 ├── .gitignore
 ├── /routes
 │    ├── categories.js      # Rutas REST de categorías
 │    └── items.js           # Rutas REST de items
 ├── /controllers
 │    ├── categoryController.js
 │    └── itemController.js
 ├── /models
 │    ├── Category.js        # Consultas SQL de categorías
 │    └── Item.js            # Consultas SQL de items
 ├── /views
 │    ├── layout.ejs         # Layout base (referencia)
 │    ├── 404.ejs
 │    ├── error.ejs
 │    ├── /partials
 │    │    ├── header.ejs
 │    │    └── footer.ejs
 │    ├── /categories
 │    │    ├── index.ejs
 │    │    ├── show.ejs
 │    │    ├── new.ejs
 │    │    └── edit.ejs
 │    └── /items
 │         ├── index.ejs
 │         ├── show.ejs
 │         ├── new.ejs
 │         └── edit.ejs
 ├── /public
 │    └── /css
 │         └── style.css
 └── /db
      ├── pool.js            # Pool de conexiones pg
      ├── schema.sql         # Esquema de tablas
      └── seed.js            # Datos ficticios
```

---

## 📋 Rutas disponibles

### Categorías
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/categories` | Lista todas las categorías |
| GET | `/categories/new` | Formulario crear categoría |
| POST | `/categories` | Crear categoría |
| GET | `/categories/:id` | Ver categoría + sus items |
| GET | `/categories/:id/items` | Lista items de una categoría |
| GET | `/categories/:id/edit` | Formulario editar categoría |
| PUT | `/categories/:id` | Actualizar categoría 🔒 |
| DELETE | `/categories/:id` | Eliminar categoría 🔒 |

### Items / Productos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/items/new` | Formulario crear producto |
| POST | `/items` | Crear producto |
| GET | `/items/:id` | Ver detalle de producto |
| GET | `/items/:id/edit` | Formulario editar producto |
| PUT | `/items/:id` | Actualizar producto 🔒 |
| DELETE | `/items/:id` | Eliminar producto 🔒 |

> 🔒 = Requiere contraseña de administrador (`ADMIN_PASSWORD` en `.env`)

---

## 🔒 Seguridad

- **Acciones destructivas** (UPDATE/DELETE) requieren la contraseña `ADMIN_PASSWORD`.
- Las **categorías con items** no pueden ser eliminadas (protección por FK + validación extra).
- Validaciones con `express-validator` en servidor para todos los formularios.

---

## 🌱 Datos Seed

El script `db/seed.js` inserta:
- **6 categorías**: Guitarras, Teclados y Pianos, Batería y Percusión, Vientos, Cuerdas, Accesorios
- **25 productos** con precios, descripciones y stock reales

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|-----------|-----|
| Node.js | Runtime |
| Express 4 | Framework web |
| PostgreSQL | Base de datos |
| `pg` | Driver PostgreSQL |
| EJS | Motor de templates |
| `method-override` | PUT/DELETE desde HTML forms |
| `express-validator` | Validaciones |
| `dotenv` | Variables de entorno |
# gestion-de-inventarios
