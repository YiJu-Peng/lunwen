import React from 'react';
import { Card, Button, Typography, Avatar, List, Descriptions, Modal, Form, Input } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useModel } from '@@/exports';

const { Title, Text } = Typography;

const UserCenter: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState.currentUser || {};

  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = React.useState(false);

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleEditPassword = () => {
    setIsPasswordModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
  };

  const handlePasswordModalCancel = () => {
    setIsPasswordModalVisible(false);
  };

  const handleEditSubmit = (values) => {
    console.log('Form values:', values);
    // 后续可以在这一段接入更新用户资料的接口
    setIsEditModalVisible(false);
  };

  const handlePasswordSubmit = (values) => {
    console.log('Form values:', values);
    // 后续可以在这一段接入修改密码的接口
    setIsPasswordModalVisible(false);
  };

  const courses = [
    { id: 1, name: 'Web 开发基础', description: '学习 Web 开发的基础知识' },
    { id: 2, name: 'React 入门', description: '掌握 React 框架的基本用法' },
    { id: 3, name: 'Node.js 进阶', description: '深入 Node.js 的高级特性' },
  ];

  const notifications = [
    { id: 1, title: '新课程上线', content: 'Web 开发基础课程已上线' },
    { id: 2, title: '系统维护通知', content: '系统将于今晚 12 点进行维护' },
  ];

  return (
    <Card title="个人中心" style={{ width: '100%', maxWidth: 800, margin: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar size={64} src={currentUser.userAvatar} icon={<UserOutlined />} />
        <div style={{ marginLeft: 20 }}>
          <Title level={3}>{currentUser.userName}</Title>
          <Text type="secondary">{currentUser.userDescription}</Text>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <Button type="primary" onClick={handleEditProfile}>编辑资料</Button>
        <Button style={{ marginLeft: 10 }} onClick={handleEditPassword}>修改密码</Button>
        <Button style={{ marginLeft: 10 }} onClick={() => console.log('退出登录')}>退出登录</Button>
      </div>

      <Descriptions title="用户信息" layout="vertical" bordered column={1} style={{ marginTop: 20 }}>
        <Descriptions.Item label="用户名">{currentUser.userName}</Descriptions.Item>
        <Descriptions.Item label="性别">{currentUser.gender===1?'男':'女'}</Descriptions.Item>
        <Descriptions.Item label="账号">{currentUser.userAccount}</Descriptions.Item>
        <Descriptions.Item label="注册日期">{currentUser.createTime.toString().substring(0, 10)}</Descriptions.Item>
      </Descriptions>

      <Card title="我的课程" style={{ marginTop: 20 }}>
        <List
          itemLayout="horizontal"
          dataSource={courses}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="通知" style={{ marginTop: 20 }}>
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={item.content}
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title="编辑资料"
        visible={isEditModalVisible}
        onCancel={handleEditModalCancel}
        footer={null}
      >
        <Form onFinish={handleEditSubmit}>
          <Form.Item name="userName" label="用户名">
            <Input defaultValue={currentUser.userName} />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input defaultValue={currentUser.email} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="修改密码"
        visible={isPasswordModalVisible}
        onCancel={handlePasswordModalCancel}
        footer={null}
      >
        <Form onFinish={handlePasswordSubmit}>
          <Form.Item name="currentPassword" label="当前密码">
            <Input.Password />
          </Form.Item>
          <Form.Item name="newPassword" label="新密码">
            <Input.Password />
          </Form.Item>
          <Form.Item name="confirmPassword" label="确认新密码">
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserCenter;
