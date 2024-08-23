/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { handleResponse } from '../helpers'

export const getUserData = async (token: string) => {
    return await fetch(`${BASE_URL}/users/me`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(async (res) => await handleResponse(res))
}

export const editUserData = async (token: string, user: any): Promise<void> => {
    try {
        if (token) {
            const response = await fetch(`${BASE_URL}/users/me`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...user
                })
            })
            //
            if (!response.ok) {
                throw new Error('Failed to fetch user data')
            }
        } else {
            throw new Error('Bearer токен отсутствует!')
        }
    } catch (error) {
        console.error('Произошла ошибка', error)
    }
}
