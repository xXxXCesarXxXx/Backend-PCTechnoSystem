const db = require('../config/db'); // Importa la conexión configurada con promesas
const nodemailer = require('nodemailer');
// Obtener la información de contacto
exports.getContactInfo = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contact');
    if (rows.length === 0) {
      // Crear un registro vacío si no hay datos
      const [result] = await db.query(
        'INSERT INTO contact (phone, email, address) VALUES (?, ?, ?)',
        ['', '', '']
      );
      rows.push({ id: result.insertId, phone: '', email: '', address: '' });
    }
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener la información de contacto:', error);
    res.status(500).json({ error: 'Error al obtener la información de contacto' });
  }
};

exports.sendEmail = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Obtener el correo electrónico del contacto desde la base de datos
    const [contact] = await db.query('SELECT email FROM contact LIMIT 1');

    if (contact.length === 0) {
      return res.status(400).json({ error: 'No hay correo de contacto registrado' });
    }
    const contactEmail = contact[0].email;
    // Configurar el transporte para enviar el correo
    const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransport({
          service: 'Gmail', // Asegúrate de que sea Gmail
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

    // Configurar el contenido del correo
    const mailOptions = {
      to: contactEmail,
      from: email,
      subject: `Mensaje de ${name} desde la página de PCTechnoSystem`,
      text: `Correo: ${email}
      ${message}`,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
};

// Crear una nueva entrada de contacto
exports.createContactInfo = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO contact (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    res.json({ message: 'Información de contacto creada exitosamente', id: result.insertId });
  } catch (error) {
    console.error('Error al crear la información de contacto:', error);
    res.status(500).json({ error: 'Error al crear la información de contacto' });
  }
};

// Eliminar una entrada de contacto
exports.deleteContactInfo = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM contact WHERE id = ?', [id]);
    res.json({ message: 'Información de contacto eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la información de contacto:', error);
    res.status(500).json({ error: 'Error al eliminar la información de contacto' });
  }
};

// Actualizar la información de contacto
// Actualizar información de contacto
exports.updateContactInfo = async (req, res) => {
  const { id } = req.params;
  const { phone, email, address } = req.body;

  try {
    await db.query(
      'UPDATE contact SET phone = ?, email = ?, address = ? WHERE id = ?',
      [phone, email, address, id]
    );
    res.json({ message: 'Información de contacto actualizada correctamente.' });
  } catch (error) {
    console.error('Error al actualizar la información de contacto:', error);
    res.status(500).json({ error: 'Error al actualizar la información de contacto.' });
  }
};



