/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getAllProjects = async (token: string) => {
    return await fetch(`${BASE_URL}/project`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(async (res) => await handleResponse(res))
}
