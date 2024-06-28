
import React, { FC, useState, useEffect } from 'react'
import { BASE_URL } from '../../utils/const'
import styles from './user-info.module.css'

interface User {
    email: string
    public_nickname: string
    full_name: string
    github: string
    tg: string
    phone: number
    role: {
        title: string
    }
    team: {
        title: string
    }
}

const UserInfo: FC = () => {
    const [user, setUser] = useState<User>({
        email: '',
        public_nickname: '',
        full_name: '',
        github: '',
        tg: '',
        phone: 0,
        role: {
            title: ''
        },
        team: {
            title: ''
        }
    })
    //
    useEffect(() => {
        const fetchUserData = async (): Promise<void> => {
            try {
                const response = await fetch(`${BASE_URL}/users/email`)
                if (!response.ok) {
                    throw new Error('Failed to fetch user data')
                }
                const userData = await response.json()
                setUser(userData)
            } catch (error) {
                console.error('Произошла ошибка', error)
            }
        }
        //
        fetchUserData().then(() => {
            console.log('Данные пользователя успешно загружены')
        }).catch((error) => {
            console.error('Ошибка при загрузке данных пользователя', error)
        })
    }, [])
    //
    const EmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setUser({ ...user, email: e.target.value })
    }
    //
    const publicNicknameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setUser({ ...user, public_nickname: e.target.value })
    }
    //
    const fullNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setUser({ ...user, full_name: e.target.value })
    }
    //
    const GithubChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setUser({ ...user, github: e.target.value })
    }
    //
    const tgChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setUser({ ...user, tg: e.target.value })
    }
    const phoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const phoneValue = e.target.value
        const phoneNum = phoneValue !== '' ? parseInt(phoneValue) : 0
        //
        setUser({ ...user, phone: phoneNum })
    }
    //
    const roleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setUser({ ...user, role: { title: e.target.value } })
    }
    //
    const teamChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setUser({ ...user, team: { title: e.target.value } })
    }
    //
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Информация о пользователе</h1>
            <div className={styles.inside__container}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={user.email} onChange={EmailChange} />
                </div>
                <div>
                    <label>Public nickname:</label>
                    <input type="text" value={user.public_nickname} onChange={publicNicknameChange} />
                </div>
                <div>
                    <label>Full name:</label>
                    <input type="text" value={user.full_name} onChange={fullNameChange} />
                </div>
                <div>
                    <label>GitHub:</label>
                    <input type="text" value={user.github} onChange={GithubChange} />
                </div>
                <div>
                    <label>TG:</label>
                    <input type="text" value={user.tg} onChange={tgChange} />
                </div>
                <div>
                    <label>Phone:</label>
                    <input type="text" value={user.phone} onChange={phoneChange} />
                </div>
                <div>
                    <label>Role:</label>
                    <input type="text" value={user.role.title} onChange={roleChange} />
                </div>
                <div>
                    <label>Team:</label>
                    <input type="text" value={user.team.title} onChange={teamChange} />
                </div>
            </div>
            <button className={styles.SaveButton}>Сохранить</button>
        </div>
    )
}

export default UserInfo
