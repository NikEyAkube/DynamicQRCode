const QRCode = require('qrcode');

function generateQRCode(url, color = '000000', size = 200) {
  return QRCode.toDataURL(url, {
    color: {
      dark: `#${color}`, // Цвет QR-кода
      light: '#FFFFFF' // Цвет фона
    },
    width: parseInt(size, 10) // Размер QR-кода
  });
}

module.exports = generateQRCode;
