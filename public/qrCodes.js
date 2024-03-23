document.addEventListener('DOMContentLoaded', (event) => {
    const video = document.getElementById('video');
    const canvasElement = document.getElementById('canvas');
    const canvas = canvasElement.getContext('2d');

    // Check if MediaDevices is supported
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // Required to work in iOS
            video.play();
            requestAnimationFrame(tick);
        });
    }

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            // Show the canvas element if it was previously hidden
            canvasElement.hidden = false;

            // Set canvas size to video size
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;

            // Draw the video frame to the canvas
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

            // Use jsQR to decode the canvas
            const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (code) {
                console.log("Found QR code", code.data);
                // Perform an action after QR code is detected, e.g., display data or navigate to a URL
                // Example: alert(code.data);
            } else {
                // Continue scanning for QR codes
                requestAnimationFrame(tick);
            }
        } else {
            requestAnimationFrame(tick);
        }
    }
});
