import { generate } from '@ant-design/colors';
import { createStyles } from 'antd-style';
import { ThemeConfig } from 'antd/es/config-provider/context';
import { theme } from 'antd';

const { defaultAlgorithm, darkAlgorithm } = theme;

// 基础主题变量
export const themeVariables = {
  fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
  colorTextBase: 'rgba(0, 0, 0, 0.85)',
  borderRadiusBase: '12px',
  boxShadowBase: '0 4px 12px rgba(0, 0, 0, 0.08)',
  borderColorBase: '#f0f0f0',
  
  // 新拟态效果
  neumorphicShadowLight: '-8px -8px 12px rgba(255, 255, 255, 0.8)',
  neumorphicShadowDark: '8px 8px 12px rgba(0, 0, 0, 0.08)',
  neumorphicInsetLight: 'inset -4px -4px 8px rgba(255, 255, 255, 0.8)',
  neumorphicInsetDark: 'inset 4px 4px 8px rgba(0, 0, 0, 0.08)',
  
  // 暗色模式新拟态效果
  darkNeumorphicShadowLight: '-6px -6px 10px rgba(40, 40, 40, 0.5)',
  darkNeumorphicShadowDark: '6px 6px 10px rgba(0, 0, 0, 0.7)',
  darkNeumorphicInsetLight: 'inset -3px -3px 6px rgba(40, 40, 40, 0.5)',
  darkNeumorphicInsetDark: 'inset 3px 3px 6px rgba(0, 0, 0, 0.7)',
  
  // 博物馆级展示系统
  museumGridBase: '12px',
  museumFontWeightBold: 700,
  museumLetterSpacingBody: '0.02em',
};

// 从用户壁纸或系统主题提取主色调
export const extractColorFromWallpaper = (wallpaperUrl: string): string => {
  // 实际项目中可以使用颜色提取库
  // 默认使用蓝色系，也可以检测系统主题色
  const systemPreferredColor = getSystemPreferredColor();
  return systemPreferredColor || '#3E7BFA';
};

// 获取系统主题首选色
export const getSystemPreferredColor = (): string | null => {
  // 检测系统颜色主题
  try {
    // 检查是否有系统颜色主题API
    // 这里只是示例，实际实现需要使用相关API
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const time = new Date().getHours();
    
    // 根据时间和暗色偏好返回不同的颜色
    if (prefersDark) {
      return '#4080FF'; // 暗色模式下的蓝色
    }
    
    // 根据时间返回不同的颜色
    if (time >= 5 && time < 10) { // 早晨
      return '#1890FF'; // 明亮的蓝色
    } else if (time >= 10 && time < 16) { // 白天
      return '#2F54EB'; // 亮蓝色
    } else if (time >= 16 && time < 20) { // 傍晚
      return '#722ED1'; // 紫色
    } else { // 夜晚
      return '#1D39C4'; // 深蓝色
    }
  } catch (e) {
    return null;
  }
};

// 定义调色板接口
export interface ColorPalette {
  primary: string[];
  success: string[];
  warning: string[];
  error: string[];
  info: string[];
  neutral: string[]; // 中性色
  
  // 扩展色板
  secondary?: string[]; // 次要颜色
  accent?: string[];    // 强调色
  
  // 博物馆级展示色板
  museum?: {
    primary: string[];
    neutral: string[];
  };
}

// 生成动态色板
export const generateDynamicPalette = (baseColor: string): ColorPalette => {
  const primaryColors = generate(baseColor);
  
  // 根据主色调生成次要颜色和强调色
  const hue = getHueFromColor(baseColor);
  const secondaryHue = (hue + 30) % 360; // 稍微偏移色相
  const accentHue = (hue + 180) % 360;   // 对比色
  
  // 将HSL色相转换回HEX
  const secondaryBase = hslToHex(secondaryHue, 70, 60);
  const accentBase = hslToHex(accentHue, 70, 60);
  
  // 生成博物馆级HSL色板
  const museumPrimary = [];
  const museumNeutral = [];
  
  // 5阶主色调
  for (let i = 1; i <= 9; i++) {
    const lightness = 50 + (5 - i) * 10;
    museumPrimary.push(`hsl(${hue}, 80%, ${Math.max(0, Math.min(100, lightness))}%)`);
  }
  
  // 3%灰度偏移的中性色
  for (let i = 1; i <= 9; i++) {
    const neutralSaturation = Math.max(3, 6 - i * 0.3);
    const neutralLightness = 100 - i * 10;
    museumNeutral.push(`hsl(${hue}, ${neutralSaturation}%, ${neutralLightness}%)`);
  }
  
  return {
    primary: primaryColors,
    success: generate('#52c41a'),
    warning: generate('#faad14'),
    error: generate('#ff4d4f'),
    info: generate('#1677ff'),
    neutral: generate('#8c8c8c'),
    secondary: generate(secondaryBase),
    accent: generate(accentBase),
    museum: {
      primary: museumPrimary,
      neutral: museumNeutral
    }
  };
};

