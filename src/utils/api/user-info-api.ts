/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
// import { TUser } from '../typesFromBackend'
import { handleResponse } from '../helpers'

export const getAllUsers = async (token: string) => {
  return await fetch(`${BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
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

export const getUserData = async (token: string) => {
    return await fetch(`${BASE_URL}/users/me`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(async (res) => await handleResponse(res))
}

export const editUserData = async (token: string, data: FormData): Promise<void> => {
  return await fetch(`${BASE_URL}/users/me`, {
      method: 'PUT',
      headers: {
          Authorization: `Bearer ${token}`
      },
      body: data
  }).then(async (res) => await handleResponse(res))
}

export const editUserDataById = async (token: string, formData: any, userId: number): Promise<void> => {
      return await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData
        })
      }).then(async (res) => await handleResponse(res))
}

export const getUserTeam = async (token: string): Promise<void> => {
      return await fetch(`${BASE_URL}/users/me`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }).then(async (res) => await handleResponse(res))
}

export const editUserTeam = async (token: string, formTeamData: any): Promise<void> => {
      return await fetch(`${BASE_URL}/teams/add`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formTeamData
        })
      }).then(async (res) => await handleResponse(res))
}

export const deleteUserTeam = async (token: string, formTeamData: any): Promise<void> => {
      return await fetch(`${BASE_URL}/teams/cut`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formTeamData
        })
      }).then(async (res) => await handleResponse(res))
}

export const editUserRole = async (token: string, formRoleData: any, userId: number): Promise<void> => {
      return await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formRoleData
        })
      }).then(async (res) => await handleResponse(res))
}

export const editUserProject = async (token: string, formProjectsData: any): Promise<void> => {
      return await fetch(`${BASE_URL}/project/add`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formProjectsData
        })
      }).then(async (res) => await handleResponse(res))
}

export const deleteUserProject = async (token: string, formProjectsData: any): Promise<void> => {
      return await fetch(`${BASE_URL}/project/cut`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formProjectsData
        })
      }).then(async (res) => await handleResponse(res))
}

export const fetchUserById = async (token: string, id: number): Promise<void> => {
      return await fetch(`${BASE_URL}/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }).then(async (res) => await handleResponse(res))
}
