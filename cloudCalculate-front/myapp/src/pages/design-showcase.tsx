import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography, Space, Row, Col, Divider, Radio, Input } from 'antd';
import { 
  MotionButton, 
  MotionCard, 
  MotionTabs, 
  TactileButton, 
  MotionImage, 
  FadeInText,
  TransitionPageContainer
} from '@/components/MotionComponents';
import DataVisualization, { DataItem } from '@/components/DataVisualization';
import MaterialToast from '@/components/MaterialToast';
import './design-showcase.less';

const { Title, Paragraph, Text } = Typography;

const DesignShowcase: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('1');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const demoData: DataItem[] = [
    { label: '类别A', value: 76, color: '#1890ff' },
    { label: '类别B', value: 52, color: '#52c41a' },
    { label: '类别C', value: 38, color: '#faad14' },
    { label: '类别D', value: 64, color: '#f5222d' },
    { label: '类别E', value: 45, color: '#722ed1' },
  ];
  
  const showToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: '操作成功完成！',
      error: '操作失败，请重试。',
      warning: '请注意，这是一个警告消息。',
      info: '这是一条信息通知。'
    };
    
    MaterialToast[type](messages[type], { particles: true });
  };
  
  return (
    <PageContainer
      header={{
        title: <Title level={2}>设计组件展示</Title>,
        subTitle: '探索系统中的交互设计组件',
        ghost: true,
      }}
    >
      <div className="theme-switch">
        <Radio.Group 
          value={theme} 
          onChange={(e) => setTheme(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="light">亮色主题</Radio.Button>
          <Radio.Button value="dark">暗色主题</Radio.Button>
        </Radio.Group>
      </div>
      
      <MotionTabs
        activeKey={selectedTab}
        onChange={setSelectedTab}
        items={[
          {
            key: '1',
            label: '按钮组件',
            children: (
              <Card className="showcase-card">
                <Title level={3}>按钮组件</Title>
                <Paragraph>
                  这些按钮组件提供了丰富的触觉反馈和视觉效果，增强用户交互体验。
                </Paragraph>
                
                <Divider orientation="left">标准按钮</Divider>
                <Space size="large" wrap>
                  <MotionButton type="primary">主要按钮</MotionButton>
                  <MotionButton>默认按钮</MotionButton>
                  <MotionButton type="dashed">虚线按钮</MotionButton>
                  <MotionButton type="text">文本按钮</MotionButton>
                  <MotionButton type="link">链接按钮</MotionButton>
                </Space>
                
                <Divider orientation="left">触觉反馈按钮</Divider>
                <Space size="large" wrap>
                  <TactileButton type="primary" intensity="light">轻度反馈</TactileButton>
                  <TactileButton type="primary" intensity="medium">中度反馈</TactileButton>
                  <TactileButton type="primary" intensity="strong">强烈反馈</TactileButton>
                </Space>
                
                <Divider orientation="left">通知提示</Divider>
                <Space size="large" wrap>
                  <TactileButton onClick={() => showToast('success')}>成功提示</TactileButton>
                  <TactileButton onClick={() => showToast('error')}>错误提示</TactileButton>
                  <TactileButton onClick={() => showToast('warning')}>警告提示</TactileButton>
                  <TactileButton onClick={() => showToast('info')}>信息提示</TactileButton>
                </Space>
              </Card>
            ),
          },
          {
            key: '2',
            label: '卡片组件',
            children: (
              <Card className="showcase-card">
                <Title level={3}>卡片组件</Title>
                <Paragraph>
                  卡片组件提供了3D悬停效果，让界面更加生动。
                </Paragraph>
                
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={8}>
                    <MotionCard title="基础卡片" bordered>
                      <Paragraph>这是一个基础卡片示例，悬停时会有3D效果。</Paragraph>
                    </MotionCard>
                  </Col>
                  <Col xs={24} md={8}>
                    <MotionCard title="信息卡片" bordered>
                      <Paragraph>鼠标在卡片上移动时，卡片会根据鼠标位置倾斜。</Paragraph>
                    </MotionCard>
                  </Col>
                  <Col xs={24} md={8}>
                    <MotionCard title="功能卡片" bordered>
                      <Paragraph>这种效果增强了界面的立体感和交互性。</Paragraph>
                    </MotionCard>
                  </Col>
                </Row>
              </Card>
            ),
          },
          {
            key: '3',
            label: '文本动画',
            children: (
              <Card className="showcase-card">
                <Title level={3}>文本动画组件</Title>
                <Paragraph>
                  文本组件支持渐入动画效果，使内容展示更加生动。
                </Paragraph>
                
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <FadeInText>
                    <Title level={4}>标题渐入效果</Title>
                  </FadeInText>
                  
                  <FadeInText delay={0.2}>
                    <Paragraph>
                      这是一段带有渐入动画的段落文本。动画使内容展示更加生动，吸引用户注意力。
                    </Paragraph>
                  </FadeInText>
                  
                  <FadeInText delay={0.4}>
                    <Paragraph>
                      这段文本有更长的延迟，创造出内容逐步显示的效果，增强阅读体验。
                    </Paragraph>
                  </FadeInText>
                  
                  <Row gutter={[24, 24]}>
                    <Col span={8}>
                      <FadeInText delay={0.6}>
                        <Card>第一个信息卡片</Card>
                      </FadeInText>
                    </Col>
                    <Col span={8}>
                      <FadeInText delay={0.8}>
                        <Card>第二个信息卡片</Card>
                      </FadeInText>
                    </Col>
                    <Col span={8}>
                      <FadeInText delay={1.0}>
                        <Card>第三个信息卡片</Card>
                      </FadeInText>
                    </Col>
                  </Row>
                </Space>
              </Card>
            ),
          },
          {
            key: '4',
            label: '数据可视化',
            children: (
              <Card className="showcase-card">
                <Title level={3}>数据可视化组件</Title>
                <Paragraph>
                  强大的3D数据可视化组件，支持亮色和暗色主题。
                </Paragraph>
                
                <DataVisualization 
                  data={demoData} 
                  height={400}
                  theme={theme}
                  title="示例数据展示"
                  description="展示各类别的数值分布情况，支持3D旋转查看"
                />
              </Card>
            ),
          },
          {
            key: '5',
            label: '图片组件',
            children: (
              <Card className="showcase-card">
                <Title level={3}>图片动画组件</Title>
                <Paragraph>
                  图片组件支持多种悬停效果，增强视觉体验。
                </Paragraph>
                
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Card title="缩放效果">
                      <MotionImage 
                        src="/assets/images/sample1.jpg" 
                        alt="示例图片1"
                        hoverEffect="zoom"
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="提升效果">
                      <MotionImage 
                        src="/assets/images/sample2.jpg" 
                        alt="示例图片2"
                        hoverEffect="lift"
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="发光效果">
                      <MotionImage 
                        src="/assets/images/sample3.jpg" 
                        alt="示例图片3"
                        hoverEffect="glow"
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="无效果">
                      <MotionImage 
                        src="/assets/images/sample4.jpg" 
                        alt="示例图片4"
                        hoverEffect="none"
                      />
                    </Card>
                  </Col>
                </Row>
                
                <Paragraph style={{ marginTop: 16 }}>
                  注意：请在public/assets/images目录下添加sample1.jpg到sample4.jpg图片文件。
                </Paragraph>
              </Card>
            ),
          },
        ]}
      />
    </PageContainer>
  );
};

export default DesignShowcase; 