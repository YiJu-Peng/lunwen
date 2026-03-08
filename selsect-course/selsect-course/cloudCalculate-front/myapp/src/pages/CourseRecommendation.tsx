import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Alert, Card, List, Typography, Tag, Space, Skeleton, Empty, message } from 'antd';
import { getMyRecommendedCourses } from '@/services/ant-design-pro/recommendationController';
import { useModel } from '@@/exports';
import { BookOutlined, BulbOutlined, UserOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { history } from '@@/core/history';
import styles from './CourseRecommendation.less';

const { Title, Text, Paragraph } = Typography;

const CourseRecommendationPage: React.FC = () => {
  const [recommendedCourses, setRecommendedCourses] = useState<API.CourseRecommendVO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  useEffect(() => {
    fetchRecommendedCourses();
  }, []);

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
    history.push(`/course-selection?highlighted=${curriculumId}`);
  };

  const renderEmptyContent = () => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="暂无课程推荐"
    >
      <Paragraph>
        系统暂时无法为您提供课程推荐，可能是因为：
        <ul>
          <li>您还没有设置专业或学院信息</li>
          <li>暂无与您专业或学院相关的课程</li>
        </ul>
      </Paragraph>
    </Empty>
  );

  return (
    <PageContainer>
      <Card className={styles.recommendationCard}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Title level={2}>
            <BulbOutlined /> 专业课程推荐
          </Title>
          
          <Alert
            message="基于专业和学院的个性化推荐"
            description="系统根据您的专业和所在学院为您推荐适合的课程。"
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
                            <Text>上课时间: {course.teachingTime ? new Date(course.teachingTime).toLocaleString() : '待定'}</Text>
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
                推荐基于您的专业和学院信息，如需更多选择，请前往
                <a onClick={() => history.push('/course-selection')}> 课程选择页面 </a>
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