const bcrypt = require('bcrypt');
const db = require('../config/db');
const readline = require('readline');

// Configurar entrada de datos desde la terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const createUser = async () => {
  rl.question('Ingresa el nombre de usuario: ', (username) => {
    rl.question('Ingresa la contraseña: ', async (password) => {
      try {
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el nuevo usuario en la base de datos
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(query, [username, hashedPassword], (err, result) => {
          if (err) {
            console.error('Error al crear el usuario:', err);
          } else {
            console.log(`Usuario ${username} creado exitosamente con ID: ${result.insertId}`);
          }
          rl.close();
        });
      } catch (error) {
        console.error('Error al hashear la contraseña:', error);
        rl.close();
      }
    });
  });
};

createUser();
