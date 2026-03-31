import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import React, {useRef} from 'react';
import type {SortOrder} from 'antd/es/table/interface';
import {
  deleteCurriculumUsingDelete,
} from '@/services/ant-design-pro/subjectController';
import {getTeachersUsingGet} from "@/services/ant-design-pro/teacherController";
import { message } from 'antd';
import { isPaperPreview } from '@/utils/paperPreview';

type TeacherRow = {
  id?: number;
  teacherId?: string;
  teacherName?: string;
  userId?: string;
  level?: string;
};

const paperPreviewTeachers: TeacherRow[] = [
  { id: 1, teacherId: 'T202401', teacherName: '张教授', userId: 'teacher_zhang', level: '教授' },
  { id: 2, teacherId: 'T202402', teacherName: '李副教授', userId: 'teacher_li', level: '副教授' },
  { id: 3, teacherId: 'T202403', teacherName: '王讲师', userId: 'teacher_wang', level: '讲师' },
  { id: 4, teacherId: 'T202404', teacherName: '赵教授', userId: 'teacher_zhao', level: '教授' },
  { id: 5, teacherId: 'T202405', teacherName: '周副教授', userId: 'teacher_zhou', level: '副教授' },
  { id: 6, teacherId: 'T202406', teacherName: '吴讲师', userId: 'teacher_wu', level: '讲师' },
];

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const paperPreview = isPaperPreview();


  const columns: ProColumns<TeacherRow>[] = [
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
      title: '工号',
      dataIndex: 'teacherId',
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
      title: '姓名',
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
      title: '账号',
      dataIndex: 'userId',
      valueType: 'textarea',
    },
    //上课时间
    {
      title: '职称',
      dataIndex: 'level',
      valueType: 'text',
      search: false,
    },
    {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id ?? record.teacherId ?? '');
        }}
      >
        编辑
      </a>,
      <a
        key="delete"
        onClick={() => {
          if (!record.id) {
            message.warning('当前教师记录缺少 id，无法删除');
            return;
          }
          deleteCurriculumUsingDelete({ id: record.id }).then(() => {
            action?.reload();
          });
        }}
      >
        删除
      </a>,
    ],
  },
  ];

  return (
    <PageContainer>
      <ProTable<TeacherRow>
        pagination={{
          pageSize: 10,
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
            const teacherIdKeyword = String(params.teacherId ?? '').trim();
            const teacherNameKeyword = String(params.teacherName ?? '').trim();
            const filtered = paperPreviewTeachers.filter((item) => {
              const matchTeacherId = !teacherIdKeyword || String(item.teacherId ?? '').includes(teacherIdKeyword);
              const matchTeacherName = !teacherNameKeyword || String(item.teacherName ?? '').includes(teacherNameKeyword);
              return matchTeacherId && matchTeacherName;
            });
            return {
              data: filtered,
              success: true,
              total: filtered.length,
            };
          }

          const res: any = await getTeachersUsingGet({
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
