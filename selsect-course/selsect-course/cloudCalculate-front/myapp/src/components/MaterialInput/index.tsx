import React, { useState } from 'react';
import { Input } from 'antd';
import { createStyles } from 'antd-style';
import { themeVariables } from '../../theme.config';
import type { InputProps } from 'antd';

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    position: relative;
    margin-bottom: 24px;
  `,
  input: css`
    border-radius: ${token.borderRadiusLG}px;
    border: none;
    background: ${token.colorBgContainer};
    box-shadow: ${themeVariables.neumorphicInsetDark}, ${themeVariables.neumorphicInsetLight};
    padding: 12px 16px;
    transition: all 0.3s ease;
    
    &:focus, &:hover {
      box-shadow: ${themeVariables.neumorphicInsetDark.replace('4px', '6px')}, ${themeVariables.neumorphicInsetLight.replace('4px', '6px')};
    }
  `,
  label: css`
    position: absolute;
    left: 16px;
    color: ${token.colorTextSecondary};
    transition: all 0.3s ease;
    pointer-events: none;
    font-size: 14px;
  `,
  focusedLabel: css`
    transform: translateY(-24px) scale(0.85);
    transform-origin: left top;
    color: ${token.colorPrimary};
  `,
  filledLabel: css`
    transform: translateY(-24px) scale(0.85);
    transform-origin: left top;
  `,
  focused: css`
    border-color: ${token.colorPrimary};
  `,
}));

export interface MaterialInputProps extends Omit<InputProps, 'label'> {
  label?: React.ReactNode;
  className?: string;
}

const MaterialInput: React.FC<MaterialInputProps> = ({ 
  label,
  className,
  value,
  defaultValue,
  onChange,
  ...props 
}) => {
  const { styles, cx } = useStyles();
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value || defaultValue || '');
  
  const handleFocus = () => {
    setFocused(true);
  };
  
  const handleBlur = () => {
    setFocused(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange?.(e);
  };
  
  const isLabelFloating = focused || inputValue !== '';
  
  return (
    <div className={styles.container}>
      {label && (
        <div 
          className={cx(
            styles.label,
            { 
              [styles.focusedLabel]: focused,
              [styles.filledLabel]: !focused && inputValue !== ''
            }
          )}
        >
          {label}
        </div>
      )}
      <Input
        className={cx(
          styles.input,
          { [styles.focused]: focused },
          className
        )}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </div>
  );
};

export default MaterialInput; 