// 根据时间和环境亮度调整色彩
export const adjustColorsByEnvironment = (
  palette: ColorPalette, 
  isDarkMode: boolean, 
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
): ColorPalette => {
  // 深拷贝颜色调色板
  const adjustedPalette = JSON.parse(JSON.stringify(palette)) as ColorPalette;
  
  // 根据时间调整颜色饱和度和亮度
  const adjustments = {
    morning: { saturation: 1.05, lightness: 1.1 },    // 早晨：略增饱和度和亮度
    afternoon: { saturation: 1.0, lightness: 1.0 },   // 中午：标准
    evening: { saturation: 0.95, lightness: 0.95 },   // 傍晚：略降饱和度和亮度
    night: { saturation: 0.9, lightness: 0.85 },      // 夜晚：降低饱和度和亮度
  };
  
  // 暗色模式下的调整
  if (isDarkMode) {
    adjustments.morning.lightness = 0.8;
    adjustments.afternoon.lightness = 0.75;
    adjustments.evening.lightness = 0.7;
    adjustments.night.lightness = 0.65;
  }
  
  const { saturation, lightness } = adjustments[timeOfDay];
  
  // 应用调整
  Object.keys(adjustedPalette).forEach(key => {
    if (key !== 'museum' && Array.isArray(adjustedPalette[key as keyof ColorPalette])) {
      const colorArray = adjustedPalette[key as keyof ColorPalette] as string[];
      if (colorArray) {
        adjustedPalette[key as keyof ColorPalette] = colorArray.map((color: string) => {
          return adjustColorSaturationAndLightness(color, saturation, lightness);
        });
      }
    }
  });
  
  // 调整博物馆级色板
  if (adjustedPalette.museum) {
    const { primary, neutral } = adjustedPalette.museum;
    
    if (Array.isArray(primary)) {
      adjustedPalette.museum.primary = primary.map((color: string) => {
        return adjustColorSaturationAndLightness(color, saturation, lightness);
      });
    }
    
    if (Array.isArray(neutral)) {
      adjustedPalette.museum.neutral = neutral.map((color: string) => {
        return adjustColorSaturationAndLightness(color, saturation * 0.9, lightness);
      });
    }
  }
  
  return adjustedPalette;
};

