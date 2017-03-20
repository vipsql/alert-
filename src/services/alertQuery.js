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
    return request(`/api/v2/incident/query/filters`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function queryCount(params) {
    return request(`/api/v2/incident/query/filters`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function queryCloumns() {
    return request(`/api/v2/incident/query/filters`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}