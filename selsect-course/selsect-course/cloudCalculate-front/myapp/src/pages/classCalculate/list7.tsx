import {PageContainer} from '@ant-design/pro-components';
import '@umijs/max';
import React, {useEffect, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import {Card, Col, Row} from 'antd';


/**
 * 接口分析
 * @constructor
 */
const InterfaceAnalysis: React.FC = () => {
  // const [data, setData] = useState<API.InterfaceInfoVO[]>([]);
  // const [users, setusers] = useState<API.UserInvokVO[]>([]);
  useEffect(() => {
    // try {
    //   listTopInvokeInterfaceInfoUsingGet().then(res => {
    //     if (res.data) {
    //       setData(res.data);
    //     }
    //   })
    // } catch (e: any) {
    //
    // }
    // try {
    //   listTopUserInvokeInterfaceInfoUsingGet().then(res => {
    //     if (res.data) {
    //       setusers(res.data);
    //     }
    //   })
    // } catch (e: any) {
    //
    // }
  }, [])

  // 映射：{ value: 1048, name: 'Search Engine' },
  const chartData = [
    -8.118881,
    -8.122378,
    -8.790210,
    -9.185185,
    -9.444444,
    -9.572391,
    -9.838384,
    -12.024476,
    -12.074074,
    -13.857143,
  ]
  //
  // // 映射：{ value: 1048, name: 'Search Engine' },
  // const usersData = users.map(item => {
  //   return {
  //     totalNum: item.totalNum,
  //     value: item.totalNum,
  //     name: item.userAccount,
  //   }
  // })

  const colors = ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
    '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
    // 可以继续添加更多颜色
  ];

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        let res = '老师教的学生数量:' + params[0].name + '<br>';
        res += '平均成绩' + '：' + params[0].value + '<br>';
        return res;
      }
    },
    xAxis: {
      name: '课程名称',
      type: 'category',
      data: [
        "Linux系统管理与配置",
        "实训(一)",
        "云计算导论",
        "大学英语视听说（Ⅱ）",
        "网球",
        "幼儿文学",
        "大学英语视听说(Ⅳ)",
        "职业规划与创新创业教育",
        "软件工程",
        "物理实验",
      ],
      // 控制x轴名称的样式
      nameTextStyle: {
        fontSize: 8, // 根据需要调整名称的字体大小
      },
      // 控制x轴标签的样式
      axisLabel: {
        interval: 0, // 显示所有标签
        rotate: 45, // 设置标签倾斜45度
        fontSize: 8, // 减小字体大小
      },
    },

    yAxis: {
      max: 0,
      name: '平均成绩',
      type: 'value'
    },
    series: [
      {
        name: '平均成绩', // 系列名称，与legend.data中的一个相对应
        data: chartData.map((value, index) => ({
          value,
          itemStyle: {
            color: colors[index % colors.length], // 循环使用颜色数组
          },
        })),
        type: 'bar'
      },
      {
        name: '课程', // 系列名称，与legend.data中的另一个相对应
        data: [
          "Linux系统管理与配置",
          "实训(一)",
          "云计算导论",
          "大学英语视听说（Ⅱ）",
          "网球",
          "幼儿文学",
          "大学英语视听说(Ⅳ",
          "职业规划与创新创业教育",
          "软件工程",
          "物理实验",
        ],
        type: 'line'
      }
    ]
  };
  const chardataNames2 = [
    '乒乓球Ⅰ',
    '形势与政策',
    'Java程序设计',
    '实训(二)',
    '数据库系统原理及应用',
  ];

  const chardataValues2 = [
    6.072222,
    4.390572,
    2.727273,
    2.430070,
    2.067340,
  ];

  const option1 = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        let res = '老师教的学生数量:' + params[0].name + '<br>';
        res += '平均成绩' + '：' + params[0].value + '<br>';
        return res;
      }
    },
    xAxis: {
      name: '课程名称',
      type: 'category',
      data: chardataNames2,
      // 控制x轴名称的样式
      nameTextStyle: {
        fontSize: 8, // 根据需要调整名称的字体大小
      },
      // 控制x轴标签的样式
      axisLabel: {
        interval: 0, // 显示所有标签
        rotate: 45, // 设置标签倾斜45度
        fontSize: 8, // 减小字体大小
      },
    },

    yAxis: {
      max: 10,
      name: '平均成绩',
      type: 'value'
    },
    series: [
      {
        data: chardataValues2.map((value, index) => ({
          value,
          itemStyle: {
            color: colors[index % colors.length], // 循环使用颜色数组
          },
        })),
        type: 'bar'
      },
      {
        data: chardataValues2,
        type: 'line'
      }
    ]
  };

  return (
    <PageContainer>
      <Card style={{width: '100%', height: '50%'}}>
        <h4 style={{textAlign: 'center'}}>男女在某科平时成绩差异最大的十个科目(女生正序)</h4>
        <ReactECharts option={option} style={{width: '100%', height: '380px'}}/>
      </Card>
      <Card style={{width: '100%', height: '50%'}}>
        <h4 style={{textAlign: 'center'}}>男女在某科平时成绩差异最大的十个科目（男生）</h4>
        <ReactECharts option={option1} style={{width: '100%', height: '380px'}}/>
      </Card>
    </PageContainer>
  );
};
export default InterfaceAnalysis;
