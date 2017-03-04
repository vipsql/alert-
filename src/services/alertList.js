import { request, packURL } from '../utils'
export async function queryAlertListTime(data) {
  const options = {
    body: JSON.stringify(data),
    method: 'post'
  }
  return request('/arbiter/rest/v1/alert/queryLastTimeline', options)
}
// 查询告警柱状图
export async function queryAlertBar(data) {

  const options = {
    body: JSON.stringify(data),
    method: 'post'
  }

  return request('/arbiter/rest/v1/alert/buckets', options)
}

// 查询告警列表(未分组)
export async function queryAlertList(data) {
  const options = {
    body: JSON.stringify(data),
    method: 'post'
  }

  return request('/arbiter/rest/v1/alert/queryLast', options)
}

export async function queryChild(param) {
  const options = {
    method: 'GET'
  }

  return request(`/arbiter/rest/v1/alert/query/childs?alertId=${param}`, options)
}
