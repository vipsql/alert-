import { request, packURL } from '../utils'
export async function queryAlertListTime(params) {
  
  const url = packURL('/mock/alertListTime.json', params)

  return request(url, {
    method: 'get'
  })
}
