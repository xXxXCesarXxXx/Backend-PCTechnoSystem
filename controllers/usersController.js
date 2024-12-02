const db = require('../config/db');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios.' });
  }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Se requieren todos los campos.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    res.status(201).json({ id: result.insertId, username });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario.' });
  }
};

// Actualizar un usuario existente
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  if (!id || (!username && !password)) {
    return res.status(400).json({ error: 'Faltan datos para actualizar.' });
  }

  try {
    const fields = [];
    const values = [];

    if (username) {
      fields.push('username = ?');
      values.push(username);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fields.push('password = ?');
      values.push(hashedPassword);
    }

    values.push(id);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(query, values);

    res.json({ message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Se requiere un ID de usuario.' });
  }

  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario.' });
  }
};
