// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** getAllStudents GET /students */
export async function getAllStudentsUsingGet(options?: { [key: string]: any }) {
  return request<API.Student[]>('/students', {
    method: 'GET',
    ...(options || {}),
  });
}

/** addStudent POST /students */
export async function addStudentUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addStudentUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<boolean>('/students', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getStudentById GET /students/${param0} */
export async function getStudentByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getStudentByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Student>(`/students/${param0}`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** updateStudent PUT /students/${param0} */
export async function updateStudentUsingPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateStudentUsingPUTParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<boolean>(`/students/${param0}`, {
    method: 'PUT',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** deleteStudent DELETE /students/${param0} */
export async function deleteStudentUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteStudentUsingDELETEParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/students/${param0}`, {
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** getStudents GET /students/page */
export async function getStudentsUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getStudentsUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.IPageStudent_>('/students/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
