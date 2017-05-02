import { request } from '../utils'

// 获取标签
export async function queryTags(params) {
  return request(`/visual/storeKeys`, {
    method: 'get',
    body: JSON.stringify(params)
  })
}


export async function queryVisual (params) {
  return request('/visual/tagValuesInfo', {
    method: 'post',
    body: JSON.stringify(params)
  })
}

export async function queryVisualRes(params) {
  return request(`/visual/resStateInfo`, {
    method: 'post',
    body: JSON.stringify(params)
  })
}
export async function queryResInfo(params) {
  return request(`/visual/resInfo`, {
    method: 'get',
    body: JSON.stringify(params)
  })
}

