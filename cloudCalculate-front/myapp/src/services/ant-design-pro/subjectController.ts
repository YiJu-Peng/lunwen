// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** getAllCurriculums GET /subject/curriculums */
export async function getAllCurriculumsUsingGet(options?: { [key: string]: any }) {
  return request<API.Curriculum[]>('/subject/curriculums', {
    method: 'GET',
    ...(options || {}),
  });
}

/** createCurriculum POST /subject/curriculums */
export async function createCurriculumUsingPost(
  body: API.Curriculum,
  options?: { [key: string]: any },
) {
  return request<API.Curriculum>('/subject/curriculums', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getCurriculumById GET /subject/curriculums/${param0} */
export async function getCurriculumByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCurriculumByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Curriculum>(`/subject/curriculums/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** updateCurriculum PUT /subject/curriculums/${param0} */
export async function updateCurriculumUsingPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateCurriculumUsingPUTParams,
  body: API.Curriculum,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Curriculum>(`/subject/curriculums/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** deleteCurriculum DELETE /subject/curriculums/${param0} */
export async function deleteCurriculumUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCurriculumUsingDELETEParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/subject/curriculums/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** checkCurriculum POST /subject/curriculums/check */
export async function checkCurriculumUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkCurriculumUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseString_>('/subject/curriculums/check', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listCurriculums GET /subject/list */
export async function listCurriculumsUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listCurriculumsUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.PageParamCurriculumVO_>('/subject/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
