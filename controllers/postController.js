const db = require('../config/db');

// Obtener todas las publicaciones con el nombre del autor
exports.getAllPosts = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.id, p.title, p.description, p.price, p.type, p.subtype, p.image_url, 
              u.username AS author 
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las publicaciones:', error);
    res.status(500).json({ error: 'Error al obtener las publicaciones.' });
  }
};

// Crear una nueva publicación
exports.createPost = async (req, res) => {
  try {
    const { type, title, description, price, subtype, author_id } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!type || !title || !description || !price || !subtype || !author_id) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const [result] = await db.query(
      'INSERT INTO posts (type, title, description, price, subtype, author_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [type, title, description, price, subtype, author_id, imageUrl]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error al crear la publicación:', error);
    res.status(500).json({ error: 'Error al crear la publicación.' });
  }
};

// Actualizar una publicación existente
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, description, price, subtype, author_id } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const query = imageUrl
      ? 'UPDATE posts SET type = ?, title = ?, description = ?, price = ?, subtype = ?, author_id = ?, image_url = ? WHERE id = ?'
      : 'UPDATE posts SET type = ?, title = ?, description = ?, price = ?, subtype = ?, author_id = ? WHERE id = ?';

    const values = imageUrl
      ? [type, title, description, price, subtype, author_id, imageUrl, id]
      : [type, title, description, price, subtype, author_id, id];

    await db.query(query, values);

    res.json({ message: 'Publicación actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la publicación:', error);
    res.status(500).json({ error: 'Error al actualizar la publicación.' });
  }
};

// Eliminar una publicación
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM posts WHERE id = ?', [id]);
    res.json({ message: 'Publicación eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la publicación:', error);
    res.status(500).json({ error: 'Error al eliminar la publicación' });
  }
};

// Obtener una publicación por ID con el nombre del autor
exports.getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT p.id, p.title, p.description, p.price, p.type, p.subtype, p.image_url, 
              u.username AS author 
       FROM posts p
       LEFT JOIN users u ON p.author_id = u.id
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la publicación:', error);
    res.status(500).json({ error: 'Error al obtener la publicación.' });
  }
};
