/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getUsers = async (token: string) => {
  return await fetch(`${BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const getUser = async (token: string, id: number) => {
  return await fetch(`${BASE_URL}/users/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const updateUser = async (token: string, id: number, data: object) => {
  return await fetch(`${BASE_URL}/users/${id}`, {
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

export const deleteUser = async (token: string, id: number) => {
  return await fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}
