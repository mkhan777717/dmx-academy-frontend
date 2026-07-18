"use client";

import React, { useEffect, useRef } from "react";

export default function ParticleCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Only on desktop
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    let isMoving = false;

    // Colorful palette similar to the screenshot
    const colors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853", "#8E24AA", "#00ACC1"];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isMoving = true;
      
      // Spawn particles on move
      for (let i = 0; i < 3; i++) {
        particles.push(createParticle(mouse.x, mouse.y));
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    function createParticle(x, y) {
      const angle = Math.random() * Math.PI * 2;
      // burst outward speed
      const speed = Math.random() * 2 + 1; 
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1.5, // slightly larger dots
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: Math.random() * 0.015 + 0.015, // how fast it fades
        angle: angle // for drawing a dash if needed
      };
    }

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // update position
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          i--;
          continue;
        }

        // draw particle as a tiny dash or circle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        
        // Drawing a small dash like in the image
        ctx.beginPath();
        ctx.roundRect(-p.size, -p.size/3, p.size * 2, p.size / 1.5, 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
