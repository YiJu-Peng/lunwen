import React, { useEffect, useState } from 'react';
import { Card, List, Tooltip, message, Skeleton, Tag, Typography, Space } from 'antd';
import { getMyRecommendedCourses } from '@/services/ant-design-pro/recommendationController';
import styles from './styles.less';
import { CalendarOutlined, EnvironmentOutlined, FireOutlined, BulbOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { selectCourseUsingPost } from '@/services/ant-design-pro/selectCourseController';
import moment from 'moment';
import { MotionButton, MotionCard, FadeInText } from '@/components/MotionComponents';

const { Text, Title } = Typography;

const RecommendedCourses: React.FC = () => {
  const [courses, setCourses] = useState<API.CourseRecommendVO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  useEffect(() => {
    fetchRecommendedCourses();
  }, []);

  const fetchRecommendedCourses = async () => {
    try {
      setLoading(true);
      const res = await getMyRecommendedCourses({ limit: 6 });
      if (res.code === 200 && res.data) {
        setCourses(res.data);
      } else {
        message.error('获取推荐课程失败');
      }
    } catch (error) {
      console.error('获取推荐课程时出错:', error);
      message.error('获取推荐课程失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourse = async (course: API.CourseRecommendVO) => {
    if (!currentUser?.id) {
      message.warning('请先登录');
      return;
    }

    try {
      const params = {
        curriculumId: course.curriculumId,
        userId: currentUser.id
      };
      const res = await selectCourseUsingPost(params);
      if (res.code === 200) {
        message.success('选课成功');
      } else {
        message.error(res.message || '选课失败');
      }
    } catch (error) {
      console.error('选课时出错:', error);
      message.error('选课失败，请稍后再试');
    }
  };

  // 计算推荐分数的标签颜色
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#f50';
    if (score >= 80) return '#fa8c16';
    if (score >= 70) return '#52c41a';
    return '#1890ff';
  };

  if (loading) {
    return (
      <MotionCard title="智能推荐课程" className={styles.recommendCard}>
        <Skeleton active paragraph={{ rows: 10 }} />
      </MotionCard>
    );
  }

  if (courses.length === 0) {
    return (
      <MotionCard title="智能推荐课程" className={styles.recommendCard}>
        <div className={styles.emptyContent}>
          <BulbOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          <Text>暂无推荐课程，请先完成一些课程学习</Text>
        </div>
      </MotionCard>
    );
  }

  return (
    <MotionCard 
      title={
        <div className={styles.cardTitle}>
          <FireOutlined style={{ color: '#f5222d', marginRight: 8 }} />
          <span>智能推荐课程</span>
        </div>
      } 
      className={styles.recommendCard}
      hoverable
    >
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
        dataSource={courses}
        renderItem={(item, index) => (
          <List.Item>
            <FadeInText delay={index * 0.1}>
              <MotionCard 
                hoverable 
                className={styles.courseCard}
                bodyStyle={{ padding: '16px' }}
                actions={[
                  <MotionButton 
                    type="primary" 
                    onClick={() => handleSelectCourse(item)}
                  >
                    立即选课
                  </MotionButton>
                ]}
              >
                <div className={styles.courseTitle}>
                  <Title level={4}>{item.subjectName}</Title>
                  <Tooltip title={`推荐指数: ${item.recommendScore.toFixed(1)}`}>
                    <Tag color={getScoreColor(item.recommendScore)}>
                      推荐指数: {item.recommendScore.toFixed(1)}
                    </Tag>
                  </Tooltip>
                </div>
                
                <div className={styles.courseInfo}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <CalendarOutlined style={{ marginRight: 8 }} /> 
                      {item.teachingTime ? moment(item.teachingTime).format('YYYY-MM-DD HH:mm') : '时间待定'}
                    </div>
                    <div>
                      <EnvironmentOutlined style={{ marginRight: 8 }} /> 
                      {item.location || '地点待定'}
                    </div>
                  </Space>
                </div>
                
                <div className={styles.recommendReason}>
                  <Text type="secondary">{item.recommendReason}</Text>
                </div>
              </MotionCard>
            </FadeInText>
          </List.Item>
        )}
      />
    </MotionCard>
  );
};

export default RecommendedCourses; 