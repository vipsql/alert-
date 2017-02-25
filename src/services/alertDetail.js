import { request } from '../utils'

export async function queryDetail(alertId) {
  return request(`/arbiter/rest/v1/alert/getAlertDetail/${alertId}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}