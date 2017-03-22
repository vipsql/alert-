import { request, packURL } from '../utils'
import querystring from 'querystring';

export async function getFormOptions() {
    return request(`/api/v2/dataService/wos`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function dispatchForm(param) {
    return request(`/api/v2/dataService/assignWO`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(param)
    })
}

export async function close(param) {
    return request(`/api/v2/incident/close`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(param)
    })
}

export async function merge(param) {
    return request(`/api/v2/incident/merge`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(param)
    })
}

export async function relieve(param) {
    return request(`/api/v2/incident/decompose`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(param)
    })
}