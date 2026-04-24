import React from 'react';
import { Typography, Space, Divider, Breadcrumb, Tag } from 'antd';
import classNames from 'classnames';
import { FadeInText } from '@/components/MotionComponents';
import './style.less';

const { Title, Text } = Typography;

export type PageHeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  extra?: React.ReactNode;
  breadcrumb?: React.ReactNode[];
  className?: string;
  style?: React.CSSProperties;
  divider?: boolean;
  tags?: { text: string; color?: string }[];
  icon?: React.ReactNode;
};

/**
 * 增强版页面标题组件
 * 提供现代化的页面标题展示风格和动画效果
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  extra,
  breadcrumb,
  className,
  style,
  divider = true,
  tags,
  icon,
}) => {
  return (
    <div className={classNames('custom-page-header', className)} style={style}>
      <FadeInText delay={0.1}>
        {breadcrumb && breadcrumb.length > 0 && (
          <Breadcrumb className="custom-page-header-breadcrumb">
            {breadcrumb.map((item, index) => (
              <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
        )}
        
        <div className="custom-page-header-main">
          <div className="custom-page-header-content">
            <div className="custom-page-header-title-wrapper">
              {icon && <div className="custom-page-header-icon">{icon}</div>}
              <Title level={4} className="custom-page-header-title">
                {title}
              </Title>
              {tags && tags.length > 0 && (
                <Space className="custom-page-header-tags" size={8}>
                  {tags.map((tag, index) => (
                    <Tag key={index} color={tag.color || 'blue'} className="header-tag">
                      {tag.text}
                    </Tag>
                  ))}
                </Space>
              )}
            </div>
            
            {subtitle && (
              <Text type="secondary" className="custom-page-header-subtitle">
                {subtitle}
              </Text>
            )}
          </div>
          
          {extra && (
            <div className="custom-page-header-extra">
              {extra}
            </div>
          )}
        </div>
        
        {divider && <Divider className="custom-page-header-divider" />}
      </FadeInText>
    </div>
  );
};

export default PageHeader; 