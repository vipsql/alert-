import { request } from '../utils'

export async function queryDashbord(parmas) {
  return request(`/api/v2/incident/getLastOneHourAlertData`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(parmas)
  })
}
