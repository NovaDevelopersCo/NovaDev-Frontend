/* eslint-disable multiline-ternary */
import * as roleAPI from '../../../utils/api/role-api'
import React, { FC, useContext } from 'react'
import { useLocation, useRouteMatch } from 'react-router-dom'
import { TRole } from '../../../utils/typesFromBackend'
import { Button, Modal, Segmented } from 'antd'
import { NotificationContext } from '../../../components/notification-provider/notification-provider'
import RoleUpdate from '../../../components/FRole/role-update/role-update'
import RoleUser from '../../../components/FRole/role-user/role-user'
import clsx from 'clsx'

interface IEditorRole {
  token: string
  t: (arg0: string) => string
  pathRest: string
  style: object
  dark: boolean
}

const Role: FC<IEditorRole> = ({ token, pathRest, t, style, dark }) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const restId = Object.keys(match?.params as string)[0]
  const [role, setRole] = React.useState<TRole>({} as TRole)
  const [isRole, setIsRole] = React.useState(false)
  const [value, setValue] = React.useState<string | number>(t('role'))
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const theme = clsx(dark ? 'black' : 'white')
  React.useEffect(() => {
    roleAPI
      .getRole(token, restId)
      .then((res: TRole) => {
        setIsRole(true)
        setRole(res)
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
          fontSize: '1.75rem',
          fontWeight: '600',
          padding: '15px'
        }}
      >
        {role?.title ? role.title : ''}
      </h4>
      <Segmented
        block
        options={[t('role'), t('users')]}
        value={value}
        style={style}
        onChange={setValue}
      />{' '}
      {isRole ? (
        value === t('role') ? (
          <RoleUpdate
            token={token}
            pathRest={pathRest}
            t={t}
            style={style}
          />
        ) : (
          ''
        )
      ) : (
        ''
      )}
      {isRole ? (
        value === t('users') ? (
          <RoleUser
            theme={theme}
            token={token}
            pathRest={pathRest}
            t={t}
            style={style}
          ></RoleUser>
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
