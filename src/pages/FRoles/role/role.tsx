/* eslint-disable multiline-ternary */
import * as roleAPI from '../../../utils/api/role-api'
import React, { FC, useContext } from 'react'
import { useLocation, useRouteMatch } from 'react-router-dom'
import { TAdmin } from '../../../utils/typesFromBackend'
import { Button, Modal, Segmented } from 'antd'
import { NotificationContext } from '../../../components/notification-provider/notification-provider'
import AdminPassword from '../../../components/admin-password/admin-password'
import AdminUpdate from '../../../components/admin-update/admins-update'

interface IEditorRole {
  token: string
  t: (arg0: string) => string
  pathRest: string
}

const Role: FC<IEditorRole> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const restId = Object.keys(match?.params as string)[0]
  const [admin, setAdmin] = React.useState<TAdmin>({} as TAdmin)
  const [isRest, setIsRest] = React.useState(false)
  const [value, setValue] = React.useState<string | number>(t('admin'))
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  console.log(restId)

  React.useEffect(() => {
    roleAPI
      .getRole(token, restId)
      .then((res: TAdmin) => {
        setIsRest(true)
        setAdmin(res)
        console.log(res)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

  const handleModalClose = (): void => {
    setIsModalVisible(false)
  }

  return (
    <>
      <h4
        style={{
          marginBottom: '15px',
          marginTop: '0',
          color: '#000',
          fontSize: '1.75rem',
          fontWeight: '600',
          padding: '15px'
        }}
      >
        {admin?.nickname ? admin.nickname : ''}
      </h4>
      <Segmented
        block
        options={[t('role'), t('users')]}
        value={value}
        onChange={setValue}
      />{' '}
      {isRest ? (
        value === t('role') ? (
          <AdminUpdate token={token} pathRest={pathRest} t={t} />
        ) : (
          ''
        )
      ) : (
        ''
      )}
      {isRest ? (
        value === t('users') ? (
          <AdminPassword
            token={token}
            pathRest={pathRest}
            t={t}
          ></AdminPassword>
        ) : (
          ''
        )
      ) : (
        ''
      )}
      {
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
          {t('field_must_not_empty')}
        </Modal>
      }
    </>
  )
}
export default Role
