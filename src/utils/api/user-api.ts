
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getUser = async (token: string, id: number) => {
  return await fetch(`${BASE_URL}/user/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(async (res) => await handleResponse(res))
}
