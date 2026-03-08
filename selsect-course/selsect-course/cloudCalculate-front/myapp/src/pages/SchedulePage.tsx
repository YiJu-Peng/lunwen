import React, { useState, useEffect, useRef } from 'react';
import { Card, Spin, Tabs, Empty, Typography, Tag, Tooltip, Row, Col, Badge, Select, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { getStudentScheduleUsingGet, getCurrentWeekScheduleUsingGet } from '@/services/ant-design-pro/scheduleController';
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  BookOutlined,
  UserOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  BarsOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { MotionCard, FadeInText, MotionTabs, MotionButton, TransitionPageContainer, useMotionSetup } from '@/components/MotionComponents';
import MaterialToast from '@/components/MaterialToast';
import { motion } from 'framer-motion';
import './SchedulePage.less';
import moment from 'moment';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// 一周的日期标题
const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
// 课程时间段
const TIME_SLOTS = [
  { start: '08:00', end: '09:40' }, // 第1节
  { start: '10:00', end: '11:40' }, // 第2节
  { start: '14:00', end: '15:40' }, // 第3节
  { start: '16:00', end: '17:40' }, // 第4节
  { start: '18:30', end: '20:10' }, // 第5节，晚上课程
];

// 课程项类型定义
interface ScheduleCourseItem {
  id?: number;
  subjectId?: number;
  teacherId?: number;
  teacherName?: string;
  courseName?: string;
  teachingTime?: Date;
  location?: string;
  dayOfWeek?: number; // 1-7表示周一到周日
  startTime?: number; // 课程开始时间段 (1-12)
  endTime?: number; // 课程结束时间段 (1-12)
  grade?: string;
  major?: string;
  remarks?: string;
  color?: string;
  gradient?: string;
}

// 颜色生成函数，确保每个课程有不同的颜色
const generateColor = (index: number) => {
  const colors = [
    '#1890ff', '#52c41a', '#722ed1', '#fa8c16', '#eb2f96',
    '#13c2c2', '#faad14', '#a0d911', '#fa541c', '#2f54eb'
  ];
  return colors[index % colors.length];
};

// 渐变色背景生成函数，基于主色生成渐变
const generateGradient = (baseColor: string) => {
  return `linear-gradient(135deg, ${baseColor} 0%, ${baseColor}99 100%)`;
};

const SchedulePage: React.FC = () => {
  // 设置动画CSS变量
  useMotionSetup();

  const [loading, setLoading] = useState<boolean>(true);
  const [scheduleData, setScheduleData] = useState<ScheduleCourseItem[]>([]);
  const [viewType, setViewType] = useState<string>('week'); // 'week' 或 'list'
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const weekViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchScheduleData();
  }, []);

  // 获取课程表数据
  const fetchScheduleData = async () => {
    if (!currentUser?.id) {
      MaterialToast.error('用户未登录');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await getCurrentWeekScheduleUsingGet({
        studentId: currentUser.id
      });

      if (Array.isArray(result)) {
        // 为每个课程分配颜色
        const courseMap = new Map<number, string>();
        let colorIndex = 0;

        const processedSchedule = result.map((course: any, index: number) => {
          // 确保课程有唯一颜色（基于科目ID）
          if (course.subjectId && !courseMap.has(course.subjectId)) {
            courseMap.set(course.subjectId, generateColor(colorIndex++));
          }

          return {
            ...course,
            // 如果没有教师名和课程名，使用ID代替
            teacherName: course.teacherName || `教师${course.teacherName}`,
            courseName: course.courseName || `课程${course.subjectName}`,
            // 设置颜色和渐变
            color: course.subjectId ? courseMap.get(course.subjectId) : generateColor(index),
            gradient: generateGradient(course.subjectId ?
              (courseMap.get(course.subjectId) || '#1890ff') :
              generateColor(index))
          };
        });

        setScheduleData(processedSchedule);
      } else {
        MaterialToast.error('获取课程表失败: 数据格式不正确');
      }
    } catch (error) {
      console.error('获取课程表发生错误:', error);
      MaterialToast.error('获取课程表出错，请稍后再试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 刷新课程表数据
  const handleRefresh = () => {
    setRefreshing(true);
    fetchScheduleData();
  };

  // 滚动到今天（仅适用于周视图）
  const scrollToToday = () => {
    if (weekViewRef.current && viewType === 'week') {
      const today = new Date().getDay(); // 0是周日，1-6是周一到周六
      const dayIndex = today === 0 ? 6 : today - 1; // 转换为0-6，0是周一

      const dayWidth = weekViewRef.current.querySelector('.day-column')?.clientWidth || 100;
      const scrollLeft = dayIndex * dayWidth;

      weekViewRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // 按星期几分组课程
  const getScheduleByDay = () => {
    const schedule: Record<number, ScheduleCourseItem[]> = {};

    // 初始化每天的数组
    for (let i = 1; i <= 7; i++) {
      schedule[i] = [];
    }

    // 将课程按星期几分组
    scheduleData.forEach(course => {
      if (course.dayOfWeek && course.dayOfWeek >= 1 && course.dayOfWeek <= 7) {
        schedule[course.dayOfWeek].push(course);
      }
    });

    return schedule;
  };

  // 格式化日期
  const formatTime = (date?: Date) => {
    if (!date) return '';
    return moment(date).format('HH:mm');
  };

  // 渲染周课表视图
  const renderWeekView = () => {
    if (scheduleData.length === 0) {
      return (
        <div className="empty-schedule">
          <Empty
            description={
              <FadeInText>
                <Text>暂无课程表数据</Text>
              </FadeInText>
            }
          />
          <FadeInText delay={0.1}>
            <MotionButton type="primary" onClick={handleRefresh} icon={<ReloadOutlined />}>
              刷新数据
            </MotionButton>
          </FadeInText>
        </div>
      );
    }

    const scheduleByDay = getScheduleByDay();

    return (
      <FadeInText>
        <div className="schedule-container" ref={weekViewRef}>
          {/* 时间轴和周几的表头 */}
          <div className="schedule-header">
            <div className="time-header">时间</div>
            {WEEKDAYS.map((day, index) => (
              <div
                key={day}
                className={`day-header ${new Date().getDay() === index + 1 ? 'today' : ''}`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 课程表内容区域 */}
          <div className="schedule-content">
            {/* 时间轴列 */}
            <div className="time-column">
              {TIME_SLOTS.map((slot, index) => (
                <div className="time-slot" key={index}>
                  <div className="time-label">{slot.start}</div>
                  <div className="time-label">{slot.end}</div>
                </div>
              ))}
            </div>

            {/* 周一到周日的列 */}
            {WEEKDAYS.map((_, dayIndex) => {
              const dayOfWeek = dayIndex + 1; // 1-7表示周一到周日
              const dayCourses = scheduleByDay[dayOfWeek] || [];

              return (
                <div
                  className={`day-column ${new Date().getDay() === dayOfWeek ? 'today' : ''}`}
                  key={dayOfWeek}
                >
                  {/* 每个时间段的单元格 */}
                  {TIME_SLOTS.map((_, slotIndex) => (
                    <div className="time-cell" key={slotIndex}>
                      {/* 找出在这个时间段的课程并渲染 */}
                      {dayCourses
                        .filter(course => {
                          const courseStart = course.startTime ? course.startTime : 0;
                          const courseEnd = course.endTime ? course.endTime : 0;
                          // 判断课程是否在这个时间段
                          return courseStart <= slotIndex + 1 && courseEnd >= slotIndex + 1;
                        })
                        .map((course, courseIndex) => {
                          // 只在课程开始的时间段渲染
                          if (course.startTime !== slotIndex + 1) return null;

                          // 计算课程跨越的时间段数量
                          const startSlot = course.startTime ? course.startTime - 1 : 0;
                          // 确保endSlot不会超出TIME_SLOTS数组范围
                          const endSlot = course.endTime ? Math.min(course.endTime - 1, TIME_SLOTS.length - 1) : startSlot;
                          const duration = endSlot - startSlot + 1;

                          // 课程样式
                          const courseStyle = {
                            height: `${duration * 100 - 10}px`,
                            backgroundColor: course.color,
                            background: course.gradient,
                          };

                          // 安全获取时间字符串
                          const startTimeStr = TIME_SLOTS[startSlot] ? TIME_SLOTS[startSlot].start : '未知';
                          const endTimeStr = TIME_SLOTS[endSlot] ? TIME_SLOTS[endSlot].end : '未知';

                          return (
                            <Tooltip
                              key={courseIndex}
                              title={
                                <div>
                                  <p><strong>{course.courseName}</strong></p>
                                  <p>教师: {course.teacherName}</p>
                                  <p>地点: {course.location}</p>
                                  <p>时间: {startTimeStr}-{endTimeStr}</p>
                                  {course.remarks && <p>备注: {course.remarks}</p>}
                                </div>
                              }
                            >
                              <div className="course-item" style={courseStyle}>
                                <div className="course-content">
                                  <div className="course-name">{course.courseName}</div>
                                  <div className="course-location">{course.location}</div>
                                </div>
                              </div>
                            </Tooltip>
                          );
                        })}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </FadeInText>
    );
  };

  // 渲染列表视图
  const renderListView = () => {
    if (scheduleData.length === 0) {
      return (
        <div className="empty-schedule">
          <Empty description="暂无课程表数据" />
          <MotionButton type="primary" onClick={handleRefresh} icon={<ReloadOutlined />}>
            刷新数据
          </MotionButton>
        </div>
      );
    }

    // 按星期几排序
    const sortedCourses = [...scheduleData].sort((a, b) => {
      // 先按星期几排序
      const dayDiff = (a.dayOfWeek || 0) - (b.dayOfWeek || 0);
      if (dayDiff !== 0) return dayDiff;

      // 再按开始时间排序
      return (a.startTime || 0) - (b.startTime || 0);
    });

    return (
      <Row gutter={[16, 16]}>
        {sortedCourses.map((course, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <FadeInText delay={index * 0.05}>
              <MotionCard
                className="course-card"
                style={{ borderTop: `3px solid ${course.color}` }}
              >
                <div className="course-card-header">
                  <BookOutlined className="course-icon" style={{ color: course.color }} />
                  <Title level={5}>{course.courseName}</Title>
                </div>

                <div className="course-card-info">
                  <div className="info-item">
                    <UserOutlined className="info-icon" />
                    <Text>{course.teacherName}</Text>
                  </div>

                  <div className="info-item">
                    <CalendarOutlined className="info-icon" />
                    <Text>{WEEKDAYS[(course.dayOfWeek || 1) - 1]} {formatTime(course.teachingTime)}</Text>
                  </div>

                  <div className="info-item">
                    <EnvironmentOutlined className="info-icon" />
                    <Text>{course.location}</Text>
                  </div>

                  {course.remarks && (
                    <div className="info-item">
                      <Text type="secondary">{course.remarks}</Text>
                    </div>
                  )}
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
      title="我的课程表"
      subTitle="查看您的课程安排"
      extra={[
        <Select
          key="viewType"
          value={viewType}
          onChange={setViewType}
          style={{ width: 120 }}
        >
          <Option value="week">周视图</Option>
          <Option value="list">列表视图</Option>
        </Select>,
        <MotionButton
          key="refresh"
          onClick={handleRefresh}
          loading={refreshing}
          icon={<ReloadOutlined />}
        >
          刷新
        </MotionButton>,
        viewType === 'week' && (
          <MotionButton
            key="today"
            onClick={scrollToToday}
          >
            今天
          </MotionButton>
        )
      ]}
    >
      <Spin spinning={loading}>
        <div className="schedule-page">
          {viewType === 'week' ? renderWeekView() : renderListView()}
        </div>
      </Spin>
    </PageContainer>
  );
};

export default SchedulePage;
