const { validationResult } = require('express-validator');
const Category = require('../models/Category');

const categoryController = {
  // ─── GET / ──────────────────────────────────────────────
  async index(req, res, next) {
    try {
      const categories = await Category.getAll();
      res.render('categories/index', {
        title: 'Categorías - MusicStore Pro',
        categories,
        success_msg: req.query.success || null,
        error_msg: req.query.error || null,
      });
    } catch (err) {
      console.error('categoryController.index:', err);
      next(err);
    }
  },

  // ─── GET /categories/new ────────────────────────────────
  newForm(req, res) {
    res.render('categories/new', {
      title: 'Nueva Categoría - MusicStore Pro',
      category: { name: '', description: '' },
      errors: [],
    });
  },

  // ─── POST /categories ───────────────────────────────────
  async create(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render('categories/new', {
        title: 'Nueva Categoría - MusicStore Pro',
        category: req.body,
        errors: errors.array(),
      });
    }

    try {
      const { name, description } = req.body;

      // Verificar nombre duplicado
      const exists = await Category.existsByName(name);
      if (exists) {
        return res.status(422).render('categories/new', {
          title: 'Nueva Categoría - MusicStore Pro',
          category: req.body,
          errors: [{ msg: `Ya existe una categoría con el nombre "${name}".` }],
        });
      }

      await Category.create({ name, description });
      res.redirect('/categories?success=' + encodeURIComponent('Categoría creada exitosamente.'));
    } catch (err) {
      console.error('categoryController.create:', err);
      res.status(500).render('categories/new', {
        title: 'Nueva Categoría - MusicStore Pro',
        category: req.body,
        errors: [{ msg: 'Error al crear la categoría. Intente nuevamente.' }],
      });
    }
  },

  // ─── GET /categories/:id ────────────────────────────────
  async show(req, res, next) {
    try {
      const category = await Category.getById(req.params.id);
      if (!category) {
        return res.status(404).render('404', { title: 'Categoría no encontrada' });
      }

      const Item = require('../models/Item');
      const items = await Item.getByCategory(category.id);

      res.render('categories/show', {
        title: `${category.name} - MusicStore Pro`,
        category,
        items,
        success_msg: req.query.success || null,
        error_msg: req.query.error || null,
      });
    } catch (err) {
      console.error('categoryController.show:', err);
      next(err);
    }
  },

  // ─── GET /categories/:id/edit ───────────────────────────
  async editForm(req, res, next) {
    try {
      const category = await Category.getById(req.params.id);
      if (!category) {
        return res.status(404).render('404', { title: 'Categoría no encontrada' });
      }
      res.render('categories/edit', {
        title: `Editar ${category.name} - MusicStore Pro`,
        category,
        errors: [],
      });
    } catch (err) {
      console.error('categoryController.editForm:', err);
      next(err);
    }
  },

  // ─── PUT /categories/:id ────────────────────────────────
  async update(req, res, next) {
    const errors = validationResult(req);
    const { id } = req.params;

    // Cargar categoría para mostrar errores
    let category;
    try {
      category = await Category.getById(id);
      if (!category) {
        return res.status(404).render('404', { title: 'Categoría no encontrada' });
      }
    } catch (err) {
      return next(err);
    }

    // Verificar contraseña de administrador
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (req.body.admin_password !== adminPassword) {
      return res.status(403).render('categories/edit', {
        title: `Editar ${category.name} - MusicStore Pro`,
        category: { ...category, ...req.body },
        errors: [{ msg: '🔒 Contraseña de administrador incorrecta. Acción no autorizada.' }],
      });
    }

    if (!errors.isEmpty()) {
      return res.status(422).render('categories/edit', {
        title: `Editar ${category.name} - MusicStore Pro`,
        category: { ...category, ...req.body },
        errors: errors.array(),
      });
    }

    try {
      const { name, description } = req.body;

      // Verificar nombre duplicado (excluyendo la categoría actual)
      const exists = await Category.existsByName(name, id);
      if (exists) {
        return res.status(422).render('categories/edit', {
          title: `Editar ${category.name} - MusicStore Pro`,
          category: { ...category, ...req.body },
          errors: [{ msg: `Ya existe una categoría con el nombre "${name}".` }],
        });
      }

      await Category.update(id, { name, description });
      res.redirect('/categories?success=' + encodeURIComponent('Categoría actualizada exitosamente.'));
    } catch (err) {
      console.error('categoryController.update:', err);
      next(err);
    }
  },

  // ─── DELETE /categories/:id ─────────────────────────────
  async destroy(req, res, next) {
    const { id } = req.params;

    // Verificar contraseña de administrador
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (req.body.admin_password !== adminPassword) {
      return res.redirect(
        `/categories/${id}?error=` +
          encodeURIComponent('🔒 Contraseña de administrador incorrecta. Acción no autorizada.')
      );
    }

    try {
      // Verificar si tiene items asociados
      const Item = require('../models/Item');
      const itemCount = await Item.countByCategory(id);
      if (itemCount > 0) {
        return res.redirect(
          `/categories/${id}?error=` +
            encodeURIComponent(
              `No se puede eliminar la categoría porque tiene ${itemCount} item(s) asociado(s). Elimina primero los items.`
            )
        );
      }

      const deleted = await Category.delete(id);
      if (!deleted) {
        return res.status(404).render('404', { title: 'Categoría no encontrada' });
      }

      res.redirect('/categories?success=' + encodeURIComponent('Categoría eliminada exitosamente.'));
    } catch (err) {
      console.error('categoryController.destroy:', err);
      // Error de FK de PostgreSQL
      if (err.code === '23503') {
        return res.redirect(
          `/categories/${id}?error=` +
            encodeURIComponent(
              'No se puede eliminar la categoría porque tiene items asociados. Elimina primero los items.'
            )
        );
      }
      next(err);
    }
  },
};

module.exports = categoryController;
