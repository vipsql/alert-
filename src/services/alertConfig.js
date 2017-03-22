import { request } from '../utils'
import {stringify} from 'qs'

// 查询应用列表
export async function queryConfigAplication(params) {
  return request(`/api/v2/application/query?${stringify(params)}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// 更改状态
export async function changeAppStatus(params) {
  const options = {
    body: JSON.stringify(params),
    method: 'POST'
  }

  return request('/api/v2/application/updateStatus', options)
}

// 删除
export async function deleteApp(id) {
  const options = {
    body: JSON.stringify({id: id}),
    method: 'POST'
  }

  return request('/api/v2/application/delete', options)
}

// 查询配置种类
export async function typeQuery(type) {
  return request(`/api/v2/applicationType/query?type=${type}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// 新增
export async function add(params) {
  const options = {
    body: JSON.stringify(params),
    method: 'POST'
  }

  return request('/api/v2/application/create', options)
}

// 编辑
export async function update(params) {
  const options = {
    body: JSON.stringify(params),
    method: 'POST'
  }

  return request('/api/v2/application/update', options)
}

// 详情
export async function view(id) {
  return request(`/api/v2/application/getAppDetail/${id}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}
