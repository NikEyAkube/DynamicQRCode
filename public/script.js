document.getElementById('qrForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const url = document.getElementById('url').value;
    const color = document.getElementById('color').value;
    const bgColor = document.getElementById('bgColor').value;
    const size = document.getElementById('size').value;

    const qrCodeContainer = document.getElementById('qrCodeContainer');
    qrCodeContainer.innerHTML = ''; // Очистка контейнера перед генерацией нового QR-кода

    // Генерация URL для отслеживания
    const trackUrl = `${window.location.origin}/track?url=${encodeURIComponent(url)}`;

    const qrCode = new QRCode(qrCodeContainer, {
        text: trackUrl,
        width: size,
        height: size,
        colorDark: color,
        colorLight: bgColor,
        correctLevel: QRCode.CorrectLevel.H
    });

    // Установка размера QR-кода в соответствии с шириной контейнера
    const canvas = qrCodeContainer.querySelector('canvas');
    if (canvas) {
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
    }
});