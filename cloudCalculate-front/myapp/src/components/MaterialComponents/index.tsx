/**
 * Material You + 新拟态美学设计系统组件
 * 
 * 这个文件导出所有的美化版组件，可以在项目中直接导入使用
 * 替代标准的Ant Design组件，同时保持相同的API
 */
import React from 'react';
import { Card as AntCard, Button as AntButton, Input as AntInput } from 'antd';
import NeumorphicCard from '../NeumorphicCard';
import NeumorphicButton from '../NeumorphicButton';
import MaterialInput from '../MaterialInput';
import { createStyles } from 'antd-style';
import { themeVariables } from '../../theme.config';
import type { CardProps, ButtonProps, InputProps } from 'antd';

// 创建动态样式
const useStyles = createStyles(({ token, css }) => ({
  // 标签样式
  tag: css`
    display: inline-block;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.03), -2px -2px 4px rgba(255, 255, 255, 0.5);
    background: linear-gradient(145deg, rgba(22, 119, 255, 0.05), rgba(22, 119, 255, 0.1));
    color: ${token.colorPrimary};
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.05), -3px -3px 6px rgba(255, 255, 255, 0.7);
    }
  `,
  
  // 徽章样式
  badge: css`
    display: inline-block;
    min-width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 10px;
    padding: 0 6px;
    font-size: 12px;
    font-weight: 600;
    background: linear-gradient(145deg, ${token.colorPrimary}, #4096ff);
    color: white;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  `,
  
  // 警告提示样式
  alert: css`
    border-radius: ${token.borderRadiusLG}px;
    padding: 12px 16px;
    box-shadow: ${themeVariables.neumorphicShadowDark}, ${themeVariables.neumorphicShadowLight};
    border: none;
    
    &.alert-info {
      background: linear-gradient(145deg, rgba(22, 119, 255, 0.05), rgba(22, 119, 255, 0.1));
      color: ${token.colorPrimary};
    }
    
    &.alert-success {
      background: linear-gradient(145deg, rgba(82, 196, 26, 0.05), rgba(82, 196, 26, 0.1));
      color: ${token.colorSuccess};
    }
    
    &.alert-warning {
      background: linear-gradient(145deg, rgba(250, 173, 20, 0.05), rgba(250, 173, 20, 0.1));
      color: ${token.colorWarning};
    }
    
    &.alert-error {
      background: linear-gradient(145deg, rgba(255, 77, 79, 0.05), rgba(255, 77, 79, 0.1));
      color: ${token.colorError};
    }
  `,
  
  // 博物馆级展示样式
  museumSection: css`
    padding: calc(var(--grid-base) * 5) calc(var(--grid-base) * 3);
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: calc(var(--grid-base) * 2);
  `,
  museumHeading: css`
    font-family: var(--font-family);
    font-weight: var(--museum-font-weight-bold, 700);
    font-size: 32px;
    letter-spacing: -0.01em;
    line-height: 1.2;
    margin-bottom: calc(var(--grid-base, 12px) * 3);
    color: var(--color-museum-neutral-900, rgba(0, 0, 0, 0.85));
  `,
  museumSubheading: css`
    font-family: var(--font-family);
    font-weight: 600;
    font-size: 24px;
    letter-spacing: -0.01em;
    line-height: 1.2;
    margin-bottom: calc(var(--grid-base, 12px) * 2);
    color: var(--color-museum-neutral-800, rgba(0, 0, 0, 0.75));
  `,
  museumBody: css`
    font-family: var(--font-family);
    font-size: 16px;
    letter-spacing: var(--museum-letter-spacing-body, 0.02em);
    line-height: 1.8;
    margin-bottom: calc(var(--grid-base, 12px) * 2);
    color: var(--color-museum-neutral-800, rgba(0, 0, 0, 0.75));
  `,
  museumCard: css`
    background: var(--color-museum-neutral-100, white);
    border-radius: calc(var(--grid-base, 12px) / 2);
    padding: calc(var(--grid-base, 12px) * 3);
    box-shadow: ${themeVariables.neumorphicShadowDark}, ${themeVariables.neumorphicShadowLight};
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100%;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 12px 12px 20px rgba(0, 0, 0, 0.08), -12px -12px 20px rgba(255, 255, 255, 0.9);
    }
  `,
}));

