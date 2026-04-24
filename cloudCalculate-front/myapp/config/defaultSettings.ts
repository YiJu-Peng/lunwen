import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name 项目默认配置
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  // 侧边导航继续沿用深色风格
  navTheme: 'realDark',
  // 主色调换成了更亮一些的蓝色
  colorPrimary: '#2563eb',
  // 整体布局采用侧边导航模式
  layout: 'side',
  // 内容区域宽度适当放大一些
  contentWidth: 'Fluid',
  // 页面顶部滚动时保持固定
  fixedHeader: true,
  // 左侧菜单栏保持固定显示
  fixSiderbar: true,
  // 色弱辅助模式默认关闭
  colorWeak: false,
  // 系统名称统一写在这一项
  title: '高校智能选课系统',
  // PWA 能力直接开启
  pwa: true,
  // 首页图标在这一项指定
  logo: '/logo.png',
  // 图标字体地址先预留到这一项
  iconfontUrl: '',
  // 页面水印相关参数统一放在这一块
  waterMarkProps: {
    content: '',
    fontColor: 'rgba(24, 144, 255, 0.0)',
  },
  // 菜单分栏模式暂时不启用
  splitMenus: false,
  // 侧边菜单宽度统一在这一项控制
  siderWidth: 220,
  // 下面集中配置主题相关细节参数
  token: {
    // 侧边栏配色细节在这一块调整
    sider: {
      colorMenuBackground: '#001529',
      colorTextMenu: 'rgba(255, 255, 255, 0.85)',
      colorTextMenuSelected: '#2563eb',
      colorTextMenuItemHover: '#2563eb',
      colorBgMenuItemHover: 'rgba(37, 99, 235, 0.1)',
      colorBgMenuItemSelected: 'rgba(37, 99, 235, 0.15)',
    },
    // 顶部栏配色统一在这一项定义
    header: {
      colorBgHeader: '#ffffff',
      colorHeaderTitle: '#2563eb',
      colorTextRightActionsItem: 'rgba(0, 0, 0, 0.75)',
    },
    // 页面主体容器的留白和背景都在这一块控制
    pageContainer: {
      paddingBlockPageContainerContent: 24,
      paddingInlinePageContainerContent: 24,
      colorBgPageContainer: '#f0f2f5',
    },
  },
};

export default Settings;
