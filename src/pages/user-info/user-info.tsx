
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
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const [user, setUser] = React.useState<TUser>({} as TUser)
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
            <div className='flex gap-6 justify-center'>
                <Button className='bg-gray-300' onClick={handleViewing}>
                    <h4 className='text-base'>{t('view-info')}</h4>
                </Button>
                <Button className='bg-gray-300' onClick={handleEditing}>
                    <h4 className='text-base'>{t('edit-info')}</h4>
                </Button>
            </div>
            { isEditing ? (
                <div className='flex flex-col mt-4'>
                    <div className='flex items-center justify-center'>
                        <h1 className='text-xl font-semibold mb-5'>{t('about-user-title')}</h1>
                    </div>
                    <Form className='flex flex-col gap-6' onFinish={onFinish} >
                        <Form.Item label={t('user-id')} rules={[{ required: false, message: t('enter-your-id') }]}>
                            <Input className='w-64' type="number" value={user.id} />
                        </Form.Item>
                        <Form.Item label={t('user-role-title')} rules={[{ required: false, message: t('enter-your-role-title') }]}>
                            <Input className='w-64' type="text" value={user.role && user.role.length > 0 ? user.role[0].title : ''} />
                        </Form.Item>
                        <div className='border-2 border-black rounded-md pl-2'>
                            <div className='flex items-center justify-center mt-2'>
                                <h4 className='text-lg font-semibold'>{t('base-info-title')}</h4>
                            </div>
                            <Form.Item label={t('user-image-url')} rules={[{ required: false, message: t('enter-your-image-url') }]}>
                                <Input className='w-64' type="text" value={user.info && user.info.length > 0 ? user.info[0].image : ''} />
                            </Form.Item>
                            <Form.Item label={t('user-public-nickname')} rules={[{ required: false, message: t('enter-your-public-nickname') }]}>
                                <Input className='w-64' type="text" value={user.info && user.info.length > 0 ? user.info[0].public_nickname : ''} />
                            </Form.Item>
                            <Form.Item label={t('user-full-name')} rules={[{ required: false, message: t('enter-your-full-name') }]}>
                                <Input className='w-64' type="text" value={user.info && user.info.length > 0 ? user.info[0].full_name : ''} />
                            </Form.Item>
                            <Form.Item label={t('user-email')} rules={[{ required: false, message: t('enter-your-email') }]}>
                                <Input className='w-64' type="text" value={user.info && user.info.length > 0 ? user.info[0].image : ''} />
                            </Form.Item>
                            <Form.Item label={t('user-phone')} rules={[{ required: false, message: t('enter-your-phone') }]}>
                                <Input className='w-64' type="number" value={user.info && user.info.length > 0 ? user.info[0].email : ''} />
                            </Form.Item>
                            <Form.Item label={t('user-github')} rules={[{ required: false, message: t('enter-your-github') }]}>
                                <Input className='w-64' type="text" value={user.info && user.info.length > 0 ? user.info[0].github : ''} />
                            </Form.Item>
                            <Form.Item label={t('user-payment-info')} rules={[{ required: false, message: t('enter-your-payment-info') }]}>
                                <Input className='w-64' type="text" value={user.info && user.info.length > 0 ? user.info[0].payment_info : ''} />
                            </Form.Item>
                            <Form.Item label={t('user-tg')} rules={[{ required: false, message: t('enter-your-tg') }]}>
                                <Input className='w-64' type="text" value={user.info && user.info.length > 0 ? user.info[0].tg : ''} />
                            </Form.Item>
                        </div>
                        <div className='border-2 border-black rounded-md pl-2'>
                            <div className='flex items-center justify-center mt-2'>
                                <h4 className='text-lg font-semibold'>{t('projects-info-title')}</h4>
                            </div>
                            <Form.Item label={t('user-project-id')} rules={[{ required: false, message: t('enter-your-project-id') }]}>
                                <Input className='w-64' type="number" value={user.projects && user.projects.length > 0 ? user.projects[0].id : ''} />
                            </Form.Item>
                            <Form.Item label={t('user-project-title')} rules={[{ required: false, message: t('enter-your-project-title') }]}>
                                <Input className='w-64' type="text" value={user.projects && user.projects.length > 0 ? user.projects[0].title : ''} />
                            </Form.Item>
                        </div>
                        <div className='flex justify-center'>
                            <Button className='flex justify-center items-center text-lg w-28 mt-5' htmlType='submit'>
                                <h4 className='p-2'>{t('changed-data')}</h4>
                            </Button>
                        </div>
                    </Form>
                    <Form className='mt-6'>
                        <div className='border-2 border-black rounded-md pl-2'>
                            <div className='flex items-center justify-center mt-2 mb-2'>
                                <h4 className='text-lg font-semibold'>{t('team-info-title')}</h4>
                            </div>
                            <Form.Item label={t('user-team-id')} >
                                <p className='text-base'>{user.team && user.team.length > 0 ? user.team[0].id : ''}</p>
                            </Form.Item>
                            <Form.Item label={t('user-team-title')} >
                                <p className='text-base'>{user.team && user.team.length > 0 ? user.team[0].title : ''}</p>
                            </Form.Item>
                            <div className='flex justify-center mb-2'>
                                <Button className='flex justify-center items-center text-lg w-28 mt-5' htmlType='submit'>
                                    <h4 className='p-2'>{t('changed-data')}</h4>
                                </Button>
                            </div>
                        </div>
                    </Form>
                </div>
            ) : (
                <div className='flex flex-col mt-4'>
                    <div className='flex items-center justify-center'>
                        <h1 className='text-xl font-semibold mb-5'>{t('about-user-title')}</h1>
                    </div>
                    <Form className='flex flex-col gap-6'>
                        <Form.Item label={t('user-id')} >
                            <p className='text-base'>{user.id}</p>
                        </Form.Item>
                        <Form.Item label={t('user-role-title')} >
                            <p className='text-base'>{user.role && user.role.length > 0 ? user.role[0].title : ''}</p>
                        </Form.Item>
                        <div className='border-2 border-black rounded-md pl-2'>
                            <div className='flex items-center justify-center mt-2'>
                                <h4 className='text-lg font-semibold'>{t('base-info-title')}</h4>
                            </div>
                            <Form.Item label={t('user-public-nickname')} >
                                <p className='text-base'>{user.info && user.info.length > 0 ? user.info[0].public_nickname : ''}</p>
                            </Form.Item>
                            <Form.Item label={t('user-full-name')} >
                                <p className='text-base'>{user.info && user.info.length > 0 ? user.info[0].full_name : ''}</p>
                            </Form.Item>
                            <Form.Item label={t('user-email')} >
                                <p className='text-base'>{user.info && user.info.length > 0 ? user.info[0].email : ''}</p>
                            </Form.Item>
                            <Form.Item label={t('user-phone')} >
                                <p className='text-base'>{user.info && user.info.length > 0 ? user.info[0].phone : ''}</p>
                            </Form.Item>
                            <Form.Item label={t('user-github')} >
                                <p className='text-base'>{user.info && user.info.length > 0 ? user.info[0].github : ''}</p>
                            </Form.Item>
                            <Form.Item label={t('user-payment-info')} >
                                <p className='text-base'>{user.info && user.info.length > 0 ? user.info[0].payment_info : ''}</p>
                            </Form.Item>
                            <Form.Item label={t('user-tg')} >
                                <p className='text-base'>{user.info && user.info.length > 0 ? user.info[0].tg : ''}</p>
                            </Form.Item>
                        </div>
                        <div className='border-2 border-black rounded-md pl-2'>
                            <div className='flex items-center justify-center mt-2'>
                                <h4 className='text-lg font-semibold'>{t('projects-info-title')}</h4>
                            </div>
                            <Form.Item label={t('user-project-id')} >
                                <p className='text-base'>{user.projects && user.projects.length > 0 ? user.projects[0].id : ''}</p>
                            </Form.Item>
                            <Form.Item label={t('user-project-title')} >
                                <p className='text-base'>{user.projects && user.projects.length > 0 ? user.projects[0].title : ''}</p>
                            </Form.Item>
                        </div>
                        <div className='border-2 border-black rounded-md pl-2'>
                            <div className='flex items-center justify-center mt-2'>
                                <h4 className='text-lg font-semibold'>{t('user-profile-image')}</h4>
                            </div>
                            <Form.Item label={t('user-image-url')} rules={[{ required: false, message: t('enter-your-image-url') }]}>
                                <img src={user.info && user.info.length > 0 ? user.info[0].image : ''} alt="Profile photo" />
                            </Form.Item>
                        </div>
                    </Form>
                    <Form className='mt-6'>
                        <div className='border-2 border-black rounded-md pl-2'>
                            <div className='flex items-center justify-center mt-2'>
                                <h4 className='text-lg font-semibold'>{t('team-info-title')}</h4>
                            </div>
                            <Form.Item label={t('user-team-id')} >
                                <p className='text-base'>{user.team && user.team.length > 0 ? user.team[0].id : ''}</p>
                            </Form.Item>
                            <Form.Item label={t('user-team-title')} >
                                <p className='text-base'>{user.team && user.team.length > 0 ? user.team[0].title : ''}</p>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            )
        }
        </div>
    )
}

export default UserInfo
