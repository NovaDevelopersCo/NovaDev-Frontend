import { Form, Input, Modal, Button } from 'antd'
import { FC, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as UserInfoAPI from '../../utils/api/user-info-api'
import { NotificationContext } from '../notification-provider/notification-provider'
import { TUser } from '../../utils/typesFromBackend'

interface IUpdateUserModalProps {
    onCancel: () => void
    token: string
    userId: number | null
}

const UpdateUserModal: FC<IUpdateUserModalProps> = ({ onCancel, token, userId }) => {
    const { t } = useTranslation()
    const { openNotification } = useContext(NotificationContext)
    const [user, setUser] = useState<TUser | null>(null)

    useEffect(() => {
        if (userId) {
            UserInfoAPI.fetchUserById(token, userId).then(res => {
                setUser(res)
            }).catch((e: Error) => openNotification(e.message, 'topRight'))
        }
    }, [token, userId])

    const onFinish = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        if (userId !== null) {
            UserInfoAPI
                .editUserDataById(token, user, userId)
                .then(() => {
                    console.log('Done')
                })
                .catch((e) => openNotification(e, 'topRight'))
        } else {
            console.error('userId is null')
            openNotification('User ID cannot be null', 'topRight')
        }
    }

    return <Modal title="Update Form Modal" open={!!userId} onCancel={onCancel} footer={[<Button key="cancel" onClick={onCancel}>{t('cancel')}</Button>]}>
    <Form className='mt-4 mb-8' onFinish={onFinish}>
        <Form.Item label={t('user-id')} rules={[{ required: false, message: t('enter-user-id') }]}>
            <Input type="number" value={user?.id} />
        </Form.Item>
        <Form.Item label={t('user-image-url')} rules={[{ required: false, message: t('enter-user-image-url') }]}>
            {/* @ts-expect-error role is object */}
            <Input type='text' value={user?.info?.image} />
        </Form.Item>
        <Form.Item label={t('user-public-nickname')} rules={[{ required: false, message: t('enter-your-public-nickname') }]}>
            {/* @ts-expect-error role is object */}
            <Input type='text' value={user?.info?.public_nickname} />
        </Form.Item>
        <Form.Item label={t('user-full-name')} rules={[{ required: false, message: t('enter-your-full-name') }]}>
            {/* @ts-expect-error role is object */}
            <Input type='text' value={user?.info?.full_name} />
        </Form.Item>
        <Form.Item label={t('user-email')} rules={[{ required: false, message: t('enter-your-email') }]}>
            {/* @ts-expect-error role is object */}
            <Input type='text' value={user?.info?.email} />
        </Form.Item>
        <Form.Item label={t('user-phone')} rules={[{ required: false, message: t('enter-your-phone') }]}>
            {/* @ts-expect-error role is object */}
            <Input type='text' value={user?.info?.phone} />
        </Form.Item>
        <Form.Item label={t('user-github')} rules={[{ required: false, message: t('enter-your-github') }]}>
            {/* @ts-expect-error role is object */}
            <Input type='text' value={user?.info?.github} />
        </Form.Item>
        <Form.Item label={t('user-payment-info')} rules={[{ required: false, message: t('enter-your-payment-info') }]}>
            {/* @ts-expect-error role is object */}
            <Input type='text' value={user?.info?.payment_info} />
        </Form.Item>
        <Form.Item label={t('user-tg')} rules={[{ required: false, message: t('enter-your-tg') }]}>
            {/* @ts-expect-error role is object */}
            <Input type='text' value={user?.info?.tg} />
        </Form.Item>
        <div className='flex justify-center'>
            <Button className='flex justify-center items-center text-lg w-28 mt-5' htmlType='submit'>
                <h4 className='p-1'>{t('changed-data')}</h4>
            </Button>
        </div>
    </Form>
    <Form className='mb-8' onFinish={onFinish}>
        <Form.Item label={t('user-role-title')} rules={[{ required: false, message: t('enter-user-role-title') }]}>
            {/* @ts-expect-error role is object */}
            <Input type="text" value={user?.role?.title} />
        </Form.Item>
        <div className='flex justify-center'>
            <Button className='flex justify-center items-center text-lg w-28 mt-5' htmlType='submit'>
                <h4 className='p-1'>{t('changed-data')}</h4>
            </Button>
        </div>
    </Form>
    <Form className='mb-8' onFinish={onFinish}>
        <Form.Item label={t('user-project-title')} rules={[{ required: false, message: t('enter-user-project-title') }]}>
            {/* @ts-expect-error role is object */}
            <Input type="text" value={user?.projects?.title} />
        </Form.Item>
        <div className='flex justify-center'>
            <Button className='flex justify-center items-center text-lg w-28 mt-5' htmlType='submit'>
                <h4 className='p-1'>{t('changed-data')}</h4>
            </Button>
        </div>
    </Form>
    <Form onFinish={onFinish}>
        <Form.Item label={t('user-team-title')} rules={[{ required: false, message: t('enter-user-team-title') }]}>
            {/* @ts-expect-error role is object */}
            <Input type="text" value={user?.team?.title ?? ''} />
        </Form.Item>
        <div className='flex justify-center'>
            <Button className='flex justify-center items-center text-lg w-28 mt-5' htmlType='submit'>
                <h4 className='p-1'>{t('changed-data')}</h4>
            </Button>
        </div>
    </Form>
  </Modal>
}

export default UpdateUserModal
