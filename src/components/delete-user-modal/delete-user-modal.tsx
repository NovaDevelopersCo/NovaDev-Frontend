import { Modal, Button } from 'antd'
import { FC, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as UserInfoAPI from '../../utils/api/user-info-api'
import { NotificationContext } from '../notification-provider/notification-provider'
import { TUser } from '../../utils/typesFromBackend'

interface IDeleteUserModalProps {
  onCancel: () => void
  token: string
  userId: number | null
}

const DeleteUserModal: FC<IDeleteUserModalProps> = ({
  onCancel,
  token,
  userId
}) => {
  const { t } = useTranslation()
  const { openNotification } = useContext(NotificationContext)
  const [, setUsers] = useState<TUser[]>([])

  const handleDelete = (userId: number): void => {
    UserInfoAPI.deleteUser(token, userId)
      .then(() => {
        setUsers((prev: TUser[]) => prev.filter((user) => user.id !== userId))
        openNotification('User deleted succesfully!', 'topRight')
      })
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }

  return (
    <Modal
      title='User delete Modal'
      open={!!userId}
      onCancel={onCancel}
      footer={[
        <Button key='cancel' onClick={onCancel}>
          {t('cancel')}
        </Button>
      ]}
    >
      <div className='flex flex-col justify-center items-center gap-4'>
        <h1 className='text-2xl font-semibold'>{t('user-delete-title')}</h1>
        <div>
          <h4 className='text-base'>{t('confirm-user-delete')}</h4>
        </div>
        <div>
          <Button
            danger
            onClick={() => {
              if (userId !== null) {
                handleDelete(userId)
              }
            }}
          >
            {t('delete')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteUserModal
