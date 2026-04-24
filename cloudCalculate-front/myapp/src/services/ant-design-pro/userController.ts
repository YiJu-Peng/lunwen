// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 用户登录接口 POST /api/user/login */
export async function login(body: API.UserLoginRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLoginResult>('/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 兼容使用，提供别名以兼容代码中的引用
export const userLoginUsingPost = login;

/** 用户注销接口 POST /api/user/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取当前登录用户 GET /api/user/get/login */
export async function getLoginUser(options?: { [key: string]: any }) {
  return request<API.BaseResponseLoginUserVO_>('/user/get/login', {
    method: 'GET',
    ...(options || {}),
  });
}

// 兼容旧的方法名，但使用新的API路径
export async function getLoginUserUsingGet(options?: { [key: string]: any }) {
  return getLoginUser(options);
}

/** 用户注册接口 POST /api/user/register */
export async function register(body: API.UserRegisterRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 添加用户 POST /api/user/add */
export async function addUser(body: API.UserAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/user/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新用户 POST /api/user/update */
export async function updateUser(body: API.UserUpdateRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取用户分页列表 GET /api/user/list/page */
export async function listUserByPage(params: API.UserQueryRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsePageUserVO_>('/user/list/page', {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
}

/** getUserById GET /user/get */
export async function getUserByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseUserVO_>('/user/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getMessages GET /user/getMessages */
export async function getMessagesUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMessagesUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageMessage_>('/user/getMessages', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listUser GET /user/list */
export async function listUserUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listUserUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListUserVO_>('/user/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** readMessage POST /user/readMessage */
export async function readMessageUsingPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.readMessageUsingPUTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseString_>('/user/readMessage', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
