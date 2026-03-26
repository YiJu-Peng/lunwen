import React, {useState, useEffect, useRef} from 'react';
import {pageCurriculumsUsingGet, selectCourseUsingPost} from "@/services/ant-design-pro/selectCourseController";
import {ActionType, PageContainer, ProColumns, ProTable} from "@ant-design/pro-components";
import type {SortOrder} from "antd/es/table/interface";
import {Alert, Button, message, Modal, Badge, Tabs, Typography, Divider, Space, Tag} from "antd";
import {useModel} from "@@/exports";
import { checkMyConflict } from '@/services/ant-design-pro/conflictController';
import { ClockCircleOutlined, WarningOutlined, BookOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { MotionCard, MotionButton, TactileButton, FadeInText } from '@/components/MotionComponents';
import MaterialToast from '@/components/MaterialToast';
import './CourseSelectionPage.less';

const { Text, Paragraph, Title } = Typography;
const { TabPane } = Tabs;

// Extend the Curriculum type to include additional fields from CurriculumVO
interface ExtendedCurriculum extends API.Curriculum {
  subjectName?: string;
  teacherName?: string;
  teachingTimeString?: string;
  capacity?: number;
  selected?: number;
  stock?: number;
  allStock?: number;
}

const CourseSelectionPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConflictVisible, setIsConflictVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>({});
  const [conflictResult, setConflictResult] = useState<API.ConflictCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  // 表格分页相关状态
  const [coursesData, setCoursesData] = useState<ExtendedCurriculum[]>([]);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const {initialState} = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  // 点击选课后，先做冲突检查
  const handleSelectCourse = async (course: any) => {
    // 先校验是否和已选课程冲突
    await checkCourseConflict(course);
    setSelectedCourse(course);
  };

  // 选课前的冲突检查
  const checkCourseConflict = async (course: any) => {
    try {
      setLoading(true);
      // Ensuring curriculumId is provided as a number
      const curriculumId = typeof course.id === 'number' ? course.id : 0;
      const res = await checkMyConflict({
        curriculumId
      });

      if (res.code === 200) {
        // setConflictResult(res.data);
        // setSelectedCourse(course);
        //
        // // 根据冲突结果决定弹窗
        // if (res.data.hasConflict) {
        //   setIsConflictVisible(true); // 显示冲突提示
        // } else {
        //   setIsModalVisible(true); // 显示选课确认
        // }
        setIsModalVisible(true);
      } else {
        MaterialToast.error('检查课程冲突失败');
      }
    } catch (error) {
      console.error('检查课程冲突时出错:', error);
      MaterialToast.error('检查课程冲突失败');
    } finally {
      setLoading(false);
    }
  };

  // 用户确认后再提交选课
  const handleConfirmSelection = async () => {
    // 这里真正调用后端的选课接口
    const params = {
      curriculumId: selectedCourse.id,
      userId: currentUser?.id
    };
    setLoading(true);
    try {
      const res = await selectCourseUsingPost(params);
      if (res.code === 200) {
        // 后端返回值不固定，这里做一次兜底
        const successMessage = typeof res.data === 'string' ? res.data : '选课成功';
        MaterialToast.success(successMessage);
        // 成功后刷新当前列表
        actionRef.current?.reload();
      } else {
        MaterialToast.error(res.message || '选课失败');
      }
    } catch (error) {
      console.error('选课时出错:', error);
      MaterialToast.error('选课失败，请稍后再试');
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  // 忽略冲突后继续选课
  const handleForceSelect = async () => {
    setIsConflictVisible(false);
    setIsModalVisible(true);
  };

  // 关闭弹窗
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsConflictVisible(false);
  };

  const actionRef = useRef<ActionType>();

  // 读取课程列表
  const fetchCourses = async (
    params: {
      current?: number;
      pageSize?: number;
      [key: string]: any;
    },
    sort?: Record<string, SortOrder>,
    filter?: Record<string, React.ReactText[] | null>,
  ) => {
    try {
      console.log('Pagination params:', params);

      const res: any = await pageCurriculumsUsingGet({
        ...params,
        current: params.current || 1,
        size: params.pageSize || 10,
      });

      if (res?.records) {
        // 有些接口把 total 返回成字符串，这里顺手兼容一下
        let total = 0;
        if (typeof res.total === 'string') {
          total = parseInt(res.total) || res.records.length;
        } else {
          total = res.total || res.records.length;
        }

        // 同步页面上的分页数据
        setCoursesData(res.records);
        setTotalCourses(total);

        console.log('分页数据:', {
          数据长度: res.records.length,
          总数: total,
          当前页: params.current,
          每页大小: params.pageSize
        });

        return {
          data: res.records,
          total: total || res.records.length, // 总数字段异常时，至少回退到当前记录数
          success: true,
          pageSize: params.pageSize,
          current: params.current,
        };
      } else {
        return {
          data: [],
          total: 0,
          success: false,
        };
      }
    } catch (error) {
      console.error('获取课程数据失败:', error);
      return {
        data: [],
        total: 0,
        success: false,
      };
    }
  };

  const columns: ProColumns<ExtendedCurriculum>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '课程名称',
      dataIndex: 'subjectName',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      render: (_, record) => (
        <Space>
          <BookOutlined style={{ color: '#1890ff' }} />
          <Text strong>{record.subjectName}</Text>
        </Space>
      ),
    },
    {
      title: '课程编号',
      dataIndex: 'subjectId',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          }
        ]
      }
    },
    {
      title: '授课教师',
      dataIndex: 'teacherName',
      valueType: 'text',
      render: (_, record) => (
        <Space>
          <UserOutlined style={{ color: '#52c41a' }} />
          <Text>{record.teacherName}</Text>
        </Space>
      ),
    },
    {
      title: '课程时间',
      dataIndex: 'teachingTime',
      valueType: 'dateTime',
      search: false,
      render: (_, record) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#722ed1' }} />
          <Text>{record.teachingTimeString || String(record.teachingTime || '')}</Text>
        </Space>
      ),
    },
    {
      title: '地点',
      dataIndex: 'location',
      valueType: 'text',
      search: false,
      render: (_, record) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#f5222d' }} />
          <Text>{record.location}</Text>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      render: (_, record) => {
        // Using stock and allStock instead of capacity and selected
        const stock = record.stock ?? 0;
        const allStock = record.allStock ?? 0;
        const remaining = stock;
        const percent = allStock > 0 ? Math.floor((allStock - stock) / allStock * 100) : 0;

        if (remaining <= 0) {
          return <Badge status="error" text={<Text type="danger">已满</Text>} />;
        } else if (remaining <= 5) {
          return <Badge status="warning" text={<Text type="warning">剩余 {remaining} 个名额 ({percent}%)</Text>} />;
        } else {
          return <Badge status="success" text={<Text type="success">充足 ({percent}%)</Text>} />;
        }
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => {
        const stock = record.stock ?? 0;

        return [
          <TactileButton
            type="primary"
            onClick={() => handleSelectCourse(record)}
            loading={loading && selectedCourse.id === record.id}
            intensity="medium"
            disabled={stock <= 0}
          >
            选择课程
          </TactileButton>
        ];
      }
    }
  ];

  // 渲染冲突详情
  const renderConflictDetails = () => {
    if (!conflictResult || !conflictResult.conflictCourses) return null;

    return (
      <div className="conflict-details">
        <Divider orientation="left">冲突详情</Divider>
        {conflictResult.conflictCourses.map((course, index) => (
          <MotionCard
            key={index}
            className="conflict-course-card"
            bordered
          >
            <FadeInText delay={index * 0.1}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>{course.subjectName}</Text>
                <Space>
                  <ClockCircleOutlined />
                  <Text>{course.teachingTimeString}</Text>
                </Space>
                <Text type="secondary">教师: {course.teacherName}</Text>
                <Text type="secondary">地点: {course.location}</Text>
                <Tag color="error"><WarningOutlined /> {course.conflictReason}</Tag>
              </Space>
            </FadeInText>
          </MotionCard>
        ))}
      </div>
    );
  };

  return (
    <PageContainer
      header={{
        title: (
          <FadeInText>
            <Title level={2}>课程选择</Title>
          </FadeInText>
        ),
        subTitle: '浏览并选择您本学期的课程',
        ghost: true,
      }}
    >
      <MotionCard
        className="course-selection-card"
        bordered={false}
      >
        <ProTable<ExtendedCurriculum>
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              console.log('页码变更:', page, pageSize);
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
          headerTitle={
            <Space>
              <BookOutlined />
              <span>可选课程列表</span>
            </Space>
          }
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 120,
            defaultCollapsed: false,
          }}
          request={fetchCourses}
          columns={columns}
          rowClassName="course-row"
        />
      </MotionCard>

      {/* 课程冲突提示弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />
            <span>课程时间冲突警告</span>
          </div>
        }
        open={isConflictVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消选课
          </Button>,
          <TactileButton key="submit" type="primary" danger onClick={handleForceSelect} intensity="strong">
            仍然选择
          </TactileButton>,
        ]}
        width={600}
        className="conflict-modal"
      >
        <Alert
          message={conflictResult?.conflictDescription || "检测到课程时间冲突"}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Paragraph>
          选择此课程可能会导致上课时间冲突，请确认是否继续:
        </Paragraph>
        {renderConflictDetails()}
      </Modal>

      {/* 选课确认弹窗 */}
      <Modal
        title="确认选课"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <TactileButton
            key="submit"
            type="primary"
            onClick={handleConfirmSelection}
            loading={loading}
            intensity="medium"
          >
            确认选课
          </TactileButton>,
        ]}
        className="confirm-modal"
      >
        <div className="course-info">
          <Title level={4}>{selectedCourse.subjectName}</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <BookOutlined style={{ color: '#1890ff' }} />
              <Text strong>课程编号: </Text>
              <Text>{selectedCourse.subjectId}</Text>
            </Space>
            <Space>
              <UserOutlined style={{ color: '#52c41a' }} />
              <Text strong>授课教师: </Text>
              <Text>{selectedCourse.teacherName}</Text>
            </Space>
            <Space>
              <ClockCircleOutlined style={{ color: '#722ed1' }} />
              <Text strong>课程时间: </Text>
              <Text>{selectedCourse.teachingTimeString || selectedCourse.teachingTime}</Text>
            </Space>
            <Space>
              <EnvironmentOutlined style={{ color: '#f5222d' }} />
              <Text strong>上课地点: </Text>
              <Text>{selectedCourse.location}</Text>
            </Space>
          </Space>
          <Divider />
          <Paragraph>
            请确认您想要选择上述课程。一旦确认，该课程将被添加到您的课程表中。
          </Paragraph>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default CourseSelectionPage;
