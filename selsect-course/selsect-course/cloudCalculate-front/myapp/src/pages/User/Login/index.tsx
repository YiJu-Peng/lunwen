import { Footer } from '@/components';
import {
  LockOutlined,
  MobileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  ProFormInstance,
} from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
import { Alert, Tabs, message, Typography, Button, Space, Divider } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
import {userLoginUsingPost} from "@/services/ant-design-pro/userController";
import './style.less';

const { Title, Text } = Typography;

const useStyles = createStyles(({ token }) => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      background: 'linear-gradient(to right, #f6f8fb, #e9f0f9)',
      position: 'relative',
      paddingInline: '0',
    },
    content: {
      flex: '1',
      padding: '32px 0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
      borderRadius: '12px',
      overflow: 'hidden',
      width: '420px',
      maxWidth: '95%',
      padding: '40px 30px',
      position: 'relative',
      zIndex: 100,
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    logo: {
      height: '64px',
      marginBottom: '16px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: token.colorTextHeading,
      marginBottom: '8px',
    },
    subTitle: {
      fontSize: '14px',
      color: token.colorTextSecondary,
    },
    footer: {
      marginTop: '24px',
      textAlign: 'center',
      color: token.colorTextSecondary,
      fontSize: '13px',
    },
    form: {
      maxWidth: '100%',
      width: '100%',
    },
    tabs: {
      marginBottom: '24px',
    },
    submitButton: {
      height: '44px',
      width: '100%',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      background: 'linear-gradient(to right, #1677ff, #4096ff)',
      boxShadow: '0 2px 8px rgba(22, 119, 255, 0.2)',
      '&:hover': {
        background: 'linear-gradient(to right, #0958d9, #1677ff)',
        boxShadow: '0 4px 12px rgba(22, 119, 255, 0.3)',
        transform: 'translateY(-1px)',
      },
    },
    decorator: {
      position: 'absolute',
      zIndex: 1,
    },
    decoratorTop: {
      top: '0',
      right: '0',
      width: '200px',
      height: '200px',
      background: 'radial-gradient(circle, rgba(22, 119, 255, 0.1) 0%, rgba(22, 119, 255, 0) 70%)',
      borderRadius: '0 0 0 100%',
    },
    decoratorBottom: {
      bottom: '0',
      left: '0',
      width: '200px',
      height: '200px',
      background: 'radial-gradient(circle, rgba(82, 196, 26, 0.1) 0%, rgba(82, 196, 26, 0) 70%)',
      borderRadius: '0 100% 0 0',
    },
    '@media screen and (max-width: 576px)': {
      card: {
        padding: '30px 20px',
        width: '100%',
        maxWidth: '95%',
      },
      title: {
        fontSize: '24px',
      },
      logo: {
        height: '50px',
      },
    },
  };
});

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
        borderRadius: '6px',
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  // 定义一个接口用于临时存储登录状态
  interface LoginState {
    status?: 'error' | 'success';
    type?: string;
  }
  
  const [userLoginState, setUserLoginState] = useState<LoginState>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { status, type: loginType } = userLoginState;
  const [loading, setLoading] = useState(false);
  // 创建一个表单引用
  const formRef = useRef<ProFormInstance>();
  const { styles } = useStyles();
  
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s: any) => ({
          ...s,
          currentUser: userInfo,
        }) as any);
      });
    }
  };
  
  const handleSubmit = async (values: API.UserLoginRequest) => {
    setLoading(true);
    try {
      // 登录
      const msg = await userLoginUsingPost({
        ...values,
      });
      if (msg && msg.code === 200) {
        // 登录成功，保存token到localStorage
        localStorage.setItem('tokenName', msg.data.tokenName);
        localStorage.setItem('tokenValue', msg.data.tokenValue);
        
        // 设置用户信息到initialState
        flushSync(() => {
          setInitialState((s: any) => ({
            ...s,
            currentUser: msg.data.user,
          }) as any);
        });
        
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      
      // 如果失败去设置用户错误信息
      setUserLoginState({
        status: 'error',
        type: 'account',
      });
      message.error(msg?.message || '登录失败，请检查账号密码');
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      
      {/* 装饰元素 */}
      <div className={`${styles.decorator} ${styles.decoratorTop}`}></div>
      <div className={`${styles.decorator} ${styles.decoratorBottom}`}></div>
      
      {/* 气泡装饰 */}
      <div className="login-bubble login-bubble-1"></div>
      <div className="login-bubble login-bubble-2"></div>
      <div className="login-bubble login-bubble-3"></div>
      <div className="login-bubble login-bubble-4"></div>
      <div className="login-bubble login-bubble-5"></div>
      
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.header}>
            <img src="/logo.png" alt="Logo" className={styles.logo} />
            <Title level={2} className={styles.title}>高校智能选课系统</Title>
            <Text type="secondary" className={styles.subTitle}>使用学号、工号或手机号登录统一选课平台</Text>
          </div>
          
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            className={styles.tabs}
            items={[
              {
                key: 'account',
                label: '账户密码登录',
              },
              {
                key: 'mobile',
                label: '手机号快捷登录',
              },
            ]}
          />
          
          {status === 'error' && loginType === 'account' && (
            <LoginMessage content={'账号或密码错误'} />
          )}
          
          <LoginForm
            formRef={formRef}
            className={styles.form}
            submitter={{
              searchConfig: {
                submitText: '登 录',
              },
              submitButtonProps: {
                size: 'large',
                loading: loading,
                className: styles.submitButton,
                style: { width: '100%' }
              },
            }}
            onFinish={async (values) => {
              await handleSubmit(values as API.UserLoginRequest);
            }}
          >
            {type === 'account' && (
              <>
                <ProFormText
                  name="userAccount"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className="login-input-icon" />,
                  }}
                  placeholder={'请输入账号'}
                  rules={[
                    {
                      required: true,
                      message: '账号不能为空',
                    },
                    {
                      min: 5,
                      message: '账号长度不能少于5位',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="userPassword"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className="login-input-icon" />,
                  }}
                  placeholder={'请输入密码'}
                  rules={[
                    {
                      required: true,
                      message: '密码不能为空',
                    },
                    {
                      min: 6,
                      message: '密码长度不能少于6位',
                    },
                  ]}
                />
                
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
                  <ProFormCheckbox name="autoLogin">
                    自动登录
                  </ProFormCheckbox>
                  <a style={{ fontSize: '14px' }}>忘记密码？</a>
                </div>
              </>
            )}

            {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
            {type === 'mobile' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileOutlined className="login-input-icon" />,
                  }}
                  name="mobile"
                  placeholder={'请输入手机号'}
                  rules={[
                    {
                      required: true,
                      message: '手机号不能为空',
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: '手机号格式不正确',
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className="login-input-icon" />,
                  }}
                  captchaProps={{
                    size: 'large',
                  }}
                  placeholder={'请输入验证码'}
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count} 秒后重新获取`;
                    }
                    return '获取验证码';
                  }}
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: '验证码不能为空',
                    },
                  ]}
                  onGetCaptcha={async () => {
                    message.success('验证码发送成功！');
                  }}
                />
              </>
            )}
          </LoginForm>
          
          <Divider plain>
            <Text type="secondary" style={{ fontSize: '14px' }}>其他登录方式</Text>
          </Divider>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
            <Button type="text" shape="circle" className="login-icon-button login-icon-button-wechat">
              <i className="login-icon wechat-icon"></i>
            </Button>
            <Button type="text" shape="circle" className="login-icon-button login-icon-button-qq">
              <i className="login-icon qq-icon"></i>
            </Button>
            <Button type="text" shape="circle" className="login-icon-button login-icon-button-weibo">
              <i className="login-icon weibo-icon"></i>
            </Button>
          </div>
          
          <div className={styles.footer}>
            <div>账号由系统管理员统一分配</div>
            <div style={{ marginTop: '8px' }}>适用于学生、教师与管理员统一登录</div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
