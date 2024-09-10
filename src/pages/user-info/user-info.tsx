
import React, { FC, useState, useEffect, useContext } from 'react'
import * as UserInfoAPI from '../../utils/api/user-info-api'
import { Button, Form, Input, Image, Upload, Segmented } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { TUser, ECountry } from '../../utils/typesFromBackend'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { SegmentedValue } from 'antd/es/segmented'

interface IUserInfo {
    token: string
    t: (arg0: string) => string
    language: ECountry
}

const UserInfo: FC<IUserInfo> = ({ token, t }) => {
    const { openNotification } = useContext(NotificationContext)
    //
    const [isImageError, setIsImageError] = useState(false)
    const handleImageError = (): void => {
        setIsImageError(true)
    }
    // const [isEditing, setIsEditing] = useState<string>('false')
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const handleChangeState = (value: SegmentedValue): void => {
        setIsEditing(value === 'Edit')
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const [user, setUser] = React.useState<TUser>({} as TUser)
    //
    useEffect(() => {
            UserInfoAPI.getUserData(token).then(res => {
                if (res) {
                    setUser(res)
                }
            }).catch((e) => openNotification(e, 'topRight'))
    }, [token])
    //
    const onFinish = (e: React.FormEvent<HTMLFormElement>): void => {
        UserInfoAPI
            .editUserData(token, user).then(() => {
                openNotification('The user data is saved!', 'topRight')
            })
            .catch((e) => openNotification(e, 'topRight'))
    }
    //
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target
        if (name in user.info) {
          setUser((prevUser) => ({
            ...prevUser,
            info: {
              ...prevUser.info,
              [name]: value
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
                <Segmented options={['View', 'Edit']} value={isEditing ? 'Edit' : 'View'} onChange={handleChangeState}/>
            </div>
            { isEditing ? (
                <div className='flex flex-col mt-4'>
                    <div className='flex items-center justify-start'>
                        <h1 className='text-xl font-semibold mb-5'>{t('about-user-title')}</h1>
                    </div>
                    <Form className='flex flex-col gap-6' onFinish={onFinish} >
                        <div>
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
                    <div>
                        <div className='flex items-center justify-start'>
                            <h1 className='text-xl font-semibold mb-5'>{t('about-user-title')}</h1>
                        </div>
                    </div>
                    <div>
                        <div className='flex items-center justify-center mt-2'>
                                <h4 className='text-lg font-semibold'>{t('user-profile-image')}</h4>
                        </div>
                        {isImageError ? (
                                <div className='flex justify-center mb-2'>
                                    <p className='text-base'>Image preload error</p>
                                </div>
                        ) : (
                            <div className='flex gap-2 mb-2'>
                                <h2>{t('user-image')}</h2>
                                <Image className='rounded-full w-24 h-24' src={user?.info?.image ?? 'No image found'} alt="Profile photo" onError={handleImageError} />
                            </div>
                        )
                        }
                    </div>
                    <div className='flex flex-col gap-6 mt-4'>
                        <div>
                            <div className='flex gap-2'>
                                <h2>{t('user-role-title')}</h2>
                                <p className='text-base'>{user?.role?.title}</p>
                            </div>
                        </div>
                        <div>
                            <div className='flex items-center justify-center mt-2'>
                                <h4 className='text-lg font-semibold'>{t('base-info-title')}</h4>
                            </div>
                            <div className='flex flex-col gap-3 mb-2'>
                                <div className='flex gap-2'>
                                    <h2>{t('user-public-nickname')}</h2>
                                    <p className='text-base'>{user?.info?.public_nickname ?? ''}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <h2>{t('user-full-name')}</h2>
                                    <p className='text-base'>{user?.info?.full_name ?? ''}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <h2>{t('user-email')}</h2>
                                    <p className='text-base'>{user?.info?.email ?? ''}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <h2>{t('user-phone')}</h2>
                                    <p className='text-base'>{user?.info?.phone ?? null}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <h2>{t('user-github')}</h2>
                                    <p className='text-base'>{user?.info?.github ?? ''}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <h2>{t('user-payment-info')}</h2>
                                    <p className='text-base'>{user?.info?.payment_info ?? ''}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <h2>{t('user-tg')}</h2>
                                    <p className='text-base'>{user?.info?.tg ?? ''}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-8'>
                        <div>
                            <div className='flex items-center justify-center mt-2'>
                                <h4 className='text-lg font-semibold'>{t('team-info-title')}</h4>
                            </div>
                            <div className='flex gap-2 mb-2'>
                                <h2>{t('user-team-title')}</h2>
                                <p className='text-base'>{user?.team?.title ?? ''}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        </div>
    )
}

export default UserInfo
