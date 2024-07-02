
import React, { FC, useState, useEffect } from 'react'
import { Button, Form, Input } from 'antd'
import { TUserInfo } from '../../utils/typesFromBackend'
import { BASE_URL } from '../../utils/const'

interface IUserInfo {
    t: (arg0: string) => string
}

const UserInfo: FC<IUserInfo> = ({ t }) => {
    // const getJWT = localStorage.getItem('token')
    const [user, setUser] = useState<TUserInfo>({
        id: 0,
        auth: {
            private_nickname: ''
        },
        info: {
            public_nickname: '',
            tg: 0
        },
        tasks: []
    })
    //
    useEffect(() => {
        const fetchUserData = async (): Promise<void> => {
            try {
                const getJWT = localStorage.getItem('token')
                if (getJWT) {
                    const response = await fetch(`${BASE_URL}/users/me`, {
                        method: 'GET',
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
        //
        fetchUserData().then(() => {
            console.log('Данные пользователя успешно загружены')
        }).catch((error) => {
            console.error('Ошибка при загрузке данных пользователя', error)
        })
    }, [])
    //
    const IdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const idValue = e.target.value
        const idNum = idValue !== '' ? parseInt(idValue) : 0
        setUser({ ...user, id: idNum })
    }
    //
    const PrivateNicknameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setUser({ ...user, auth: { ...user.auth, private_nickname: e.target.value } })
    }
    //
    const PublicNicknameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setUser({ ...user, info: { ...user.info, public_nickname: e.target.value } })
    }
    //
    const TgChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const tgIdValue = e.target.value
        const tgIdNum = tgIdValue !== '' ? parseInt(tgIdValue) : 0
        setUser({ ...user, info: { ...user.info, tg: tgIdNum } })
    }
    //
    return (
        <div className='flex flex-col'>
            <h1 className='text-xl font-semibold mb-5'>Информация о пользователе</h1>
            <div className='flex flex-col gap-4'>
                <Form.Item name='id' rules={[{ required: false, message: t('enter-your-id') }]}>
                    <label className='text-base'>Id:</label>
                    <Input className='w-64' type="number" value={user.id} onChange={IdChange} />
                </Form.Item>
                <Form.Item name='private_nickname' rules={[{ required: false, message: t('enter-your-private-nickname') }]}>
                    <label className='text-base'>Private nickname:</label>
                    <Input className='w-64' type="text" value={user.auth.private_nickname} onChange={PrivateNicknameChange} />
                </Form.Item>
                <Form.Item name='public_nickname' rules={[{ required: false, message: t('enter-your-public-nickname') }]}>
                    <label className='text-base'>Public nickname:</label>
                    <Input className='w-64' type="text" value={user.info.public_nickname} onChange={PublicNicknameChange} />
                </Form.Item>
                <Form.Item name='tg_id' rules={[{ required: false, message: t('enter-your-tg_id') }]}>
                    <label className='text-base'>Tg Id:</label>
                    <Input className='w-64' type="number" value={user.info.tg} onChange={TgChange} />
                </Form.Item>
            </div>
            <Button className='flex justify-center items-center text-lg w-28 mt-5'>
                <h4 className='p-2'>{t('Изменить')}</h4>
            </Button>
        </div>
    )
}

export default UserInfo
