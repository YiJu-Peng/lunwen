import { PageContainer} from '@ant-design/pro-components';
import '@umijs/max';
import React, { useEffect, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import {Card, Col, Row} from 'antd';
import {list3UsingGet} from "@/services/ant-design-pro/calculateController";


/**
 * 接口分析
 * @constructor
 */
const InterfaceAnalysis: React.FC = () => {
  const [data, setData] = useState<API.TeacherCountDTO[]>([]);
  // const [users, setusers] = useState<API.UserInvokVO[]>([]);
  useEffect(() => {
    try {
      list3UsingGet().then(res => {
        if (res) {
          setData(res);
        }
      })
    } catch (e: any) {

    }
    // try {
    //   listTopInvokeInterfaceInfoUsingGet().then(res => {
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
    return item.name;
  })
  const chartData1 = data.map(item => {
    return item.studentCount
  })
  const chartData2 = data.map(item => {
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
      formatter: function (params) {
        let res ='老师教的学生数量:'+params[0].name + '<br>';
        res += '平均成绩' + '：' + params[0].value + '<br>';
        return res;
      }
    },
    xAxis: {
      name: '学生数量',
      type: 'category',
      data: chartData1
    },
    yAxis: {
      max: 100,
      name: '平均成绩',
      type: 'value'
    },
    series: [
      {
        data: chartData2.map((value, index) => ({
          value,
          itemStyle: {
            color: colors[index % colors.length], // 循环使用颜色数组
          },
        })),
        type: 'bar'
      },
      {
        data: chartData2,
        type: 'line'
      }
    ]
  };

  return (
    <PageContainer>
      <Card>
            <h1 style={{ textAlign: 'center' }}>教师教学学生数量与平时成绩的关系</h1>
            <ReactECharts option={option} />
      </Card>
    </PageContainer>
  );
};
export default InterfaceAnalysis;
