const canvas = document.getElementById("textCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const text = "Bevan";
const fontSize = 150;
const balls = [];
const ballCount = 100; // Number of balls to trace the text

// Draw the text onto the canvas and create a pixel-based path for the balls to follow
function drawTextPath() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#222";

    // Draw the text onto the canvas
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // Get pixel data to identify the text path
    const textWidth = ctx.measureText(text).width;
    const imageData = ctx.getImageData((canvas.width - textWidth) / 2, (canvas.height - fontSize) / 2, textWidth, fontSize);

    // Iterate through the pixel data to find the text outline
    for (let y = 0; y < imageData.height; y += 2) {
        for (let x = 0; x < imageData.width; x += 2) {
            const index = (y * imageData.width + x) * 4;
            // Check if the pixel is not transparent (part of the text)
            if (imageData.data[index + 3] > 128) {
                // Add the position as a target for a ball to follow
                balls.push({
                    targetX: (canvas.width - textWidth) / 2 + x,
                    targetY: (canvas.height - fontSize) / 2 + y,
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                    speed: 0.05 + Math.random() * 0.05
                });
            }
        }
    }
}

// Animate the balls along the text path
function animateBalls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    balls.forEach(ball => {
        // Move each ball closer to its target position on the text outline
        const dx = ball.targetX - ball.x;
        const dy = ball.targetY - ball.y;
        ball.x += dx * ball.speed;
        ball.y += dy * ball.speed;

        // Draw the ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
    });

    requestAnimationFrame(animateBalls);
}

// Initialize and animate
drawTextPath();
animateBalls();

// Resize canvas and redraw text path on window resize
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    balls.length = 0; // Clear existing balls
    drawTextPath();
});
