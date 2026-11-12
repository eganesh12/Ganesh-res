import { useEffect, useRef } from "react";

export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class definition
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 1;
        
        // Cyberpunk palette: ambient neon teal or hot pink
        const colors = [
          "rgba(6, 182, 212, 0.45)", // Teal
          "rgba(244, 63, 94, 0.35)",  // Rose/Pink
          "rgba(99, 102, 241, 0.4)",  // Indigo
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.shadowColor = this.color;
        c.shadowBlur = 4;
        c.fill();
        c.shadowBlur = 0; // Reset
      }
    }

    const particles: Particle[] = Array.from({ length: 60 }, () => new Particle());

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Interactive lines
    const drawLines = (c: CanvasRenderingContext2D) => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.12;
            c.beginPath();
            c.moveTo(particles[i].x, particles[i].y);
            c.lineTo(particles[j].x, particles[j].y);
            c.strokeStyle = `rgba(165, 180, 252, ${alpha})`;
            c.lineWidth = 0.5;
            c.stroke();
          }
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      drawLines(ctx);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div id="bg-particles-container" className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-300">
      {/* High-tech discrete grid scanning layer */}
      <div id="bg-grid-scanner" className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.18)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(30,41,59,0.18)_1.5px,transparent_1.5px)] bg-[size:50px_50px]" />
      
      {/* High-fidelity drifting AI intelligence nebulas */}
      <div className="absolute top-[-20%] left-[-15%] w-[70vw] h-[60vh] rounded-full bg-cyan-500/8 filter blur-[150px] animate-aurora-slow pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[65vw] h-[65vh] rounded-full bg-indigo-500/8 filter blur-[160px] animate-aurora-delayed pointer-events-none" />
      <div className="absolute top-[30%] left-[20%] w-[50vw] h-[50vh] rounded-full bg-pink-600/4 filter blur-[140px] animate-aurora-fast pointer-events-none" />

      {/* Cyber ambient central glow node */}
      <div className="absolute top-[25%] right-[15%] w-[45vw] h-[45vh] rounded-full bg-violet-600/5 filter blur-[130px] animate-pulse pointer-events-none" />

      {/* Canvas coordinates tracker graph system */}
      <canvas
        id="bg-interactive-particles"
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-65"
      />
    </div>
  );
}
