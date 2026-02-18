const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const itemController = require('../controllers/itemController');

// Validaciones para categorías
const categoryValidations = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre de la categoría es obligatorio.')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.')
    .isLength({ max: 100 }).withMessage('El nombre no puede superar 100 caracteres.'),
  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede superar 500 caracteres.'),
];

// GET /categories → Lista todas las categorías
router.get('/', categoryController.index);

// GET /categories/new → Formulario de nueva categoría
router.get('/new', categoryController.newForm);

// POST /categories → Crear nueva categoría
router.post('/', categoryValidations, categoryController.create);

// GET /categories/:id → Detalle de una categoría
router.get('/:id', categoryController.show);

// GET /categories/:id/items → Items de una categoría
router.get('/:categoryId/items', itemController.indexByCategory);

// GET /categories/:id/edit → Formulario de edición
router.get('/:id/edit', categoryController.editForm);

// PUT /categories/:id → Actualizar categoría
router.put('/:id', categoryValidations, categoryController.update);

// DELETE /categories/:id → Eliminar categoría
router.delete('/:id', categoryController.destroy);

module.exports = router;
