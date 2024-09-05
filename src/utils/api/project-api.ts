/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getAllProjects = async (token: string) => {
  return await fetch(`${BASE_URL}/projects`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const getProject = async (token: string, id: number) => {
  return await fetch(`${BASE_URL}/project/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}

export const createProject = async (token: string, data: any) => {
  return await fetch(`${BASE_URL}/project`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(async (res) => await handleResponse(res))
}

export const updateProject = async (token: string, data: { name: string, description: string, category: string, startDate: string, endDate: string }) => {
  return await fetch(`${BASE_URL}/project/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(async (res) => await handleResponse(res))
}

export const deleteProject = async (token: string, id: number) => {
  return await fetch(`${BASE_URL}/project/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}
