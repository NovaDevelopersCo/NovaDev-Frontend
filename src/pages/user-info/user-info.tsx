
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
                        <Form.Item label={t('user-id')} rules={[{ required: false, message: t('enter-your-id') }]}>
                            <Input className='w-64' type="number" value={user.id} />
                        </Form.Item>
                        <Form.Item label={t('user-role-id')} rules={[{ required: false, message: t('enter-your-role-id') }]}>
                            <Input className='w-64' type="number" value={user.role.id} />
                        </Form.Item>
                        <Form.Item label={t('user-role-title')} rules={[{ required: false, message: t('enter-your-role-title') }]}>
                            <Input className='w-64' type="text" value={user.role.title} />
                        </Form.Item>
                        <Form.Item label={t('user-image-url')} rules={[{ required: false, message: t('enter-your-image-url') }]}>
                            <Input className='w-64' type="text" value={user.image} />
                        </Form.Item>
                        <Form.Item label={t('user-public-nickname')} rules={[{ required: false, message: t('enter-your-public-nickname') }]}>
                            <Input className='w-64' type="text" value={user.public_nickname} />
                        </Form.Item>
                        <Form.Item label={t('user-full-name')} rules={[{ required: false, message: t('enter-your-full-name') }]}>
                            <Input className='w-64' type="text" value={user.full_name} />
                        </Form.Item>
                        <Form.Item label={t('user-email')} rules={[{ required: false, message: t('enter-your-email') }]}>
                            <Input className='w-64' type="text" value={user.email} />
                        </Form.Item>
                        <Form.Item label={t('user-phone')} rules={[{ required: false, message: t('enter-your-phone') }]}>
                            <Input className='w-64' type="number" value={user.email} />
                        </Form.Item>
                        <Form.Item label={t('user-github')} rules={[{ required: false, message: t('enter-your-github') }]}>
                            <Input className='w-64' type="text" value={user.github} />
                        </Form.Item>
                        <Form.Item label={t('user-payment-info')} rules={[{ required: false, message: t('enter-your-payment-info') }]}>
                            <Input className='w-64' type="text" value={user.payment_info} />
                        </Form.Item>
                        <Form.Item label={t('user-tg')} rules={[{ required: false, message: t('enter-your-tg') }]}>
                            <Input className='w-64' type="text" value={user.tg} />
                        </Form.Item>
                        <Form.Item label={t('user-team-id')} rules={[{ required: false, message: t('enter-your-team-id') }]}>
                            <Input className='w-64' type="number" value={user.team.id} />
                        </Form.Item>
                        <Form.Item label={t('user-team-title')} rules={[{ required: false, message: t('enter-your-team-title') }]}>
                            <Input className='w-64' type="text" value={user.team.title} />
                        </Form.Item>
                        <Form.Item label={t('user-project-id')} rules={[{ required: false, message: t('enter-your-project-id') }]}>
                            <Input className='w-64' type="number" value={user.projects.id} />
                        </Form.Item>
                        <Form.Item label={t('user-project-title')} rules={[{ required: false, message: t('enter-your-project-title') }]}>
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
                    <Form className='flex flex-col gap-1'>
                        <Form.Item label={t('user-id')} >
                            <p className='text-base'>{user.id}</p>
                        </Form.Item>
                        <Form.Item label={t('user-role-id')} >
                            <p className='text-base'>{user.role.id}</p>
                        </Form.Item>
                        <Form.Item label={t('user-role-title')} >
                            <p className='text-base'>{user.role.title}</p>
                        </Form.Item>
                        <Form.Item label={t('user-image-url')} >
                            <p className='text-base'>{user.image}</p>
                        </Form.Item>
                        <Form.Item label={t('user-public-nickname')} >
                            <p className='text-base'>{user.public_nickname}</p>
                        </Form.Item>
                        <Form.Item label={t('user-full-name')} >
                            <p className='text-base'>{user.full_name}</p>
                        </Form.Item>
                        <Form.Item label={t('user-email')} >
                            <p className='text-base'>{user.email}</p>
                        </Form.Item>
                        <Form.Item label={t('user-phone')} >
                            <p className='text-base'>{user.phone}</p>
                        </Form.Item>
                        <Form.Item label={t('user-github')} >
                            <p className='text-base'>{user.github}</p>
                        </Form.Item>
                        <Form.Item label={t('user-payment-info')} >
                            <p className='text-base'>{user.payment_info}</p>
                        </Form.Item>
                        <Form.Item label={t('user-tg')} >
                            <p className='text-base'>{user.tg}</p>
                        </Form.Item>
                        <Form.Item label={t('user-team-id')} >
                            <p className='text-base'>{user.team.id}</p>
                        </Form.Item>
                        <Form.Item label={t('user-team-title')} >
                            <p className='text-base'>{user.team.title}</p>
                        </Form.Item>
                        <Form.Item label={t('user-project-id')} >
                            <p className='text-base'>{user.projects.id}</p>
                        </Form.Item>
                        <Form.Item label={t('user-project-title')} >
                            <p className='text-base'>{user.projects.title}</p>
                        </Form.Item>
                    </Form>
                </div>
            )
            }
        </div>
    )
}

export default UserInfo
