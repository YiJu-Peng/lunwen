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
import { isPaperPreview } from '@/utils/paperPreview';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// 周视图表头
const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
// 每天的上课时间段
const TIME_SLOTS = [
  { start: '08:00', end: '09:40' }, // 第1节
  { start: '10:00', end: '11:40' }, // 第2节
  { start: '14:00', end: '15:40' }, // 第3节
  { start: '16:00', end: '17:40' }, // 第4节
  { start: '18:30', end: '20:10' }, // 第5节，晚上课程
];

// 课表项结构
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

// 给不同课程分配不同颜色
const generateColor = (index: number) => {
  const colors = [
    '#1890ff', '#52c41a', '#722ed1', '#fa8c16', '#eb2f96',
    '#13c2c2', '#faad14', '#a0d911', '#fa541c', '#2f54eb'
  ];
  return colors[index % colors.length];
};

// 根据主色拼一个渐变背景
const generateGradient = (baseColor: string) => {
  return `linear-gradient(135deg, ${baseColor} 0%, ${baseColor}99 100%)`;
};

const demoScheduleData: ScheduleCourseItem[] = [
  {
    id: 1001,
    subjectId: 210301,
    teacherId: 3011,
    teacherName: '李佳航',
    courseName: '分布式系统架构',
    teachingTime: new Date('2026-04-06T08:00:00'),
    location: '软件楼 A302',
    dayOfWeek: 1,
    startTime: 1,
    endTime: 1,
    remarks: '核心专业课',
  },
  {
    id: 1002,
    subjectId: 210317,
    teacherId: 3015,
    teacherName: '张倩',
    courseName: '云平台运维实践',
    teachingTime: new Date('2026-04-07T14:00:00'),
    location: '云计算实验室 B201',
    dayOfWeek: 2,
    startTime: 3,
    endTime: 3,
    remarks: '实验课',
  },
  {
    id: 1003,
    subjectId: 210326,
    teacherId: 3020,
    teacherName: '刘海峰',
    courseName: '服务治理与性能优化',
    teachingTime: new Date('2026-04-08T10:00:00'),
    location: '信息楼 C403',
    dayOfWeek: 3,
    startTime: 2,
    endTime: 2,
  },
  {
    id: 1004,
    subjectId: 210330,
    teacherId: 3033,
    teacherName: '王璐',
    courseName: '软件测试与质量保障',
    teachingTime: new Date('2026-04-10T16:00:00'),
    location: '软件楼 A410',
    dayOfWeek: 5,
    startTime: 4,
    endTime: 4,
  },
];

const SchedulePage: React.FC = () => {
  // 初始化页面动效变量
  useMotionSetup();

  const [loading, setLoading] = useState<boolean>(true);
  const [scheduleData, setScheduleData] = useState<ScheduleCourseItem[]>([]);
  const [viewType, setViewType] = useState<string>('week'); // 'week' 或 'list'
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const weekViewRef = useRef<HTMLDivElement>(null);
  const paperPreview = isPaperPreview();

  useEffect(() => {
    fetchScheduleData();
  }, []);

  // 拉取当前课表
  const fetchScheduleData = async () => {
    if (paperPreview) {
      const processedSchedule = demoScheduleData.map((course, index) => {
        const color = generateColor(index);
        return {
          ...course,
          color,
          gradient: generateGradient(color),
        };
      });
      setScheduleData(processedSchedule);
      setLoading(false);
      setRefreshing(false);
      return;
    }
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
        // 同一门课尽量保持同一种颜色
        const courseMap = new Map<number, string>();
        let colorIndex = 0;

        const processedSchedule = result.map((course: any, index: number) => {
          // 用科目 id 作为颜色复用的依据
          if (course.subjectId && !courseMap.has(course.subjectId)) {
            courseMap.set(course.subjectId, generateColor(colorIndex++));
          }

          return {
            ...course,
            // 接口没返回名称时，先给个占位值
            teacherName: course.teacherName || `教师${course.teacherName}`,
            courseName: course.courseName || `课程${course.subjectName}`,
            // 补上卡片颜色和渐变
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

  // 手动刷新课表
  const handleRefresh = () => {
    setRefreshing(true);
    fetchScheduleData();
  };

  // 周视图下滚到今天所在的列
  const scrollToToday = () => {
    if (weekViewRef.current && viewType === 'week') {
      const today = new Date().getDay(); // 0 是周日，1-6 是周一到周六
      const dayIndex = today === 0 ? 6 : today - 1; // 转成 0-6，0 对应周一

      const dayWidth = weekViewRef.current.querySelector('.day-column')?.clientWidth || 100;
      const scrollLeft = dayIndex * dayWidth;

      weekViewRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // 按星期把课程分组
  const getScheduleByDay = () => {
    const schedule: Record<number, ScheduleCourseItem[]> = {};

    // 先补齐周一到周日的空数组
    for (let i = 1; i <= 7; i++) {
      schedule[i] = [];
    }

    // 再按 dayOfWeek 分发到对应列
    scheduleData.forEach(course => {
      if (course.dayOfWeek && course.dayOfWeek >= 1 && course.dayOfWeek <= 7) {
        schedule[course.dayOfWeek].push(course);
      }
    });

    return schedule;
  };

  // 统一时间显示格式
  const formatTime = (date?: Date) => {
    if (!date) return '';
    return moment(date).format('HH:mm');
  };

  // 渲染周课表
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
          {/* 时间轴和周表头 */}
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

          {/* 课表主体 */}
          <div className="schedule-content">
            {/* 左侧时间轴 */}
            <div className="time-column">
              {TIME_SLOTS.map((slot, index) => (
                <div className="time-slot" key={index}>
                  <div className="time-label">{slot.start}</div>
                  <div className="time-label">{slot.end}</div>
                </div>
              ))}
            </div>

            {/* 周一到周日的课程列 */}
            {WEEKDAYS.map((_, dayIndex) => {
              const dayOfWeek = dayIndex + 1; // 1-7 表示周一到周日
              const dayCourses = scheduleByDay[dayOfWeek] || [];

              return (
                <div
                  className={`day-column ${new Date().getDay() === dayOfWeek ? 'today' : ''}`}
                  key={dayOfWeek}
                >
                  {/* 每个时间段对应一个格子 */}
                  {TIME_SLOTS.map((_, slotIndex) => (
                    <div className="time-cell" key={slotIndex}>
                      {/* 找出落在当前时间段里的课程 */}
                      {dayCourses
                        .filter(course => {
                          const courseStart = course.startTime ? course.startTime : 0;
                          const courseEnd = course.endTime ? course.endTime : 0;
                          // 判断课程是否覆盖当前时间段
                          return courseStart <= slotIndex + 1 && courseEnd >= slotIndex + 1;
                        })
                        .map((course, courseIndex) => {
                          // 只在课程起始节次渲染一次卡片
                          if (course.startTime !== slotIndex + 1) return null;

                          // 算一下这门课跨了几个时间段
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
      subTitle="查看本周课程安排与上课地点"
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
