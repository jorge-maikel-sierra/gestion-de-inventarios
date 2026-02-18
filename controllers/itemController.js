const { validationResult } = require('express-validator');
const Item = require('../models/Item');
const Category = require('../models/Category');

const itemController = {
  // ─── GET /categories/:categoryId/items ──────────────────
  async indexByCategory(req, res, next) {
    try {
      const category = await Category.getById(req.params.categoryId);
      if (!category) {
        return res.status(404).render('404', { title: 'Categoría no encontrada' });
      }
      const items = await Item.getByCategory(category.id);
      res.render('items/index', {
        title: `Items de ${category.name} - MusicStore Pro`,
        category,
        items,
        success_msg: req.query.success || null,
        error_msg: req.query.error || null,
      });
    } catch (err) {
      console.error('itemController.indexByCategory:', err);
      next(err);
    }
  },

  // ─── GET /items/new ─────────────────────────────────────
  async newForm(req, res, next) {
    try {
      const categories = await Category.getAll();
      res.render('items/new', {
        title: 'Nuevo Producto - MusicStore Pro',
        item: {
          name: '',
          description: '',
          price: '',
          quantity: '',
          category_id: req.query.category_id || '',
        },
        categories,
        errors: [],
      });
    } catch (err) {
      console.error('itemController.newForm:', err);
      next(err);
    }
  },

  // ─── POST /items ─────────────────────────────────────────
  async create(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      try {
        const categories = await Category.getAll();
        return res.status(422).render('items/new', {
          title: 'Nuevo Producto - MusicStore Pro',
          item: req.body,
          categories,
          errors: errors.array(),
        });
      } catch (err) {
        return next(err);
      }
    }

    try {
      const { name, description, price, quantity, category_id } = req.body;

      // Verificar que la categoría existe
      const category = await Category.getById(category_id);
      if (!category) {
        const categories = await Category.getAll();
        return res.status(422).render('items/new', {
          title: 'Nuevo Producto - MusicStore Pro',
          item: req.body,
          categories,
          errors: [{ msg: 'La categoría seleccionada no existe.' }],
        });
      }

      await Item.create({ name, description, price, quantity, category_id });
      res.redirect(
        `/categories/${category_id}?success=` +
          encodeURIComponent('Producto creado exitosamente.')
      );
    } catch (err) {
      console.error('itemController.create:', err);
      next(err);
    }
  },

  // ─── GET /items/:id ─────────────────────────────────────
  async show(req, res, next) {
    try {
      const item = await Item.getById(req.params.id);
      if (!item) {
        return res.status(404).render('404', { title: 'Producto no encontrado' });
      }
      res.render('items/show', {
        title: `${item.name} - MusicStore Pro`,
        item,
        success_msg: req.query.success || null,
        error_msg: req.query.error || null,
      });
    } catch (err) {
      console.error('itemController.show:', err);
      next(err);
    }
  },

  // ─── GET /items/:id/edit ─────────────────────────────────
  async editForm(req, res, next) {
    try {
      const [item, categories] = await Promise.all([
        Item.getById(req.params.id),
        Category.getAll(),
      ]);
      if (!item) {
        return res.status(404).render('404', { title: 'Producto no encontrado' });
      }
      res.render('items/edit', {
        title: `Editar ${item.name} - MusicStore Pro`,
        item,
        categories,
        errors: [],
      });
    } catch (err) {
      console.error('itemController.editForm:', err);
      next(err);
    }
  },

  // ─── PUT /items/:id ─────────────────────────────────────
  async update(req, res, next) {
    const errors = validationResult(req);
    const { id } = req.params;

    // Cargar item para mostrar errores
    let item;
    try {
      item = await Item.getById(id);
      if (!item) {
        return res.status(404).render('404', { title: 'Producto no encontrado' });
      }
    } catch (err) {
      return next(err);
    }

    // Verificar contraseña de administrador
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (req.body.admin_password !== adminPassword) {
      const categories = await Category.getAll();
      return res.status(403).render('items/edit', {
        title: `Editar ${item.name} - MusicStore Pro`,
        item: { ...item, ...req.body },
        categories,
        errors: [{ msg: '🔒 Contraseña de administrador incorrecta. Acción no autorizada.' }],
      });
    }

    if (!errors.isEmpty()) {
      try {
        const categories = await Category.getAll();
        return res.status(422).render('items/edit', {
          title: `Editar ${item.name} - MusicStore Pro`,
          item: { ...item, ...req.body },
          categories,
          errors: errors.array(),
        });
      } catch (err) {
        return next(err);
      }
    }

    try {
      const { name, description, price, quantity, category_id } = req.body;

      // Verificar que la categoría existe
      const category = await Category.getById(category_id);
      if (!category) {
        const categories = await Category.getAll();
        return res.status(422).render('items/edit', {
          title: `Editar ${item.name} - MusicStore Pro`,
          item: { ...item, ...req.body },
          categories,
          errors: [{ msg: 'La categoría seleccionada no existe.' }],
        });
      }

      const updated = await Item.update(id, { name, description, price, quantity, category_id });
      res.redirect(
        `/items/${updated.id}?success=` +
          encodeURIComponent('Producto actualizado exitosamente.')
      );
    } catch (err) {
      console.error('itemController.update:', err);
      next(err);
    }
  },

  // ─── DELETE /items/:id ──────────────────────────────────
  async destroy(req, res, next) {
    const { id } = req.params;

    // Verificar contraseña de administrador
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (req.body.admin_password !== adminPassword) {
      return res.redirect(
        `/items/${id}?error=` +
          encodeURIComponent('🔒 Contraseña de administrador incorrecta. Acción no autorizada.')
      );
    }

    try {
      const item = await Item.getById(id);
      if (!item) {
        return res.status(404).render('404', { title: 'Producto no encontrado' });
      }

      const categoryId = item.category_id;
      await Item.delete(id);

      res.redirect(
        `/categories/${categoryId}?success=` +
          encodeURIComponent(`Producto "${item.name}" eliminado exitosamente.`)
      );
    } catch (err) {
      console.error('itemController.destroy:', err);
      next(err);
    }
  },
};

module.exports = itemController;
