const pool = require('../db/pool');

const Item = {
  /**
   * Obtener todos los items con información de su categoría
   */
  async getAll() {
    const query = `
      SELECT i.*, c.name AS category_name
      FROM items i
      JOIN categories c ON c.id = i.category_id
      ORDER BY c.name ASC, i.name ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  /**
   * Obtener items por categoría
   */
  async getByCategory(categoryId) {
    const query = `
      SELECT i.*, c.name AS category_name
      FROM items i
      JOIN categories c ON c.id = i.category_id
      WHERE i.category_id = $1
      ORDER BY i.name ASC
    `;
    const { rows } = await pool.query(query, [categoryId]);
    return rows;
  },

  /**
   * Obtener un item por ID
   */
  async getById(id) {
    const query = `
      SELECT i.*, c.name AS category_name
      FROM items i
      JOIN categories c ON c.id = i.category_id
      WHERE i.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  /**
   * Crear un nuevo item
   */
  async create({ name, description, price, quantity, category_id }) {
    const query = `
      INSERT INTO items (name, description, price, quantity, category_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      name.trim(),
      description ? description.trim() : null,
      parseFloat(price),
      parseInt(quantity, 10),
      parseInt(category_id, 10),
    ]);
    return rows[0];
  },

  /**
   * Actualizar un item existente
   */
  async update(id, { name, description, price, quantity, category_id }) {
    const query = `
      UPDATE items
      SET name = $1, description = $2, price = $3, quantity = $4,
          category_id = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      name.trim(),
      description ? description.trim() : null,
      parseFloat(price),
      parseInt(quantity, 10),
      parseInt(category_id, 10),
      id,
    ]);
    return rows[0] || null;
  },

  /**
   * Eliminar un item
   */
  async delete(id) {
    const query = 'DELETE FROM items WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  /**
   * Contar items en una categoría
   */
  async countByCategory(categoryId) {
    const { rows } = await pool.query(
      'SELECT COUNT(*)::int AS total FROM items WHERE category_id = $1',
      [categoryId]
    );
    return rows[0].total;
  },
};

module.exports = Item;
