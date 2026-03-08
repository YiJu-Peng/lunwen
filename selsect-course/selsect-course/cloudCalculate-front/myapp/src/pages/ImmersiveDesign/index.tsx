import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Space, 
  Divider, 
  Switch, 
  Tabs,
  Button,
  theme
} from 'antd';
import { ImmersiveExhibitList } from '@/components/ImmersiveExhibit';
import { 
  MotionCard, 
  MotionButton, 
  MotionTabs, 
  TactileButton,
  TransitionPageContainer
} from '@/components/MotionComponents';
import { 
  RocketOutlined, 
  ExperimentOutlined, 
  ThunderboltOutlined, 
  StarOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;

const designSystemExhibits = [
  {
    title: '神经拟态设计',
    subtitle: '融合物理世界的交互模式',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
    description: '神经拟态设计通过模拟物理世界的阴影、光线和深度，创造出具有立体感的界面。这种设计风格强调自然的交互方式，让用户在数字空间中获得类似现实世界的体验。'
  },
  {
    title: '微交互反馈',
    subtitle: '精细动画提升用户体验',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb',
    description: '微交互是数字产品中的细微动画和反馈，它们对用户交互做出即时响应。这些细小但有意义的动画能显著提高用户体验，让界面更具生命力和响应性。'
  },
  {
    title: '流体界面设计',
    subtitle: '平滑过渡的视觉体验',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
    description: '流体界面设计强调内容之间的自然过渡，元素如水一般流动。这种设计理念创造出更为连贯、自然的用户体验，减少用户的认知负担，让信息传递更加直观。'
  },
  {
    title: '空间交互模型',
    subtitle: '三维层次的界面构建',
    image: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2',
    description: '空间交互模型将界面视为三维空间中的层次结构，创造出深度和层级感。这种设计方法可以更好地组织复杂信息，并使用户更直观地理解界面结构。'
  },
  {
    title: '触觉反馈系统',
    subtitle: '多感官的交互体验',
    image: 'https://images.unsplash.com/photo-1595675024853-0f3ec9098ac7',
    description: '触觉反馈系统通过振动、压力或质感变化等方式，为数字交互提供物理感受。这种多感官反馈可以增强用户与界面之间的连接，创造更加沉浸式的体验。'
  },
  {
    title: '动态色彩系统',
    subtitle: '随环境变化的色彩适应',
    image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c32a',
    description: '动态色彩系统根据时间、环境光线或用户偏好自动调整界面色彩。这种自适应的色彩变化不仅提高了视觉舒适度，还能增强内容的可读性和界面的美观性。'
  },
  {
    title: '声音设计语言',
    subtitle: '听觉维度的界面元素',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
    description: '声音设计语言通过精心设计的音效和音乐，为界面交互增添听觉维度。恰当的声音反馈可以增强用户对操作的感知，使整个体验更加完整和沉浸。'
  },
  {
    title: '自适应布局系统',
    subtitle: '智能响应多种设备场景',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e',
    description: '自适应布局系统能够智能地根据设备尺寸、方向和环境条件调整界面布局。这种设计系统确保用户在任何设备和情境下都能获得最佳的视觉体验和功能性。'
  }
];

// 演示组件区域
interface DemoSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const DemoSection: React.FC<DemoSectionProps> = ({ 
  title, 
  description, 
  children 
}) => {
  const { token } = useToken();
  
  return (
    <Card 
      title={
        <Title level={4} style={{ margin: 0 }}>{title}</Title>
      }
      extra={
        <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
          {description}
        </Text>
      }
      bordered={false}
      style={{ 
        borderRadius: token.borderRadiusLG,
        boxShadow: 'var(--neumorphic-shadow-light), var(--neumorphic-shadow-dark)'
      }}
    >
      {children}
    </Card>
  );
};

// 沉浸式设计系统页面
const ImmersiveDesignPage: React.FC = () => {
  const { token } = useToken();
  const [tactileFeedback, setTactileFeedback] = useState(true);
  
  // 模拟页面准备状态
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // 模拟页面加载
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Tab项定义
  const tabItems = [
    {
      key: '1',
      label: '展品展示',
      icon: <StarOutlined />,
      children: (
        <ImmersiveExhibitList exhibits={designSystemExhibits} />
      )
    },
    {
      key: '2',
      label: '交互组件',
      icon: <ThunderboltOutlined />,
      children: (
        <Row gutter={[24, 24]}>
          <Col span={24} md={12}>
            <DemoSection title="动态卡片" description="悬停时的微妙动画效果">
              <MotionCard 
                hoverable 
                title="带有动效的卡片" 
                bordered={false}
                style={{ width: '100%' }}
              >
                <Paragraph>
                  这个卡片组件融合了微妙的动画效果，当用户与之交互时，它会做出自然的响应，增强界面的生动性和用户体验。
                </Paragraph>
                <MotionButton type="primary">
                  交互按钮
                </MotionButton>
              </MotionCard>
            </DemoSection>
          </Col>
          
          <Col span={24} md={12}>
            <DemoSection title="触觉反馈按钮" description="点击时提供触觉反馈">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space wrap>
                  <TactileButton 
                    type="primary" 
                    size="large"
                    disabled={!tactileFeedback}
                    intensity="medium"
                  >
                    主要按钮
                  </TactileButton>
                  <TactileButton 
                    type="default" 
                    size="large"
                    disabled={!tactileFeedback}
                    intensity="light"
                  >
                    默认按钮
                  </TactileButton>
                  <TactileButton 
                    type="dashed" 
                    size="large"
                    disabled={!tactileFeedback}
                    intensity="light"
                  >
                    虚线按钮
                  </TactileButton>
                </Space>
                
                <Divider orientation="left" plain>
                  触觉反馈设置
                </Divider>
                
                <Space>
                  <Switch 
                    checked={tactileFeedback} 
                    onChange={setTactileFeedback} 
                  />
                  <Text>
                    {tactileFeedback ? '触觉反馈已开启' : '触觉反馈已关闭'}
                  </Text>
                </Space>
              </Space>
            </DemoSection>
          </Col>
          
          <Col span={24}>
            <DemoSection title="动态标签页" description="标签切换时的流畅过渡">
              <MotionTabs
                defaultActiveKey="1"
                items={[
                  {
                    key: '1',
                    label: (
                      <span>
                        <RocketOutlined />
                        快速开始
                      </span>
                    ),
                    children: (
                      <div style={{ padding: token.padding }}>
                        <Title level={4}>快速开始使用我们的设计系统</Title>
                        <Paragraph>
                          我们的设计系统提供了丰富的组件和交互模式，帮助您快速构建具有沉浸式体验的应用界面。
                          从这里开始，您可以了解基本的设计原则和组件使用方法。
                        </Paragraph>
                        <MotionButton type="primary" icon={<RocketOutlined />}>
                          开始使用
                        </MotionButton>
                      </div>
                    )
                  },
                  {
                    key: '2',
                    label: (
                      <span>
                        <ExperimentOutlined />
                        进阶技术
                      </span>
                    ),
                    children: (
                      <div style={{ padding: token.padding }}>
                        <Title level={4}>探索沉浸式交互的进阶技术</Title>
                        <Paragraph>
                          沉浸式交互设计涉及多种感官体验的整合，包括视觉、听觉和触觉反馈。
                          了解如何将这些元素融合，创造出更具吸引力的用户体验。
                        </Paragraph>
                        <MotionButton type="default" icon={<ExperimentOutlined />}>
                          探索更多
                        </MotionButton>
                      </div>
                    )
                  }
                ]}
              />
            </DemoSection>
          </Col>
        </Row>
      )
    }
  ];
  
  return (
    <TransitionPageContainer isLoading={isLoading}>
      <PageContainer
        header={{
          title: '沉浸式交互设计系统',
          subTitle: '探索未来界面设计的无限可能',
          ghost: true
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <MotionCard>
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} md={16}>
                <Title level={3}>设计系统博物馆</Title>
                <Paragraph>
                  欢迎来到设计系统博物馆，这里展示了各种先进的界面设计概念和交互模式。
                  通过沉浸式的展示方式，您可以直观地体验这些设计理念如何提升用户体验。
                  探索各个展品，感受未来界面设计的无限可能。
                </Paragraph>
              </Col>
              <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                <MotionButton 
                  type="primary" 
                  size="large" 
                  icon={<RocketOutlined />}
                  style={{ height: 50, borderRadius: 25, padding: '0 32px' }}
                >
                  开始探索之旅
                </MotionButton>
              </Col>
            </Row>
          </MotionCard>
          
          <MotionTabs 
            type="card"
            size="large"
            animated={{ inkBar: true, tabPane: true }}
            items={tabItems}
          />
        </Space>
      </PageContainer>
    </TransitionPageContainer>
  );
};

export default ImmersiveDesignPage; 