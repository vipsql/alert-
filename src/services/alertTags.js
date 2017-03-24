import { request, packURL } from '../utils'
import querystring from 'querystring';

export async function isSetUserTags() {
    return request(`/incident/tags/isSet`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function getTagsByUser() {
    return request(`/incident/tags/chosen`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function getAllTags() {
    return request(`/incident/tags/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function setUserTags(tagObject) {
    return request(`/incident/tags`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagObject)
    })
}