import { request } from '../utils'

export async function querySource() {
    return request(`/api/v2/incident/querySourceTags`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function queryAlertList(params) {
    return request(`/api/v2/incident/queryHistory`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
}

export async function queryCount(params) {
    return request(`/api/v2/incident/queryIncidentCount`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
}

export async function queryCloumns() {
    return request(`/api/v2/incident/queryExtendedTag`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}