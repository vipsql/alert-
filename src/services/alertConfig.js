import { request } from '../utils'
import {stringify} from 'qs'

// 查询应用列表
export async function queryConfigAplication(params) {
  return request(`/application/query?${stringify(params)}`, {
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
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'POST'
  }

  return request('/application/updateStatus', options)
}

// 删除
export async function deleteApp(id) {
  const options = {
    body: JSON.stringify({id: id}),
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'POST'
  }

  return request('/application/delete', options)
}

// 查询配置种类
export async function typeQuery(type) {
  return request(`/applicationType/query?type=${type}`, {
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
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'POST'
  }

  return request('/application/create', options)
}

// 编辑
export async function update(params) {
  const options = {
    body: JSON.stringify(params),
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'POST'
  }

  return request('/application/update', options)
}

// 详情
export async function view(id) {
  return request(`/application/getAppDetail/${id}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// 在snmp页面查询映射字段
export async function getField() {
  return request(`/applyRule/matchFilterValue`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

// 在snmp页面查询filter字段
export async function getSource() {
  return request(`/applyRule/filterFieldValue`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}

