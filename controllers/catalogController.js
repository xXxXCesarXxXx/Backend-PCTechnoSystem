const db = require('../config/db'); // Importar la conexión a MySQL

// Obtener todos los elementos
exports.getAllPosts = async (req, res) => {
  try {
    const { type, subtype } = req.query;
    let query = 'SELECT * FROM posts';
    const params = [];

    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }

    if (subtype) {
      query += type ? ' AND subtype = ?' : ' WHERE subtype = ?';
      params.push(subtype);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las publicaciones:', error);
    res.status(500).json({ message: 'Error al obtener las publicaciones.', error });
  }
};


// Agregar un nuevo elemento
exports.addItem = async (req, res) => {
  const { title, description, price, type } = req.body;
  try {
    const [result] = await db.query('INSERT INTO posts (title, description, price, type) VALUES (?, ?, ?, ?)', [
      title,
      description,
      price,
      type,
    ]);
    res.status(201).json({ id: result.insertId, title, description, price, type });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar el elemento' });
  }
};

// Actualizar un elemento
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, type } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE posts SET title = ?, description = ?, price = ?, type = ? WHERE id = ?',
      [title, description, price, type, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Elemento no encontrado' });
    }
    res.json({ id, title, description, price, type });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el elemento' });
  }
};

// Eliminar un elemento
exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM posts WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Elemento no encontrado' });
    }
    res.json({ message: 'Elemento eliminado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el elemento' });
  }
};
