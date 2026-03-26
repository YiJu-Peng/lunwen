import { PageContainer} from '@ant-design/pro-components';
import '@umijs/max';
import React, { useEffect, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import {Card, Col, Row} from 'antd';
import {list4UsingGet} from "@/services/ant-design-pro/calculateController";


/**
 * 接口分析
 * @constructor
 */
const InterfaceAnalysis: React.FC = () => {
  const [data, setData] = useState<API.UsualScoreDTO[]>([]);
  // const [users, setusers] = useState<API.UserInvokVO[]>([]);
  useEffect(() => {
    try {
      list4UsingGet().then(res => {
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
  const XchartData = data.map(item => {
    return item.scoreRange
  })
  const toatalchartData = data.map(item => {
    return item.totalInRange
  })
  const guakechartData = data.map(item => {
    return item.failCount
  })
  const weiguakechartData = data.map(item => {
    return item.totalInRange- item.failCount
  })
  const guakelvchartData = data.map(item => {
    return {
      name: item.scoreRange,
      value: item.failRate
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
        data: XchartData
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '学生总数',
        type: 'bar',
        emphasis: {
          focus: 'series'
        },
        data: toatalchartData
      },
      {
        name: '未挂科学生数',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series'
        },
        data: weiguakechartData
      },
      {
        name: '挂科学生人数',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series'
        },
        data: guakechartData
      },
    ]
  };

  const userOption = {
    legend: {
      top: 'bottom'
    },
    tooltip: { // 补充维护tooltip配置
      trigger: 'item', // 触发类型，默认为item，即数据项图形触发。
      formatter: '{a} <br/>{b}: {c}% ({d}%)' // 自定义悬浮提示内容格式，{a}：系列名，{b}：数据名，{c}：数据值，{d}%：百分比。
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true }
      }
    },
    series: [
      {
        name: '平时成绩与挂科率',
        type: 'pie',
        radius: [0, 100],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: guakelvchartData
      }
    ]
  };

  return (
    <PageContainer>
      <Row gutter={16}>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Card >
            <h1 style={{ textAlign: 'center' }}>平时成绩挂科人数分析</h1>
            <ReactECharts option={option} />
          </Card>
        </Col >
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Card>
            <h1 style={{textAlign: 'center'}}>各个平时成绩区间的挂科率分析</h1>
            <ReactECharts option={userOption}/>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
export default InterfaceAnalysis;
