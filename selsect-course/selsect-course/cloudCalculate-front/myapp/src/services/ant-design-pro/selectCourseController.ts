// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** dropCourse POST /api/enrollments/drop */
export async function dropCourseUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dropCourseUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseString>('/main/drop', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** pageCurriculums GET /api/enrollments/page */
export async function pageCurriculumsUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageCurriculumsUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.PageParamCurriculumVO_>('/main/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getStudentEnrollments GET /api/enrollments/student/{studentId} */
export async function getStudentEnrollmentsUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getStudentEnrollmentsUsingGETParams,
  options?: { [key: string]: any },
) {
  const { studentId: param0, ...queryParams } = params;
  return request<API.ResponseCurriculum>(`/main/search?studentId=${param0}`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** selectCourse POST /api/enrollments/select */
export async function selectCourseUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.selectCourseUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponse>('/main/select', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** checkCourse POST /api/enrollments/check */
export async function checkCourseUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkCourseUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<boolean>('/api/enrollments/check', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** test GET /api/enrollments/test */
export async function testUsingGet(options?: { [key: string]: any }) {
  return request<string>('/api/enrollments/test', {
    method: 'GET',
    ...(options || {}),
  });
}
