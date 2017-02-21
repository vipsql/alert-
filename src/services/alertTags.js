import { request, packURL } from '../utils'
import querystring from 'querystring';

export async function isSetUserTags(userId) {
    return request(`/arbiter/rest/v1/alert/tags/isSet/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function getTagsByUser(userId) {
    return request(`/arbiter/rest/v1/alert/tags/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function getAllTags() {
    return request(`/arbiter/rest/v1/alert/tags/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export async function setUserTags(tagObject) {
    return request(`/arbiter/rest/v1/alert/tags`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagObject)
    })
}