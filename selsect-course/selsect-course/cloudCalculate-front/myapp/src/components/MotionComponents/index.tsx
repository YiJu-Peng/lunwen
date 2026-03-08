import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Image, Tabs, Typography } from 'antd';
import type { ButtonProps } from 'antd/es/button';
import type { CardProps } from 'antd/es/card';
import type { ImageProps } from 'antd/es/image';
import type { TabsProps } from 'antd/es/tabs';
import { ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd/es/config-provider/context';
import { useInView } from 'framer-motion';
import { PageContainer } from '@ant-design/pro-components';
import './index.less';

const { Title, Paragraph, Text } = Typography;

// 自定义classNames合并函数(替代clsx)
function classNames(...classes: (string | undefined | null | false | 0)[]) {
  return classes.filter(Boolean).join(' ');
}

// 触觉按钮 - 提供触觉反馈的按钮
interface TactileButtonProps extends ButtonProps {
  intensity?: 'light' | 'medium' | 'strong';
}

export const TactileButton: React.FC<TactileButtonProps> = ({ 
  children, 
  intensity = 'medium',
  className,
  ...props 
}) => {
  // 触觉强度对应的动画配置
  const intensityMap = {
    light: { scale: 0.98, transition: { type: 'spring', stiffness: 400, damping: 10 } },
    medium: { scale: 0.95, transition: { type: 'spring', stiffness: 500, damping: 15 } },
    strong: { scale: 0.92, transition: { type: 'spring', stiffness: 600, damping: 20 } },
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!props.disabled) {
      // 适当的触觉反馈函数
    }
    
    props.onClick?.(e);
  };

  const btnClass = classNames(
    'tactile-button',
    `tactile-button-${intensity}`,
    className
  );

  return (
    <motion.div
      whileTap={intensityMap[intensity]}
      className="tactile-button-container"
    >
      <Button className={btnClass} onClick={handleClick} {...props}>
        {children}
      </Button>
    </motion.div>
  );
};

// 动态按钮 - 带有动画效果的按钮
export const MotionButton: React.FC<ButtonProps> = ({ 
  children,
  className,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="motion-button-container"
    >
      <Button className={classNames('motion-button', className)} {...props}>
        {children}
      </Button>
    </motion.div>
  );
};

// 动态卡片 - 带有3D悬停效果的卡片
export const MotionCard: React.FC<CardProps> = ({
  children,
  className,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={classNames('motion-card-container', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        scale: isHovered ? 1.02 : 1,
        boxShadow: isHovered 
          ? '0 10px 30px rgba(0, 0, 0, 0.1)'
          : '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      style={{
        borderRadius: '8px',
      }}
    >
      <Card className="motion-card" {...props}>
        {children}
      </Card>
    </motion.div>
  );
};

// 动态标签页 - 平滑过渡的标签页
export const MotionTabs: React.FC<TabsProps> = ({
  className,
  ...props
}) => {
  // 创建符合Ant Design主题的配置
  const customTheme: ThemeConfig = {
    components: {
      Tabs: {
        // 使用合法的Tabs组件Token
        motion: true,
        motionDurationSlow: '0.3s',
        motionDurationMid: '0.2s',
      },
    },
  };

  return (
    <ConfigProvider theme={customTheme}>
      <Tabs
        className={classNames('motion-tabs', className)}
        animated={{ inkBar: true, tabPane: true }}
        {...props}
      />
    </ConfigProvider>
  );
};

// 页面转场容器 - 为页面添加进场和离场动画
interface TransitionPageContainerProps {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const TransitionPageContainer: React.FC<TransitionPageContainerProps> = ({
  children,
  className,
  isLoading = false,
}) => {
  const ref = useRef(null);
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={ref}
        className={classNames('transition-page-container', className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoading ? 0.5 : 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// 动态图片 - 带有加载动画和悬停效果的图片
interface MotionImageProps extends ImageProps {
  hoverEffect?: 'zoom' | 'lift' | 'glow' | 'none';
}

export const MotionImage: React.FC<MotionImageProps> = ({
  hoverEffect = 'zoom',
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const hoverEffects = {
    zoom: { scale: 1.05 },
    lift: { y: -10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' },
    glow: { boxShadow: '0 0 20px rgba(0,150,255,0.5)' },
    none: {},
  };

  return (
    <motion.div
      className={classNames('motion-image-container', `motion-image-${hoverEffect}`, className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      whileHover={hoverEffects[hoverEffect as keyof typeof hoverEffects]}
      transition={{ duration: 0.3 }}
    >
      <Image
        {...props}
        className="motion-image"
        onLoad={() => setIsLoaded(true)}
        preview={props.preview === undefined ? false : props.preview}
      />
    </motion.div>
  );
};

// 淡入文本 - 带有淡入效果的文本组件
interface FadeInTextProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeInText: React.FC<FadeInTextProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  className,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      className={classNames('fade-in-text', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
};

// CSS变量设置
export const useMotionSetup = () => {
  const setupCSSVariables = () => {
    const root = document.documentElement;
    
    // 按钮触觉反馈相关变量
    root.style.setProperty('--tactile-button-light-scale', '0.98');
    root.style.setProperty('--tactile-button-medium-scale', '0.95');
    root.style.setProperty('--tactile-button-strong-scale', '0.92');
    
    // 动画持续时间相关变量
    root.style.setProperty('--motion-duration-fast', '0.2s');
    root.style.setProperty('--motion-duration-medium', '0.4s');
    root.style.setProperty('--motion-duration-slow', '0.6s');
    
    // 过渡曲线相关变量
    root.style.setProperty('--motion-ease-in-out', 'cubic-bezier(0.4, 0, 0.2, 1)');
    root.style.setProperty('--motion-ease-out', 'cubic-bezier(0, 0, 0.2, 1)');
    root.style.setProperty('--motion-ease-in', 'cubic-bezier(0.4, 0, 1, 1)');
  };

  // 在组件挂载时设置CSS变量
  useEffect(() => {
    setupCSSVariables();
  }, []);
};

export default {
  TactileButton,
  MotionButton,
  MotionCard,
  MotionTabs,
  TransitionPageContainer,
  MotionImage,
  FadeInText,
}; 