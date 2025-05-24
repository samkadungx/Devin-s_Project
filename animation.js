// Get the canvas element and its context
const canvas = document.getElementById('bouncingCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Ball class
class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = (Math.random() - 0.5) * 8; // Random horizontal velocity
        this.dy = (Math.random() - 0.5) * 8; // Random vertical velocity
        this.mass = radius; // Mass proportional to radius
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(balls) {
        // Bounce off walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Keep balls within bounds
        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));

        // Check collision with other balls
        balls.forEach(ball => {
            if (ball === this) return; // Skip self

            // Calculate distance between ball centers
            const dx = ball.x - this.x;
            const dy = ball.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if balls are colliding
            if (distance < this.radius + ball.radius) {
                // Collision resolution
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                // Rotate velocities
                const vx1 = this.dx * cos + this.dy * sin;
                const vy1 = this.dy * cos - this.dx * sin;
                const vx2 = ball.dx * cos + ball.dy * sin;
                const vy2 = ball.dy * cos - ball.dx * sin;

                // Elastic collision formula
                const m1 = this.mass;
                const m2 = ball.mass;
                const u1 = vx1;
                const u2 = vx2;

                const v1 = (u1 * (m1 - m2) + 2 * m2 * u2) / (m1 + m2);
                const v2 = (u2 * (m2 - m1) + 2 * m1 * u1) / (m1 + m2);

                // Rotate velocities back
                this.dx = v1 * cos - vy1 * sin;
                this.dy = vy1 * cos + v1 * sin;
                ball.dx = v2 * cos - vy2 * sin;
                ball.dy = vy2 * cos + v2 * sin;

                // Move balls apart to prevent sticking
                const overlap = (this.radius + ball.radius - distance) / 2;
                const moveX = overlap * cos;
                const moveY = overlap * sin;
                
                this.x -= moveX;
                this.y -= moveY;
                ball.x += moveX;
                ball.y += moveY;
            }
        });

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

// Create balls with different colors
const balls = [
    new Ball(400, 300, 20, 'red'),
    new Ball(200, 200, 20, 'green'),
    new Ball(600, 400, 20, 'blue'),
    new Ball(300, 500, 20, 'orange'),
    new Ball(500, 100, 20, 'white'),
    // Adding three more green balls at different positions
    new Ball(150, 150, 20, 'green'),
    new Ball(450, 250, 20, 'green'),
    new Ball(350, 400, 20, 'green')
];

// Animation loop
function animate() {
    // Clear canvas completely (removed rgba opacity)
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw balls
    balls.forEach(ball => ball.update(balls));

    // Request next frame
    requestAnimationFrame(animate);
}

// Start animation
animate(); 