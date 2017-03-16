import { request } from '../utils'

// 查询应用列表
export async function queryConfigAplication(params) {
  return request(`/api/v2/application/query?type=${params.type}&sortKey=${params.orderBy}&sortType=${params.orderType}`, {
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

  return request('/api/v2/application/updateStatus', options)
}
