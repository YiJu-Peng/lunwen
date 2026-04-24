import React, { useState } from 'react';
import { Modal, Button, Form, Input, Table } from 'antd';

const TeacherManagementPage: React.FC = () => {
  const [teachers, setTeachers] = useState([
    { id: 1, name: '王老师', teacherId: '20210001', title: '教授' },
    { id: 2, name: '李老师', teacherId: '20210002', title: '副教授' },
    // 其他教师
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'details' | 'delete'>('create');
  const [selectedTeacher, setSelectedTeacher] = useState<any>({});

  const [form] = Form.useForm();

  const handleViewDetails = (teacher: any) => {
    setSelectedTeacher(teacher);
    setModalType('details');
    setIsModalVisible(true);
  };

  const handleEdit = (teacher: any) => {
    setSelectedTeacher(teacher);
    setModalType('edit');
    setIsModalVisible(true);
  };

  const handleDelete = (teacher: any) => {
    setSelectedTeacher(teacher);
    setModalType('delete');
    setIsModalVisible(true);
  };

  const handleCreate = () => {
    setModalType('create');
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (modalType === 'create') {
      form.validateFields().then(values => {
        setTeachers([...teachers, { id: teachers.length + 1, ...values }]);
        form.resetFields();
        setIsModalVisible(false);
      });
    } else if (modalType === 'edit') {
      form.validateFields().then(values => {
        setTeachers(teachers.map(teacher => (teacher.id === selectedTeacher.id ? { ...teacher, ...values } : teacher)));
        form.resetFields();
        setIsModalVisible(false);
      });
    } else if (modalType === 'delete') {
      setTeachers(teachers.filter(teacher => teacher.id !== selectedTeacher.id));
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <h1>教师管理</h1>
      <Button type="primary" onClick={handleCreate}>添加教师</Button>
      <Table dataSource={teachers} rowKey="id">
        <Table.Column title="姓名" dataIndex="name" key="name" />
        <Table.Column title="工号" dataIndex="teacherId" key="teacherId" />
        <Table.Column title="职称" dataIndex="title" key="title" />
        <Table.Column
          title="操作"
          key="action"
          render={(text, record) => (
            <span>
              <Button type="link" onClick={() => handleViewDetails(record)}>查看详情</Button>
              <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
              <Button type="link" onClick={() => handleDelete(record)}>删除</Button>
            </span>
          )}
        />
      </Table>

      <Modal
        title={modalType === 'create' ? '添加教师' : modalType === 'edit' ? '编辑教师' : modalType === 'details' ? '教师详情' : '确认删除'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={modalType === 'delete' ? '确认删除' : '确定'}
        cancelText="取消"
      >
        {modalType === 'create' || modalType === 'edit' ? (
          <Form form={form} initialValues={modalType === 'edit' ? selectedTeacher : {}}>
            <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="teacherId" label="工号" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="title" label="职称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="contact" label="联系方式">
              <Input />
            </Form.Item>
            <Form.Item name="college" label="学院">
              <Input />
            </Form.Item>
          </Form>
        ) : modalType === 'details' ? (
          <>
            <p><strong>姓名:</strong> {selectedTeacher.name}</p>
            <p><strong>工号:</strong> {selectedTeacher.teacherId}</p>
            <p><strong>职称:</strong> {selectedTeacher.title}</p>
            <p><strong>联系方式:</strong> {selectedTeacher.contact}</p>
            <p><strong>学院:</strong> {selectedTeacher.college}</p>
          </>
        ) : modalType === 'delete' ? (
          <p>您确定要删除教师 <strong>{selectedTeacher.name}</strong> 吗？</p>
        ) : null}
      </Modal>
    </div>
  );
};

export default TeacherManagementPage;
