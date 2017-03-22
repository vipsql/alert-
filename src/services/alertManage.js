import { request } from '../utils'

export async function queryDashbord(parmas) {
  return request(`/api/v2/incident/getLastOneHourIncidentData`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(parmas)
  })
}
