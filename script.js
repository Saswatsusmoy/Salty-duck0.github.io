document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let centerX = canvas.width / 2;
    let centerY = canvas.height / 3;
    let scaleFactor = Math.min(canvas.width, canvas.height) / 3;

    const G = 9.8;  // Gravity constant
    const L1 = 1.0; // Length of pendulum 1
    const L2 = 1.0; // Length of pendulum 2
    const M1 = 1.0; // Mass of pendulum 1
    const M2 = 1.0; // Mass of pendulum 2

    let tracerPath = []; // Array to store the tracer positions
    let state = {
        th1: Math.PI / 2,  // Initial angle for pendulum 1
        th2: Math.PI / 4,  // Initial angle for pendulum 2
        w1: 0.0,           // Initial angular velocity for pendulum 1
        w2: 0.0            // Initial angular velocity for pendulum 2
    };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        centerX = canvas.width / 2;
        centerY = canvas.height / 3;
        scaleFactor = Math.min(canvas.width, canvas.height) / 3;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();  // Call it once to initialize

    function drawPendulum(th1, th2) {
        // Clear only the parts of the canvas that will be redrawn
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the tracer path first
        ctx.lineWidth = 2;
        for (let i = 1; i < tracerPath.length; i++) {
            const { x, y } = tracerPath[i];
            const previousPoint = tracerPath[i - 1];
            const age = tracerPath.length - i;  // Older points will have higher age
            const alpha = Math.max(0, 1 - age / 100);  // Fade effect

            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;  // White color with fading effect
            ctx.beginPath();
            ctx.moveTo(previousPoint.x, previousPoint.y);
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        // Pendulum positions
        const x1 = L1 * Math.sin(th1);
        const y1 = -L1 * Math.cos(th1);
        const x2 = x1 + L2 * Math.sin(th2);
        const y2 = y1 - L2 * Math.cos(th2);

        const x1Scaled = centerX + x1 * scaleFactor;
        const y1Scaled = centerY - y1 * scaleFactor;
        const x2Scaled = centerX + x2 * scaleFactor;
        const y2Scaled = centerY - y2 * scaleFactor;

        // Add the current position to the tracer path
        tracerPath.push({ x: x2Scaled, y: y2Scaled });

        // Limit the number of points in the tracer path for efficiency
        if (tracerPath.length > 100) {
            tracerPath.shift();  // Remove the oldest point
        }

        // Draw pendulum rods and masses
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x1Scaled, y1Scaled);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x1Scaled, y1Scaled);
        ctx.lineTo(x2Scaled, y2Scaled);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw pendulum balls
        ctx.beginPath();
        ctx.arc(x1Scaled, y1Scaled, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x2Scaled, y2Scaled, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    function updatePendulum(state, dt) {
        const { th1, th2, w1, w2 } = state;

        const delta = th2 - th1;
        const den1 = (M1 + M2) * L1 - M2 * L1 * Math.cos(delta) * Math.cos(delta);
        const a1 = (M2 * L1 * w1 ** 2 * Math.sin(delta) * Math.cos(delta) +
            M2 * G * Math.sin(th2) * Math.cos(delta) +
            M2 * L2 * w2 ** 2 * Math.sin(delta) -
            (M1 + M2) * G * Math.sin(th1)) / den1;

        const den2 = (L2 / L1) * den1;
        const a2 = (-M2 * L2 * w2 ** 2 * Math.sin(delta) * Math.cos(delta) +
            (M1 + M2) * G * Math.sin(th1) * Math.cos(delta) -
            (M1 + M2) * L1 * w1 ** 2 * Math.sin(delta) -
            (M1 + M2) * G * Math.sin(th2)) / den2;

        const new_w1 = w1 + a1 * dt;
        const new_w2 = w2 + a2 * dt;

        const new_th1 = th1 + new_w1 * dt;
        const new_th2 = th2 + new_w2 * dt;

        return {
            th1: new_th1,
            th2: new_th2,
            w1: new_w1,
            w2: new_w2
        };
    }

    function animatePendulum() {
        state = updatePendulum(state, 0.01); // Use small time steps
        drawPendulum(state.th1, state.th2);
        requestAnimationFrame(animatePendulum); // Continue the animation loop
    }

    animatePendulum(); // Start the animation
});
