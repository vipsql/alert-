import { request } from '../utils'

export async function querySource() {
    return request(`/arbiter/rest/v1/alert/query/filters`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function queryAlertList(params) {
    return request(`/arbiter/rest/v1/alert/query/filters`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function queryCount(params) {
    return request(`/arbiter/rest/v1/alert/query/filters`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function queryCloumns() {
    return request(`/arbiter/rest/v1/alert/query/filters`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}