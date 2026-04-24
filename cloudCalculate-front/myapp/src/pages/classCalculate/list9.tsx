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
  // const chartData = data.map(item => {
  //   return {
  //     value: item.totalNum,
  //     name: item.name,
  //   }
  // })
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
    legend: {
      top: 'left'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: false },
        dataView: { show: false, readOnly: false },
        restore: { show: false },
        saveAsImage: { show: true }
      }
    },
    height: 300,
    series: [
      {
        name: 'Nightingale Chart',
        type: 'pie',
        radius: [20, 100],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 3
        },
        data: []
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
      <Row gutter={16}>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Card >
            <h1 style={{ textAlign: 'center' }}>接口调用次数统计TOP10</h1>
            <ReactECharts option={option} />
          </Card>
        </Col >
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Card>
            <h1 style={{textAlign: 'center'}}>用户调用次数统计TOP10</h1>
            <ReactECharts option={userOption}/>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
export default InterfaceAnalysis;
