import React, { useEffect, useState } from 'react';
import { Card, Spin, BackTop } from 'antd';
import classNames from 'classnames';
import PageHeader, { PageHeaderProps } from '../PageHeader';
import { TransitionPageContainer } from '@/components/MotionComponents';
import './style.less';

export interface PageContainerProps extends Omit<PageHeaderProps, 'className'> {
  loading?: boolean;
  className?: string;
  contentClassName?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  transparent?: boolean;
  bordered?: boolean;
  headerStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  animation?: 'fade' | 'slide' | 'zoom' | 'none';
  background?: string;
}

/**
 * 增强版页面容器组件
 * 提供统一的页面布局结构和动画效果
 */
const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  extra,
  breadcrumb,
  loading = false,
  children,
  footer,
  className,
  contentClassName,
  transparent = false,
  bordered = true,
  headerStyle,
  contentStyle,
  divider = true,
  animation = 'fade',
  background,
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const headerProps = {
    title,
    subtitle,
    extra,
    breadcrumb,
    divider,
    style: headerStyle,
  };

  const containerStyle: React.CSSProperties = {
    backgroundImage: background ? `url(${background})` : undefined,
    backgroundSize: background ? 'cover' : undefined,
    backgroundPosition: background ? 'center' : undefined,
    ...contentStyle,
  };

  // 根据不同动画类型添加不同的动画类
  const animationClass = animation !== 'none' ? `animation-${animation}` : '';

  const content = (
    <div className={classNames('custom-page-container', className)}>
      <PageHeader {...headerProps} />
      
      <Spin spinning={loading}>
        <div 
          className={classNames(
            'custom-page-container-content',
            { 'custom-page-container-content-transparent': transparent },
            contentClassName,
            animationClass,
            { 'mounted': mounted }
          )}
          style={containerStyle}
        >
          {transparent ? (
            <div className="custom-transparent-content">{children}</div>
          ) : (
            <Card
              bordered={bordered}
              bodyStyle={{ padding: 24 }}
              className="custom-page-container-card"
            >
              {children}
            </Card>
          )}
        </div>
      </Spin>
      
      {footer && (
        <div className="custom-page-container-footer">
          {footer}
        </div>
      )}
      
      <BackTop visibilityHeight={300} />
    </div>
  );

  // 使用动画容器包装内容
  return <TransitionPageContainer isLoading={loading}>{content}</TransitionPageContainer>;
};

export default PageContainer; 