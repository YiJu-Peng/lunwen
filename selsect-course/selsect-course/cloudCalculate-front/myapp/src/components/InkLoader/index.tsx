import React, { useEffect, useRef } from 'react';
import { useMotionSetup } from '../MotionComponents';
import './index.less';

interface InkLoaderProps {
  size?: number;
  color?: string;
}

const InkLoader: React.FC<InkLoaderProps> = ({ 
  size = 200,
  color = '#000000'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  useMotionSetup();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // 设置画布尺寸
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 水墨粒子系统
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;
      speed: number;
    }> = [];
    
    // 创建水墨粒子
    const createInkParticles = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      const hue = parseInt(color.replace('#', ''), 16);
      const colorBase = `rgba(${hue >> 16}, ${(hue >> 8) & 0xff}, ${hue & 0xff}`;
      
      for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 5 + 2;
        const distance = Math.random() * 10;
        
        particles.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          radius: radius,
          vx: Math.cos(angle) * (Math.random() * 2 + 0.5),
          vy: Math.sin(angle) * (Math.random() * 2 + 0.5),
          opacity: 0.8,
          speed: Math.random() * 0.5 + 0.2
        });
      }
    };
    
    // 动画循环
    const animate = () => {
      // 添加淡入透明效果
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 更新和绘制粒子
      particles.forEach((p, index) => {
        p.x += p.vx * p.speed;
        p.y += p.vy * p.speed;
        p.radius += 0.2;
        p.opacity -= 0.01;
        
        if (p.opacity <= 0) {
          particles.splice(index, 1);
          return;
        }
        
        // 绘制粒子
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius
        );
        
        const hue = parseInt(color.replace('#', ''), 16);
        const r = hue >> 16;
        const g = (hue >> 8) & 0xff;
        const b = hue & 0xff;
        
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.opacity})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
      
      // 当粒子太少时添加新粒子
      if (particles.length < 20) {
        createInkParticles();
      }
      
      requestAnimationFrame(animate);
    };
    
    // 尝试播放ASMR音效
    if (audioRef.current) {
      // 降低音量
      audioRef.current.volume = 0.2;
      
      // 捕获播放可能失败的错误（浏览器可能阻止自动播放）
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('用户交互前无法自动播放音频');
        });
      }
    }
    
    // 初始化粒子并开始动画
    createInkParticles();
    const animationId = requestAnimationFrame(animate);
    
    // 清理函数
    return () => {
      cancelAnimationFrame(animationId);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [size, color]);
  
  return (
    <div className="ink-loader-container" style={{ width: size, height: size }}>
      <canvas ref={canvasRef} className="ink-loader-canvas" />
      <div className="ink-loader-text">加载中...</div>
      <audio ref={audioRef} preload="auto" loop>
        <source src="/assets/sounds/ink-flow.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default InkLoader; 