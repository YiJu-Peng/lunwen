import UserMessage from "@/pages/User/UserMessage";
import { ExperimentOutlined } from '@ant-design/icons';

export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  {
    path: '/userCenter',
    component: './User/UserCenter',
  },
  {
    path: '/userMessage',
    component: './User/UserMessage',
  },
  { path: '/welcome', name: '欢迎', icon: 'WechatOutlined', component: './Welcome' },
  // { path: '/design-showcase', name: '设计组件展示', icon: 'AppstoreOutlined', component: './design-showcase' },
  // { path: '/design-system', name: '设计系统', icon: 'AppstoreOutlined', component: './DesignSystem' },
  // { path: '/immersive-design', name: '沉浸式设计', icon: 'ExperimentOutlined', component: './ImmersiveDesign' },
  // { path: '/visual-experience', name: '视觉体验', icon: 'ExperimentOutlined', component: './VisualExperience' },
  // { path: '/design-system/immersive-demo', name: '沉浸式演示', component: './DesignSystem/ImmersiveDemo' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/upload', name: '上传成绩数据',component: './admin/Admin' },
      { path: '/admin/course', name: '课程管理',component: './admin/Course' },
      { path: '/admin/student', name: '学生管理', component: './admin/Student' },
      { path: '/admin/teacher', name: '教师管理', component: './admin/Teacher' },
    ],
  },
  // {
  //   path: '/score',
  //   name: '成绩页面',
  //   icon: 'smile',
  //   routes: [
  //     { path: '/score', redirect: '/score/sub-page' },
  //     { name: '缓考的学院分布饼状图', icon: 'table', path: '/score/list1', component: './classCalculate/list1' },
  //     { name: '缓考原因饼状图', icon: 'table', path: '/score/list2', component: './classCalculate/list2' },
  //     { name: '任一门课成绩分析', icon: 'table', path: '/score/list3', component: './classCalculate/list3' },
  //     { name: '平时成绩与挂科率分析', icon: 'table', path: '/score/list4', component: './classCalculate/list4' },
  //     { name: '各科成绩分析', icon: 'table', path: '/score/list5', component: './classCalculate/list5' },
  //     { name: '各班挂科率对比', icon: 'table', path: '/score/list6', component: './classCalculate/list6' },
  //     { name: '男女生各科成绩差异', icon: 'table', path: '/score/list7', component: './classCalculate/list7' },
  //     { name: '任课老师挂科率和平时分的分析', icon: 'table', path: '/score/list8', component: './classCalculate/list8' },
  //   ],
  // },
  { path: '/courseSelect', name: '选课页面', icon: 'smile', component: './CourseSelectionPage' },
  { path: '/course-recommendations', name: '课程推荐', icon: 'bulb', component: './CourseRecommendation' },
  { path: '/selected', name: '已选课程页面', icon: 'smile', component: './SelectedCoursesPage' },
  { path: '/schedule', name: '我的课程表', icon: 'calendar', component: './SchedulePage' },
  // { name: '专业课与公共课平时成绩与总评对比', icon: 'table', path: '/list9', component: './classCalculate/list9' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
