import { request, packURL } from '../utils'
import querystring from 'querystring';

export async function isSetUserTags(userId) {
    return request(`/api/v2/incident/tags/isSet/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function getTagsByUser(userId) {
    return request(`/api/v2/incident/tags/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function getAllTags() {
    return request(`/api/v2/incident/tags/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function setUserTags(tagObject) {
    return request(`/api/v2/incident/tags`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagObject)
    })
}