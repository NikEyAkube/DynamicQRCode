const express = require('express');
const generateQRCode = require('./qr');
const appendToSheet = require('./googleSheets');
const useragent = require('express-useragent'); // Для определения типа устройства и ОС
const moment = require('moment-timezone');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;
const baseUrl = process.env.BASE_URL || `https://${process.env.VERCEL_URL}`; // Используем переменную окружения для базового URL

app.use(express.static(path.join(__dirname, 'public'))); // Обслуживание статических файлов из папки public
app.use(useragent.express()); // Используем middleware для user-agent

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Отправка index.html при переходе на корневой URL
});

app.get('/generate', async (req, res) => {
  console.log('Received request for /generate');
  const { url, color, size } = req.query;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  const trackUrl = `${baseUrl}/track?url=${encodeURIComponent(url)}`;
  console.log('Track URL:', trackUrl);
  const qrCode = await generateQRCode(trackUrl, color, size);
  res.send(`<img src="${qrCode}" alt="QR Code" />`);
});

app.get('/track', async (req, res) => {
  console.log('Received request for /track');
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  const timestamp = moment().tz('Europe/Moscow').format('YYYY-MM-DD HH:mm:ss'); // Московское время
  const device = req.useragent.isMobile ? 'Mobile' : req.useragent.isTablet ? 'Tablet' : 'Desktop';
  const os = req.useragent.os;
  const browser = req.useragent.browser;

  const data = { url, timestamp, device, os, browser };
  console.log('Data to be logged:', data); // Логирование данных для отладки

  await appendToSheet(data);
  res.redirect(url);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;