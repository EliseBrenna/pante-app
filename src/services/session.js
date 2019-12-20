const API_URL = '/api';

export function createSession({ email, password }) {
    return fetch(`${API_URL}/session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
    })
    .then((res) => res.json());
}

export function checkSession() {
    return fetch(`${API_URL}/session`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'X-Auth-Token': localStorage.getItem('panteapp_token')
        }
    })
    .then((res) => res.status === 200);
}