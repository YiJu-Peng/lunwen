import React from 'react';
import { Card } from 'antd';
import { createStyles } from 'antd-style';
import { themeVariables } from '../../theme.config';
import type { MouseEventHandler } from 'react';

const useStyles = createStyles(({ token, css }) => ({
  card: css`
    border-radius: ${token.borderRadiusLG}px;
    background: ${token.colorBgContainer};
    box-shadow: ${themeVariables.neumorphicShadowDark}, ${themeVariables.neumorphicShadowLight};
    border: none;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
    
    .ant-card-head {
      border-bottom: none;
    }
  `,
  pressed: css`
    box-shadow: ${themeVariables.neumorphicInsetDark}, ${themeVariables.neumorphicInsetLight};
    transform: translateY(0);
  `,
  highlight: css`
    background: linear-gradient(145deg, ${token.colorBgContainer}, ${token.colorPrimaryBg});
    border: 1px solid ${token.colorPrimaryBorder};
  `,
}));

export interface NeumorphicCardProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  children?: React.ReactNode;
  isPressed?: boolean;
  highlight?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
  [key: string]: any;
}

const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
  isPressed = false,
  highlight = false,
  className,
  children,
  ...props
}) => {
  const { styles, cx } = useStyles();
  
  return (
    <Card 
      className={cx(
        styles.card,
        { 
          [styles.pressed]: isPressed,
          [styles.highlight]: highlight
        },
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};

export default NeumorphicCard; 