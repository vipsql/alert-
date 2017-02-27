import { request } from '../utils'

export async function queryDashbord(parmas) {
  return request(`/arbiter/rest/v1/alert/getLastOneHourAlertData`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(parmas)
  })
}
