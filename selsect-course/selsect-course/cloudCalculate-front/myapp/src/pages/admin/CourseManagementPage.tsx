import React, { useState } from 'react';
import { Modal, Button, Form, Input, Table } from 'antd';

const CourseManagementPage: React.FC = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: '计算机科学导论', teacher: '张三', time: '周一 9:00-11:00', location: 'A101' },
    { id: 2, name: '数据结构与算法', teacher: '李四', time: '周三 13:00-15:00', location: 'B202' },
    // 其他课程
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'details' | 'delete'>('create');
  const [selectedCourse, setSelectedCourse] = useState<any>({});

  const [form] = Form.useForm();

  const handleViewDetails = (course: any) => {
    setSelectedCourse(course);
    setModalType('details');
    setIsModalVisible(true);
  };

  const handleEdit = (course: any) => {
    setSelectedCourse(course);
    setModalType('edit');
    setIsModalVisible(true);
  };

  const handleDelete = (course: any) => {
    setSelectedCourse(course);
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
        setCourses([...courses, { id: courses.length + 1, ...values }]);
        form.resetFields();
        setIsModalVisible(false);
      });
    } else if (modalType === 'edit') {
      form.validateFields().then(values => {
        setCourses(courses.map(course => (course.id === selectedCourse.id ? { ...course, ...values } : course)));
        form.resetFields();
        setIsModalVisible(false);
      });
    } else if (modalType === 'delete') {
      setCourses(courses.filter(course => course.id !== selectedCourse.id));
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <h1>课程管理</h1>
      <Button type="primary" onClick={handleCreate}>创建课程</Button>
      <Table dataSource={courses} rowKey="id">
        <Table.Column title="课程名称" dataIndex="name" key="name" />
        <Table.Column title="教师" dataIndex="teacher" key="teacher" />
        <Table.Column title="时间" dataIndex="time" key="time" />
        <Table.Column title="地点" dataIndex="location" key="location" />
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
        title={modalType === 'create' ? '创建课程' : modalType === 'edit' ? '编辑课程' : modalType === 'details' ? '课程详情' : '确认删除'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={modalType === 'delete' ? '确认删除' : '确定'}
        cancelText="取消"
      >
        {modalType === 'create' || modalType === 'edit' ? (
          <Form form={form} initialValues={modalType === 'edit' ? selectedCourse : {}}>
            <Form.Item name="name" label="课程名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="teacher" label="教师" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="time" label="时间" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="location" label="地点" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="syllabus" label="课程大纲">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="teachingPlan" label="教学计划">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="references" label="参考资料">
              <Input.TextArea />
            </Form.Item>
          </Form>
        ) : modalType === 'details' ? (
          <>
            <p><strong>课程名称:</strong> {selectedCourse.name}</p>
            <p><strong>教师:</strong> {selectedCourse.teacher}</p>
            <p><strong>时间:</strong> {selectedCourse.time}</p>
            <p><strong>地点:</strong> {selectedCourse.location}</p>
            <h2>课程大纲</h2>
            <p>{selectedCourse.syllabus}</p>
            <h2>教学计划</h2>
            <p>{selectedCourse.teachingPlan}</p>
            <h2>参考资料</h2>
            <p>{selectedCourse.references}</p>
          </>
        ) : modalType === 'delete' ? (
          <p>您确定要删除课程 <strong>{selectedCourse.name}</strong> 吗？</p>
        ) : null}
      </Modal>
    </div>
  );
};

export default CourseManagementPage;
