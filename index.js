const express = require('express');
const generateQRCode = require('./qr');
const appendToSheet = require('./googleSheets');
const useragent = require('express-useragent'); // Для определения типа устройства и ОС

const app = express();
const port = process.env.PORT || 3001;
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`; // Используем переменную окружения для базового URL

app.use(express.static('public'));
app.use(useragent.express()); // Используем middleware для user-agent

app.get('/generate', async (req, res) => {
  const { url, color, size } = req.query;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  const trackUrl = `${baseUrl}/track?url=${encodeURIComponent(url)}`;
  const qrCode = await generateQRCode(trackUrl, color, size);
  res.send(`<img src="${qrCode}" alt="QR Code" />`);
});

app.get('/track', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  const timestamp = new Date().toLocaleString(); // Изменяем формат даты
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