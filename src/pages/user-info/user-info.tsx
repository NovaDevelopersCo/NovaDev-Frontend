import React, { FC, useState, useEffect, useContext } from 'react'
import * as UserInfoAPI from '../../utils/api/user-info-api'
import { Button, Form, Input, Image, Upload, UploadFile, Segmented } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { TUser, TUserInfo, ECountry } from '../../utils/typesFromBackend'
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
    const [form] = Form.useForm()
    //
    const [isImageError, setIsImageError] = useState(false)
    const handleImageError = (): void => {
        setIsImageError(true)
    }
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const handleChangeState = (value: SegmentedValue): void => {
        setIsEditing(value === 'Edit')
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const [user, setUser] = React.useState<TUser>({} as TUser)
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const [userInfo, setUserInfo] = React.useState<TUserInfo>({} as TUserInfo)
    const [fileList, setFileList] = React.useState<UploadFile[]>([])
    const [formData, setFormData] = React.useState(() => {
        const storedFormDataString = localStorage.getItem('formDataUser')
        return storedFormDataString ? JSON.parse(storedFormDataString) : null
    })
    //
    const handleFormChange = (): void => {
        const allValues = form.getFieldsValue()
        const updateAllValues = { ...allValues, _id: user.id }
        setFormData(updateAllValues)
    }
    //
    const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }): void => {
        setFileList(fileList)
    }
    //
    React.useEffect(() => {
        if (Object.keys(user).length > 0 && formData) {
          if (user.id !== formData._id) {
            localStorage.removeItem('formDataUser')
          }
        }
        localStorage.setItem('formDataUser', JSON.stringify(formData))
    }, [formData])
    //
    useEffect(() => {
            UserInfoAPI.getUserData(token).then(res => {
                if (res) {
                    setUser(res)
                }
            }).catch((e) => openNotification(e, 'topRight'))
    }, [token])
    //
    useEffect(() => {
        UserInfoAPI.getUserData(token).then(res => {
            if (res.info) {
                setUserInfo(res.info)
            }
        }).catch((e) => openNotification(e, 'topRight'))
    }, [token])
    //
    React.useEffect(() => {
        const storedFormDataString = localStorage.getItem('formDataUser')
        const parsedFormData = storedFormDataString
          ? JSON.parse(storedFormDataString)
          : null
        if (parsedFormData && parsedFormData.id === user.id) {
          form.setFieldsValue({
            public_nickname: parsedFormData.public_nickname
          })
          form.setFieldsValue({
            full_name: parsedFormData.full_name
          })
          form.setFieldsValue({
            phone: parsedFormData.phone
          })
          form.setFieldsValue({
            email: parsedFormData.email
          })
          form.setFieldsValue({
            github: parsedFormData.github
          })
          form.setFieldsValue({
            payment_info: parsedFormData.payment_info
          })
          form.setFieldsValue({
            tg: parsedFormData.tg
          })
        } else {
          form.setFieldsValue({
            public_nickname: userInfo?.public_nickname
          })
          form.setFieldsValue({
            full_name: userInfo?.full_name
          })
          form.setFieldsValue({
            phone: userInfo?.phone
          })
          form.setFieldsValue({
            email: userInfo?.email
          })
          form.setFieldsValue({
            github: userInfo?.github
          })
          form.setFieldsValue({
            payment_info: userInfo?.payment_info
          })
          form.setFieldsValue({
            tg: userInfo?.tg
          })
        }
      }, [userInfo])
    //
    const onFinish = (values: any): void => {
            const formData = new FormData()
            formData.append('public_nickname', values.public_nickname)
            formData.append('full_name', values.full_name)
            formData.append('phone', values.phone)
            formData.append('email', values.email)
            formData.append('github', values.github)
            formData.append('payment_info', values.payment_info)
            formData.append('tg', values.tg)
        if (fileList.length > 0 && fileList[0].originFileObj) {
            const file = fileList[0].originFileObj
            formData.append('image', file)
          } else {
            console.error('No file found in fileList')
          }
        //
        UserInfoAPI
            .editUserData(token, formData).then(() => {
                localStorage.removeItem('formDataUser')
                openNotification('The user data is saved!', 'topRight')
            })
            .catch((e) => openNotification(e, 'topRight'))
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
                    <Form className='flex flex-col gap-6' name='user' form={form} onFinish={onFinish} onValuesChange={handleFormChange} >
                        <div>
                            <div className='flex items-center justify-center mt-2 mb-3'>
                                <h4 className='text-lg font-semibold'>{t('base-info-title')}</h4>
                            </div>
                            <Form.Item label={t('user-public-nickname')} name='public_nickname' rules={[{ required: false, message: t('enter-your-public-nickname') }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label={t('user-full-name')} name='full_name' rules={[{ required: false, message: t('enter-your-full-name') }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label={t('user-image')} rules={[{ required: false, message: t('enter-your-image') }]}>
                                <Upload onChange={handleUploadChange} fileList={fileList} beforeUpload={() => false} >
                                    <Button className='flex items-center'>
                                        <UploadOutlined />
                                        {t('upload-image')}
                                    </Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item label={t('user-phone')} name='phone' rules={[{ required: false, message: t('enter-your-phone') }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label={t('user-email')} name='email' rules={[{ required: false, message: t('enter-your-email') }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label={t('user-github')} name='github' rules={[{ required: false, message: t('enter-your-github') }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label={t('user-payment-info')} name='payment_info' rules={[{ required: false, message: t('enter-your-payment-info') }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label={t('user-tg')} name='tg' rules={[{ required: false, message: t('enter-your-tg') }]}>
                                <Input />
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
        </div>
    )
}

export default UserInfo
