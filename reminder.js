import fetch from 'node-fetch';  // Necesario para hacer solicitudes HTTP

// Tu horario de clases (puedes obtener esto de una base de datos o archivo)
const horarioClases = {
  lunes: [
    { materia: 'Física General', hora_inicio: '18:00', hora_fin: '20:00' },
  ],
  martes: [
    { materia: 'Matemática', hora_inicio: '18:00', hora_fin: '21:30' },
  ],
  "miercoles": [
      { "materia": "Comunicación", "hora_inicio": "18:00", "hora_fin": "22:10" },
      { "materia": "Historia y Geografía", "hora_inicio": "18:00", "hora_fin": "22:10" }
    ],
    "jueves": [
      { "materia": "Matemática", "hora_inicio": "18:00", "hora_fin": "22:10" },
      { "materia": "Comunicación", "hora_inicio": "18:00", "hora_fin": "22:10" }
    ],
    "viernes": [
      { "materia": "Computación", "hora_inicio": "18:00", "hora_fin": "22:10" },
      { "materia": "Computación", "hora_inicio": "18:00", "hora_fin": "22:10" }
    ]
  }
  // Completa para el resto de los días

// Función para verificar si tenemos clase en este minuto
const verificarClasesYEnviar = async () => {
  const now = new Date();
  const diaSemana = now.toLocaleString('es-ES', { weekday: 'long' }).toLowerCase(); // día de la semana en formato "lunes"
  const horaActual = now.getHours();
  const minutoActual = now.getMinutes();

  // Obtener las clases para hoy
  const clasesHoy = horarioClases[diaSemana] || [];

  // Verificar si alguna clase coincide con la hora actual
  clasesHoy.forEach((clase) => {
    const [horaInicio, minutoInicio] = clase.hora_inicio.split(':').map(Number);
    const [horaFin, minutoFin] = clase.hora_fin.split(':').map(Number);

    // Verificar si la hora actual está dentro del rango de la clase
    if (
      (horaActual === horaInicio && minutoActual >= minutoInicio) ||  // Si es después de la hora de inicio
      (horaActual === horaFin && minutoActual <= minutoFin)           // O antes de la hora de fin
    ) {
      console.log(`Tienes clase de ${clase.materia} ahora, enviando mensaje de WhatsApp...`);
      // Enviar el recordatorio (llamamos a la API que creamos para enviar el mensaje)
      enviarMensajeWhatsApp(clase.materia);
    }
  });
};

// Función para enviar el mensaje a través de la API
const enviarMensajeWhatsApp = async (materia) => {
  try {
    const response = await fetch('http://localhost:3000/api/send-whatsapp', {
      method: 'GET',
    });
    const data = await response.json();

    if (data.success) {
      console.log(`Recordatorio para la clase de ${materia} enviado exitosamente.`);
    } else {
      console.log('Hubo un error al enviar el mensaje:', data.message);
    }
  } catch (error) {
    console.error('Error al enviar el mensaje de WhatsApp:', error);
  }
};

// Ejecutar la verificación cada minuto (60000 ms)
setInterval(verificarClasesYEnviar, 60000);

console.log('Sistema de recordatorios en funcionamiento...');

