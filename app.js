require('dotenv').config();
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const categoryRoutes = require('./routes/categories');
const itemRoutes = require('./routes/items');

const app = express();

// Motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para variables locales disponibles en todas las vistas
app.use((req, res, next) => {
  res.locals.success_msg = req.query.success || null;
  res.locals.error_msg = req.query.error || null;
  next();
});

// Rutas
app.use('/categories', categoryRoutes);
app.use('/items', itemRoutes);

// Ruta raíz → redirige a categorías
app.get('/', (req, res) => {
  res.redirect('/categories');
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { title: 'Error del servidor', message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎸 MusicStore Pro corriendo en http://localhost:${PORT}`);
});

module.exports = app;
