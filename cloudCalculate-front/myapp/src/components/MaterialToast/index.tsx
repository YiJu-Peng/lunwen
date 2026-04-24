import React, { useState, useEffect, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled, WarningFilled } from '@ant-design/icons';
import './index.less';

// Toast类型
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Toast配置
export interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
  showIcon?: boolean;
  showProgress?: boolean;
  particles?: boolean;
}

// Toast实例结构
interface ToastInstance extends ToastConfig {
  id: string;
}

// 全局toast列表
let toasts: ToastInstance[] = [];
// 回调函数，用于触发组件更新
let notifyUpdate: () => void = () => {};

// Toast图标映射
const IconMap: Record<ToastType, ReactNode> = {
  success: <CheckCircleFilled />,
  error: <CloseCircleFilled />,
  warning: <WarningFilled />,
  info: <InfoCircleFilled />,
};

// 单个Toast组件
const Toast: React.FC<{
  toast: ToastInstance;
  onRemove: (id: string) => void;
}> = ({ toast, onRemove }) => {
  const { id, message, type = 'info', duration = 3000, showIcon = true, showProgress = true, particles = true } = toast;
  
  // 进度条动画
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    // 设置倒计时
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);
    
    // 设置进度条动画
    if (showProgress) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 10);
      
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
    
    return () => clearTimeout(timer);
  }, [duration, id, onRemove, showProgress]);
  
  // 粒子效果类名
  const particlesClassName = particles ? `toast-particles-${type}` : '';
  
  return (
    <motion.div
      className={`material-toast ${type} ${particlesClassName}`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.2 }}
    >
      <div className="toast-content">
        {showIcon && (
          <div className="toast-icon">
            {IconMap[type]}
          </div>
        )}
        <div className="toast-message">{message}</div>
      </div>
      
      {showProgress && (
        <div 
          className="toast-progress" 
          style={{ width: `${progress}%` }}
        />
      )}
    </motion.div>
  );
};

// Toast容器组件
const ToastContainer: React.FC = () => {
  // 本地状态，用于触发渲染
  const [, setUpdate] = useState(0);
  
  // 设置更新函数
  useEffect(() => {
    notifyUpdate = () => setUpdate(prev => prev + 1);
    return () => {
      notifyUpdate = () => {};
    };
  }, []);
  
  // 移除Toast的方法
  const handleRemove = (id: string) => {
    toasts = toasts.filter(toast => toast.id !== id);
    notifyUpdate();
  };
  
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            toast={toast} 
            onRemove={handleRemove} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// 创建Toast容器DOM节点
let containerElement: HTMLElement | null = null;

// 先把Toast容器准备出来
const initToastContainer = () => {
  if (!containerElement && typeof document !== 'undefined') {
    containerElement = document.createElement('div');
    containerElement.id = 'material-toast-container';
    document.body.appendChild(containerElement);
    
    ReactDOM.render(<ToastContainer />, containerElement);
  }
};

// Toast服务对象
const MaterialToast = {
  // 显示Toast的方法
  show: (config: ToastConfig) => {
    initToastContainer();
    
    const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const toast: ToastInstance = { id, ...config };
    
    toasts.push(toast);
    notifyUpdate();
    
    return id;
  },
  
  // 快捷方法
  success: (message: string, config?: Omit<ToastConfig, 'message' | 'type'>) => 
    MaterialToast.show({ message, type: 'success', ...config }),
    
  error: (message: string, config?: Omit<ToastConfig, 'message' | 'type'>) => 
    MaterialToast.show({ message, type: 'error', ...config }),
    
  warning: (message: string, config?: Omit<ToastConfig, 'message' | 'type'>) => 
    MaterialToast.show({ message, type: 'warning', ...config }),
    
  info: (message: string, config?: Omit<ToastConfig, 'message' | 'type'>) => 
    MaterialToast.show({ message, type: 'info', ...config }),
    
  // 移除指定Toast
  remove: (id: string) => {
    toasts = toasts.filter(toast => toast.id !== id);
    notifyUpdate();
  },
  
  // 清空所有Toast
  clear: () => {
    toasts = [];
    notifyUpdate();
  }
};

export default MaterialToast; 