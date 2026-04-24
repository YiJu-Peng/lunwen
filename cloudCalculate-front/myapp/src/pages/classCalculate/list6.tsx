import { PageContainer} from '@ant-design/pro-components';
import '@umijs/max';
import React, { useEffect, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import {Card, Col, Row} from 'antd';
import {list6UsingGet} from "@/services/ant-design-pro/calculateController";


/**
 * 接口分析
 * @constructor
 */
const InterfaceAnalysis: React.FC = () => {
  const [data, setData] = useState<API.ClassFailCountDTO[]>([]);
  // const [users, setusers] = useState<API.UserInvokVO[]>([]);
  useEffect(() => {
    try {
      list6UsingGet().then(res => {
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
    return item.className;
  })
  const chartData1 = data.map(item => {
    return item.failRatio;
  })
  const colors = ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
    '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
    // 可以继续添加更多颜色
  ];

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any[]) {
        let res ='班级:'+params[0].name + '<br>';
        res += '挂科率' + '：' + params[0].value + '<br>';
        return res;
      }
    },
    xAxis: {
      name: '班级平成',
      type: 'category',
      data: chartData
    },
    yAxis: {
      max: 50,
      name: '挂科率',
      type: 'value'
    },
    series: [
      {
        data: chartData1.map((value, index) => ({
          value,
          itemStyle: {
            color: colors[index % colors.length], // 循环使用颜色数组
          },
        })),
        type: 'bar'
      },
      {
        data: chartData1,
        type: 'line'
      }
    ]
  };

  return (
    <PageContainer>
          <Card >
            <h1 style={{ textAlign: 'center' }}>各班挂科率分析</h1>
            <ReactECharts option={option}/>
          </Card>
    </PageContainer>
  );
};
export default InterfaceAnalysis;
