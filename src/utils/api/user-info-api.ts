/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { TUser } from '../typesFromBackend'

export const getUserData = async (token: string, user: any, setUser: any): Promise<void> => {
    try {
        if (token) {
            const response = await fetch(`${BASE_URL}/users/me`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch user data')
            }

            const data = await response.json()

            if (data && Object.keys(data).length > 0) {
                const formattedData: TUser = {
                    id: data.id,
                    role: [data.role],
                    info: [data.info],
                    team: [data.team],
                    projects: Array.isArray(data.projects) ? data.projects.map((project: any) => ({ id: project.id, title: project.title })) : []
                }

                setUser(formattedData)
            } else {
                console.error('Received empty data from the server')
            }
        } else {
            throw new Error('Bearer токен отсутствует!')
        }
    } catch (error) {
        console.error('Произошла ошибка', error)
    }
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
