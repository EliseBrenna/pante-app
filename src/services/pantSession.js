  const API_URL = '/api';

export function addPantData(data) {
  return fetch(`${API_URL}/pant`, {
    method: 'POST',   
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then((res) => res.json());
}

export function updatePantData(data) {
  return fetch (`${API_URL}/pant`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then((res) => res.json());
}

export function updatePantData2 (data) {
  return fetch (`${API_URL}/home`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': localStorage.getItem('pante_app_token')
    },
    body: JSON.stringify(data)
  })
  .then((res) => res.json());
}

export function activityData() {
  return fetch(`${API_URL}/activity`)
  .then((res) => res.json())
}

export async function saldoData(id) {
  const res = await fetch(`${API_URL}/saldo`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(id)
  });
  return await res.json();
}