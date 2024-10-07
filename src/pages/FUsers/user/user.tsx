import React, { FC, useContext, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Form, Input, Button, Popconfirm, Modal } from 'antd'
import { NotificationContext } from '../../../components/notification-provider/notification-provider'
import * as UserInfoAPI from '../../../utils/api/user-api'
import { TUser } from '../../../utils/typesFromBackend'
import clsx from 'clsx'
interface IUserEditPage {
  token: string
  pathRest: string
  t: (arg0: string) => string
  style: object
  dark: boolean
}

const UserEditPage: FC<IUserEditPage> = ({
  token,
  pathRest,
  t,
  style,
  dark
}) => {
  const { openNotification } = useContext(NotificationContext)
  const [form] = Form.useForm()
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<TUser | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const theme = clsx(dark ? 'black' : 'white')
  React.useEffect(() => {
    UserInfoAPI.getUser(token, Number(id))
      .then((res: TUser) => {
        setUser(res)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

  const onFinish = (values: any): void => {
    const updatedUserData = {
      info: {
        public_nickname: values.public_nickname,
        full_name: values.full_name,
        email: values.email
      },
      role: { title: values.role }
    }

    UserInfoAPI.updateUser(token, Number(id), updatedUserData)
      .then(() => {
        openNotification('User updated successfully!', 'topRight')
        history.push(`/${pathRest}/users`)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  const handleDelete = (): void => {
    UserInfoAPI.deleteUser(token, Number(id))
      .then(() => {
        openNotification('User deleted successfully!', 'topRight')
        history.push(`/${pathRest}/users`)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  const handleModalClose = (): void => {
    setIsModalVisible(false)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h4
        style={{
          marginBottom: '15px',
          marginTop: '0',
          fontSize: '1.75rem',
          fontWeight: '600'
        }}
      >
        {user?.info?.public_nickname ?? t('edit-info-user')}
      </h4>
      <Form
        form={form}
        onFinish={onFinish}
        layout='vertical'
        className={theme}
        style={{ maxWidth: '500px' }}
      >
        <Form.Item name='role' label={t('role')}>
          <Input />
        </Form.Item>
        <Form.Item name='public_nickname' label={t('public-nickname')}>
          <Input />
        </Form.Item>
        <Form.Item name='full_name' label={t('full-name')}>
          <Input />
        </Form.Item>
        <Form.Item name='email' label={t('email')}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            {t('save')}
          </Button>
        </Form.Item>
        <Popconfirm
          title={t('are-you-sure-delete-this-user')}
          onConfirm={handleDelete}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button danger>{t('delete-user')}</Button>
        </Popconfirm>
      </Form>
      <Modal
        title={t('alert')}
        open={isModalVisible}
        closable={false}
        footer={[
          <Button key='ok' type='primary' onClick={handleModalClose}>
            {t('close')}
          </Button>
        ]}
      >
        {t('field_must-not-empty')}
      </Modal>
    </div>
  )
}

export default UserEditPage
