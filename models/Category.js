const pool = require('../db/pool');

const Category = {
  /**
   * Obtener todas las categorías con el conteo de items
   */
  async getAll() {
    const query = `
      SELECT c.*, COUNT(i.id)::int AS item_count
      FROM categories c
      LEFT JOIN items i ON i.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  /**
   * Obtener una categoría por ID
   */
  async getById(id) {
    const query = `
      SELECT c.*, COUNT(i.id)::int AS item_count
      FROM categories c
      LEFT JOIN items i ON i.category_id = c.id
      WHERE c.id = $1
      GROUP BY c.id
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  /**
   * Crear una nueva categoría
   */
  async create({ name, description }) {
    const query = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      name.trim(),
      description ? description.trim() : null,
    ]);
    return rows[0];
  },

  /**
   * Actualizar una categoría existente
   */
  async update(id, { name, description }) {
    const query = `
      UPDATE categories
      SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      name.trim(),
      description ? description.trim() : null,
      id,
    ]);
    return rows[0] || null;
  },

  /**
   * Eliminar una categoría (falla si tiene items por FK RESTRICT)
   */
  async delete(id) {
    const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  /**
   * Verificar si existe una categoría con ese nombre (para validar duplicados)
   */
  async existsByName(name, excludeId = null) {
    let query, params;
    if (excludeId) {
      query = 'SELECT id FROM categories WHERE LOWER(name) = LOWER($1) AND id != $2';
      params = [name.trim(), excludeId];
    } else {
      query = 'SELECT id FROM categories WHERE LOWER(name) = LOWER($1)';
      params = [name.trim()];
    }
    const { rows } = await pool.query(query, params);
    return rows.length > 0;
  },
};

module.exports = Category;
