import React from 'react';
import { motion } from 'framer-motion';
import { Card, Image, Typography, Tag, Button, Space } from 'antd';
import { theme } from 'antd';

const { useToken } = theme;
const { Title, Paragraph } = Typography;

// 创建带动画效果的Card组件
export const MotionCard = motion(Card);

// 创建带动画效果的图片组件
export const MotionImage = motion(Image);

// 创建带动画效果的标题组件
export const MotionTitle = motion(Title);

// 创建带动画效果的段落组件
export const MotionParagraph = motion(Paragraph);

// 创建带动画效果的标签组件
export const MotionTag = motion(Tag);

// 创建带动画效果的按钮组件
export const MotionButton = motion(Button);

// 创建带动画效果的容器组件
export const MotionContainer = motion.div;

// 创建视差效果容器
export const ParallaxContainer: React.FC<{
  children: React.ReactNode;
  depth?: number;
  className?: string;
}> = ({ children, depth = 5, className }) => {
  const { token } = useToken();
  
  return (
    <MotionContainer
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: token.borderRadiusLG,
        background: token.colorBgContainer,
        boxShadow: token.boxShadow,
      }}
      whileHover={{
        y: -depth,
        boxShadow: `0 ${depth * 2}px ${depth * 4}px rgba(0, 0, 0, 0.1)`,
        transition: { duration: 0.3 }
      }}
    >
      {children}
    </MotionContainer>
  );
};

// 创建交互演示容器
export const InteractiveDemo: React.FC<{
  children: React.ReactNode;
  title?: string;
  description?: string;
}> = ({ children, title, description }) => {
  const { token } = useToken();
  
  return (
    <MotionContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: token.padding,
        margin: `${token.margin}px 0`,
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      {title && <Title level={4} style={{ marginBottom: token.marginSM }}>{title}</Title>}
      {description && <Paragraph type="secondary">{description}</Paragraph>}
      <Space direction="vertical" style={{ width: '100%', marginTop: token.margin }}>
        {children}
      </Space>
    </MotionContainer>
  );
};

export default {
  MotionCard,
  MotionImage,
  MotionTitle,
  MotionParagraph,
  MotionTag,
  MotionButton,
  MotionContainer,
  ParallaxContainer,
  InteractiveDemo
}; 