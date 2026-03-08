// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addTeacher POST /teachers */
export async function addTeacherUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addTeacherUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<boolean>('/teachers', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getTeacherById GET /teachers/${param0} */
export async function getTeacherByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTeacherByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Teacher>(`/teachers/${param0}`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** updateTeacher PUT /teachers/${param0} */
export async function updateTeacherUsingPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateTeacherUsingPUTParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<boolean>(`/teachers/${param0}`, {
    method: 'PUT',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** deleteTeacher DELETE /teachers/${param0} */
export async function deleteTeacherUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteTeacherUsingDELETEParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/teachers/${param0}`, {
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** getTeachers GET /teachers/page */
export async function getTeachersUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTeachersUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.IPageTeacher_>('/teachers/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
