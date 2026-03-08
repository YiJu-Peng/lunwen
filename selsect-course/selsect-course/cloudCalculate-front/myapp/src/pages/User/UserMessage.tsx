import React, {useEffect, useState} from 'react';
import {List, Typography, Pagination, Badge, Empty, Spin, Tag, Avatar, Tooltip, message} from 'antd';
import {getMessagesUsingGet, readMessageUsingPut} from "@/services/ant-design-pro/userController";
import {useModel} from "@@/exports";
import {
  ClockCircleOutlined, 
  BellOutlined, 
  CalendarOutlined,
  ReadOutlined,
  BookOutlined
} from "@ant-design/icons";
import PageContainer from '@/components/PageContainer';
import CommonCard from '@/components/CommonCard';
import './UserMessage.less';

const {Text, Paragraph} = Typography;

// 定义类型接口
interface CurrentUser {
  id: number;
  userName?: string;
  userAvatar?: string;
  userRole?: string;
  [key: string]: any;
}

interface MessageItem {
  id?: number;
  message?: string;
  isRead?: number;
  createTime?: string;
  [key: string]: any;
}

// 定义initialState类型
interface InitialState {
  currentUser?: CurrentUser;
  loading?: boolean;
}

// 定义消息类型对应的图标和颜色
const messageTypeConfig = {
  'default': {
    icon: <BookOutlined />,
    color: '#1677ff',
    tagColor: 'blue',
    title: '系统通知'
  },
  'course': {
    icon: <CalendarOutlined />,
    color: '#52c41a',
    tagColor: 'green',
    title: '选课信息'
  },
  'grade': {
    icon: <ReadOutlined />,
    color: '#722ed1',
    tagColor: 'purple',
    title: '成绩通知'
  }
};

// 获取消息类型（简单实现，实际应该根据后端数据判断）
const getMessageType = (content: string) => {
  if (content && (content.includes('选修') || content.includes('课程'))) {
    return 'course';
  } else if (content && (content.includes('成绩') || content.includes('分数'))) {
    return 'grade';
  }
  return 'default';
};

// 格式化时间
const formatTime = (timeStr: string) => {
  if (!timeStr) return '';
  
  const date = new Date(timeStr);
  const now = new Date();
  
  // 计算时间差（毫秒）
  const diff = now.getTime() - date.getTime();
  
  // 24小时内
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    if (hours === 0) {
      const minutes = Math.floor(diff / (60 * 1000));
      if (minutes === 0) {
        return '刚刚';
      }
      return `${minutes}分钟前`;
    }
    return `${hours}小时前`;
  }
  
  // 超过24小时但在30天内
  if (diff < 30 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days}天前`;
  }
  
  // 超过30天，显示年月日
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

const UserMessage: React.FC = () => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(false);
  const {initialState} = useModel('@@initialState') as { initialState: InitialState | undefined };
  const currentUser = initialState?.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (currentUser?.id) {
          const data = await getMessagesUsingGet({
            userId: currentUser.id,
            current: current,
            pageSize: pageSize
          });
          if (data && data.data) {
            setMessages(data.data.records || []);
            setTotal(data.data.total || 0);
          }
        }
      } catch (error) {
        console.error('获取消息失败:', error);
        message.error('获取消息失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser?.id) {
      fetchData();
    }
  }, [currentUser, current, pageSize]);

  const handlePageChange = (page: number, newPageSize?: number) => {
    setCurrent(page);
    if (newPageSize) {
      setPageSize(newPageSize);
    }
  };
  
  const markAsRead = async (id: number) => {
    try {
      await readMessageUsingPut({id});
      const updatedMessages = messages.map(msg =>
        msg.id === id ? {...msg, isRead: 1} : msg
      );
      setMessages(updatedMessages);
      message.success('已标记为已读');
    } catch (error) {
      console.error('标记消息失败:', error);
      message.error('标记已读失败，请稍后重试');
    }
  };

  const renderMessageList = () => {
    if (messages.length === 0) {
      return (
        <Empty 
          description="暂无消息" 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          className="message-empty"
        />
      );
    }

    return (
      <List
        className="message-list"
        dataSource={messages}
        renderItem={(item) => {
          const type = getMessageType(item.message || '');
          const config = messageTypeConfig[type];
          
          return (
            <List.Item className="message-list-item">
              <div className={`message-item ${!item.isRead ? 'message-item-unread' : ''}`}>
                <div className="message-item-avatar">
                  <Avatar 
                    icon={config.icon} 
                    size={40}
                    style={{ backgroundColor: config.color }}
                  />
                </div>
                
                <div className="message-item-content" onClick={() => {
                  if (!item.isRead && item.id) {
                    markAsRead(item.id);
                  }
                }}>
                  <CommonCard
                    hoverable
                    highlight={!item.isRead}
                    status={!item.isRead ? 'processing' : undefined}
                    title={config.title}
                    subtitle={
                      <Tooltip title={item.createTime}>
                        <span className="message-time">
                          <ClockCircleOutlined /> {formatTime(item.createTime as string)}
                        </span>
                      </Tooltip>
                    }
                    extra={
                      !item.isRead && (
                        <Badge 
                          count="未读" 
                          style={{ backgroundColor: '#ff4d4f' }}
                        />
                      )
                    }
                  >
                    <Paragraph className="message-content">
                      {item.message}
                    </Paragraph>
                  </CommonCard>
                </div>
              </div>
            </List.Item>
          );
        }}
      />
    );
  };

  return (
    <PageContainer
      title="消息中心"
      subtitle={`您有 ${total} 条消息`}
      extra={<Tag color="blue">{`第 ${current} 页 / 共 ${Math.ceil(total / pageSize)} 页`}</Tag>}
      loading={loading}
    >
      <div className="message-container">
        {renderMessageList()}
        
        {total > 0 && (
          <Pagination
            className="message-pagination"
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            onShowSizeChange={(current, size) => handlePageChange(1, size)}
            showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
            showSizeChanger
            showQuickJumper
            hideOnSinglePage
          />
        )}
      </div>
    </PageContainer>
  );
};

export default UserMessage;
