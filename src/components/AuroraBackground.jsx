import React, { useEffect, useRef } from 'react';

const AuroraBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width, height;
        let particles = [];
        let animationId;

        // Aurora colors: Deep Purple, Dark Blue, Cyan, hints of Gold
        const colors = ["#2c003e", "#001a33", "#330019", "#0f0f1a"];

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        class Orb {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 300 + 150; // Large glowing orbs
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges gently
                if (this.x < -200 || this.x > width + 200) this.vx *= -1;
                if (this.y < -200 || this.y > height + 200) this.vy *= -1;
            }

            draw(ctx) {
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
                gradient.addColorStop(0, this.color); // Core color
                gradient.addColorStop(1, "transparent"); // Fade out

                ctx.globalCompositeOperation = "screen"; // Blend mode for glowing effect
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = "source-over"; // Reset
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < 8; i++) { // Number of aurora sources
                particles.push(new Orb());
            }
        };

        const animate = () => {
            ctx.fillStyle = "#050510"; // Very dark BG
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw(ctx);
            });

            animationId = requestAnimationFrame(animate); // Capture animation frame ID
        };

        window.addEventListener('resize', resize);
        resize();
        animationId = requestAnimationFrame(animate); // Initial call

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-[-1] pointer-events-none" />;
};

export default AuroraBackground;
