/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getAllProjects = async (token: string) => {
  return await fetch(`${BASE_URL}/project`, {
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

export const updateProject = async (
  token: string,
  projectId: string,
  data: {
    name: string
    technologies: string
    server: string
    documentation: string
    client: string
    users: string
    dateEnd: string
  }
) => {
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
export function getProjects(token: string) {
  throw new Error('Function not implemented.')
}
