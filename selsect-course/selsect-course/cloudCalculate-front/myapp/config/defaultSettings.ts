import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name 项目默认配置
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  // 使用深色侧边栏主题
  navTheme: 'realDark',
  // 主题色 - 使用更加鲜艳的蓝色
  colorPrimary: '#2563eb',
  // 使用侧边栏布局
  layout: 'side',
  // 更宽的内容区
  contentWidth: 'Fluid',
  // 固定头部
  fixedHeader: true,
  // 固定侧边栏
  fixSiderbar: true,
  // 不使用色弱模式
  colorWeak: false,
  // 系统标题
  title: '工学院选课系统',
  // 支持PWA
  pwa: true,
  // 现代Logo
  logo: '/logo.png',
  // 图标字体URL
  iconfontUrl: '',
  // 水印
  waterMarkProps: {
    content: '工学院选课系统',
    fontColor: 'rgba(24, 144, 255, 0.15)',
  },
  // 分割菜单
  splitMenus: false,
  // 菜单宽度
  siderWidth: 220,
  // 自定义主题相关配置
  token: {
    // 侧边栏样式
    sider: {
      colorMenuBackground: '#001529',
      colorTextMenu: 'rgba(255, 255, 255, 0.85)',
      colorTextMenuSelected: '#2563eb',
      colorTextMenuItemHover: '#2563eb',
      colorBgMenuItemHover: 'rgba(37, 99, 235, 0.1)',
      colorBgMenuItemSelected: 'rgba(37, 99, 235, 0.15)',
    },
    // 头部样式
    header: {
      colorBgHeader: '#ffffff',
      colorHeaderTitle: '#2563eb',
      colorTextRightActionsItem: 'rgba(0, 0, 0, 0.75)',
    },
    // 页面容器
    pageContainer: {
      paddingBlockPageContainerContent: 24,
      paddingInlinePageContainerContent: 24,
      colorBgPageContainer: '#f0f2f5',
    },
  },
};

export default Settings;
