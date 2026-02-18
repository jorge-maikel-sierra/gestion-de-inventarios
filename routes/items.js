const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const itemController = require('../controllers/itemController');

// Validaciones para items
const itemValidations = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre del producto es obligatorio.')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.')
    .isLength({ max: 200 }).withMessage('El nombre no puede superar 200 caracteres.'),
  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 }).withMessage('La descripción no puede superar 1000 caracteres.'),
  body('price')
    .notEmpty().withMessage('El precio es obligatorio.')
    .isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor a 0.'),
  body('quantity')
    .notEmpty().withMessage('La cantidad es obligatoria.')
    .isInt({ min: 0 }).withMessage('La cantidad debe ser un número entero mayor o igual a 0.'),
  body('category_id')
    .notEmpty().withMessage('Debes seleccionar una categoría.')
    .isInt({ gt: 0 }).withMessage('La categoría seleccionada no es válida.'),
];

// GET /items/new → Formulario de nuevo item
router.get('/new', itemController.newForm);

// POST /items → Crear nuevo item
router.post('/', itemValidations, itemController.create);

// GET /items/:id → Detalle de un item
router.get('/:id', itemController.show);

// GET /items/:id/edit → Formulario de edición
router.get('/:id/edit', itemController.editForm);

// PUT /items/:id → Actualizar item
router.put('/:id', itemValidations, itemController.update);

// DELETE /items/:id → Eliminar item
router.delete('/:id', itemController.destroy);

module.exports = router;
