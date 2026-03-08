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
  getAllCurriculumsUsingGet,
  listCurriculumsUsingGet
} from '@/services/ant-design-pro/subjectController';
import {TableDropdown} from "@ant-design/pro-table";
import {getTeachersUsingGet} from "@/services/ant-design-pro/teacherController";

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();


  const columns: ProColumns<API.Curriculum>[] = [
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
          action?.startEditable?.(record.subjectid);
        }}
      >
        编辑
      </a>,
      <a
        key="delete"
        onClick={() => {
          deleteCurriculumUsingDelete(record.id).then(() => {
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
      <ProTable<API.Curriculum>
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

