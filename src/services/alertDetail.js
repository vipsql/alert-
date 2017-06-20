import { request } from '../utils'

export async function queryDetail(alertId) {
    return request(`/incident/getIncidentDetail/${alertId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}