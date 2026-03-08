import { PageContainer} from '@ant-design/pro-components';
import '@umijs/max';
import React, { useEffect, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import {Card, Col, Row} from 'antd';
import {list1UsingGet} from "@/services/ant-design-pro/calculateController";
import {c} from "@umijs/utils/compiled/tar";


/**
 * 接口分析
 * @constructor
 */
const InterfaceAnalysis: React.FC = () => {
  const [data, setData] = useState<API.CollegeCountDTO[]>([]);
  // const [users, setusers] = useState<API.UserInvokVO[]>([]);
  useEffect(() => {
    try {
      list1UsingGet().then(res => {
        if (res) {
          setData(res);
        }
      })
    } catch (e: any) {

    }

  }, [])

  // 映射：{ value: 1048, name: 'Search Engine' },
  const chartData = data.map(item => {
    return {
      value: parseInt(item.value),
      name: item.name,
    }
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

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      textStyle: {
        fontSize: 18, // 根据需要调整字体大小
      },
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data
      }
    ]
  };

  const userOption = {
    dataset: {
      source: [],
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: { containLabel: true },
    xAxis: { name: '调用次数' },
    yAxis: { name: '用户名', type: 'category' },
    visualMap: {
      orient: 'horizontal',
      left: 'center',
      min: 10,
      max: 1000000,
      text: ['低调用', '高调用'],
      // Map the score column to color
      dimension: 0,
      inRange: {
        color: ['#65B581', '#FFCE34', '#FD665F']
      }
    },
    series: [
      {
        type: 'bar',
        encode: {
          // Map the "amount" column to X axis.
          x: 'totalNum',
          // Map the "product" column to Y axis
          y: 'name'
        }
      }
    ]
  };

  return (
    <PageContainer>
          <Card >
            <h1 style={{ textAlign: 'center' }}>各学院缓考人数统计</h1>
            <ReactECharts option={option} />
          </Card>
          {/*<Card>*/}
          {/*  <h1 style={{textAlign: 'center'}}>用户调用次数统计TOP10</h1>*/}
          {/*  <ReactECharts option={userOption}/>*/}
          {/*</Card>*/}
    </PageContainer>
  );
};
export default InterfaceAnalysis;
