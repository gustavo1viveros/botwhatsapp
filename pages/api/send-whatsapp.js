import twilio from 'twilio';
import fs from 'fs';
import path from 'path';

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = twilio(accountSid, authToken);

// Función para obtener el día actual
const getDiaActual = () => {
  const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const hoy = new Date();
  return dias[hoy.getDay()];
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Leer los horarios de clases desde el archivo JSON
      const filePath = path.join(process.cwd(), 'horarios.json');
      const data = fs.readFileSync(filePath, 'utf8');
      const horarios = JSON.parse(data);

      // Obtener el día actual
      const diaActual = getDiaActual();

      // Verificar si hay clases hoy
      const clasesHoy = horarios[diaActual.toLowerCase()];
      if (!clasesHoy || clasesHoy.length === 0) {
        return res.status(200).json({ success: true, message: `Hoy no tienes clases.` });
      }

      // Crear el mensaje con los horarios de clases de hoy
      let mensaje = `¡Hola! Aquí está tu horario de clases para hoy (${diaActual}):\n`;
      clasesHoy.forEach(clase => {
        mensaje += `${clase.materia} - ${clase.hora_inicio} a ${clase.hora_fin}\n`;
      });

      // Enviar mensaje por WhatsApp
      const message = await client.messages.create({
        from: 'whatsapp:+14155238886', // Número de WhatsApp sandbox de Twilio
        to: 'whatsapp:+595986913688',   // Tu número de WhatsApp
        body: mensaje,
      });

      return res.status(200).json({ success: true, message: 'Mensaje enviado', sid: message.sid });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }
}