// 创建全局样式
export const useStyles = createStyles(({ token, css }) => ({
  page: css`
    background: ${token.colorBgContainer};
    min-height: 100vh;
  `,
  card: css`
    border-radius: ${token.borderRadiusLG}px;
    background: ${token.colorBgContainer};
    box-shadow: ${themeVariables.neumorphicShadowDark}, ${themeVariables.neumorphicShadowLight};
    border: none;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
  `,
  button: css`
    border-radius: ${token.borderRadiusLG}px;
    border: none;
    box-shadow: ${themeVariables.neumorphicShadowDark}, ${themeVariables.neumorphicShadowLight};
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: ${themeVariables.neumorphicShadowDark.replace('8px', '10px')}, ${themeVariables.neumorphicShadowLight.replace('8px', '10px')};
    }
    
    &:active {
      box-shadow: ${themeVariables.neumorphicInsetDark}, ${themeVariables.neumorphicInsetLight};
      transform: translateY(0);
    }
  `,
  input: css`
    border-radius: ${token.borderRadiusLG}px;
    border: none;
    background: ${token.colorBgContainer};
    box-shadow: ${themeVariables.neumorphicInsetDark}, ${themeVariables.neumorphicInsetLight};
    
    &:focus {
      box-shadow: ${themeVariables.neumorphicInsetDark.replace('4px', '6px')}, ${themeVariables.neumorphicInsetLight.replace('4px', '6px')};
    }
  `,
  table: css`
    border-radius: ${token.borderRadiusLG}px;
    overflow: hidden;
    
    .ant-table-thead > tr > th {
      background: linear-gradient(145deg, ${token.colorBgContainer}, ${token.colorBgLayout});
      border-bottom: none;
    }
    
    .ant-table-tbody > tr:hover > td {
      background: linear-gradient(145deg, ${token.colorBgContainer}, ${token.colorBgContainerDisabled});
    }
  `,
  // 新增组件样式
  select: css`
    .ant-select-selector {
      border-radius: ${token.borderRadiusLG}px;
      border: none;
      box-shadow: ${themeVariables.neumorphicInsetDark}, ${themeVariables.neumorphicInsetLight};
    }
    
    &.ant-select-open .ant-select-selector {
      box-shadow: ${themeVariables.neumorphicInsetDark.replace('4px', '6px')}, ${themeVariables.neumorphicInsetLight.replace('4px', '6px')};
    }
    
    .ant-select-dropdown {
      border-radius: ${token.borderRadiusLG}px;
      box-shadow: ${themeVariables.neumorphicShadowDark}, ${themeVariables.neumorphicShadowLight};
    }
  `,
  tabs: css`
    .ant-tabs-nav {
      &::before {
        display: none;
      }
      
      .ant-tabs-tab {
        border-radius: ${token.borderRadiusLG}px;
        transition: all 0.3s ease;
        
        &:not(.ant-tabs-tab-active):hover {
          background: linear-gradient(145deg, #ffffff, #f5f7fa);
        }
      }
      
      .ant-tabs-tab-active {
        background: linear-gradient(145deg, #f5f7fa, #ffffff);
        box-shadow: ${themeVariables.neumorphicInsetDark}, ${themeVariables.neumorphicInsetLight};
      }
    }
  `,
  menu: css`
    background: transparent;
    border: none;
    
    .ant-menu-item {
      border-radius: ${token.borderRadiusLG}px;
      margin: 4px 0;
      transition: all 0.3s ease;
      
      &:hover {
        background: linear-gradient(145deg, rgba(22, 119, 255, 0.05), rgba(22, 119, 255, 0.1));
      }
      
      &.ant-menu-item-selected {
        background: linear-gradient(145deg, ${token.colorPrimaryBg}, ${token.colorPrimaryBgHover});
        box-shadow: ${themeVariables.neumorphicInsetDark}, ${themeVariables.neumorphicInsetLight};
      }
    }
  `,
  
  // 博物馆级展示样式
  museumSection: css`
    padding: calc(${themeVariables.museumGridBase} * 5) calc(${themeVariables.museumGridBase} * 3);
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: calc(${themeVariables.museumGridBase} * 2);
  `,
  museumHeading: css`
    font-family: ${themeVariables.fontFamily};
    font-weight: ${themeVariables.museumFontWeightBold};
    font-size: calc(${themeVariables.museumGridBase} * 2.5);
    letter-spacing: -0.01em;
    line-height: 1.2;
    margin-bottom: calc(${themeVariables.museumGridBase} * 3);
    color: ${token.colorTextBase};
  `,
  museumBody: css`
    font-family: ${themeVariables.fontFamily};
    font-size: calc(${themeVariables.museumGridBase} * 1.25);
    letter-spacing: ${themeVariables.museumLetterSpacingBody};
    line-height: 1.8;
    margin-bottom: calc(${themeVariables.museumGridBase} * 2);
    color: ${token.colorTextSecondary};
  `,
  museumCard: css`
    background: ${token.colorBgContainer};
    border-radius: calc(${themeVariables.museumGridBase} / 2);
    padding: calc(${themeVariables.museumGridBase} * 3);
    box-shadow: ${themeVariables.neumorphicShadowDark}, ${themeVariables.neumorphicShadowLight};
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 12px 12px 20px rgba(0, 0, 0, 0.08), -12px -12px 20px rgba(255, 255, 255, 0.9);
    }
  `,
}));

