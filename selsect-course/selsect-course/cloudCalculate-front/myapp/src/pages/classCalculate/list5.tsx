import { PageContainer} from '@ant-design/pro-components';
import '@umijs/max';
import React, { useEffect, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import {Card, Col, Row} from 'antd';
import {list5UsingGet} from "@/services/ant-design-pro/calculateController";


/**
 * 接口分析
 * @constructor
 */
const InterfaceAnalysis: React.FC = () => {
  const [data, setData] = useState<API.ClassesAvgDTO[]>([]);
  // const [users, setusers] = useState<API.UserInvokVO[]>([]);
  useEffect(() => {
    try {
      list5UsingGet().then(res => {
        if (res) {
          setData(res);
        }
      })
    } catch (e: any) {

    }
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
  const chartData = data.map(item => {
    return item.subjectName
  })
  const chartData1 = data.map(item => {
    return item.averageScore
  })
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
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '1%',
      right: '1%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: chartData,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          rotate: 0,
          interval: 0, // 根据实际情况调整，如每隔一个显示可设为'auto'
          fontSize: 10 // 减小字体大小
        },
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    dataZoom: [ // 添加数据区域缩放组件
      {
        type: 'slider', // 类型为滑块型
        show: true, // 显示滑块
        start: 0, // 初始缩放比例的起始位置
        end: 10, // 初始缩放比例的结束位置
        handleSize: '80%', // 滑块的大小
        height: 15, // 滑块组件的高度
        xAxisIndex: [0], // 控制的X轴索引，如果有多个X轴，按需设置
        filterMode: 'filter' // 数据过滤模式，'filter'表示过滤掉滑块外的数据
      },
      {
        type: 'inside', // 内置型数据缩放组件，适用于触屏设备
        xAxisIndex: [0]
      }
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: chartData1.map((value, index) => ({
          value,
          itemStyle: {
            color: colors[index % colors.length], // 循环使用颜色数组
          },
        })),
      }
    ]
  };


  return (
    <PageContainer>
      <Card>
        <h1 style={{textAlign: 'center'}}>各课程平均分统计</h1>
        <h2 style={{textAlign: 'center'}}>拖动下面滑动条可以查看更多条目以及增加同时展示条目数量</h2>
        <ReactECharts option={option}/>
      </Card>
    </PageContainer>
  );
};
export default InterfaceAnalysis;
