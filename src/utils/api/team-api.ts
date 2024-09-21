/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
// import { TUser } from '../typesFromBackend'
import { handleResponse } from '../helpers'

export const getTeamById = async (token: string, teamId: number) => {
  return await fetch(`${BASE_URL}/teams/${teamId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}
