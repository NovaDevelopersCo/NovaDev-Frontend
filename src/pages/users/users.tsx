import { Button, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, useContext, useEffect, useState } from 'react'
import * as UserInfoAPI from '../../utils/api/user-info-api'
import { Link, NavLink } from 'react-router-dom'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { TUser } from '../../utils/typesFromBackend'
import UpdateUserModal from '../../components/update-user-modal/update-user-modal'

interface IUsers {
  token: string
  pathRest: string
  t: (arg0: string) => string
}

const AllUsers: FC<IUsers> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [users, setUsers] = useState<TUser[]>([])
  // const history = useHistory()
  const [updatingUserId, setUpdatingUserId] = useState<null | number>(null)

  useEffect(() => {
    UserInfoAPI
      .getAllUsers(token)
      .then((res: TUser[]) => {
        setUsers(res)
      })
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }, [token, openNotification])

  const handleDelete = (id: number): void => {
    UserInfoAPI
      .deleteUser(token, id)
      .then(() =>
        setUsers((prev: TUser[]) =>
          prev.filter((user) => user.id !== id)
        )
      )
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }

  const handleCancel = (): void => {
    setUpdatingUserId(null)
  }

  const columns: ColumnsType<TUser> = [
    {
      title: `${t('id')}`,
      dataIndex: 'id',
      key: 'id',
      render: (id: number, user: TUser): JSX.Element => (
        <Link to={`/${pathRest}/user/${user.id}`}>{id}</Link>
      ),
      sorter: (a: TUser, b: TUser): number =>
        a.id - b.id
    },
    {
      title: `${t('role-title')}`,
      dataIndex: 'role_title',
      key: 'role_title',
      render: (title: string, user: TUser): JSX.Element => {
        if (user?.role) {
          // @ts-expect-error role is object
          return <span>{user.role.title}</span>
        } else {
          return <span>No role found</span>
        }
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.role && b.role) {
            // @ts-expect-error role is object
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
      render: (public_nickname: string, user: TUser): JSX.Element => {
        if (user?.info) {
          // @ts-expect-error role is object
          return <span>{user.info.public_nickname}</span>
        } else {
          return <span>No public_nickname found</span>
        }
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.info && b.info) {
            // @ts-expect-error role is object
            return a.info.public_nickname.localeCompare(b.info.public_nickname)
        }
        return 0
      }
    },
    {
      title: `${t('full-name')}`,
      dataIndex: 'full_name',
      key: 'full_name',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      render: (full_name: string, user: TUser): JSX.Element => {
        if (user?.info) {
          // @ts-expect-error role is object
          return <span>{user.info.full_name}</span>
        } else {
          return <span>No full_name found</span>
        }
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.info && b.info) {
            // @ts-expect-error role is object
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
        if (user?.info) {
          // @ts-expect-error role is object
          return <span>{user.info.email}</span>
        } else {
          return <span>No email found</span>
        }
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.info && b.info) {
            // @ts-expect-error role is object
            return a.info.email.localeCompare(b.info.email)
        }
        return 0
      }
    },
    {
      title: `${t('phone')}`,
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: number, user: TUser): JSX.Element => {
        if (user?.info) {
          // @ts-expect-error role is object
          return <span>{user.info.phone}</span>
        } else {
          return <span>No phone found</span>
        }
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.info && b.info) {
            // @ts-expect-error role is object
            return a.info.phone.localeCompare(b.info.phone)
        }
        return 0
      }
    },
    {
      title: `${t('github')}`,
      dataIndex: 'github',
      key: 'github',
      render: (github: string, user: TUser): JSX.Element => {
        if (user?.info) {
          // @ts-expect-error role is object
          return <span>{user.info.github}</span>
        } else {
          return <span>No github found</span>
        }
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.info && b.info) {
            // @ts-expect-error role is object
            return a.info.github.localeCompare(b.info.github)
        }
        return 0
      }
    },
    {
      title: `${t('payment-info')}`,
      dataIndex: 'payment_info',
      key: 'payment_info',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      render: (payment_info: string, user: TUser): JSX.Element => {
        if (user?.info) {
          // @ts-expect-error role is object
          return <span>{user.info.payment_info}</span>
        } else {
          return <span>No payment_info found</span>
        }
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.info && b.info) {
            // @ts-expect-error role is object
            return a.info.payment_info.localeCompare(b.info.payment_info)
        }
        return 0
      }
    },
    {
      title: `${t('tg')}`,
      dataIndex: 'tg',
      key: 'tg',
      render: (tg: string, user: TUser): JSX.Element => {
        if (user?.info) {
          // @ts-expect-error role is object
          return <span>{user.info.tg}</span>
        } else {
          return <span>No tg found</span>
        }
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.info && b.info) {
            // @ts-expect-error role is object
            return a.info.tg.localeCompare(b.info.tg)
        }
        return 0
      }
    },
    {
      title: `${t('image')}`,
      dataIndex: 'image',
      key: 'image',
      render: (image: string, user: TUser): JSX.Element => {
        if (user?.info) {
          // @ts-expect-error role is object
          return <span>{user.info.image}</span>
        } else {
          return <span>No image found</span>
        }
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.info && b.info) {
            // @ts-expect-error role is object
            return a.info.image.localeCompare(b.info.image)
        }
        return 0
      }
    },
    {
      title: `${t('team-title')}`,
      dataIndex: 'team_title',
      key: 'team_title',
      render: (title: string, user: TUser): JSX.Element => {
        if (user?.team) {
          // @ts-expect-error role is object
          return <span>{user.team.title}</span>
        } else {
          return <span>No team_title found</span>
        }
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.team && b.team) {
            // @ts-expect-error role is object
            return a.team.title.localeCompare(b.team.title)
        }
        return 0
      }
    },
    {
      title: `${t('projects-title')}`,
      dataIndex: 'projects_title',
      key: 'projects_title',
      render: (title: string, user: TUser): JSX.Element => {
        if (user?.projects) {
          // @ts-expect-error role is object
          return <span>{user.projects.title}</span>
        } else {
          return <span>No projects_title found</span>
        }
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.projects && b.projects) {
            // @ts-expect-error role is object
            return a.projects.title.localeCompare(b.projects.title)
        }
        return 0
      }
    },
    {
      title: `${t('actions')}`,
      key: 'actions',
      render: (_: any, user: TUser): JSX.Element => (
        <div className='flex flex-col justify-center gap-1'>
          <Button
            type='primary'
            onClick={() => {
              console.log(user)
              setUpdatingUserId(user.id)
            }}
          >
            {t('update')}
          </Button>
          <Button danger onClick={() => handleDelete(user.id)}>
            {t('delete')}
          </Button>
        </div>
      )
    }
  ]

  console.log(users)

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
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
            <h2 style={{ fontWeight: 600, marginBottom: '0' }}>
              {t('users')}
            </h2>
            <p style={{ marginBottom: '0' }}>{t('your-list-users')}</p>
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
        <Table columns={columns} dataSource={users} />
      </div>
      <UpdateUserModal token={token} userId={updatingUserId} onCancel={handleCancel}/>
    </>
  )
}

export default AllUsers
