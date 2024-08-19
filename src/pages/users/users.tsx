import { Button, Table, Image } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, useContext, useEffect, useState } from 'react'
import * as UserInfoAPI from '../../utils/api/user-info-api'
import { Link } from 'react-router-dom'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { TUser } from '../../utils/typesFromBackend'
import UpdateUserModal from '../../components/update-user-modal/update-user-modal'
import DeleteUserModal from '../../components/delete-user-modal/delete-user-modal'
import AddUserModal from '../../components/create-user-modal/create-user-modal'

interface IUsers {
  token: string
  pathRest: string
  t: (arg0: string) => string
}

const AllUsers: FC<IUsers> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [users, setUsers] = useState<TUser[]>([])
  const [updatingUserId, setUpdatingUserId] = useState<null | number>(null)
  const [deletingUserId, setDeletingUserId] = useState<null | number>(null)
  const [createUser, setCreateUser] = useState(false)

  useEffect(() => {
    UserInfoAPI
      .getAllUsers(token)
      .then((res: TUser[]) => {
        setUsers(res)
      })
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }, [token, openNotification])

  const handleCancel = (): void => {
    setUpdatingUserId(null)
  }

  const closeModalDelete = (): void => {
    setDeletingUserId(null)
  }

  const closeModalAdd = (): void => {
    setCreateUser(false)
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
      render: (public_nickname: string, user: TUser): JSX.Element => {
        const userPublicNickname = user?.info?.public_nickname ?? 'No public_nickname found'
        return <span>{userPublicNickname}</span>
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
      // eslint-disable-next-line @typescript-eslint/naming-convention
      render: (full_name: string, user: TUser): JSX.Element => {
        const userFullName = user?.info?.full_name ?? 'No full_name found'
        return <span>{userFullName}</span>
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
    },
    {
      title: `${t('phone')}`,
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: number, user: TUser): JSX.Element => {
        const userPhone = user?.info?.phone ?? 'No phone found'
        return <span>{userPhone}</span>
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
        const userGithub = user?.info?.github ?? 'No github found'
        return <span>{userGithub}</span>
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.info && b.info) {
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
        const userPaymentInfo = user?.info?.payment_info ?? 'No payment info found'
        return <span>{userPaymentInfo}</span>
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.info && b.info) {
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
        const userTg = user?.info?.tg ?? 'No tg found'
        return <span>{userTg}</span>
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.info && b.info) {
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
        const userImage = user?.info?.image ?? 'No image found'
        return <Image alt='user image' src={userImage} />
      }
    },
    {
      title: `${t('team-title')}`,
      dataIndex: 'team_title',
      key: 'team_title',
      render: (title: string, user: TUser): JSX.Element => {
        if (user?.team) {
          return <span>{user.team.title}</span>
        } else {
          return <span>No team_title found</span>
        }
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.team && b.team) {
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
        if (user?.projects && user.projects.length > 0) {
          return (
            <div>
              {user.projects.map((project, index) => {
                return <div key={index}>{project.title || 'No title'}</div>
              })}
            </div>
          )
        } else {
          return <span>No projects_title found</span>
        }
      },
      sorter: (a: TUser, b: TUser): number => {
        if (a.projects && b.projects) {
          const aTitle = a.projects && a.projects.length > 0 ? a.projects[0].title : ''
          const bTitle = b.projects && b.projects.length > 0 ? b.projects[0].title : ''
          return aTitle.localeCompare(bTitle)
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
              setUpdatingUserId(user.id)
            }}
          >
            {t('update')}
          </Button>
          <Button danger onClick={() => setDeletingUserId(user.id)}>
            {t('delete')}
          </Button>
        </div>
      )
    }
  ]

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
          <Button
            onClick={() => {
              setCreateUser(true)
            }}
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
          </Button>
        </div>
        <Table columns={columns} dataSource={users.map(user => ({ ...user, key: user.id }))} />
      </div>
      <UpdateUserModal token={token} userId={updatingUserId} onCancel={handleCancel}/>
      <DeleteUserModal token={token} userId={deletingUserId} onCancel={closeModalDelete}/>
      <AddUserModal token={token} openUser={createUser} onCancel={closeModalAdd}/>
    </>
  )
}

export default AllUsers
