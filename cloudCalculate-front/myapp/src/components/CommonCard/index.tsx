import React from 'react';
import { Card, Typography, Space, Badge } from 'antd';
import classNames from 'classnames';
import './style.less';

const { Title, Text } = Typography;

export type CommonCardProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  extra?: React.ReactNode;
  children?: React.ReactNode;
  loading?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  highlight?: boolean;
  status?: 'default' | 'processing' | 'success' | 'error' | 'warning';
  className?: string;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  headStyle?: React.CSSProperties;
  onClick?: () => void;
};

/**
 * 通用卡片组件
 * 提供一致的样式和交互体验
 */
const CommonCard: React.FC<CommonCardProps> = ({
  title,
  subtitle,
  extra,
  children,
  loading,
  bordered = true,
  hoverable = true,
  highlight = false,
  status,
  className,
  style,
  bodyStyle,
  headStyle,
  onClick,
}) => {
  // 渲染状态标记
  const renderStatus = () => {
    if (!status) return null;
    
    const statusColors = {
      default: '#d9d9d9',
      processing: '#1677ff',
      success: '#52c41a',
      error: '#ff4d4f',
      warning: '#faad14',
    };
    
    return (
      <Badge 
        color={statusColors[status]} 
        style={{ marginRight: 8 }} 
      />
    );
  };

  return (
    <Card
      className={classNames('common-card', 
        { 
          'common-card-highlight': highlight,
          'common-card-clickable': onClick,
        }, 
        className
      )}
      style={style}
      bodyStyle={{ padding: '16px 24px', ...bodyStyle }}
      headStyle={headStyle}
      bordered={bordered}
      hoverable={hoverable}
      loading={loading}
      onClick={onClick}
    >
      {(title || subtitle || extra) && (
        <div className="common-card-header">
          <Space direction="vertical" size={4} style={{ flex: 1 }}>
            {title && (
              <Space align="center">
                {renderStatus()}
                <Title level={5} className="common-card-title" style={{ margin: 0 }}>
                  {title}
                </Title>
              </Space>
            )}
            {subtitle && (
              <Text type="secondary" className="common-card-subtitle">
                {subtitle}
              </Text>
            )}
          </Space>
          {extra && <div className="common-card-extra">{extra}</div>}
        </div>
      )}
      <div className="common-card-content appear-transition">
        {children}
      </div>
    </Card>
  );
};

export default CommonCard; 