import { request, packURL } from '../utils'
export async function queryAlertListTime(data) {
  const options = {
    body: JSON.stringify(data),
    method: 'post'
  }
  return request('/api/v2/incident/queryLastTimeline', options)
}
// 查询告警柱状图
export async function queryAlertBar(data) {
  
  const options = {
    body: JSON.stringify(data),
    method: 'post'
  }

  return request('/api/v2/incident/buckets', options)
}

// 查询告警列表(未分组)
export async function queryAlertList(data) {
  const options = {
    body: JSON.stringify(data),
    method: 'post'
  }

  return request('/api/v2/incident/queryLastTimeline', options)
}

export async function queryChild(param) {
  const options = {
    method: 'GET'
  }

  return request(`/api/v2/incident/query/childs?incidentId=${param}`, options)
}
