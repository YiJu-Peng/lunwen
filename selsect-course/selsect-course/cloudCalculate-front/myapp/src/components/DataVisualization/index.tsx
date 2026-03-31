import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import lottie from 'lottie-web';
import { useInView } from 'framer-motion';
import './index.less';

export interface DataItem {
  label: string;
  value: number;
  color?: string;
}

interface DataVisualizationProps {
  data: DataItem[];
  lottieAsset?: string;
  theme?: 'light' | 'dark';
  height?: number;
  width?: number;
  title?: string;
  description?: string;
}

const defaultLottieAsset = '/assets/lottie/data-visual.json';

const DataVisualization: React.FC<DataVisualizationProps> = ({
  data,
  lottieAsset = defaultLottieAsset,
  theme = 'light',
  height = 400,
  width = 800,
  title,
  description
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLottieLoaded, setIsLottieLoaded] = useState(false);
  const [isThreeLoaded, setIsThreeLoaded] = useState(false);
  
  // 检测浏览器是否支持WebGL
  const canUseWebGL = () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
               (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  };
  
  // Lottie动画初始化
  useEffect(() => {
    if (!lottieRef.current || !isInView) return;
    
    try {
      const anim = lottie.loadAnimation({
        container: lottieRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: lottieAsset,
        rendererSettings: {
          progressiveLoad: true,
          preserveAspectRatio: 'xMidYMid meet'
        }
      });
      
      anim.addEventListener('DOMLoaded', () => {
        setIsLottieLoaded(true);
      });
      
      return () => {
        anim.destroy();
      };
    } catch (error) {
      console.error('Lottie加载失败:', error);
      setIsLottieLoaded(true); // 即使失败也标记为已加载，避免阻塞其他组件
    }
  }, [lottieAsset, isInView]);
  
  // Three.js场景初始化
  useEffect(() => {
    if (!threeRef.current || !isInView || !isLottieLoaded || !canUseWebGL()) return;
    
    try {
      // 性能监测
      const startTime = performance.now();
      
      const currentWidth = threeRef.current.clientWidth;
      const currentHeight = threeRef.current.clientHeight;
      
      // 创建Three.js场景
      const scene = new THREE.Scene();
      if (theme === 'dark') {
        scene.background = new THREE.Color(0x121212);
      }
      
      const camera = new THREE.PerspectiveCamera(
        45, 
        currentWidth / currentHeight, 
        0.1, 
        1000
      );
      
      // 性能自适应设置
      const isHighPerformance = window.navigator.hardwareConcurrency > 4;
      
      const renderer = new THREE.WebGLRenderer({ 
        antialias: isHighPerformance,
        alpha: true,
        powerPreference: isHighPerformance ? 'high-performance' : 'default'
      });
      
      renderer.setSize(currentWidth, currentHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isHighPerformance ? 2 : 1));
      threeRef.current.appendChild(renderer.domElement);
      
      // 根据数据生成3D可视化元素
      const visualizationGroup = new THREE.Group();
      
      // 计算数据的最大值用于归一化
      const maxValue = Math.max(...data.map(item => item.value));
      const normalizedData = data.map(item => ({
        ...item,
        normalizedValue: item.value / maxValue
      }));
      
      // 创建环境光和方向光
      const ambientLight = new THREE.AmbientLight(
        theme === 'dark' ? 0x555555 : 0xffffff, 
        0.5
      );
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
      
      // 柱状图可视化
      normalizedData.forEach((item, index) => {
        const barHeight = item.normalizedValue * 10; // 最高高度为10个单位
        const barGeometry = new THREE.BoxGeometry(1, barHeight, 1);
        
        // 使用提供的颜色或默认生成颜色
        const defaultColor = new THREE.Color(0.3 + index * 0.1, 0.6, 0.7);
        const itemColor = item.color 
          ? new THREE.Color(item.color) 
          : defaultColor;
          
        const barMaterial = new THREE.MeshStandardMaterial({
          color: itemColor,
          roughness: 0.4,
          metalness: 0.6
        });
        
        const bar = new THREE.Mesh(barGeometry, barMaterial);
        
        // 将柱子沿X轴排列，每个柱子间隔2个单位
        const spacing = Math.min(2, 10 / data.length); // 确保不会太拥挤
        bar.position.x = index * spacing - ((data.length - 1) * spacing / 2);
        bar.position.y = barHeight / 2; // 柱子从底部向上生长
        
        visualizationGroup.add(bar);
        
        // 为每个柱子添加标签
        if (isHighPerformance) {
          const canvas = document.createElement('canvas');
          canvas.width = 256;
          canvas.height = 64;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.font = '24px Arial';
            ctx.fillStyle = theme === 'dark' ? 'white' : 'black';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, 128, 32);
            
            const texture = new THREE.CanvasTexture(canvas);
            const labelMaterial = new THREE.SpriteMaterial({ map: texture });
            const label = new THREE.Sprite(labelMaterial);
            
            label.scale.set(2, 0.5, 1);
            label.position.set(bar.position.x, -1, 0);
            visualizationGroup.add(label);
          }
        }
      });
      
      scene.add(visualizationGroup);
      
      // 设置相机位置
      camera.position.set(0, 5, 20);
      camera.lookAt(0, 0, 0);
      
      // 动画循环
      const animate = () => {
        visualizationGroup.rotation.y += 0.003; // 缓慢旋转
        renderer.render(scene, camera);
        return requestAnimationFrame(animate);
      };
      
      const animationId = animate();
      
      // 响应窗口大小变化
      const handleResize = () => {
        if (!threeRef.current) return;
        
        const newWidth = threeRef.current.clientWidth;
        const newHeight = threeRef.current.clientHeight;
        
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };
      
      window.addEventListener('resize', handleResize);
      
      // 记录性能数据
      const endTime = performance.now();
      console.log(`3D可视化渲染时间: ${endTime - startTime}ms`);
      
      setIsThreeLoaded(true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
        
        // 清理Three.js资源
        visualizationGroup.traverse((obj: any) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((mat: any) => mat.dispose());
            } else {
              obj.material.dispose();
            }
          }
        });
        
        renderer.dispose();
        
        if (threeRef.current && renderer.domElement) {
          threeRef.current.removeChild(renderer.domElement);
        }
      };
    } catch (error) {
      console.error('3D可视化加载失败:', error);
      setIsThreeLoaded(true); // 即使失败也标记为已加载
    }
  }, [data, isInView, isLottieLoaded, theme]);
  
  // 设置加载状态
  useEffect(() => {
    if (isLottieLoaded && isThreeLoaded) {
      setIsLoaded(true);
    }
  }, [isLottieLoaded, isThreeLoaded]);
  
  useEffect(() => {
    if (isInView && !isLottieLoaded) {
      // 5秒后如果仍未加载完成，强制显示
      const timer = setTimeout(() => {
        setIsLottieLoaded(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isInView, isLottieLoaded]);
  
  return (
    <div 
      ref={containerRef} 
      className={`data-visualization-container ${theme}`}
      style={{ height, width: width || '100%' }}
    >
      {title && <div className="data-visualization-title">{title}</div>}
      {description && <div className="data-visualization-description">{description}</div>}
      
      <div className="data-visualization-content">
        <div 
          ref={lottieRef} 
          className={`data-visualization-lottie ${isLoaded ? 'loaded' : 'loading'}`}
        />
        
        <div 
          ref={threeRef} 
          className={`data-visualization-three ${isLoaded ? 'loaded' : 'loading'}`}
        />
        
        {!isLoaded && (
          <div className="data-visualization-loader">
            <div className="loader-spinner"></div>
            <div className="loader-text">加载可视化组件...</div>
          </div>
        )}
      </div>
      
      {isLoaded && !canUseWebGL() && (
        <div className="data-visualization-fallback">
          <div className="fallback-message">
            您的浏览器不支持3D可视化，已切换到兼容模式
          </div>
          <div className="fallback-chart">
            {data.map((item, index) => (
              <div className="fallback-bar-container" key={index}>
                <div className="fallback-bar-label">{item.label}</div>
                <div 
                  className="fallback-bar" 
                  style={{ 
                    height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%`,
                    backgroundColor: item.color || `hsl(${index * 40}, 70%, 60%)`
                  }}
                >
                  <span className="fallback-bar-value">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataVisualization; 
