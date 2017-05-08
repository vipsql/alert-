import { request } from '../utils'

// 获取标签
export async function queryTags(params) {
  return request(`/visual/storeKeys`, {
    method: 'get',
    body: params
  })
}


export async function queryVisual (params) {
  return request('/visual/tagValuesInfo', {
    method: 'post',
    body: JSON.stringify(params),
    headers: {
          'Content-Type': 'application/json',
      }
  })
}
// 获取资源列表（根据标签）
export async function queryVisualRes(params) {
  return request(`/visual/resStateInfo`, {
    method: 'post',
    body: JSON.stringify(params),
    headers: {
        'Content-Type': 'application/json',
    }
  })
}
// 根据资源ID查询属性信息
export async function queryResInfo(params) {
  return request(`/visual/resInfo`, {
    method: 'get',
    body: params
  })
}

// 根据资源获取故障列表
export async function queryAlertList(params) {
  return request(`/visual/resIncidents`, {
    method: 'get',
    body: params
  })
}

