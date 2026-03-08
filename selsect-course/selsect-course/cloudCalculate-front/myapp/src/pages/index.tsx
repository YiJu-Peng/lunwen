import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography, Row, Col, Statistic, Button } from 'antd';
import { useModel } from '@umijs/max';
import { MotionCard, MotionButton, TactileButton, FadeInText } from '@/components/MotionComponents';
import DataVisualization, { DataItem } from '@/components/DataVisualization';
import './index.less';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  
  const [usageData, setUsageData] = useState<DataItem[]>([
    { label: '内存', value: 65, color: '#4096ff' },
    { label: 'CPU', value: 42, color: '#73d13d' },
    { label: '存储', value: 78, color: '#ffa940' },
    { label: '网络', value: 36, color: '#ff7a45' },
  ]);
  
  // 模拟数据更新
  useEffect(() => {
    const timer = setInterval(() => {
      setUsageData(prevData => 
        prevData.map(item => ({
          ...item,
          value: Math.floor(Math.random() * 80) + 20
        }))
      );
    }, 10000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <PageContainer
      header={{
        title: (
          <FadeInText>
            <Title level={2}>欢迎使用云计算平台</Title>
          </FadeInText>
        ),
      }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <MotionCard 
            bordered={false} 
            className="welcome-card"
            title="系统概览"
          >
            <FadeInText delay={0.2}>
              <Paragraph>
                欢迎回来，{currentUser?.userName || '用户'}！您的云资源运行状态良好。
              </Paragraph>
            </FadeInText>
            
            <Row gutter={[16, 16]} className="stats-row">
              <Col span={6}>
                <FadeInText delay={0.3}>
                  <Statistic title="计算节点" value={8} suffix="个" />
                </FadeInText>
              </Col>
              <Col span={6}>
                <FadeInText delay={0.4}>
                  <Statistic title="存储容量" value={2048} suffix="GB" />
                </FadeInText>
              </Col>
              <Col span={6}>
                <FadeInText delay={0.5}>
                  <Statistic title="任务数" value={42} suffix="个" />
                </FadeInText>
              </Col>
              <Col span={6}>
                <FadeInText delay={0.6}>
                  <Statistic title="运行时间" value={124} suffix="小时" />
                </FadeInText>
              </Col>
            </Row>
            
            <Row className="action-row" gutter={16}>
              <Col>
                <MotionButton type="primary">查看详情</MotionButton>
              </Col>
              <Col>
                <TactileButton intensity="light">新建任务</TactileButton>
              </Col>
            </Row>
          </MotionCard>
        </Col>
        
        <Col xs={24} lg={8}>
          <MotionCard 
            bordered={false}
            className="quick-actions-card"
            title="快速操作"
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <TactileButton block>创建实例</TactileButton>
              </Col>
              <Col span={12}>
                <TactileButton block>管理存储</TactileButton>
              </Col>
              <Col span={12}>
                <TactileButton block>监控面板</TactileButton>
              </Col>
              <Col span={12}>
                <TactileButton block>查看日志</TactileButton>
              </Col>
            </Row>
          </MotionCard>
        </Col>
      </Row>
      
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <MotionCard 
            bordered={false}
            className="data-visualization-card"
            title="系统资源使用情况"
          >
            <DataVisualization 
              data={usageData}
              height={380}
              title="实时资源监控"
              description="显示当前系统各项资源的使用情况，每10秒自动更新"
            />
          </MotionCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default HomePage;
