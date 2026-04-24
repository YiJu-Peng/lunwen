import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[]}
      copyright="高校智能选课系统前端演示界面"
    />
  );
};

export default Footer;
