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

function consoleText(words, id, colors) {
    if (colors === undefined) colors = ['#fff'];
    var visible = true;
    var con = document.getElementById('console');
    var letterCount = 1;
    var x = 1;
    var waiting = false;
    var target = document.getElementById(id);
    target.setAttribute('style', 'color:' + colors[0]);
    window.setInterval(function() {
        if (letterCount === 0 && waiting === false) {
            waiting = true;
            target.innerHTML = words[0].substring(0, letterCount);
            window.setTimeout(function() {
                var usedColor = colors.shift();
                colors.push(usedColor);
                var usedWord = words.shift();
                words.push(usedWord);
                x = 1;
                target.setAttribute('style', 'color:' + colors[0]);
                letterCount += x;
                waiting = false;
            }, 1000);
        } else if (letterCount === words[0].length + 1 && waiting === false) {
            waiting = true;
            window.setTimeout(function() {
                x = -1;
                letterCount += x;
                waiting = false;
            }, 1000);
        } else if (waiting === false) {
            target.innerHTML = words[0].substring(0, letterCount);
            letterCount += x;
        }
    }, 120);
    window.setInterval(function() {
        if (visible === true) {
            con.className = 'console-underscore hidden';
            visible = false;
        } else {
            con.className = 'console-underscore';
            visible = true;
        }
    }, 400);
}

console.log(document.getElementById('text')); // Check if the element is found
consoleText(['Made by Yakubov Nikita.', 'Made with Love ❤️'], 'text', ['tomato', 'rebeccapurple', 'lightblue']);