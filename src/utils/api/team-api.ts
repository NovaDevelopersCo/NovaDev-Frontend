/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getAllTeams = async (token: string) => {
  return await fetch(`${BASE_URL}/teams`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const getTeam = async (token: string, id: number) => {
  return await fetch(`${BASE_URL}/team/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const createTeam = async (token: string, id: number) => {
  return await fetch(`${BASE_URL}/team`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(id)
  }).then(async (res) => await handleResponse(res))
}

export const updateTeam = async (token: string, id: number) => {
  return await fetch(`${BASE_URL}/team/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(id)
  }).then(async (res) => await handleResponse(res))
}

export const deleteTeam = async (token: string, id: number) => {
  return await fetch(`${BASE_URL}/team/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}
