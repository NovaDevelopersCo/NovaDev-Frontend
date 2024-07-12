
import React, { FC, useState, useEffect, useContext } from 'react'
import * as UserInfoAPI from '../../utils/api/user-info-api'
import { Button, Form, Input } from 'antd'
import { TUser, ECountry } from '../../utils/typesFromBackend'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IUserInfo {
    token: string
    t: (arg0: string) => string
    language: ECountry
}

const UserInfo: FC<IUserInfo> = ({ token, t }) => {
    const { openNotification } = useContext(NotificationContext)
    //
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
    useEffect(() => {
        UserInfoAPI
            .getUserData(token, user, setUser)
            .then(() => {
                console.log('Выполнено!')
            })
            .catch((e) => openNotification(e, 'topRight'))
    }, [])
    //
    const onFinish = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        UserInfoAPI
            .editUserData(token, user)
            .then(() => {
                console.log('Done')
            })
            .catch((e) => openNotification(e, 'topRight'))
    }
    //
    return (
        <div>
            <div className='flex gap-4 justify-center'>
                <Button className='bg-gray-300' onClick={handleViewing}>
                    <h4 className='text-base'>{t('view-info')}</h4>
                </Button>
                <Button className='bg-gray-300' onClick={handleEditing}>
                    <h4 className='text-base'>{t('edit-info')}</h4>
                </Button>
            </div>
            { isEditing ? (
                <div className='flex flex-col'>
                    <h1 className='text-xl font-semibold mb-5'>{t('about-user-title')}</h1>
                    <Form className='flex flex-col gap-4' onFinish={onFinish} >
                        <Form.Item label={t('user-id')} name='id' rules={[{ required: false, message: t('enter-your-id') }]}>
                            <Input className='w-64' type="number" value={user.id} />
                        </Form.Item>
                        <Form.Item label={t('user-role-id')} name='role_id' rules={[{ required: false, message: t('enter-your-role-id') }]}>
                            <Input className='w-64' type="number" value={user.role.id} />
                        </Form.Item>
                        <Form.Item label={t('user-role-title')} name='role_title' rules={[{ required: false, message: t('enter-your-role-title') }]}>
                            <Input className='w-64' type="text" value={user.role.title} />
                        </Form.Item>
                        <Form.Item label={t('user-image-url')} name='image' rules={[{ required: false, message: t('enter-your-image-url') }]}>
                            <Input className='w-64' type="text" value={user.image} />
                        </Form.Item>
                        <Form.Item label={t('user-public-nickname')} name='public_nickname' rules={[{ required: false, message: t('enter-your-public-nickname') }]}>
                            <Input className='w-64' type="text" value={user.public_nickname} />
                        </Form.Item>
                        <Form.Item label={t('user-full-name')} name='full_name' rules={[{ required: false, message: t('enter-your-full-name') }]}>
                            <Input className='w-64' type="text" value={user.full_name} />
                        </Form.Item>
                        <Form.Item label={t('user-email')} name='email' rules={[{ required: false, message: t('enter-your-email') }]}>
                            <Input className='w-64' type="text" value={user.email} />
                        </Form.Item>
                        <Form.Item label={t('user-phone')} name='phone' rules={[{ required: false, message: t('enter-your-phone') }]}>
                            <Input className='w-64' type="number" value={user.email} />
                        </Form.Item>
                        <Form.Item label={t('user-github')} name='github' rules={[{ required: false, message: t('enter-your-github') }]}>
                            <Input className='w-64' type="text" value={user.github} />
                        </Form.Item>
                        <Form.Item label={t('user-payment-info')} name='payment_info' rules={[{ required: false, message: t('enter-your-payment-info') }]}>
                            <Input className='w-64' type="text" value={user.payment_info} />
                        </Form.Item>
                        <Form.Item label={t('user-tg')} name='tg' rules={[{ required: false, message: t('enter-your-tg') }]}>
                            <Input className='w-64' type="text" value={user.tg} />
                        </Form.Item>
                        <Form.Item label={t('user-team-id')} name='team_id' rules={[{ required: false, message: t('enter-your-team-id') }]}>
                            <Input className='w-64' type="number" value={user.team.id} />
                        </Form.Item>
                        <Form.Item label={t('user-team-title')} name='team_title' rules={[{ required: false, message: t('enter-your-team-title') }]}>
                            <Input className='w-64' type="text" value={user.team.title} />
                        </Form.Item>
                        <Form.Item label={t('user-project-id')} name='project_id' rules={[{ required: false, message: t('enter-your-project-id') }]}>
                            <Input className='w-64' type="number" value={user.projects.id} />
                        </Form.Item>
                        <Form.Item label={t('user-project-title')} name='project_title' rules={[{ required: false, message: t('enter-your-project-title') }]}>
                            <Input className='w-64' type="text" value={user.projects.title} />
                        </Form.Item>
                        <Button className='flex justify-center items-center text-lg w-28 mt-5' htmlType='submit'>
                            <h4 className='p-2'>{t('changed-data')}</h4>
                        </Button>
                    </Form>
                </div>
            ) : (
                <div className='flex flex-col'>
                    <h1 className='text-xl font-semibold mb-5'>{t('about-user-title')}</h1>
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>{t('user-id')}</h4>
                            <p className='text-base'>{user.id}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>{t('user-role-id')}</h4>
                            <p className='text-base'>{user.role.id}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>{t('user-role-title')}</h4>
                            <p className='text-base'>{user.role.title}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>{t('user-image-url')}</h4>
                            <p className='text-base'>{user.image}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>{t('user-public-nickname')}</h4>
                            <p className='text-base'>{user.public_nickname}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>{t('user-full-name')}</h4>
                            <p className='text-base'>{user.full_name}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>{t('user-email')}</h4>
                            <p className='text-base'>{user.email}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>{t('user-phone')}</h4>
                            <p className='text-base'>{user.phone}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>{t('user-github')}</h4>
                            <p className='text-base'>{user.github}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>{t('user-payment-info')}</h4>
                            <p className='text-base'>{user.payment_info}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>{t('user-tg')}</h4>
                            <p className='text-base'>{user.tg}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>{t('user-team-id')}</h4>
                            <p className='text-base'>{user.team.id}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>{t('user-team-title')}</h4>
                            <p className='text-base'>{user.team.title}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>{t('user-project-id')}</h4>
                            <p className='text-base'>{user.projects.id}</p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <h4 className='text-base font-semibold'>{t('user-project-title')}</h4>
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
