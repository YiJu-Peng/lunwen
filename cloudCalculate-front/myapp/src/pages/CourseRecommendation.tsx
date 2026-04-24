import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Alert, Card, List, Typography, Tag, Space, Skeleton, Empty, message } from 'antd';
import { getMyRecommendedCourses } from '@/services/ant-design-pro/recommendationController';
import { useModel } from '@@/exports';
import { BookOutlined, BulbOutlined, UserOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { history } from '@@/core/history';
import styles from './CourseRecommendation.less';
import { isPaperPreview } from '@/utils/paperPreview';

const { Title, Text, Paragraph } = Typography;

const demoRecommendedCourses: API.CourseRecommendVO[] = [
  {
    curriculumId: 1001,
    subjectId: 210301,
    subjectName: '分布式系统架构',
    teachingTime: '2026-04-06 08:00:00',
    location: '软件楼 A302',
    recommendReason: '与软件工程专业方向高度匹配，适合作为分布式课程拓展。',
    recommendScore: 96.5,
  },
  {
    curriculumId: 1002,
    subjectId: 210317,
    subjectName: '云平台运维实践',
    teachingTime: '2026-04-07 14:00:00',
    location: '云计算实验室 B201',
    recommendReason: '覆盖容器部署、日志监控与自动化运维，贴合系统运维能力培养目标。',
    recommendScore: 93.0,
  },
  {
    curriculumId: 1003,
    subjectId: 210326,
    subjectName: '服务治理与性能优化',
    teachingTime: '2026-04-08 10:00:00',
    location: '信息楼 C403',
    recommendReason: '与微服务架构课程链路衔接紧密，可强化网关、限流与压测分析能力。',
    recommendScore: 91.2,
  },
  {
    curriculumId: 1004,
    subjectId: 210330,
    subjectName: '软件测试与质量保障',
    teachingTime: '2026-04-10 16:00:00',
    location: '软件楼 A410',
    recommendReason: '帮助完善测试设计与质量度量能力，适合作为毕业设计配套课程。',
    recommendScore: 88.6,
  },
];

const CourseRecommendationPage: React.FC = () => {
  const [recommendedCourses, setRecommendedCourses] = useState<API.CourseRecommendVO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const paperPreview = isPaperPreview();

  useEffect(() => {
    if (paperPreview) {
      setRecommendedCourses(demoRecommendedCourses);
      setLoading(false);
      return;
    }
    fetchRecommendedCourses();
  }, [paperPreview]);

  const fetchRecommendedCourses = async () => {
    try {
      setLoading(true);
      const res = await getMyRecommendedCourses({
        limit: 10,
      });
      
      if (res.code === 200 && res.data) {
        setRecommendedCourses(res.data);
      } else {
        message.error('获取推荐课程失败: ' + res.message);
        setRecommendedCourses([]);
      }
    } catch (error) {
      console.error('获取推荐课程时出错:', error);
      message.error('获取推荐课程失败，请稍后再试');
      setRecommendedCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourse = (curriculumId: number) => {
    // 跳转到课程选择页面，并传递课程ID
    const basePath = paperPreview ? '/courseSelect?paper=1' : '/courseSelect';
    const separator = basePath.includes('?') ? '&' : '?';
    history.push(`${basePath}${separator}highlighted=${curriculumId}`);
  };

  const renderEmptyContent = () => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="暂无课程推荐"
    >
      <Paragraph>
        系统暂时无法为您提供课程推荐，可能是因为：
        <ul>
          <li>您还没有完善专业信息</li>
          <li>当前暂无与您专业方向匹配的课程</li>
        </ul>
      </Paragraph>
    </Empty>
  );

  return (
    <PageContainer>
      <Card className={styles.recommendationCard}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Title level={2}>
            <BulbOutlined /> 智能课程推荐
          </Title>
          
          <Alert
            message="基于专业标签的智能推荐"
            description="系统结合您的专业方向与当前开放课程信息，推荐匹配度更高的课程。"
            type="info"
            showIcon
          />

          <Skeleton loading={loading} active paragraph={{ rows: 6 }}>
            {recommendedCourses.length > 0 ? (
              <List
                dataSource={recommendedCourses}
                renderItem={(course) => (
                  <List.Item
                    key={course.curriculumId}
                    actions={[
                      <a key="select" onClick={() => handleSelectCourse(course.curriculumId)}>
                        选择课程
                      </a>
                    ]}
                    className={styles.courseItem}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <BookOutlined style={{ color: '#1890ff' }} />
                          <Text strong>{course.subjectName}</Text>
                          <Tag color="blue">ID: {course.subjectId}</Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical">
                          <Space>
                            <ClockCircleOutlined style={{ color: '#722ed1' }} />
                            <Text>上课时间: {course.teachingTime ? new Date(course.teachingTime).toLocaleString('zh-CN', { hour12: false }) : '待定'}</Text>
                          </Space>
                          <Space>
                            <EnvironmentOutlined style={{ color: '#f5222d' }} />
                            <Text>上课地点: {course.location || '待定'}</Text>
                          </Space>
                          <Space>
                            <BulbOutlined style={{ color: '#faad14' }} />
                            <Text type="secondary">推荐理由: {course.recommendReason}</Text>
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              renderEmptyContent()
            )}
          </Skeleton>
          
          {recommendedCourses.length > 0 && (
            <Paragraph className={styles.recommendationFooter}>
              <Text type="secondary">
                推荐结果基于您的专业标签生成，如需查看更多课程，请前往
                <a onClick={() => history.push(paperPreview ? '/courseSelect?paper=1' : '/courseSelect')}> 课程选择页面 </a>
                浏览全部课程。
              </Text>
            </Paragraph>
          )}
        </Space>
      </Card>
    </PageContainer>
  );
};

export default CourseRecommendationPage; 
