import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { MaterialDesignDemo } from '@/components';
import { Row, Col, Tabs, Typography, Divider } from 'antd';
import {
  MuseumSection,
  MuseumHeading,
  MuseumSubheading,
  MuseumBody,
  MuseumCard
} from '@/components/MaterialComponents';

const { TabPane } = Tabs;
const { Title } = Typography;

// 模拟animated组件
const Animated = ({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) => {
  return (
    <div 
      className="appear-transition" 
      style={{
        ...style,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {children}
    </div>
  );
};

const DesignSystemPage: React.FC = () => {
  const [activeExhibit, setActiveExhibit] = useState(0);

  // 博物馆展示项目
  const exhibits = [
    {
      title: '古希腊陶器',
      description: '公元前5世纪的希腊陶器，精美的红色图案描绘了奥林匹斯山众神的故事。',
      image: 'https://via.placeholder.com/400x300/3E7BFA/FFFFFF?text=Greek+Pottery'
    },
    {
      title: '文艺复兴时期肖像画',
      description: '15世纪佛罗伦萨画派的代表作品，展现了当时贵族的精致服饰与神态。',
      image: 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Renaissance+Portrait'
    },
    {
      title: '现代主义雕塑',
      description: '20世纪初期的抽象雕塑作品，探索了形式与空间的新关系。',
      image: 'https://via.placeholder.com/400x300/FF7043/FFFFFF?text=Modern+Sculpture'
    }
  ];

  // 使用CSS过渡替代react-spring
  const getExhibitStyle = (index: number): React.CSSProperties => ({
    transform: activeExhibit === index ? 'scale(1.05)' : 'scale(1)',
    boxShadow: activeExhibit === index 
      ? '0 24px 38px rgba(0,0,0,0.14), 0 9px 46px rgba(0,0,0,0.12)'
      : '8px 8px 12px rgba(0, 0, 0, 0.08), -8px -8px 12px rgba(255, 255, 255, 0.8)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: 'calc(var(--grid-base, 12px) / 2)',
    overflow: 'hidden',
    cursor: 'pointer',
    transformOrigin: 'center center',
  });

  return (
    <PageContainer
      header={{
        title: '设计系统展示',
        subTitle: 'Material You + 新拟态设计美学',
      }}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Material You 设计" key="1">
          <MaterialDesignDemo />
        </TabPane>
        <TabPane tab="博物馆级展示效果" key="2">
          <Animated style={{
            transformOrigin: 'center center'
          }}>
            <MuseumSection>
              <div style={{ gridColumn: 'span 12', marginBottom: 'var(--space-md, 36px)' }}>
                <MuseumHeading>博物馆级展示系统</MuseumHeading>
                <MuseumBody>
                  采用12px基线网格对齐与斐波那契比例留白，打造出典雅、精致的展示效果。
                  基于HSL的5阶动态色板，包含3%的灰度偏移，确保色彩平衡与和谐。
                  配合700字重的主标题与0.02em字距的正文，创造出富有韵律感的视觉层次。
                </MuseumBody>
              </div>
              
              <div style={{ gridColumn: 'span 12', marginBottom: 'var(--space-md, 36px)' }}>
                <MuseumSubheading>12px基线网格 + 斐波那契比例</MuseumSubheading>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(13, 1fr)', 
                  gridGap: 'var(--space-xs, 12px)',
                  marginBottom: 'var(--space-lg, 60px)'
                }}>
                  {[1, 2, 3, 5, 8, 13].map((size, index) => (
                    <div 
                      key={index}
                      style={{ 
                        gridColumn: `span ${size}`,
                        height: `${size * 12}px`,
                        background: `var(--color-primary-${(index + 3) * 100}, rgb(22, 119, 255, ${0.1 * (index + 1)}))`,
                        borderRadius: 'var(--border-radius-base, 6px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: index > 3 ? 'white' : 'inherit'
                      }}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ gridColumn: 'span 12', marginBottom: 'var(--space-md, 36px)' }}>
                <MuseumSubheading>HSL 5阶动态色板 + 3%灰度偏移</MuseumSubheading>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(9, 1fr)', 
                  gridGap: 'var(--space-xs, 12px)',
                  marginBottom: 'var(--space-md, 36px)'
                }}>
                  {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((level, index) => (
                    <div 
                      key={index}
                      style={{ 
                        gridColumn: 'span 1',
                        height: '48px',
                        background: `var(--color-museum-${level}, hsl(216, 80%, ${90 - index * 10}%))`,
                        borderRadius: 'var(--border-radius-base, 6px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: index > 4 ? 'white' : 'inherit',
                        fontSize: '12px'
                      }}
                    >
                      {level}
                    </div>
                  ))}
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(9, 1fr)', 
                  gridGap: 'var(--space-xs, 12px)',
                  marginBottom: 'var(--space-lg, 60px)'
                }}>
                  {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((level, index) => (
                    <div 
                      key={index}
                      style={{ 
                        gridColumn: 'span 1',
                        height: '48px',
                        background: `var(--color-museum-neutral-${level}, hsl(216, ${5 - Math.min(5, index) * 0.5}%, ${97 - index * 10}%))`,
                        borderRadius: 'var(--border-radius-base, 6px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: index > 5 ? 'white' : 'inherit',
                        fontSize: '12px'
                      }}
                    >
                      N{level}
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ gridColumn: 'span 12', marginBottom: 'var(--space-xl, 96px)' }}>
                <MuseumSubheading>展品卡片演示（使用CSS过渡效果实现状态迁移）</MuseumSubheading>
                <Row gutter={[24, 24]}>
                  {exhibits.map((exhibit, index) => (
                    <Col span={8} key={index}>
                      <div 
                        style={getExhibitStyle(index)}
                        onClick={() => setActiveExhibit(index)}
                      >
                        <div style={{
                          background: `url(${exhibit.image}) no-repeat center center`,
                          backgroundSize: 'cover',
                          height: '200px'
                        }} />
                        <div style={{ padding: 'calc(var(--grid-base, 12px) * 2)' }}>
                          <h3 style={{ 
                            fontWeight: 'var(--museum-font-weight-bold, 700)',
                            marginBottom: 'calc(var(--grid-base, 12px) * 1)',
                            fontSize: '20px',
                            letterSpacing: 'var(--museum-letter-spacing-tight, -0.01em)'
                          }}>
                            {exhibit.title}
                          </h3>
                          <p style={{ 
                            letterSpacing: 'var(--museum-letter-spacing-body, 0.02em)',
                            lineHeight: 'var(--museum-line-height-relaxed, 1.8)',
                            margin: 0
                          }}>
                            {exhibit.description}
                          </p>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </MuseumSection>
          </Animated>
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default DesignSystemPage; 