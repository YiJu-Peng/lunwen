import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Typography, Space, Row, Col, Divider, Tag } from 'antd';
import { 
  FadeInText,
  MotionCard, 
  MotionButton,
  MotionImage,
  TactileButton
} from '../MotionComponents';
import { motion, useScroll, useTransform } from 'framer-motion';

const { Title, Paragraph, Text } = Typography;

// 展示项类型定义
export interface ExhibitItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
  size?: 'small' | 'medium' | 'large';
  importance?: number; // 1-10, 影响动画优先级
}

// 沉浸式设计展示组件属性
interface ImmersiveExhibitProps {
  item: ExhibitItem;
  index: number;
  isInView?: boolean;
}

// 沉浸式栅格展示列表属性
interface ImmersiveGridProps {
  items: ExhibitItem[];
  title?: string;
  description?: string;
}

// 单个沉浸式展示组件
export const ImmersiveExhibit: React.FC<ImmersiveExhibitProps> = ({
  item,
  index,
  isInView = true
}) => {
  const ref = useRef(null);
  const [hover, setHover] = useState(false);
  
  // 计算基于索引的延迟
  const delay = Math.min(0.1 + index * 0.05, 0.5);
  
  // 确定大小
  const getColSpan = () => {
    switch(item.size) {
      case 'small': return { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 };
      case 'large': return { xs: 24, sm: 24, md: 16, lg: 12, xl: 12 };
      default: return { xs: 24, sm: 12, md: 12, lg: 8, xl: 8 }; // medium
    }
  };
  
  return (
    <Col {...getColSpan()}>
      <MotionCard
        style={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column'
        }}
        cover={item.imageUrl && (
          <MotionImage 
            src={item.imageUrl} 
            alt={item.title}
            style={{ 
              height: item.size === 'large' ? 240 : 180,
              objectFit: 'cover'
            }}
          />
        )}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Card.Meta
          title={
            <FadeInText delay={delay}>
              <Title level={4}>{item.title}</Title>
            </FadeInText>
          }
          description={
            <>
              {item.subtitle && (
                <FadeInText delay={delay + 0.1}>
                  <Text type="secondary">{item.subtitle}</Text>
                </FadeInText>
              )}
              
              <FadeInText delay={delay + 0.2}>
                <Paragraph style={{ marginTop: 16 }}>
                  {item.description}
                </Paragraph>
              </FadeInText>
              
              {item.tags && item.tags.length > 0 && (
                <FadeInText delay={delay + 0.3}>
                  <Space wrap size={[0, 8]} style={{ marginTop: 12 }}>
                    {item.tags.map((tag, idx) => (
                      <Tag key={idx} color={idx % 2 === 0 ? 'blue' : 'cyan'}>
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                </FadeInText>
              )}
            </>
          }
        />
        
        <div style={{ marginTop: 'auto', paddingTop: 16 }}>
          <FadeInText delay={delay + 0.4}>
            <Space>
              <MotionButton type="primary" ghost>
                查看详情
              </MotionButton>
              <TactileButton>
                体验
              </TactileButton>
            </Space>
          </FadeInText>
        </div>
      </MotionCard>
    </Col>
  );
};

// 沉浸式栅格展示组件
export const ImmersiveGrid: React.FC<ImmersiveGridProps> = ({
  items,
  title,
  description
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.98, 1, 1, 0.98]);
  
  return (
    <motion.div
      ref={containerRef}
      style={{
        opacity,
        scale,
      }}
    >
      {(title || description) && (
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          {title && (
            <FadeInText>
              <Title level={2}>{title}</Title>
            </FadeInText>
          )}
          
          {description && (
            <FadeInText delay={0.1}>
              <Paragraph style={{ fontSize: 16, maxWidth: 800, margin: '0 auto' }}>
                {description}
              </Paragraph>
            </FadeInText>
          )}
          
          <Divider style={{ margin: '24px 0' }} />
        </div>
      )}
      
      <Row gutter={[24, 24]}>
        {items.map((item, index) => (
          <ImmersiveExhibit
            key={item.id}
            item={item}
            index={index}
          />
        ))}
      </Row>
    </motion.div>
  );
};

// 交互式演示组件
interface InteractiveDemoProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const InteractiveDemo: React.FC<InteractiveDemoProps> = ({
  title,
  description,
  children
}) => {
  return (
    <MotionCard 
      style={{ marginBottom: 24 }}
    >
      <Title level={4}>{title}</Title>
      {description && (
        <Paragraph style={{ marginBottom: 24 }}>
          {description}
        </Paragraph>
      )}
      <Divider style={{ margin: '16px 0' }} />
      <div style={{ padding: '24px 0' }}>
        {children}
      </div>
    </MotionCard>
  );
};

// 视差滚动容器
interface ParallaxContainerProps {
  children: React.ReactNode;
  bgImage?: string;
  speed?: number; // 速度系数 0-1
  height?: number | string;
}

export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  bgImage,
  speed = 0.5,
  height = 400
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);
  
  return (
    <motion.div
      ref={containerRef}
      style={{
        position: 'relative',
        height,
        overflow: 'hidden',
        borderRadius: 8,
        margin: '32px 0',
      }}
    >
      {bgImage && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            y,
            zIndex: 0,
          }}
        />
      )}
      
      <div 
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
          background: bgImage ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

// 适配组件：接收exhibits数组并将其转换为符合ExhibitItem格式的数据
export interface ExhibitsListProps {
  exhibits: Array<{
    title: string;
    subtitle?: string;
    description: string;
    image?: string;
    tags?: string[];
  }>;
}

export const ImmersiveExhibitList: React.FC<ExhibitsListProps> = ({ exhibits }) => {
  // 将exhibits转换为ExhibitItem格式
  const items: ExhibitItem[] = exhibits.map((exhibit, idx) => ({
    id: `exhibit-${idx}`,
    title: exhibit.title,
    subtitle: exhibit.subtitle,
    description: exhibit.description,
    imageUrl: exhibit.image,
    tags: exhibit.tags,
    size: (idx % 3 === 0) ? 'large' : (idx % 5 === 0) ? 'small' : 'medium',
    importance: Math.floor(Math.random() * 10) + 1
  }));
  
  return <ImmersiveGrid items={items} />;
};

// 默认导出
export default {
  ImmersiveExhibit,
  ImmersiveGrid,
  InteractiveDemo,
  ParallaxContainer,
  ImmersiveExhibitList
}; 