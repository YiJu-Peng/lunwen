import {AvatarDropdown, AvatarName, Footer, Question} from '@/components';
import { LinkOutlined } from '@ant-design/icons';
import {Settings as LayoutSettings} from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { Link, history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import React, {useState} from "react";
import {requestConfig} from "@/requestConfig";
import {getLoginUser} from "@/services/ant-design-pro/userController";
import {flushSync} from "react-dom";
import { ConfigProvider } from 'antd';
import { StyleProvider } from 'antd-style';
import themeConfig, { generateDynamicPalette, extractColorFromWallpaper, adjustColorsByEnvironment, generateDarkTheme } from './theme.config';
import { useMotionSetup, TransitionPageContainer } from './components/MotionComponents';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.LoginUserVO;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.LoginUserVO | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      // 使用新的getLoginUser方法获取用户信息
      const res = await getLoginUser({
        skipErrorHandler: true,
      });
      return res.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}


export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    actionsRender: () => [<Question key="doc" />],
    avatarProps: {
      src: initialState?.currentUser?.userAvatar || "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.userName,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    menuItemRender: (menuItemProps, defaultDom) => {
      if (menuItemProps.isUrl || !menuItemProps.path) {
        return defaultDom;
      }
      // 给菜单项添加动画效果
      return (
        <Link 
          to={menuItemProps.path} 
          style={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {defaultDom}
        </Link>
      );
    },
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#2563eb',
                borderRadius: 8,
                colorLink: '#2563eb',
                colorLinkHover: '#4285f4',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                colorBgContainer: '#ffffff',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              },
              components: {
                Card: {
                  borderRadiusLG: 12,
                  colorBorderSecondary: 'rgba(0, 0, 0, 0.06)',
                  boxShadowTertiary: '0 4px 12px rgba(0, 0, 0, 0.08)',
                },
                Button: {
                  borderRadius: 6,
                  controlHeight: 36,
                },
                Input: {
                  borderRadius: 6,
                  controlHeight: 38,
                },
                Select: {
                  borderRadius: 6,
                  controlHeight: 38,
                },
                Table: {
                  borderRadius: 8,
                  colorBgContainer: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                },
                Menu: {
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                },
                Layout: {
                  colorBgHeader: '#ffffff',
                  colorBgBody: '#f0f2f5',
                  colorBgTrigger: 'rgba(0, 0, 0, 0.02)',
                },
              },
            }}
          >
            <StyleProvider>
              {children}
              {isDev && initialState && (
                <SettingDrawer
                  disableUrlParams
                  enableDarkTheme
                  settings={initialState.settings}
                  onSettingChange={(settings1) => {
                      setInitialState((preInitialState) => ({
                        ...preInitialState,
                        settings: settings1,
                      }));
                  }}
                />
              )}
            </StyleProvider>
          </ConfigProvider>
        </>
      );
    },
    // 页面加载时的过渡动画
    contentStyle: {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    ...initialState?.settings,
  };
};

/**
 * 设置CSS变量以匹配主题配置
 */
function setCSSVariables(primaryColor = '#2563eb') {
  const root = document.documentElement;
  
  // 设置主色调
  root.style.setProperty('--ant-primary-color', primaryColor);
  root.style.setProperty('--ant-primary-color-hover', '#4285f4');
  
  // 其他颜色
  root.style.setProperty('--ant-error-color', '#dc2626');
  root.style.setProperty('--ant-success-color', '#10b981');
  root.style.setProperty('--ant-warning-color', '#f59e0b');
  
  // 阴影和边框
  root.style.setProperty('--ant-shadow-1', '0 2px 8px rgba(0, 0, 0, 0.08)');
  root.style.setProperty('--ant-shadow-2', '0 4px 16px rgba(0, 0, 0, 0.1)');
  root.style.setProperty('--ant-border-radius-base', '8px');
  root.style.setProperty('--ant-border-radius-lg', '12px');
  root.style.setProperty('--ant-border-radius-sm', '4px');
}

/**
 * 根容器，应用全局主题配置
 */
export function rootContainer(container: React.ReactNode) {
  // 创建一个包装组件来使用useMotionSetup钩子
  const AppWrapper = () => {
    // 在组件内部调用hooks
    useMotionSetup();
    
    // 获取当前主题模式（明亮/暗黑）
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 获取当前时间
    const hour = new Date().getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'afternoon';
    
    if (hour >= 5 && hour < 10) {
      timeOfDay = 'morning';
    } else if (hour >= 10 && hour < 16) {
      timeOfDay = 'afternoon';
    } else if (hour >= 16 && hour < 20) {
      timeOfDay = 'evening';
    } else {
      timeOfDay = 'night';
    }
    
    // 提取系统主色调
    const baseColor = extractColorFromWallpaper('');
    
    // 基于主色调生成动态色板，并根据时间和环境调整
    const dynamicPalette = adjustColorsByEnvironment(
      generateDynamicPalette(baseColor),
      prefersDarkMode,
      timeOfDay
    );
    
    // 将主题配置同步到最新
    const updatedTheme = prefersDarkMode
      ? generateDarkTheme(baseColor)
      : {
          ...themeConfig,
          token: {
            ...themeConfig.token,
            colorPrimary: baseColor,
          },
        };
    
    // 设置CSS变量
    React.useEffect(() => {
      setCSSVariables(baseColor);
      
      if (prefersDarkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      
      // 监听系统主题变化
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleThemeChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      };
      
      darkModeMediaQuery.addEventListener('change', handleThemeChange);
      return () => {
        darkModeMediaQuery.removeEventListener('change', handleThemeChange);
      };
    }, [prefersDarkMode, baseColor]);
    
    return (
      <StyleProvider>
        <ConfigProvider theme={updatedTheme}>
          <TransitionPageContainer>
            {container}
          </TransitionPageContainer>
        </ConfigProvider>
      </StyleProvider>
    );
  };
  
  return <AppWrapper />;
}

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = requestConfig;
