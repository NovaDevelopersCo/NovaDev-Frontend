/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'

export const getUserData = async (user: any, setUser: any): Promise<void> => {
    try {
        const getJWT = localStorage.getItem('token')
        if (getJWT) {
            const response = await fetch(`${BASE_URL}/users/me`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${getJWT}`
                }
            })
            //
            if (!response.ok) {
                throw new Error('Failed to fetch user data')
            }
            //
            const userData = await response.json()
            setUser(userData)
            //
        } else {
            throw new Error('Bearer токен отсутствует!')
        }
    } catch (error) {
        console.error('Произошла ошибка', error)
    }
}
