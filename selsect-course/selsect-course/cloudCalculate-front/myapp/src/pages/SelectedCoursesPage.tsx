import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Space, Typography, Empty, Spin } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { ClockCircleOutlined, EnvironmentOutlined, DeleteOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';
import { MotionCard, MotionButton, TactileButton, FadeInText } from '@/components/MotionComponents';
import MaterialToast from '@/components/MaterialToast';
import { useModel } from '@umijs/max';
import { getStudentEnrollmentsUsingGet, dropCourseUsingPost } from '@/services/ant-design-pro/selectCourseController';
import './SelectedCoursesPage.less';
import moment from 'moment';

const { Title, Text } = Typography;

// 扩展类型定义，针对课程项目添加颜色属性
interface ExtendedCourseItem {
  id?: number;
  subjectId?: number;
  teacherId?: number;
  teachingTime?: Date;
  location?: string;
  grade?: string;
  major?: string;
  remarks?: string;
  stock?: number;
  isStock?: number;
  createTime?: Date;
  updateTime?: Date;
  isCheck?: number;
  color?: string;
  teacherName?: string;
  subjectName?: string;
}

const SelectedCoursesPage: React.FC = () => {
  const [selectedCourses, setSelectedCourses] = useState<ExtendedCourseItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ExtendedCourseItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  // 颜色生成函数，确保每个课程有不同的颜色
  const generateColor = (index: number) => {
    const colors = [
      '#1890ff', '#52c41a', '#722ed1', '#fa8c16', '#eb2f96',
      '#13c2c2', '#faad14', '#a0d911', '#fa541c', '#2f54eb'
    ];
    return colors[index % colors.length];
  };

  // 获取已选课程
  useEffect(() => {
    fetchSelectedCourses();
  }, []);

  const fetchSelectedCourses = async () => {
    if (!currentUser?.id) {
      MaterialToast.error('用户未登录');
      setPageLoading(false);
      return;
    }

    setPageLoading(true);
    try {
      const res = await getStudentEnrollmentsUsingGet({
        studentId: currentUser.id
      });

      if (res && Array.isArray(res)){
        // 为课程分配颜色
        const coloredCourses: ExtendedCourseItem[] = res.map((course: any, index: number) => ({
          ...course,
          color: generateColor(index),
          // 添加临时教师名称和课程名称（如果API没有返回）
          teacherName: course.teacherName || `教师${course.teacherId}`,
          subjectName: course.subjectName || `课程${course.subjectId}`
        }));
        setSelectedCourses(coloredCourses);
      } else {
        MaterialToast.error('获取已选课程失败：数据格式不正确');
        setSelectedCourses([]);
      }
    } catch (error) {
      console.error('获取已选课程时出错:', error);
      MaterialToast.error('获取已选课程失败，请稍后再试');
      setSelectedCourses([]);
    } finally {
      setPageLoading(false);
    }
  };

  const handleUnselectCourse = (course: ExtendedCourseItem) => {
    setSelectedCourse(course);
    setIsModalVisible(true);
  };

  const handleConfirmUnselection = async () => {
    if (!selectedCourse?.id || !currentUser?.id) return;

    setLoading(true);
    try {
      const res = await dropCourseUsingPost({
        courseId: selectedCourse.id,
        studentId: currentUser.id
      });

      if (res && res.data === '退课成功') {
        MaterialToast.success('退课成功');
        // 更新本地数据
        setSelectedCourses(selectedCourses.filter(course => course.id !== selectedCourse.id));
      } else {
        MaterialToast.error(res?.data || '退课失败');
      }
    } catch (error) {
      console.error('退课时出错:', error);
      MaterialToast.error('退课失败，请稍后再试');
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 计算课程时间分布 - 用于动画效果的延迟
  const getAnimationDelay = (index: number) => {
    return index * 0.05;
  };

  // 格式化时间
  const formatTime = (time?: Date) => {
    if (!time) return '待定时间';
    return moment(time).format('YYYY-MM-DD HH:mm');
  };

  // 展示课程信息卡片
  const renderCourseCards = () => {
    if (selectedCourses.length === 0) {
      return (
        <div className="empty-courses">
          <Empty
            description="暂无已选课程"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <MotionButton
            type="primary"
            onClick={() => window.location.href = '/courseSelect'}
            style={{ marginTop: 16 }}
          >
            去选课
          </MotionButton>
        </div>
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {selectedCourses.map((course, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={course.id || index}>
            <FadeInText delay={getAnimationDelay(index)}>
              <MotionCard
                className="selected-course-card"
                bordered
                actions={[
                  <TactileButton
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleUnselectCourse(course)}
                    intensity="light"
                  >
                    退课
                  </TactileButton>
                ]}
              >
                <div className="course-header">
                  <BookOutlined className="course-icon" style={{ color: course.color }} />
                  <Title level={5} className="course-title">{course.subjectName}</Title>
                </div>

                <div className="course-details">
                  <div className="course-detail-item">
                    <UserOutlined className="detail-icon teacher-icon" />
                    <Text className="detail-text">{course.teacherName}</Text>
                  </div>

                  <div className="course-detail-item">
                    <ClockCircleOutlined className="detail-icon time-icon" />
                    <Text className="detail-text">{formatTime(course.teachingTime)}</Text>
                  </div>

                  <div className="course-detail-item">
                    <EnvironmentOutlined className="detail-icon location-icon" />
                    <Text className="detail-text">{course.location || '待定地点'}</Text>
                  </div>
                </div>
              </MotionCard>
            </FadeInText>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <PageContainer
      title="已选课程"
      subTitle="查看和管理您已选的课程"
    >
      <Spin spinning={pageLoading}>
        <div className="selected-courses-container">
          {renderCourseCards()}
        </div>
      </Spin>

      <Modal
        title="确认退课"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger
            loading={loading}
            onClick={handleConfirmUnselection}
          >
            确认退课
          </Button>,
        ]}
      >
        <p>确定要退选 <strong>{selectedCourse?.subjectName}</strong> 课程吗？</p>
        <p>退课后将重新增加该课程的可选名额。</p>
      </Modal>
    </PageContainer>
  );
};

export default SelectedCoursesPage;
