
import React, { FC, useState, useEffect, useContext } from 'react'
import * as UserInfoAPI from '../../utils/api/user-info-api'
import { Button, Form, Input, Image, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
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
        if (token) {
            UserInfoAPI.getUserData(token).then(res => {
                if (res) {
                    setUser(res)
                }
            }).catch((e) => openNotification(e, 'topRight'))
        }
    }, [token])
    //
    const onFinish = (e: React.FormEvent<HTMLFormElement>): void => {
        UserInfoAPI
            .editUserData(token, user).then(() => {
                console.log(user)
                openNotification('The user data is saved!', 'topLeft')
            })
            .catch((e) => openNotification(e, 'topRight'))
    }
    //
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target
        // console.log(`Changing ${name} to ${value}`)
        if (name in user.info) {
          setUser((prevUser) => ({
            ...prevUser,
            info: {
              ...prevUser.info,
              [name]: value || ''
            }
          }))
        }
    }
    //
    const handleUploadChange = (info: any): void => {
        if (info.file.status === 'done') {
          setUser((prevUser) => ({
            ...prevUser,
            info: {
              ...prevUser.info,
              image: info.file.response.url
            }
          }))
        }
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
                        <div className='border-2 border-black rounded-md pl-2'>
                            <div className='flex items-center justify-center mt-2 mb-3'>
                                <h4 className='text-lg font-semibold'>{t('base-info-title')}</h4>
                            </div>
                            <Form.Item label={t('user-public-nickname')} rules={[{ required: false, message: t('enter-your-public-nickname') }]}>
                                <Input className='w-64' type="text" value={user?.info?.public_nickname ?? ''} name='public_nickname' onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label={t('user-full-name')} rules={[{ required: false, message: t('enter-your-full-name') }]}>
                                <Input className='w-64' type="text" value={user?.info?.full_name ?? ''} name='full_name' onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label={t('user-image')} rules={[{ required: false, message: t('enter-your-image') }]}>
                                <Upload onChange={handleUploadChange} >
                                    <Button className='flex items-center'>
                                        <UploadOutlined />
                                        {t('upload-image')}
                                    </Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item label={t('user-phone')} rules={[{ required: false, message: t('enter-your-phone') }]}>
                                <Input className='w-64' type="number" value={user?.info?.phone ?? ''} name='phone' onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label={t('user-email')} rules={[{ required: false, message: t('enter-your-email') }]}>
                                <Input className='w-64' type="text" value={user?.info?.email ?? ''} name='email' onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label={t('user-github')} rules={[{ required: false, message: t('enter-your-github') }]}>
                                <Input className='w-64' type="text" value={user?.info?.github ?? ''} name='github' onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label={t('user-payment-info')} rules={[{ required: false, message: t('enter-your-payment-info') }]}>
                                <Input className='w-64' type="text" value={user?.info?.payment_info ?? ''} name='payment_info' onChange={handleChange} />
                            </Form.Item>
                            <Form.Item label={t('user-tg')} rules={[{ required: false, message: t('enter-your-tg') }]}>
                                <Input className='w-64' type="text" value={user?.info?.tg ?? ''} name='tg' onChange={handleChange} />
                            </Form.Item>
                        </div>
                        <div className='flex justify-center'>
                            <Button className='flex justify-center items-center text-lg w-28 mt-5' htmlType='submit'>
                                <h4 className='p-2'>{t('changed-data')}</h4>
                            </Button>
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
                            {user?.id ? (
                                <p className='text-base'>{user?.id ?? ''}</p>
                            ) : (
                                <p>Id not found</p>
                            )
                            }
                        </Form.Item>
                        <Form.Item label={t('user-role-title')} >
                            {user?.role?.title ? (
                                <p className='text-base'>{user?.role?.title}</p>
                            ) : (
                                <p>Role title not found</p>
                            )
                            }
                        </Form.Item>
                        <div className='border-2 border-black rounded-md pl-2'>
                            <div className='flex items-center justify-center mt-2'>
                                <h4 className='text-lg font-semibold'>{t('base-info-title')}</h4>
                            </div>
                            <Form.Item label={t('user-public-nickname')} >
                                {user?.info?.public_nickname ? (
                                    <p className='text-base'>{user?.info?.public_nickname ?? ''}</p>
                                ) : (
                                    <p className='text-xs'>Public nickname not found</p>
                                )
                                }
                            </Form.Item>
                            <Form.Item label={t('user-full-name')} >
                                {user?.info?.full_name ? (
                                    <p className='text-base'>{user?.info?.full_name ?? ''}</p>
                                ) : (
                                    <p>Full name not found</p>
                                )
                                }
                            </Form.Item>
                            <Form.Item label={t('user-email')} >
                                {user?.info?.email ? (
                                    <p className='text-base'>{user?.info?.email ?? ''}</p>
                                ) : (
                                    <p>Email not found</p>
                                )
                                }
                            </Form.Item>
                            <Form.Item label={t('user-phone')} >
                                {user?.info?.phone ? (
                                    <p className='text-base'>{user?.info?.phone ?? null}</p>
                                ) : (
                                    <p>Phone not found</p>
                                )
                                }
                            </Form.Item>
                            <Form.Item label={t('user-github')} >
                                {user?.info?.github ? (
                                    <p className='text-base'>{user?.info?.github ?? ''}</p>
                                ) : (
                                    <p>GitHub not found</p>
                                )
                                }
                            </Form.Item>
                            <Form.Item label={t('user-payment-info')} >
                                {user?.info?.payment_info ? (
                                    <p className='text-base'>{user?.info?.payment_info ?? ''}</p>
                                ) : (
                                    <p>Payment info not found</p>
                                )
                                }
                            </Form.Item>
                            <Form.Item label={t('user-tg')} >
                                {user?.info?.tg ? (
                                    <p className='text-base'>{user?.info?.tg ?? ''}</p>
                                ) : (
                                    <p>Telegram not found</p>
                                )
                                }
                            </Form.Item>
                        </div>
                        <div className='border-2 border-black rounded-md pl-2'>
                            <div className='flex items-center justify-center mt-2'>
                                <h4 className='text-lg font-semibold'>{t('projects-info-title')}</h4>
                            </div>
                            <Form.Item label={t('user-project-id')} className='flex items-center' >
                                {user?.projects?.map(project => {
                                    return (
                                        <p key={project.id} className='text-base'>{project.id}</p>
                                    )
                                })
                                }
                            </Form.Item>
                            <Form.Item label={t('user-project-title')} >
                                {user?.projects?.map(project => {
                                    return (
                                        <p key={project.id} className='text-base'>{project.title}</p>
                                    )
                                })}
                            </Form.Item>
                        </div>
                        <div className='border-2 border-black rounded-md pl-2'>
                            <div className='flex items-center justify-center mt-2'>
                                <h4 className='text-lg font-semibold'>{t('user-profile-image')}</h4>
                            </div>
                            <Form.Item label={t('user-image-url')} rules={[{ required: false, message: t('enter-your-image-url') }]}>
                                {user?.info?.image ? (
                                    <Image src={user?.info?.image ?? 'No image found'} alt="Profile photo" />
                                ) : (
                                    <p>Image not found</p>
                                )
                                }
                            </Form.Item>
                        </div>
                    </Form>
                    <Form className='mt-8'>
                        <div className='border-2 border-black rounded-md pl-2'>
                            <div className='flex items-center justify-center mt-2'>
                                <h4 className='text-lg font-semibold'>{t('team-info-title')}</h4>
                            </div>
                            <Form.Item label={t('user-team-id')} >
                                {user?.team?.id ? (
                                    <p className='text-base'>{user?.team?.id ?? ''}</p>
                                ) : (
                                    <p>Team Id not found</p>
                                )
                                }
                            </Form.Item>
                            <Form.Item label={t('user-team-title')} >
                                {user?.team?.title ? (
                                    <p className='text-base'>{user?.team?.title ?? ''}</p>
                                ) : (
                                    <p>Team title not found</p>
                                )
                                }
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
