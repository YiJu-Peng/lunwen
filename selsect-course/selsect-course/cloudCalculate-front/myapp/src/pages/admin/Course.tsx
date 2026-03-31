import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import React, {useRef} from 'react';
import type {SortOrder} from 'antd/es/table/interface';
import {
  checkCurriculumUsingPost,
  deleteCurriculumUsingDelete,
  listCurriculumsUsingGet,
} from '@/services/ant-design-pro/subjectController';
import {Button, Popconfirm, message} from "antd";
import {CheckOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import { isPaperPreview } from '@/utils/paperPreview';

type CourseRow = {
  id?: number;
  subjectName?: string;
  teacherName?: string;
  location?: string;
  teachingTime?: string;
  isCheck?: number;
};

const paperPreviewCourses: CourseRow[] = [
  { id: 1, subjectName: '计算机网络基础', teacherName: '张教授', location: '主教学楼A101', teachingTime: '2026-04-08 08:00:00', isCheck: 1 },
  { id: 2, subjectName: '数据结构与算法', teacherName: '李副教授', location: '主教学楼A102', teachingTime: '2026-04-08 10:00:00', isCheck: 1 },
  { id: 3, subjectName: '数据库系统原理', teacherName: '王讲师', location: '主教学楼A103', teachingTime: '2026-04-08 14:00:00', isCheck: 1 },
  { id: 4, subjectName: '操作系统', teacherName: '赵教授', location: '主教学楼A104', teachingTime: '2026-04-09 08:00:00', isCheck: 1 },
  { id: 5, subjectName: '软件测试与质量保障', teacherName: '周副教授', location: '软件楼A410', teachingTime: '2026-04-09 16:00:00', isCheck: 0 },
  { id: 6, subjectName: '云平台运维实践', teacherName: '吴讲师', location: '云计算实验室B201', teachingTime: '2026-04-10 14:00:00', isCheck: 1 },
];

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const paperPreview = isPaperPreview();

  const handleEdit = (record: CourseRow) => {
    message.info(`课程 #${record.id ?? '未知'} 的编辑入口暂未接入`);
  };

  const handleDelete = async (record: CourseRow) => {
    if (paperPreview) {
      message.success('演示模式下不执行实际删除');
      return;
    }
    if (!record.id) {
      message.warning('当前课程缺少 id，无法删除');
      return;
    }
    await deleteCurriculumUsingDelete({ id: record.id });
    message.success('课程删除成功');
    actionRef.current?.reload?.();
  };

  const handleCheck = async (record: CourseRow) => {
    if (paperPreview) {
      message.success('演示模式下模拟审核通过');
      return;
    }
    if (!record.id) {
      message.warning('当前课程缺少 id，无法审核');
      return;
    }
    await checkCurriculumUsingPost({ curriculumId: record.id });
    message.success('课程审核成功');
    actionRef.current?.reload?.();
  };


  const columns: ProColumns<CourseRow>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    //id
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      search: false,
      hideInTable: true,
    },
    {
      title: '课程',
      dataIndex: 'subjectName',
      copyable: true,
      ellipsis: true,
      tooltip: '课程名称过长会自动收缩',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    //上课老师
    {
      title: '教师',
      dataIndex: 'teacherName',
      copyable: true,
      ellipsis: true,
      tooltip: '老师名称过长会自动收缩',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          }
        ]
      }
    },
    //上课地址
    {
      title: '地址',
      dataIndex: 'location',
      valueType: 'textarea',
    },
    //上课时间
    {
      title: '时间',
      dataIndex: 'teachingTime',
      valueType: 'dateTime',
      search: false,
    },
    //备注
    {
      title: '是否审批',
      dataIndex: 'isCheck',
      valueEnum: {
        1: {text: '已审批', status: 'Success'},
        0: {text: '未审批', status: 'Error'},
      },
      // render: (text) => (
      //   <Badge status={text ? "success" : "error"} text={text ? "已审批" : "未审批"} />
      // ),
    },
    {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <span>
        <Button type="link" onClick={() => handleEdit(record)}>
          <EditOutlined /> 编辑
        </Button>
        <Popconfirm
          title="确定要删除此课程吗？"
          onConfirm={() => handleDelete(record)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" danger>
            <DeleteOutlined /> 删除
          </Button>
        </Popconfirm>
        <Popconfirm
          title="确定审核通过此课程吗？"
          onConfirm={() => handleCheck(record)}
          okText="确定"
          cancelText="取消"
        >
          {record.isCheck === 0 && (
            <Button type="link" style={{ color: '#52c41a' }}>
              <CheckOutlined /> 审核
            </Button>
          )}
        </Popconfirm>
        </span>
    ],
  },
  ];

  return (
    <PageContainer>
      <ProTable<CourseRow>
        pagination={{
          pageSize: 1000,
          onChange: (page) => console.log(page),
        }}
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={async (
          params,
          sort: Record<string, SortOrder>,
          filter: Record<string, React.ReactText[] | null>,
        ) => {
          if (paperPreview) {
            const subjectKeyword = String(params.subjectName ?? '').trim();
            const teacherKeyword = String(params.teacherName ?? '').trim();
            const filtered = paperPreviewCourses.filter((item) => {
              const matchSubject = !subjectKeyword || String(item.subjectName ?? '').includes(subjectKeyword);
              const matchTeacher = !teacherKeyword || String(item.teacherName ?? '').includes(teacherKeyword);
              return matchSubject && matchTeacher;
            });
            return {
              data: filtered,
              success: true,
              total: filtered.length,
            };
          }

          const res: any = await listCurriculumsUsingGet({
            ...params,
          });
          if (res?.records) {
            return {
              data: res?.records || [],
              success: true,
              total: res?.total || 0,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        //
      />

    </PageContainer>
  );
};
export default TableList;
