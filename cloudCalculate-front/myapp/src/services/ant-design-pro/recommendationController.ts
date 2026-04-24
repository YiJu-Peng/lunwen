// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * 获取当前用户的推荐课程
 */
export async function getMyRecommendedCourses(
  params: {
    // query
    /** 推荐课程数量 */
    limit?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse<API.CourseRecommendVO[]>>('/api/recommend/myCourses', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/**
 * 获取指定用户的推荐课程
 */
export async function getRecommendedCourses(
  params: {
    // query
    /** 用户ID */
    userId: number;
    /** 推荐课程数量 */
    limit?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse<API.CourseRecommendVO[]>>('/api/recommend/courses', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
} 