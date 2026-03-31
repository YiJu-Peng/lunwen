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
import {getStudentsUsingGet} from "@/services/ant-design-pro/studentController";
import { message } from 'antd';
import { isPaperPreview } from '@/utils/paperPreview';

type StudentRow = {
  id?: number;
  studentId?: string;
  userId?: string;
  studentName?: string;
  major?: string;
};

const paperPreviewStudents: StudentRow[] = [
  { id: 1, studentId: '2022101001', userId: 'u2022101001', studentName: '张晨', major: '软件工程' },
  { id: 2, studentId: '2022101002', userId: 'u2022101002', studentName: '李悦', major: '计算机科学与技术' },
  { id: 3, studentId: '2022101003', userId: 'u2022101003', studentName: '王宁', major: '数据科学与大数据技术' },
  { id: 4, studentId: '2022101004', userId: 'u2022101004', studentName: '赵航', major: '人工智能' },
  { id: 5, studentId: '2022101005', userId: 'u2022101005', studentName: '周璇', major: '网络工程' },
  { id: 6, studentId: '2022101006', userId: 'u2022101006', studentName: '陈默', major: '信息安全' },
  { id: 7, studentId: '2022101007', userId: 'u2022101007', studentName: '孙妍', major: '软件工程' },
  { id: 8, studentId: '2022101008', userId: 'u2022101008', studentName: '吴桐', major: '计算机科学与技术' },
];

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const paperPreview = isPaperPreview();


  const columns: ProColumns<StudentRow>[] = [
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
      title: '学号',
      dataIndex: 'studentId',
      copyable: true,
      ellipsis: true,
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
      title: '账号',
      dataIndex: 'userId',
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
      title: '姓名',
      dataIndex: 'studentName',
      valueType: 'text',
    },
    //上课时间
    {
      title: '专业',
      dataIndex: 'major',
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
          action?.startEditable?.(record.id ?? '');
        }}
      >
        编辑
      </a>,
      <a
        key="delete"
        onClick={() => {
          if (!record.id) {
            message.warning('当前学生记录缺少 id，无法删除');
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
      <ProTable<StudentRow>
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
            const studentIdKeyword = String(params.studentId ?? '').trim();
            const userIdKeyword = String(params.userId ?? '').trim();
            const filtered = paperPreviewStudents.filter((item) => {
              const matchStudentId = !studentIdKeyword || String(item.studentId ?? '').includes(studentIdKeyword);
              const matchUserId = !userIdKeyword || String(item.userId ?? '').includes(userIdKeyword);
              return matchStudentId && matchUserId;
            });
            return {
              data: filtered,
              success: true,
              total: filtered.length,
            };
          }

          const res: any = await getStudentsUsingGet({
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
