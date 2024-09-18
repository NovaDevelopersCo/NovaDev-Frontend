
import React, { FC, useState, useEffect, useContext } from 'react'
import * as UserInfoAPI from '../../utils/api/user-info-api'
import { Image } from 'antd'
import { TUser } from '../../utils/typesFromBackend'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IViewUserInfo {
    token: string
    t: (arg0: string) => string
}

const ViewUserInfo: FC<IViewUserInfo> = ({ token, t }) => {
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
                                <div className='flex items-center justify-center'>
                                    <Image className='rounded-lg overflow-hidden' width={200} height={200} src={user?.info?.image} alt="Profile photo" onError={handleImageError} />
                                </div>
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

export default ViewUserInfo
