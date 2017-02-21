import { request, packURL } from '../utils'
export async function queryAlertListTime(params) {

  return request('/mock/alertListTime.json', {
    method: 'get'
  })
}
export async function queryAlertBar(data) {

  const options = {
    body: JSON.stringify(data),
    method: 'post'
  }
  console.log(options)
  return request('/arbiter/rest/v1/alert/buckets', options)
}
