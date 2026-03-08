import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import React, {useRef} from 'react';
import type {SortOrder} from 'antd/es/table/interface';
import {
  deleteCurriculumUsingDelete, listCurriculumsUsingGet,
} from '@/services/ant-design-pro/subjectController';
import {Badge, Button, Popconfirm, Space} from "antd";
import {CheckCircleOutlined, CheckOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";

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
      <ProTable<API.Curriculum>
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

