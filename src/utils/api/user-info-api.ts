/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BASE_URL } from '../const'
import { TUser, TUserTeam } from '../typesFromBackend'
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

export const editUserDataById = async (token: string, formData: any, userId: number): Promise<void> => {
    try {
        if (token) {
            const response = await fetch(`${BASE_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData
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

export const getUserTeam = async (token: string, userTeam: any, setUserTeam: any): Promise<void> => {
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
                const formattedData: TUserTeam = {
                    id: data.team.id as number,
                    title: data.team.title as string
                }

                setUserTeam(formattedData)
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

export const editUserTeam = async (token: string, formTeamData: any): Promise<void> => {
    try {
        if (token) {
            const response = await fetch(`${BASE_URL}/teams/add`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formTeamData
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

export const deleteUserTeam = async (token: string, formTeamData: any): Promise<void> => {
    try {
        if (token) {
            const response = await fetch(`${BASE_URL}/teams/cut`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formTeamData
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

export const editUserRole = async (token: string, formRoleData: any, userId: number): Promise<void> => {
    try {
        if (token) {
            const response = await fetch(`${BASE_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formRoleData
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

export const editUserProject = async (token: string, formProjectsData: any): Promise<void> => {
    try {
        if (token) {
            const response = await fetch(`${BASE_URL}/project/add`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formProjectsData
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

export const deleteUserProject = async (token: string, formProjectsData: any): Promise<void> => {
    try {
        if (token) {
            const response = await fetch(`${BASE_URL}/project/cut`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formProjectsData
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

export const fetchUserById = async (token: string, id: number): Promise<TUser | null> => {
    try {
        if (token) {
            const response = await fetch(`${BASE_URL}/users/${id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch ')
            }

            return await response.json() ?? null
        }
        return null
    } catch (error) {
        console.error('Произошла ошибка', error)
        return null
    }
}
