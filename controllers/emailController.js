const nodemailer = require('nodemailer');
const db = require('../config/db'); // Tu configuración de base de datos

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
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Puedes usar otro servicio como Outlook, Yahoo, etc.
      auth: {
        user: process.env.EMAIL_USER, // Tu correo de envío
        pass: process.env.EMAIL_PASS, // Tu contraseña o app password
      },
    });

    // Configurar el contenido del correo
    const mailOptions = {
      to: contactEmail,
      from: email,
      subject: `Mensaje de ${name} desde la página de PCTechnoSystem`,
      text: `Correo de contacto: ${email}
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
