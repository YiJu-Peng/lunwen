// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function rule(
  params?: API.PageParams & Record<string, any>,
  options?: { [key: string]: any },
) {
  return request<{
    data: API.RuleListItem[];
    total: number;
    success: boolean;
    pageSize: number;
    current: number;
  }>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function addRule(
  body: Partial<API.RuleListItem>,
  options?: { [key: string]: any },
) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      ...body,
      method: 'post',
    },
    ...(options || {}),
  });
}

export async function updateRule(
  body: Partial<API.RuleListItem>,
  options?: { [key: string]: any },
) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      ...body,
      method: 'update',
    },
    ...(options || {}),
  });
}

export async function removeRule(
  body: { key: number[] },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      ...body,
      method: 'delete',
    },
    ...(options || {}),
  });
}
