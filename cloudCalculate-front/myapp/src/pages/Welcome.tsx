import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography, Row, Col, Space, theme } from 'antd';
import React, { useEffect } from 'react';
import RecommendedCourses from '@/components/RecommendedCourses';
import { useModel } from 'umi';
import { MotionCard, FadeInText, MotionButton, useMotionSetup, TransitionPageContainer } from '@/components/MotionComponents';
import { BookOutlined, QuestionCircleOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
  icon?: React.ReactNode;
}> = ({ title, href, index, desc, icon }) => {
  const { useToken } = theme;
  const { token } = useToken();

  return (
    <MotionCard
      hoverable
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
      }}
      bodyStyle={{
        padding: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '48px',
            borderRadius: '50%',
            backgroundSize: '100%',
            textAlign: 'center',
            color: '#FFF',
            fontSize: '20px',
            fontWeight: 'bold',
            backgroundColor: token.colorPrimary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon || index}
        </div>
        <div
          style={{
            fontSize: '18px',
            color: token.colorText,
            fontWeight: 'bold',
          }}
        >
          {title}
        </div>
      </div>
      <FadeInText delay={0.1}>
        <div
          style={{
            fontSize: '14px',
            color: token.colorTextSecondary,
            textAlign: 'justify',
            lineHeight: '24px',
            marginBottom: 16,
          }}
        >
          {desc}
        </div>
      </FadeInText>
      <MotionButton type="primary" href={href} target="_blank" style={{ marginTop: '8px' }}>
        了解更多
      </MotionButton>
    </MotionCard>
  );
};

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const isLoggedIn = initialState?.currentUser?.id;
  
  // 设置CSS动画变量
  useMotionSetup();

  return (
    <TransitionPageContainer>
      <PageContainer>
        <Row gutter={[24, 24]}>
          {isLoggedIn && (
            <Col span={24}>
              <RecommendedCourses />
            </Col>
          )}

          <Col xs={24} md={12}>
            <FadeInText delay={0.1}>
              <MotionCard 
                title={
                  <Space>
                    <BookOutlined style={{ color: '#1677ff' }} />
                    <span>欢迎使用选课系统</span>
                  </Space>
                } 
                style={{ height: '100%' }}
                hoverable
              >
                <Typography.Paragraph>
                  选课系统提供了便捷的选课、退课和课程管理功能，帮助您更加高效地完成选课流程。
                </Typography.Paragraph>
                <Typography.Paragraph>
                  系统特点：
                  <ul>
                    <li>智能课程推荐，根据学习历史精准推荐课程</li>
                    <li>实时选课状态更新，随时查看选课结果</li>
                    <li>个性化选课管理，轻松掌握学习进度</li>
                    <li>丰富的数据分析，直观了解学习情况</li>
                  </ul>
                </Typography.Paragraph>
              </MotionCard>
            </FadeInText>
          </Col>

          <Col xs={24} md={12}>
            <FadeInText delay={0.2}>
              <MotionCard 
                title={
                  <Space>
                    <QuestionCircleOutlined style={{ color: '#1677ff' }} />
                    <span>使用指南</span>
                  </Space>
                } 
                style={{ height: '100%' }}
                hoverable
              >
                <Typography.Paragraph>
                  <strong>如何使用本系统：</strong>
                </Typography.Paragraph>
                <Typography.Paragraph>
                  <ol>
                    <li>登录系统：使用学号/工号和密码登录</li>
                    <li>浏览课程：点击"可选课程"查看所有可选课程</li>
                    <li>选择课程：在课程列表中点击"选择课程"按钮</li>
                    <li>确认选课：在弹出的确认窗口中确认选课信息</li>
                    <li>查看已选：在"已选课程"页面查看已选课程</li>
                    <li>退课操作：在已选课程页面点击"退课"按钮</li>
                  </ol>
                </Typography.Paragraph>
              </MotionCard>
            </FadeInText>
          </Col>
          
          <Col xs={24} md={8}>
            <FadeInText delay={0.3}>
              <InfoCard 
                title="个人中心" 
                index={1} 
                icon={<UserOutlined />}
                desc="在个人中心可以查看和管理您的个人信息、学习记录和系统通知。定期查看个人中心以获取最新的系统信息和学习建议。" 
                href="/userCenter" 
              />
            </FadeInText>
          </Col>
          
          <Col xs={24} md={8}>
            <FadeInText delay={0.4}>
              <InfoCard 
                title="课程表" 
                index={2} 
                icon={<CalendarOutlined />}
                desc="查看您的课程安排，包括上课时间、地点和任课教师等详细信息。系统会自动为您的课程安排提供日程提醒。" 
                href="/schedule" 
              />
            </FadeInText>
          </Col>
          
          <Col xs={24} md={8}>
            <FadeInText delay={0.5}>
              <InfoCard 
                title="选课中心" 
                index={3} 
                icon={<BookOutlined />}
                desc="浏览所有可选课程，根据学分、时间和个人兴趣进行选择。系统会智能推荐适合您的课程，提高选课效率。" 
                href="/courseSelect" 
              />
            </FadeInText>
          </Col>
        </Row>
      </PageContainer>
    </TransitionPageContainer>
  );
};

export default Welcome;
