/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getAllClients = async (token: string) => {
  return await fetch(`${BASE_URL}/clients`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const getClients = async (token: string, id: string) => {
  const response = await fetch(`${BASE_URL}/client/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch client')
  }

  return await response.json()
}
export const deleteClient = async (token: string, id: string) => {
  return await fetch(`${BASE_URL}/client/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const updateClient = async (token: string, data: any) => {
  return await fetch(`${BASE_URL}/client/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...data
    })
  }).then(async (res) => await handleResponse(res))
}
