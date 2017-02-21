import { request, packURL } from '../utils'
export async function queryAlertListTime(params) {

  const url = packURL('/mock/alertListTime.json', params)

  return request(url, {
    method: 'get'
  })
}
export async function queryAlertBar(data) {

  const options = {
    data:JSON.stringify(data),
    method: 'post'
  }

  return request('http://10.1.10.114:8890/arbiter/rest/v1/alert/buckets', options)
}
