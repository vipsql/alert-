import { request, packURL } from '../utils'
import querystring from 'querystring';

export async function getFormOptions() {
    return request(`/arbiter/rest/v1/dataService/wos`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function dispatchForm(param) {
    return request(`/arbiter/rest/v1/dataService/assignWO`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(param)
    })
}

export async function close(param) {
    return request(`/arbiter/rest/v1/alert/close`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(param)
    })
}

export async function merge(param) {
    return request(`/arbiter/rest/v1/alert/megar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(param)
    })
}

export async function relieve(param) {
    return request(`/arbiter/rest/v1/alert/decompose`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(param)
    })
}