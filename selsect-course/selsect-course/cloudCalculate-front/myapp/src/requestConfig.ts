import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';
import { history } from '@umijs/max';

// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const requestConfig: RequestConfig = {
  baseURL: 'http://localhost:9000/api', // 修改为网关地址
  withCredentials: true,
  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 从localStorage中获取token
      const tokenName = localStorage.getItem('tokenName');
      const tokenValue = localStorage.getItem('tokenValue');

      // 如果token存在，则添加到请求头中
      if (tokenName && tokenValue) {
        const headers = config.headers || {};
        headers[tokenName] =" Bearer " +tokenValue;
        // 移除CORS相关的请求头，由代理服务器处理
        config.headers = headers;
      }

      return config;
    },
  ],
  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;

      // 业务状态处理
      if (data && data.code !== 200 ) {
        if (data.code === 40100 || data.code === 40101) {
          // 登录失效或未登录
          message.error('登录已过期，请重新登录');
          // 清除本地token
          localStorage.removeItem('tokenName');
          localStorage.removeItem('tokenValue');
          // 跳转到登录页
          history.push('/user/login');
        } else {
          // 其他业务错误
          // message.error(data.message || '请求失败');
        }
      }

      return response;
    },
  ],
};
