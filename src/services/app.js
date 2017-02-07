import { request } from '../utils'

export async function queryAlertDashbord () {
  return request('/mock/app.json', {
    method: 'get'
  })
}
