import React from 'react';
import { Space, Typography, Row, Col, Divider } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { 
  ImmersiveGrid, 
  ImmersiveExhibit,
  InteractiveDemo,
  ParallaxContainer
} from '@/components/ImmersiveExhibit';
import { 
  TransitionPageContainer,
  TactileButton,
  MotionCard,
  MotionButton,
  FadeInText
} from '@/components/MotionComponents';

const { Title, Paragraph } = Typography;

// 沉浸式设计展示数据
const exhibitItems = [
  {
    id: '1',
    title: '智能数据分析',
    subtitle: '发现隐藏的数据模式',
    description: '通过AI辅助的数据分析系统，自动识别数据中的模式和异常，提供直观可视化报告。',
    imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    tags: ['数据分析', 'AI', '可视化'],
    size: 'medium',
    importance: 8
  },
  {
    id: '2',
    title: '云计算资源调度',
    subtitle: '高效管理云资源',
    description: '智能调度算法确保云计算资源的高效分配，减少浪费，降低成本，提高运行效率。',
    imageUrl: 'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109382753-8368e7e1e7cf.webp',
    tags: ['云计算', '资源管理', '调度算法'],
    size: 'large',
    importance: 10
  },
  {
    id: '3',
    title: '实时协作平台',
    subtitle: '无缝团队协作',
    description: '支持多用户实时编辑和协作的云平台，内置版本控制和冲突解决机制。',
    imageUrl: 'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
    tags: ['协作', '实时', '团队'],
    size: 'small',
    importance: 7
  },
  {
    id: '4',
    title: '边缘计算节点',
    subtitle: '分布式处理能力',
    description: '边缘计算节点提供本地化的处理能力，减少数据传输延迟，提升用户体验。',
    imageUrl: 'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473186578172-c141e6798cf4.webp',
    tags: ['边缘计算', '低延迟', '分布式'],
    size: 'small',
    importance: 6
  },
  {
    id: '5',
    title: '安全加密系统',
    subtitle: '保护数据安全',
    description: '端到端加密系统确保数据在传输和存储过程中的安全，支持多因素认证和访问控制。',
    imageUrl: 'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109382753-8368e7e1e7cf.webp',
    tags: ['安全', '加密', '隐私保护'],
    size: 'medium',
    importance: 9
  }
];

// 沉浸式演示页面
const ImmersiveDemo: React.FC = () => {
  return (
    <PageContainer
      header={{
        title: '沉浸式交互系统',
        ghost: true,
      }}
    >
      <TransitionPageContainer>
        <ParallaxContainer 
          bgImage="https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg"
          height={400}
          speed={0.3}
        >
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#fff' }}>
            <FadeInText>
              <Title level={1} style={{ color: '#fff', marginBottom: 24 }}>
                探索云计算的沉浸式体验
              </Title>
            </FadeInText>
            
            <FadeInText delay={0.2}>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 18, maxWidth: 700, margin: '0 auto 40px' }}>
                通过先进的交互设计和动效，让复杂的云计算概念变得直观易懂
              </Paragraph>
            </FadeInText>
            
            <Space size="large">
              <TactileButton type="primary" size="large">
                立即体验
              </TactileButton>
              <MotionButton ghost size="large">
                了解更多
              </MotionButton>
            </Space>
          </div>
        </ParallaxContainer>

        <div style={{ padding: '40px 0' }}>
          <Divider orientation="center">
            <Title level={3}>沉浸式设计案例</Title>
          </Divider>
          
          <ImmersiveGrid
            items={exhibitItems}
            description="以下展示了云计算领域的沉浸式设计案例，结合了视觉效果和交互体验，使技术更易于理解和使用。"
          />
        </div>
        
        <div style={{ padding: '40px 0' }}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <InteractiveDemo
                title="触觉反馈演示"
                description="通过触觉反馈增强用户交互体验，使云计算界面更直观、更具响应性。"
              >
                <Space wrap size="large">
                  <TactileButton type="primary" intensity="light">
                    轻度反馈
                  </TactileButton>
                  <TactileButton type="primary" intensity="medium">
                    中度反馈
                  </TactileButton>
                  <TactileButton type="primary" intensity="strong">
                    强度反馈
                  </TactileButton>
                </Space>
              </InteractiveDemo>
            </Col>
            
            <Col xs={24} md={12}>
              <MotionCard title="动效卡片" style={{ height: '100%' }}>
                <Paragraph>
                  基于用户交互的自适应动效，提供更加流畅的操作体验。
                  将鼠标悬停在卡片上可以体验微妙的3D效果。
                </Paragraph>
              </MotionCard>
            </Col>
            
            <Col xs={24} md={12}>
              <MotionCard title="渐进式动画" style={{ height: '100%' }}>
                <Paragraph>
                  信息以渐进方式呈现，减少认知负荷，提高用户对复杂数据的理解能力。
                </Paragraph>
                <FadeInText delay={0.3}>
                  <Paragraph type="secondary">
                    这段文字将在页面加载后延迟显示，创造层次感。
                  </Paragraph>
                </FadeInText>
              </MotionCard>
            </Col>
          </Row>
        </div>
      </TransitionPageContainer>
    </PageContainer>
  );
};

export default ImmersiveDemo; 