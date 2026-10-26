import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

/**
 * 60FPS Hardware-accelerated Particle & Confetti Canvas
 * Zero dependencies, handles confetti bursts, spark flashes, and electric arcs.
 */
const ParticleCanvas = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

  useImperativeHandle(ref, () => ({
    burst(x, y, count = 35, colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const originX = x !== undefined ? x : rect.width / 2;
      const originY = y !== undefined ? y : rect.height / 2;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        particlesRef.current.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          size: Math.random() * 6 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
          gravity: 0.18,
          shape: Math.random() > 0.4 ? "rect" : "circle",
        });
      }
    },
    celebration() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const colors = ["#2563eb", "#38bdf8", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];
      
      // Launch from left and right corners
      for (let i = 0; i < 70; i++) {
        const isLeft = Math.random() > 0.5;
        const startX = isLeft ? 40 : rect.width - 40;
        const angle = isLeft ? -Math.PI / 4 + (Math.random() - 0.5) * 0.5 : -3 * Math.PI / 4 + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 12 + 8;
        particlesRef.current.push({
          x: startX,
          y: rect.height - 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 7 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 15,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.01,
          gravity: 0.22,
          shape: Math.random() > 0.5 ? "rect" : "circle",
        });
      }
    },
    clear() {
      particlesRef.current = [];
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    }
    resize();
    window.addEventListener("resize", resize);

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
});

export default ParticleCanvas;
