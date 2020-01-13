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

export async function updateUser({ name, email, password, newPassword }) {
    const response = await fetch(`${API_URL}/editprofile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': localStorage.getItem('pante_app_token')
      },
      body: JSON.stringify({ name, email, password, newPassword })
    })
    return response.json();
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

export async function nameData() {
    const response = await fetch(`${API_URL}/name`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': localStorage.getItem('pante_app_token')
      }
    });
    return await response.json();
  }
  
export async function withdrawAccountBalance() {
    const response = await fetch(`${API_URL}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': localStorage.getItem('pante_app_token')
        }
    });
    return await response.json();
}

export async function deleteUser() {
    const response = await fetch(`${API_URL}/delete`, {
        method: 'DELETE',
        headers: {
            'X-Auth-Token': localStorage.getItem('pante_app_token')
        }
    })
    return await response.json();
}

// export function withdrawAccountBalance() {
//     return fetch(`${API_URL}/withdraw`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-Auth-Token': localStorage.getItem('pante_app_token')
//         }
//     })
//     .then((res) => res.json());
// }

export function updatePantData (data) {
    return fetch (`${API_URL}/home`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': localStorage.getItem('pante_app_token')
      },
      body: JSON.stringify(data)
    })
    .then((res) => res.json());
  }
