const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'catalog_db',
});

// Verificar la conexión
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    process.exit(1);
  }
  console.log('Conexión a la base de datos establecida');
});

// Exportar la conexión como una instancia de promesas
module.exports = connection.promise();
