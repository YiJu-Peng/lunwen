import { PageContainer} from '@ant-design/pro-components';
import '@umijs/max';
import React, { useEffect, useState} from 'react';
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
  const chartData = [3.225806, 25.531915, 2.352941]
  const chartData2 = [70.000000,77.708333,60.000000]
  //
  // // 映射：{ value: 1048, name: 'Search Engine' },
  // const usersData = users.map(item => {
  //   return {
  //     totalNum: item.totalNum,
  //     value: item.totalNum,
  //     name: item.userAccount,
  //   }
  // })

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['A','B','C']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '挂科率%',
        type: 'bar',
        emphasis: {
          focus: 'series'
        },
        data: chartData
      },
      {
        name: '平时成绩平均分数',
        type: 'bar',
        emphasis: {
          focus: 'series'
        },
        data: chartData2
      },
    ]
  };

  return (
    <PageContainer>
          <Card >
            <h1 style={{ textAlign: 'center' }}>各任课老师的挂科率和平时分平均分的分析</h1>
            <ReactECharts option={option} />
          </Card>
    </PageContainer>
  );
};
export default InterfaceAnalysis;
