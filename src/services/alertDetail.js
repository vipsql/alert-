import { request } from '../utils'

export async function queryDetail(alertId) {
  return request(`/api/v2/incident/getAlertDetail/${alertId}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  })
}