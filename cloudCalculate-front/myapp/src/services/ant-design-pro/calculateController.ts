// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** list1 GET /calculate/list1 */
export async function list1UsingGet(options?: { [key: string]: any }) {
  return request<API.CollegeCountDTO[]>('/calculate/list1', {
    method: 'GET',
    ...(options || {}),
  });
}

/** list2 GET /calculate/list2 */
export async function list2UsingGet(options?: { [key: string]: any }) {
  return request<API.ReasonCountDTO[]>('/calculate/list2', {
    method: 'GET',
    ...(options || {}),
  });
}

/** list3 GET /calculate/list3 */
export async function list3UsingGet(options?: { [key: string]: any }) {
  return request<API.TeacherCountDTO[]>('/calculate/list3', {
    method: 'GET',
    ...(options || {}),
  });
}

/** list4 GET /calculate/list4 */
export async function list4UsingGet(options?: { [key: string]: any }) {
  return request<API.UsualScoreDTO[]>('/calculate/list4', {
    method: 'GET',
    ...(options || {}),
  });
}

/** list5 GET /calculate/list5 */
export async function list5UsingGet(options?: { [key: string]: any }) {
  return request<API.ClassesAvgDTO[]>('/calculate/list5', {
    method: 'GET',
    ...(options || {}),
  });
}

/** list6 GET /calculate/list6 */
export async function list6UsingGet(options?: { [key: string]: any }) {
  return request<API.ClassFailCountDTO[]>('/calculate/list6', {
    method: 'GET',
    ...(options || {}),
  });
}

/** list7 GET /calculate/list7 */
export async function list7UsingGet(options?: { [key: string]: any }) {
  return request<API.CourseAverageScoreDTO[]>('/calculate/list7', {
    method: 'GET',
    ...(options || {}),
  });
}
