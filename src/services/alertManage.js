import { request } from '../utils'

export async function queryDashbord(parmas) {
  console.log(parmas)
  return request(`http://10.1.240.105:8890/arbiter/rest/v1/alert/queryLastTimeline`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(parmas)
  })
}
