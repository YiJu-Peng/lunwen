import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Button, Space, Divider, Typography, Radio, Switch, theme } from 'antd';
import { TransitionPageContainer } from '@/components/MotionComponents';
import InkLoader from '@/components/InkLoader';
import DataVisualization, { DataItem } from '@/components/DataVisualization';
import MaterialToast from '@/components/MaterialToast';

const { Title, Paragraph } = Typography;
const { useToken } = theme;

const VisualExperiencePage: React.FC = () => {
  const { token } = useToken();
  const [isLoading, setIsLoading] = useState(true);
  const [visualTheme, setVisualTheme] = useState<'light' | 'dark'>('light');
  const [inkColor, setInkColor] = useState('#000000');
  
  // 数据可视化示例数据
  const visualizationData: DataItem[] = [
    { label: '语文', value: 85, color: '#FF4B4B' },
    { label: '数学', value: 92, color: '#4B9EFF' },
    { label: '英语', value: 78, color: '#21D59B' },
    { label: '物理', value: 88, color: '#FFCF4B' },
    { label: '化学', value: 76, color: '#A165FF' },
    { label: '生物', value: 82, color: '#FF8E50' },
  ];
  
  // 模拟加载过程
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 切换主题
  const handleThemeChange = (e: any) => {
    setVisualTheme(e.target.value);
  };
  
  // 切换水墨加载颜色
  const handleInkColorChange = (color: string) => {
    setInkColor(color);
  };
  
  // 展示Toast通知
  const showToastDemo = (type: 'success' | 'error' | 'info' | 'warning') => {
    const messages = {
      success: '操作成功完成，数据已保存！',
      error: '操作失败，请检查网络连接并重试。',
      info: '系统将于今晚22:00进行维护升级。',
      warning: '您的存储空间即将用完，请及时清理。'
    };
    
    MaterialToast[type](messages[type]);
  };
  
  // 重新触发加载动画
  const handleReload = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };
  
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column',
        height: '100vh', 
        background: visualTheme === 'dark' ? '#121212' : '#ffffff',
        color: visualTheme === 'dark' ? '#ffffff' : '#000000'
      }}>
        <InkLoader size={200} color={inkColor} />
      </div>
    );
  }
  
  return (
    <TransitionPageContainer>
      <PageContainer
        header={{
          title: '视觉记忆点展示',
          subTitle: '三个标志性视觉记忆点的实现与展示',
          ghost: true,
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="主题设置" style={{ marginBottom: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <span>主题模式：</span>
                <Radio.Group value={visualTheme} onChange={handleThemeChange}>
                  <Radio.Button value="light">浅色</Radio.Button>
                  <Radio.Button value="dark">深色</Radio.Button>
                </Radio.Group>
              </Space>
              
              <Space>
                <span>水墨动画颜色：</span>
                <Radio.Group value={inkColor} onChange={(e) => handleInkColorChange(e.target.value)}>
                  <Radio.Button value="#000000">黑色</Radio.Button>
                  <Radio.Button value="#1890ff">蓝色</Radio.Button>
                  <Radio.Button value="#52c41a">绿色</Radio.Button>
                  <Radio.Button value="#722ed1">紫色</Radio.Button>
                </Radio.Group>
              </Space>
            </Space>
          </Card>
          
          <Card 
            title="标志性视觉记忆点 1：独创的Loading指示器" 
            extra={<Button type="primary" onClick={handleReload}>重新加载</Button>}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Paragraph>
                水墨扩散风格的加载指示器，结合中国传统艺术与现代数字美学，提供独特的加载体验。
                点击"重新加载"按钮可以再次看到加载效果。
              </Paragraph>
              
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <InkLoader size={150} color={inkColor} />
              </div>
              
              <Divider orientation="left">实现特点</Divider>
              <ul>
                <li>采用Canvas绘制水墨粒子效果</li>
                <li>支持自定义颜色和大小</li>
                <li>优化的性能与自适应设计</li>
                <li>优雅的加载状态表达</li>
              </ul>
            </Space>
          </Card>
          
          <Card title="标志性视觉记忆点 2：数据可视化插画系统">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Paragraph>
                结合Lottie动画和Three.js 3D可视化的创新数据展示系统，提供沉浸式的数据体验。
                支持灵活的数据输入和多种展示模式，自动适应不同设备和环境。
              </Paragraph>
              
              <DataVisualization 
                data={visualizationData}
                theme={visualTheme}
                height={400}
                title="学生成绩分析"
                description="各科目成绩数据三维可视化展示"
              />
              
              <Divider orientation="left">实现特点</Divider>
              <ul>
                <li>Three.js实现的3D交互数据可视化</li>
                <li>Lottie动画装饰，增强视觉体验</li>
                <li>自动降级策略，兼容各种浏览器</li>
                <li>性能优化设计，流畅的动画效果</li>
              </ul>
            </Space>
          </Card>
          
          <Card title="标志性视觉记忆点 3：全局状态美学反馈">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Paragraph>
                重新设计的Toast通知系统，采用材质化设计和微妙的粒子动画，提供优雅的状态反馈。
                点击下方按钮体验不同类型的通知效果。
              </Paragraph>
              
              <Space wrap>
                <Button type="primary" onClick={() => showToastDemo('success')}>
                  成功通知
                </Button>
                <Button danger onClick={() => showToastDemo('error')}>
                  错误通知
                </Button>
                <Button type="default" onClick={() => showToastDemo('info')}>
                  信息通知
                </Button>
                <Button type="dashed" onClick={() => showToastDemo('warning')}>
                  警告通知
                </Button>
              </Space>
              
              <Divider orientation="left">实现特点</Divider>
              <ul>
                <li>优雅的材质化设计风格</li>
                <li>细腻的微交互动画效果</li>
                <li>全局状态管理，支持多通知堆叠</li>
                <li>完善的可访问性支持</li>
              </ul>
            </Space>
          </Card>
        </Space>
      </PageContainer>
    </TransitionPageContainer>
  );
};

export default VisualExperiencePage; 