// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前用户的课程表 GET /api/schedule/current */
export async function getCurrentScheduleUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseScheduleVO>('/api/schedule/current', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取学生的当前周课程表 GET /api/schedule/student/{studentId}/current-week */
export async function getCurrentWeekScheduleUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getStudentScheduleUsingGETParams,
  options?: { [key: string]: any },
) {
  const { studentId: param0, ...queryParams } = params;
  return request<API.ScheduleCourseItemVO[]>(`/main/search?studentId=${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取指定学生的完整课程表 GET /api/schedule/student/{studentId} */
export async function getStudentScheduleUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getStudentScheduleUsingGETParams,
  options?: { [key: string]: any },
) {
  const { studentId: param0, ...queryParams } = params;
  return request<API.ScheduleCourseItemVO[]>(`/api/schedule/student/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取指定教师的课程表 GET /api/schedule/teacher/{teacherId} */
export async function getTeacherScheduleUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTeacherScheduleUsingGETParams,
  options?: { [key: string]: any },
) {
  const { teacherId: param0, ...queryParams } = params;
  return request<API.BaseResponseScheduleVO>(`/api/schedule/teacher/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
