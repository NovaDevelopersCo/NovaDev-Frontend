import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, useContext, useEffect, useState } from 'react'
import * as UserInfoAPI from '../../../utils/api/user-info-api'
import { Link, NavLink } from 'react-router-dom'
import { NotificationContext } from '../../../components/notification-provider/notification-provider'
import { TUser } from '../../../utils/typesFromBackend'
import clsx from 'clsx'

interface IUsers {
  token: string
  pathRest: string
  t: (arg0: string) => string
  dark: boolean
}

const AllUsers: FC<IUsers> = ({ token, pathRest, t, dark }) => {
  const { openNotification } = useContext(NotificationContext)
  const [users, setUsers] = useState<TUser[]>([])

  useEffect(() => {
    UserInfoAPI.getAllUsers(token)
      .then((res: TUser[]) => {
        setUsers(res)
      })
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }, [token, openNotification])

  const columns: ColumnsType<TUser> = [
    {
      title: `${t('role-title')}`,
      dataIndex: 'role_title',
      key: 'role_title',
      render: (title: string, user: TUser): JSX.Element => {
        const userRoleTitle = user?.role?.title ?? 'No user role title found'
        return <span>{userRoleTitle}</span>
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.role && b.role) {
          return a.role.title.localeCompare(b.role.title)
        }
        return 0
      }
    },
    {
      title: `${t('public-nickname')}`,
      dataIndex: 'public_nickname',
      key: 'public_nickname',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      render: (_: string, user: TUser): JSX.Element => {
        const userPublicNickname =
          user?.info?.public_nickname ?? 'No public_nickname found'
        return (
          <Link to={`/${pathRest}/user/${user.id}`}>{userPublicNickname}</Link>
        )
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.info && b.info) {
          return a.info.public_nickname.localeCompare(b.info.public_nickname)
        }
        return 0
      }
    },
    {
      title: `${t('full-name')}`,
      dataIndex: 'full_name',
      key: 'full_name',
      render: (_: string, user: TUser): JSX.Element => {
        const userFullName = user?.info?.full_name ?? 'No full_name found'
        return <Link to={`/${pathRest}/user/${user.id}`}>{userFullName}</Link>
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.info && b.info) {
          return a.info.full_name.localeCompare(b.info.full_name)
        }
        return 0
      }
    },
    {
      title: `${t('email')}`,
      dataIndex: 'email',
      key: 'email',
      render: (email: string, user: TUser): JSX.Element => {
        const userEmail = user?.info?.email ?? 'No email found'
        return <span>{userEmail}</span>
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.info && b.info) {
          return a.info.email.localeCompare(b.info.email)
        }
        return 0
      }
    }
  ]
  const theme = clsx(dark ? 'black' : 'white')
  return (
    <>
      <div
        style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
      >
        <div
          style={{
            display: 'flex',
            marginBottom: '1rem',
            alignItems: 'center',
            outline: 'none',
            padding: '0'
          }}
        >
          <div style={{ display: 'block', marginRight: 'auto' }}>
            <h2 style={{ fontWeight: 600, marginBottom: '0' }}>{t('users')}</h2>
            <p style={{ marginBottom: '0' }}>{t('list-users')}</p>
          </div>
          <NavLink
            to={`/${pathRest}/add/user`}
            style={{
              color: '#fff',
              backgroundColor: '#2bc155',
              borderColor: '#2bc155',
              width: '145px',
              height: '61px',
              borderRadius: '0.375rem',
              fontWeight: '500',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {t('add')}
          </NavLink>
        </div>
        <Table
          className={theme}
          columns={columns}
          dataSource={users.map((user) => ({ ...user, key: user.id }))}
        />
      </div>
    </>
  )
}

export default AllUsers
