/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
// import { TTeams } from '../typesFromBackend'
import { handleResponse } from '../helpers'

export const getAllTeams = async (token: string) => {
    return await fetch(`${BASE_URL}/teams`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(async (res) => await handleResponse(res))
}

export const editTeam = async (token: string, id: number, teams: any) => {
    return await fetch(`${BASE_URL}/teams/${id}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            ...teams
        })
    }).then(async (res) => await handleResponse(res))
}

export const deleteTeam = async (token: string, id: number) => {
    return await fetch(`${BASE_URL}/teams/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(async (res) => await handleResponse(res))
}

export const getTeamById = async (token: string, id: number) => {
    return await fetch(`${BASE_URL}/teams/${id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(async (res) => await handleResponse(res))
}
