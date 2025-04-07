import twilio from 'twilio';
import dayjs from 'dayjs'; // Para obtener el día de la semana

// Cargar las credenciales de Twilio desde el archivo .env
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = twilio(accountSid, authToken);

// Definir el horario de clases
const horarios = {
  lunes: [
    { materia: "Física General", hora_inicio: "18:00", hora_fin: "20:00" }
  ],
  martes: [
    { materia: "Matemática", hora_inicio: "18:00", hora_fin: "21:30" }
  ],
  miercoles: [
    { materia: "Comunicación", hora_inicio: "18:00", hora_fin: "22:10" },
    { materia: "Historia y Geografía", hora_inicio: "18:00", hora_fin: "22:10" }
  ],
  jueves: [
    { materia: "Matemática", hora_inicio: "18:00", hora_fin: "22:10" },
    { materia: "Comunicación", hora_inicio: "18:00", hora_fin: "22:10" }
  ],
  viernes: [
    { materia: "Computación", hora_inicio: "18:00", hora_fin: "22:10" },
    { materia: "Computación", hora_inicio: "18:00", hora_fin: "22:10" }
  ]
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Obtener el número de teléfono del usuario que envió el mensaje
      const userPhoneNumber = req.body.From;

      // Definir el número autorizado
      const authorizedNumber = 'whatsapp:+595986913688'; // El número que puede interactuar con el bot

      // Verificar si el mensaje es del número autorizado
      if (userPhoneNumber !== authorizedNumber) {
        return res.status(200).send('Este número no está autorizado para interactuar con el bot.');
      }

      // Obtener el mensaje del usuario
      const userMessage = req.body.Body.toLowerCase();  // El texto del mensaje del usuario

      // Obtener el día actual
      const today = dayjs().format('dddd').toLowerCase(); // "lunes", "martes", etc.

      let responseMessage = '';

      // Si el mensaje contiene la pregunta "¿Qué materia tengo hoy?"
      if (userMessage.includes("qué materia tengo hoy")) {
        const todaysClasses = horarios[today]; // Obtener las clases del día
        if (todaysClasses && todaysClasses.length > 0) {
          responseMessage = `Hoy tienes las siguientes materias:\n`;
          todaysClasses.forEach((clase, index) => {
            responseMessage += `${index + 1}. ${clase.materia} de ${clase.hora_inicio} a ${clase.hora_fin}\n`;
          });
        } else {
          responseMessage = `Hoy no tienes clases.`;
        }
      } else {
        responseMessage = "Lo siento, no entendí la pregunta. Puedes preguntar: '¿Qué materia tengo hoy?'.";
      }

      // Enviar el mensaje de WhatsApp a través de Twilio
      const from = 'whatsapp:+14155238886';  // Número del sandbox de Twilio
      const to = userPhoneNumber;  // Número de teléfono del usuario que envió el mensaje

      const message = await client.messages.create({
        body: responseMessage,
        from: from,
        to: to
      });

      // Responder con el SID del mensaje si fue exitoso
      res.status(200).send('Mensaje enviado');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      res.status(500).send('Hubo un error al enviar el mensaje');
    }
  } else {
    // Si no es un POST, devolver un error
    res.status(405).json({
      success: false,
      message: 'Método no permitido'
    });
  }
}
