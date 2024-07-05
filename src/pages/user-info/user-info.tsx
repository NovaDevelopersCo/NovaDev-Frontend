
import React, { FC, useState, useEffect } from 'react'
import * as UserInfoAPI from '../../utils/api/user-info-api'
import { Button, Form, Input } from 'antd'
import { TUser } from '../../utils/typesFromBackend'

interface IUserInfo {
    t: (arg0: string) => string
}

const UserInfo: FC<IUserInfo> = ({ t }) => {
    const [isEditing, setIsEditing] = useState(false)
    const handleEditing = (): void => {
        setIsEditing(true)
    }
    const handleViewing = (): void => {
        setIsEditing(false)
    }
    //
    const [user, setUser] = useState<TUser>({
        id: 0,
        role: {
            id: 0,
            title: ''
        },
        image: '',
        public_nickname: '',
        full_name: '',
        email: '',
        phone: 0,
        github: '',
        payment_info: '',
        tg: '',
        team: {
            id: 0,
            title: ''
        },
        projects: {
            id: 0,
            title: ''
        }
    })
    //
    // const getJWT = localStorage.getItem('token')
    //
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                await UserInfoAPI.getUserData(user, setUser)
            } catch (error) {
                console.error('Проиошла ошибка:', error)
            }
        }
        //
        fetchData().then(() => {
            console.log('Выполнено!')
        }).catch((error: string) => {
            console.error('Произошла ошибка', error)
        })
    }, [])
    //
    return (
        <div>
            <div className='flex gap-4 justify-center'>
                <Button className='bg-gray-300' onClick={handleViewing}>
                    <h4 className='text-base'>{t('Просмотр')}</h4>
                </Button>
                <Button className='bg-gray-300' onClick={handleEditing}>
                    <h4 className='text-base'>{t('Изменение')}</h4>
                </Button>
            </div>
            { isEditing ? (
                <Form className='flex flex-col'>
                    <h1 className='text-xl font-semibold mb-5'>Информация о пользователе</h1>
                    <div className='flex flex-col gap-4'>
                        <Form.Item name='id' rules={[{ required: false, message: t('enter-your-id') }]}>
                            <label className='text-base'>Id:</label>
                            <Input className='w-64' type="number" value={user.id} />
                        </Form.Item>
                        <Form.Item name='role_id' rules={[{ required: false, message: t('enter-your-role-id') }]}>
                            <label className='text-base'>Role Id:</label>
                            <Input className='w-64' type="number" value={user.role.id} />
                        </Form.Item>
                        <Form.Item name='role_title' rules={[{ required: false, message: t('enter-your-role-title') }]}>
                            <label className='text-base'>Role title:</label>
                            <Input className='w-64' type="text" value={user.role.title} />
                        </Form.Item>
                        <Form.Item name='image' rules={[{ required: false, message: t('enter-your-image-url') }]}>
                            <label className='text-base'>Image URL:</label>
                            <Input className='w-64' type="text" value={user.image} />
                        </Form.Item>
                        <Form.Item name='public_nickname' rules={[{ required: false, message: t('enter-your-public-nickname') }]}>
                            <label className='text-base'>Public nickname:</label>
                            <Input className='w-64' type="text" value={user.public_nickname} />
                        </Form.Item>
                        <Form.Item name='full_name' rules={[{ required: false, message: t('enter-your-full-name') }]}>
                            <label className='text-base'>Full name:</label>
                            <Input className='w-64' type="text" value={user.full_name} />
                        </Form.Item>
                        <Form.Item name='email' rules={[{ required: false, message: t('enter-your-email') }]}>
                            <label className='text-base'>Email:</label>
                            <Input className='w-64' type="text" value={user.email} />
                        </Form.Item>
                        <Form.Item name='phone' rules={[{ required: false, message: t('enter-your-phone') }]}>
                            <label className='text-base'>Phone:</label>
                            <Input className='w-64' type="number" value={user.email} />
                        </Form.Item>
                        <Form.Item name='github' rules={[{ required: false, message: t('enter-your-github') }]}>
                            <label className='text-base'>GitHub:</label>
                            <Input className='w-64' type="text" value={user.github} />
                        </Form.Item>
                        <Form.Item name='payment_info' rules={[{ required: false, message: t('enter-your-payment-info') }]}>
                            <label className='text-base'>Payment info:</label>
                            <Input className='w-64' type="text" value={user.payment_info} />
                        </Form.Item>
                        <Form.Item name='tg' rules={[{ required: false, message: t('enter-your-tg') }]}>
                            <label className='text-base'>TG:</label>
                            <Input className='w-64' type="text" value={user.tg} />
                        </Form.Item>
                        <Form.Item name='team_id' rules={[{ required: false, message: t('enter-your-team-id') }]}>
                            <label className='text-base'>Team Id:</label>
                            <Input className='w-64' type="number" value={user.team.id} />
                        </Form.Item>
                        <Form.Item name='team_title' rules={[{ required: false, message: t('enter-your-team-title') }]}>
                            <label className='text-base'>Team Title:</label>
                            <Input className='w-64' type="text" value={user.team.title} />
                        </Form.Item>
                        <Form.Item name='project_id' rules={[{ required: false, message: t('enter-your-project-id') }]}>
                            <label className='text-base'>Project Id:</label>
                            <Input className='w-64' type="number" value={user.team.id} />
                        </Form.Item>
                        <Form.Item name='project_title' rules={[{ required: false, message: t('enter-your-project-title') }]}>
                            <label className='text-base'>Project Title:</label>
                            <Input className='w-64' type="text" value={user.projects.title} />
                        </Form.Item>
                    </div>
                    <Button className='flex justify-center items-center text-lg w-28 mt-5' htmlType='submit'>
                        <h4 className='p-2'>{t('Изменить')}</h4>
                    </Button>
                </Form>
            ) : (
                <div className='flex flex-col'>
                    <h1 className='text-xl font-semibold mb-5'>Информация о пользователе</h1>
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>Id:</h4>
                            <p className='text-base'>{user.id}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>Role Id:</h4>
                            <p className='text-base'>{user.role.id}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>Role title:</h4>
                            <p className='text-base'>{user.role.title}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>Image:</h4>
                            <p className='text-base'>{user.image}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>Public nickname:</h4>
                            <p className='text-base'>{user.public_nickname}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>Full name:</h4>
                            <p className='text-base'>{user.full_name}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>Email:</h4>
                            <p className='text-base'>{user.email}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>Phone:</h4>
                            <p className='text-base'>{user.phone}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>GitHub:</h4>
                            <p className='text-base'>{user.github}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>Payment info:</h4>
                            <p className='text-base'>{user.payment_info}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>TG:</h4>
                            <p className='text-base'>{user.tg}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>Team Id:</h4>
                            <p className='text-base'>{user.team.id}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>Team Title:</h4>
                            <p className='text-base'>{user.team.title}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>Project Id:</h4>
                            <p className='text-base'>{user.projects.id}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>Project Title:</h4>
                            <p className='text-base'>{user.projects.title}</p>
                        </div>
                    </div>
                </div>
            )
            }
        </div>
    )
}

export default UserInfo
