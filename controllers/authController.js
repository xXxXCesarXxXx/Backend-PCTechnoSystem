const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Importa bcrypt
const db = require('../config/db');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  console.log('Intento de login:', username);

  try {
    // Busca al usuario en la base de datos
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (users.length === 0) {
      console.log('Usuario no encontrado.');
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    const user = users[0];

    // Compara la contraseña proporcionada con la contraseña hasheada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Contraseña incorrecta.');
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    // Genera un token JWT
    const token = jwt.sign({ id: user.id, username: user.username }, 'my_secret_key', {
      expiresIn: '1h',
    });

    console.log('Token generado:', token);
    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      username: user.username, // Asegúrate de incluir el username aquí
    });
    
  } catch (error) {
    console.error('Error en el backend:', error);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};
