
import React, { FC, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import * as UserInfoAPI from '../../utils/api/user-info-api'
import { Image } from 'antd'
import { TUser } from '../../utils/typesFromBackend'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IViewUserInfo {
    token: string
    pathRest: string
    t: (arg0: string) => string
}

const ViewUserInfo: FC<IViewUserInfo> = ({ token, pathRest, t }) => {
    const { openNotification } = useContext(NotificationContext)
    const [isImageError, setIsImageError] = useState(false)
    const handleImageError = (): void => {
        setIsImageError(true)
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const [user, setUser] = React.useState<TUser>({} as TUser)
    useEffect(() => {
        UserInfoAPI.getUserData(token).then(res => {
            if (res) {
                setUser(res)
            }
        }).catch((e) => openNotification(e, 'topRight'))
    }, [token])
    return (
        <div className='flex flex-col mt-4'>
                    <div>
                        <div className='flex items-center justify-start'>
                            <h1 className='text-xl font-semibold mb-5'>{t('about-user-title')}</h1>
                        </div>
                    </div>
                    <div>
                        {isImageError ? (
                                <div className='flex justify-center mb-2'>
                                    <p className='text-base'>Image preload error</p>
                                </div>
                        ) : (
                            <div className='flex gap-2 mb-2  items-center justify-center'>
                                <div>
                                    <Image className='rounded-lg overflow-hidden  border-2 border-black object-cover' width={200} height={200} src={user?.info?.image} alt="Profile photo" onError={handleImageError} />
                                </div>
                            </div>
                        )
                        }
                    </div>
                    <div className='flex flex-col gap-6 mt-4'>
                        <div>
                            <div className='flex gap-2 items-center'>
                                <h2 className='font-semibold'>{t('user-role-title')}</h2>
                                <Link to={`/${pathRest}/role/:${user.roleId}`}>{user?.role?.title}</Link>
                            </div>
                        </div>
                        <div>
                            <div className='flex items-center justify-center mt-2'>
                                <h4 className='text-lg font-semibold'>{t('base-info-title')}</h4>
                            </div>
                            <div className='flex flex-col gap-3 mb-2'>
                                <div className='flex gap-2 items-center'>
                                    <h2 className='font-semibold'>{t('user-public-nickname')}</h2>
                                    <p>{user?.info?.public_nickname ?? ''}</p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <h2 className='font-semibold'>{t('user-full-name')}</h2>
                                    <p>{user?.info?.full_name ?? ''}</p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <h2 className='font-semibold'>{t('user-email')}</h2>
                                    <a href={`mailto:${user?.info?.email}`}>{user?.info?.email ?? ''}</a>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <h2 className='font-semibold'>{t('user-phone')}</h2>
                                    <p>{user?.info?.phone ?? null}</p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <h2 className='font-semibold'>{t('user-github')}</h2>
                                    <a href={`${user?.info?.github}`}>{user?.info?.github ?? ''}</a>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <h2 className='font-semibold'>{t('user-payment-info')}</h2>
                                    <a href={`${user?.info?.payment_info}`}>{user?.info?.payment_info ?? ''}</a>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <h2 className='font-semibold'>{t('user-tg')}</h2>
                                    <a href={`${user?.info?.tg}`}>{user?.info?.tg ?? ''}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-8'>
                        <div>
                            <div className='flex items-center justify-center mt-2'>
                                <h4 className='text-lg font-semibold'>{t('team-info-title')}</h4>
                            </div>
                            <div className='flex gap-2 mb-2 items-center'>
                                <h2 className='font-semibold'>{t('user-team-title')}</h2>
                                <p>{user?.team?.title ?? ''}</p>
                            </div>
                        </div>
                    </div>
                </div>
    )
}

export default ViewUserInfo
