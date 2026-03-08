import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import '@umijs/max';
import { Alert, Card, Typography } from 'antd';
import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
const { Dragger } = Upload;

const props2: UploadProps = {
  name: 'file',
  multiple: true,
  action: 'http://localhost:8101/api/cloudCalculate/delayedUpload',
  beforeUpload: (file) => {
    // 修改这里以正确识别 Excel 文件类型
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel';
    if (!isExcel) {
      message.error(`${file.name} 不是一个有效的Excel表格`);
    }
    return isExcel || Upload.LIST_IGNORE;
  },
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      if (info.file.response.code === 0){
        message.success(`${info.file.name} file uploaded successfully.`);
      }else {
        message.error(`${info.file.name} file upload failed.${info.file.response.message}`);
      }

    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const props1: UploadProps = {
  name: 'file',
  multiple: true,
  action: 'http://localhost:8101/api/cloudCalculate/uploadExcel',
  beforeUpload: (file) => {
    // 修改这里以正确识别 Excel 文件类型
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel';
    if (!isExcel) {
      message.error(`${file.name} 不是一个有效的Excel表格`);
    }
    return isExcel || Upload.LIST_IGNORE;
  },
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      if (info.file.response.code === 0){
        message.success(`${info.file.name} file uploaded successfully.`);
      }else {
        message.error(`${info.file.name} file upload failed.${info.file.response.message}`);
      }

    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};
const Admin: React.FC = () => {
  return (
    <PageContainer content={""}>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <h2 align={"center"}>上传每门课成绩或者全班成绩</h2>
      <Dragger {...props1}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽一个文件到此区域</p>
        <p className="ant-upload-hint">
          支持一个或多个Excel表格上传，自动进行表格数据检验。
        </p>
      </Dragger>
      <h2 align={"center"}>上传缓考数据</h2>
      <Dragger {...props2}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽一个文件到此区域</p>
        <p className="ant-upload-hint">
          支持一个或多个Excel表格上传，自动进行表格数据检验。
        </p>
      </Dragger>
      <Card>
        <Alert
          message={'更多的成绩数据分析已经计算成功，已经发布。'}
          type="success"
          showIcon
          banners
          style={{
            margin: -12,
            marginBottom: 48,
          }}
        />
        <Typography.Title
          level={2}
          style={{
            textAlign: 'center',
          }}
        >
          <SmileTwoTone /> DawnCclin <HeartTwoTone twoToneColor="#eb2f96" /> You
        </Typography.Title>
      </Card>
    </PageContainer>
  );
};
export default Admin;