// 卡片组件
export const Card: React.FC<CardProps> = (props) => {
  return <NeumorphicCard {...props} />;
};

// 按钮组件
export const Button: React.FC<ButtonProps> = (props) => {
  return <NeumorphicButton {...props} />;
};

// 输入框组件
export const Input: React.FC<InputProps> = (props) => {
  return <MaterialInput {...props} />;
};

// 自定义标签组件
export interface TagProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Tag: React.FC<TagProps> = ({ 
  children, 
  color = 'blue',
  onClick,
  className,
  style,
}) => {
  const { styles, cx } = useStyles();
  
  const colorMap = {
    blue: 'rgba(22, 119, 255, 0.1)',
    green: 'rgba(82, 196, 26, 0.1)',
    red: 'rgba(255, 77, 79, 0.1)',
    orange: 'rgba(250, 173, 20, 0.1)',
    purple: 'rgba(114, 46, 209, 0.1)',
  };
  
  const textColorMap = {
    blue: '#1677ff',
    green: '#52c41a',
    red: '#ff4d4f',
    orange: '#faad14',
    purple: '#722ed1',
  };
  
  return (
    <span 
      className={cx(styles.tag, className)}
      style={{ 
        background: colorMap[color], 
        color: textColorMap[color],
        ...style 
      }}
      onClick={onClick}
    >
      {children}
    </span>
  );
};

// 徽章组件
export interface BadgeProps {
  count: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ 
  count, 
  className,
  style,
}) => {
  const { styles, cx } = useStyles();
  
  return (
    <span 
      className={cx(styles.badge, className)}
      style={style}
    >
      {count}
    </span>
  );
};

// 警告提示组件
export interface AlertProps {
  message: React.ReactNode;
  description?: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
  style?: React.CSSProperties;
}

export const Alert: React.FC<AlertProps> = ({
  message,
  description,
  type = 'info',
  className,
  style,
}) => {
  const { styles, cx } = useStyles();
  
  return (
    <div 
      className={cx(styles.alert, `alert-${type}`, className)}
      style={style}
    >
      <div style={{ fontWeight: 500 }}>{message}</div>
      {description && <div style={{ marginTop: 8 }}>{description}</div>}
    </div>
  );
};

// 博物馆级组件 - 小节组件
export interface MuseumSectionProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const MuseumSection: React.FC<MuseumSectionProps> = ({
  children,
  className,
  style,
}) => {
  const { styles, cx } = useStyles();
  
  return (
    <section 
      className={cx(styles.museumSection, className)}
      style={style}
    >
      {children}
    </section>
  );
};

// 博物馆级组件 - 标题组件
export interface MuseumHeadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const MuseumHeading: React.FC<MuseumHeadingProps> = ({
  children,
  className,
  style,
}) => {
  const { styles, cx } = useStyles();
  
  return (
    <h1 
      className={cx(styles.museumHeading, className)}
      style={style}
    >
      {children}
    </h1>
  );
};

// 博物馆级组件 - 副标题组件
export interface MuseumSubheadingProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const MuseumSubheading: React.FC<MuseumSubheadingProps> = ({
  children,
  className,
  style,
}) => {
  const { styles, cx } = useStyles();
  
  return (
    <h2 
      className={cx(styles.museumSubheading, className)}
      style={style}
    >
      {children}
    </h2>
  );
};

// 博物馆级组件 - 正文组件
export interface MuseumBodyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const MuseumBody: React.FC<MuseumBodyProps> = ({
  children,
  className,
  style,
}) => {
  const { styles, cx } = useStyles();
  
  return (
    <p 
      className={cx(styles.museumBody, className)}
      style={style}
    >
      {children}
    </p>
  );
};

// 博物馆级组件 - 卡片组件
export interface MuseumCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const MuseumCard: React.FC<MuseumCardProps> = ({
  children,
  className,
  style,
}) => {
  const { styles, cx } = useStyles();
  
  return (
    <div 
      className={cx(styles.museumCard, className)}
      style={style}
    >
      {children}
    </div>
  );
};

// 重新导出所有组件
export { default as NeumorphicCard } from '../NeumorphicCard';
export { default as NeumorphicButton } from '../NeumorphicButton';
export { default as MaterialInput } from '../MaterialInput';
export { default as MaterialDesignDemo } from '../MaterialDesignDemo'; 