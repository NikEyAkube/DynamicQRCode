const { GoogleSpreadsheet } = require('google-spreadsheet');
const moment = require('moment-timezone');
require('dotenv').config();

// Декодирование учетных данных из переменной окружения
const creds = JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS, 'base64').toString('utf-8'));

async function appendToSheet(data) {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    await sheet.loadHeaderRow();
    const headers = sheet.headerValues;
    const requiredHeaders = ['URL', 'Timestamp', 'Device', 'OS', 'Browser'];
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));

    if (missingHeaders.length > 0) {
      console.error('Missing headers in Google Sheets:', missingHeaders);
      return;
    }

    console.log('Appending row:', data);
    await sheet.addRow({
      URL: data.url,
      Timestamp: data.timestamp,
      Device: data.device,
      OS: data.os,
      Browser: data.browser
    });
    console.log('Row appended successfully');
  } catch (error) {
    if (error.message.includes('Duplicate header detected')) {
      console.error('Duplicate header detected in Google Sheets. Please ensure all headers are unique.');
    } else {
      console.error('Error appending row:', error);
    }
    throw error;
  }
}

module.exports = appendToSheet;