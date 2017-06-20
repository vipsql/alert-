import { request } from '../utils'

export async function queryDashbord(parmas) {
    return request(`/incident/getLastOneHourIncidentData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(parmas)
    })
}
