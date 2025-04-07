const cron = require('node-cron');
const fetch = require('node-fetch'); // O axios para enviar la solicitud

cron.schedule('* * * * *', () => {
  console.log('Enviando mensaje...');
  fetch('https://botwhatsapp-taupe.vercel.app/api/send-whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: '+595986913688', // Tu número de WhatsApp
      message: 'Este es tu recordatorio cada minuto.',
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
});
