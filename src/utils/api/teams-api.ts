/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getTeams = async () => {
    return await fetch(`${BASE_URL}/teams`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(async (res) => await handleResponse(res)) 
    }
