import React, { useState } from 'react';
import { Modal, Button, Form, Input, Table } from 'antd';

const StudentManagementPage: React.FC = () => {
  const [students, setStudents] = useState([
    { id: 1, name: '张三', studentId: '20210001', major: '计算机科学' },
    { id: 2, name: '李四', studentId: '20210002', major: '软件工程' },
    // 其他学生
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'details' | 'delete'>('create');
  const [selectedStudent, setSelectedStudent] = useState<any>({});

  const [form] = Form.useForm();

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student);
    setModalType('details');
    setIsModalVisible(true);
  };

  const handleEdit = (student: any) => {
    setSelectedStudent(student);
    setModalType('edit');
    setIsModalVisible(true);
  };

  const handleDelete = (student: any) => {
    setSelectedStudent(student);
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
        setStudents([...students, { id: students.length + 1, ...values }]);
        form.resetFields();
        setIsModalVisible(false);
      });
    } else if (modalType === 'edit') {
      form.validateFields().then(values => {
        setStudents(students.map(student => (student.id === selectedStudent.id ? { ...student, ...values } : student)));
        form.resetFields();
        setIsModalVisible(false);
      });
    } else if (modalType === 'delete') {
      setStudents(students.filter(student => student.id !== selectedStudent.id));
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <h1>学生管理</h1>
      <Button type="primary" onClick={handleCreate}>添加学生</Button>
      <Table dataSource={students} rowKey="id">
        <Table.Column title="姓名" dataIndex="name" key="name" />
        <Table.Column title="学号" dataIndex="studentId" key="studentId" />
        <Table.Column title="专业" dataIndex="major" key="major" />
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
        title={modalType === 'create' ? '添加学生' : modalType === 'edit' ? '编辑学生' : modalType === 'details' ? '学生详情' : '确认删除'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={modalType === 'delete' ? '确认删除' : '确定'}
        cancelText="取消"
      >
        {modalType === 'create' || modalType === 'edit' ? (
          <Form form={form} initialValues={modalType === 'edit' ? selectedStudent : {}}>
            <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="studentId" label="学号" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="major" label="专业" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="contact" label="联系方式">
              <Input />
            </Form.Item>
            <Form.Item name="class" label="班级">
              <Input />
            </Form.Item>
          </Form>
        ) : modalType === 'details' ? (
          <>
            <p><strong>姓名:</strong> {selectedStudent.name}</p>
            <p><strong>学号:</strong> {selectedStudent.studentId}</p>
            <p><strong>专业:</strong> {selectedStudent.major}</p>
            <p><strong>联系方式:</strong> {selectedStudent.contact}</p>
            <p><strong>班级:</strong> {selectedStudent.class}</p>
          </>
        ) : modalType === 'delete' ? (
          <p>您确定要删除学生 <strong>{selectedStudent.name}</strong> 吗？</p>
        ) : null}
      </Modal>
    </div>
  );
};

export default StudentManagementPage;
