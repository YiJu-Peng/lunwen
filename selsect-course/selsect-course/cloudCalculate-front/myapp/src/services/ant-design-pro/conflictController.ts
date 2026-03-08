// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * 检查当前用户的课程冲突
 */
export async function checkMyConflict(
  params: {
    // query
    /** 课程ID */
    curriculumId: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse<API.ConflictCheckResult>>('/api/conflict/myCheck', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/**
 * 检查指定用户的课程冲突
 */
export async function checkConflict(
  params: {
    // query
    /** 用户ID */
    userId: number;
    /** 课程ID */
    curriculumId: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse<API.ConflictCheckResult>>('/api/conflict/check', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
} 