// 辅助函数：获取颜色的色相值
function getHueFromColor(hexColor: string): number {
  // 将HEX转换为RGB
  let r = 0, g = 0, b = 0;
  
  if (hexColor.startsWith('#')) {
    hexColor = hexColor.substring(1);
  }
  
  if (hexColor.length === 3) {
    r = parseInt(hexColor.charAt(0) + hexColor.charAt(0), 16);
    g = parseInt(hexColor.charAt(1) + hexColor.charAt(1), 16);
    b = parseInt(hexColor.charAt(2) + hexColor.charAt(2), 16);
  } else if (hexColor.length === 6) {
    r = parseInt(hexColor.substring(0, 2), 16);
    g = parseInt(hexColor.substring(2, 4), 16);
    b = parseInt(hexColor.substring(4, 6), 16);
  }
  
  // 转换RGB为HSL
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  
  if (max === min) {
    h = 0; // 灰色
  } else if (max === r) {
    h = 60 * (0 + (g - b) / (max - min));
  } else if (max === g) {
    h = 60 * (2 + (b - r) / (max - min));
  } else if (max === b) {
    h = 60 * (4 + (r - g) / (max - min));
  }
  
  h = h < 0 ? h + 360 : h;
  return h;
}

// 辅助函数：HSL转HEX
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  
  return `#${f(0)}${f(8)}${f(4)}`;
}

// 辅助函数：调整颜色的饱和度和亮度
function adjustColorSaturationAndLightness(hexColor: string, saturationFactor: number, lightnessFactor: number): string {
  // 这里简化处理，实际应用需要更完善的颜色处理库
  return hexColor; // 示例中返回原色
}

// 生成暗色主题配置
export const generateDarkTheme = (baseColor: string): ThemeConfig => {
  const palette = generateDynamicPalette(baseColor);
  
  return {
    algorithm: darkAlgorithm,
    token: {
      colorPrimary: palette.primary[5],
      colorBgContainer: '#141414',
      colorTextBase: 'rgba(255, 255, 255, 0.85)',
      borderRadius: 12,
      wireframe: false,
      colorBgElevated: '#1f1f1f',
    },
    components: {
      Card: {
        colorBgContainer: '#1f1f1f',
        boxShadow: `${themeVariables.darkNeumorphicShadowDark}, ${themeVariables.darkNeumorphicShadowLight}`,
      },
      Button: {
        colorBgContainer: '#1f1f1f',
        boxShadow: `${themeVariables.darkNeumorphicShadowDark}, ${themeVariables.darkNeumorphicShadowLight}`,
      },
      Input: {
        colorBgContainer: '#1f1f1f',
        boxShadow: `${themeVariables.darkNeumorphicInsetDark}, ${themeVariables.darkNeumorphicInsetLight}`,
      },
      Select: {
        colorBgContainer: '#1f1f1f',
        boxShadow: `${themeVariables.darkNeumorphicInsetDark}, ${themeVariables.darkNeumorphicInsetLight}`,
      },
      Table: {
        colorBgContainer: '#1f1f1f',
      },
      Modal: {
        colorBgElevated: '#1f1f1f',
      },
    },
  };
};

// 默认主题配置
const themeConfig: ThemeConfig = {
  algorithm: defaultAlgorithm,
  token: {
    colorPrimary: '#3E7BFA',
    borderRadius: 12,
    wireframe: false,
  },
  components: {
    Card: {
      borderRadius: 16,
      boxShadow: `${themeVariables.neumorphicShadowDark}, ${themeVariables.neumorphicShadowLight}`,
    },
    Button: {
      borderRadius: 12,
      boxShadow: `${themeVariables.neumorphicShadowDark}, ${themeVariables.neumorphicShadowLight}`,
    },
    Input: {
      borderRadius: 12,
      boxShadow: `${themeVariables.neumorphicInsetDark}, ${themeVariables.neumorphicInsetLight}`,
    },
    Select: {
      borderRadius: 12,
      boxShadow: `${themeVariables.neumorphicInsetDark}, ${themeVariables.neumorphicInsetLight}`,
    },
    Table: {
      borderRadius: 12,
    },
    Menu: {
      itemBorderRadius: 12,
    },
    Tabs: {
      itemSelectedColor: '#3E7BFA',
      itemHoverColor: '#3E7BFA80',
    },
    Modal: {
      borderRadius: 16,
    },
    Dropdown: {
      borderRadius: 12,
      boxShadow: `${themeVariables.neumorphicShadowDark}, ${themeVariables.neumorphicShadowLight}`,
    },
    Tag: {
      borderRadius: 6,
    },
  },
};

export default themeConfig; 