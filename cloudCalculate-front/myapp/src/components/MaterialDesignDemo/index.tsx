import React, { useState } from 'react';
import { Row, Col, Space, Typography, Radio } from 'antd';
import { createStyles } from 'antd-style';
import NeumorphicCard from '../NeumorphicCard';
import NeumorphicButton from '../NeumorphicButton';
import MaterialInput from '../MaterialInput';
import { themeVariables, generateDynamicPalette } from '../../theme.config';

const { Title, Paragraph } = Typography;

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    padding: 24px;
  `,
  demoSection: css`
    margin-bottom: 48px;
  `,
  colorBlock: css`
    height: 80px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: ${themeVariables.neumorphicShadowDark}, ${themeVariables.neumorphicShadowLight};
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 12px 12px 20px rgba(0, 0, 0, 0.1), -12px -12px 20px rgba(255, 255, 255, 0.8);
    }
  `,
}));

const MaterialDesignDemo: React.FC = () => {
  const { styles } = useStyles();
  const [selectedColor, setSelectedColor] = useState('#3E7BFA');
  const [isPressed, setIsPressed] = useState(false);
  
  const palette = generateDynamicPalette(selectedColor);
  
  const colorOptions = [
    { label: '深蓝', value: '#3E7BFA' },
    { label: '翠绿', value: '#4CAF50' },
    { label: '珊瑚', value: '#FF7043' },
    { label: '紫罗兰', value: '#9C27B0' },
  ];
  
  return (
    <div className={styles.container}>
      <div className={styles.demoSection}>
        <Title level={2}>Material You + 新拟态设计系统</Title>
        <Paragraph>
          以下示例展示了Material You动态色彩和新拟态美学的结合应用，为Ant Design Pro项目带来现代化的视觉效果。
        </Paragraph>
        
        <Title level={3} style={{ marginTop: 24 }}>1. 动态色彩系统</Title>
        <Paragraph>选择主题色彩，系统会自动生成色彩变体：</Paragraph>
        
        <Radio.Group 
          options={colorOptions} 
          value={selectedColor}
          onChange={e => setSelectedColor(e.target.value)}
          optionType="button"
          buttonStyle="solid"
          style={{ marginBottom: 24 }}
        />
        
        <Row gutter={[16, 16]}>
          {palette.primary.map((color, index) => (
            <Col span={6} key={index}>
              <div 
                className={styles.colorBlock} 
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </div>
            </Col>
          ))}
        </Row>
      </div>
      
      <div className={styles.demoSection}>
        <Title level={3}>2. 新拟态卡片组件</Title>
        <Paragraph>卡片组件采用新拟态设计，增强立体感和交互体验：</Paragraph>
        
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <NeumorphicCard title="标准卡片" extra={<a href="#">更多</a>}>
              <p>这是一个标准的新拟态卡片组件，具有轻微的阴影效果。</p>
            </NeumorphicCard>
          </Col>
          <Col span={8}>
            <NeumorphicCard 
              title="按下状态" 
              extra={<a href="#">更多</a>}
              isPressed={isPressed}
              onClick={() => setIsPressed(!isPressed)}
            >
              <p>点击此卡片切换按下状态，展示内凹阴影效果。</p>
            </NeumorphicCard>
          </Col>
          <Col span={8}>
            <NeumorphicCard 
              title="高亮卡片" 
              extra={<a href="#">更多</a>}
              highlight={true}
            >
              <p>高亮显示的卡片，可用于强调重要内容。</p>
            </NeumorphicCard>
          </Col>
        </Row>
      </div>
      
      <div className={styles.demoSection}>
        <Title level={3}>3. 新拟态按钮</Title>
        <Space size="large">
          <NeumorphicButton>默认按钮</NeumorphicButton>
          <NeumorphicButton type="primary">主要按钮</NeumorphicButton>
          <NeumorphicButton danger>危险按钮</NeumorphicButton>
        </Space>
      </div>
      
      <div className={styles.demoSection}>
        <Title level={3}>4. Material输入框</Title>
        <Row gutter={[24, 0]}>
          <Col span={8}>
            <MaterialInput label="用户名" placeholder="请输入用户名" />
          </Col>
          <Col span={8}>
            <MaterialInput label="密码" placeholder="请输入密码" type="password" />
          </Col>
          <Col span={8}>
            <MaterialInput label="邮箱" placeholder="请输入邮箱地址" />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MaterialDesignDemo; 