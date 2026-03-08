import React from 'react';
import { Button } from 'antd';
import { createStyles } from 'antd-style';
import { themeVariables } from '../../theme.config';
import type { ButtonProps } from 'antd';

const useStyles = createStyles(({ token, css }) => ({
  button: css`
    border-radius: ${token.borderRadiusLG}px;
    border: none;
    box-shadow: ${themeVariables.neumorphicShadowDark}, ${themeVariables.neumorphicShadowLight};
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: ${themeVariables.neumorphicShadowDark.replace('8px', '10px')}, ${themeVariables.neumorphicShadowLight.replace('8px', '10px')};
    }
    
    &:active {
      box-shadow: ${themeVariables.neumorphicInsetDark}, ${themeVariables.neumorphicInsetLight};
      transform: translateY(0);
    }
  `,
  primary: css`
    background: linear-gradient(145deg, ${token.colorPrimary}, ${token.colorPrimaryActive});
    color: white;
    
    &:hover {
      background: linear-gradient(145deg, ${token.colorPrimaryHover}, ${token.colorPrimary});
      color: white;
    }
  `,
}));

export interface NeumorphicButtonProps extends ButtonProps {
  className?: string;
}

const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({ 
  className,
  children,
  type,
  ...props 
}) => {
  const { styles, cx } = useStyles();
  
  return (
    <Button
      className={cx(
        styles.button,
        { [styles.primary]: type === 'primary' },
        className
      )}
      type={type}
      {...props}
    >
      {children}
    </Button>
  );
};

export default NeumorphicButton; 