import { Modal, Button, Form, Input } from 'antd'
import { FC, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as UserInfoAPI from '../../utils/api/user-info-api'
import { NotificationContext } from '../notification-provider/notification-provider'
// import { TUser } from '../../utils/typesFromBackend'

interface IAddUserModalProps {
    onCancel: () => void
    token: string
    openUser: boolean
    // userId: number | null
}

const AddUserModal: FC<IAddUserModalProps> = ({ onCancel, token, openUser }) => {
    const { t } = useTranslation()
    const { openNotification } = useContext(NotificationContext)
    const [newUserLogin, setNewUserLogin] = useState<string | undefined>(undefined)
    const [newUserPassword, setNewUserPassword] = useState<string | undefined>(undefined)

    const handleCreateUser = (): void => {
        UserInfoAPI
          .addUser(token)
          .then(res => {
              openNotification('User created succesfully!', 'topRight')
              setNewUserLogin(res.login)
              setNewUserPassword(res.password)
            }
          )
          .catch((e: Error) => openNotification(e.message, 'topRight'))
    }

    return <Modal title="User delete Modal" open={!!openUser} onCancel={onCancel} footer={[<Button key="cancel" onClick={onCancel}>{t('cancel')}</Button>]}>
        <div className='flex flex-col gap-6 items-center'>
          <div className='flex flex-col gap-2'>
            <h4 className='text-xl font-bold'>{t('create-new-user-title')}</h4>
            <Button className='text-base' onClick={handleCreateUser} >{t('create-new-user')}</Button>
          </div>
          <div>
            <Form>
              <Form.Item label={t('user-public-nickname')} >
                  <Input value={newUserLogin} />
              </Form.Item>
              <Form.Item label={t('password')} >
                  <Input value={newUserPassword} />
              </Form.Item>
            </Form>
          </div>
        </div>
  </Modal>
}

export default AddUserModal
