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
            'X-Auth-Token': localStorage.getItem('pante_app_token')
        }
    })
    .then((res) => res.status === 200);
}

export async function createUser({name, email, phone, password}){
    const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, password })
    })
    return response.json();
}

export async function getUserById() {
    const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        headers : {
            'Content-type': 'application/json',
            'X-Auth-Token': localStorage.getItem('pante_app_token')
        }
    })
    return response.json();
}

export function updateUser(user) {
    return fetch(`${API_URL}/editprofile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': localStorage.getItem('pante_app_token')
      },
      body: JSON.stringify(user)
    })
    .then((res) => res.json());
  }

export async function activitiesData() {
const response = await fetch(`${API_URL}/activity`, {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json',
    'X-Auth-Token': localStorage.getItem('pante_app_token')
    }
});
return await response.json();
}
