import { Button, Table, Image } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, useContext, useEffect, useState } from 'react'
import * as teamsAPI from '../../utils/api/teams-api'
import { Link } from 'react-router-dom'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { TTeams } from '../../utils/typesFromBackend'
import UpdateTeamModal from '../../components/update-team-modal/update-team-modal'
import DeleteTeamModal from '../../components/delete-team-modal/delete-team-modal'

interface ITeams {
  token: string
  pathRest: string
  t: (arg0: string) => string
}

const Teams: FC<ITeams> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [teams, setTeams] = useState<TTeams[]>([])
  const [updatingTeamId, setUpdatingTeamId] = useState<null | number>(null)
  const [deletingTeamId, setDeletingTeamId] = useState<null | number>(null)
  // const history = useHistory()

  useEffect(() => {
    teamsAPI
      .getAllTeams(token)
      .then((res: TTeams[]) => setTeams(res))
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }, [token, openNotification])

  // const handleDelete = (id: number): void => {
  //   teamsAPI
  //     .deleteTeam(token, id)
  //     .then(() =>
  //       setTeams((prev: TTeams[]) =>
  //         prev.filter((team) => team.id !== id)
  //       )
  //     )
  //     .catch((e: Error) => openNotification(e.message, 'topRight'))
  // }

  // const closeModalUpdate = (): void => {
  //   setUpdatingTeamId(null)
  // }

  const closeModalUpdate = (): void => {
    setUpdatingTeamId(null)
  }

  const closeModalDelete = (): void => {
    setDeletingTeamId(null)
  }

  const columns: ColumnsType<TTeams> = [
    {
      title: `${t('id')}`,
      dataIndex: 'id',
      key: 'id',
      render: (id: number, team: TTeams): JSX.Element => (
        <Link to={`/${pathRest}/customer/${team.id}`}>{id}</Link>
      )
      // sorter: (a: TCustomer, b: TCustomer): number =>
      //   a.name.localeCompare(b.name)
    },
    {
      title: `${t('title')}`,
      dataIndex: 'title',
      key: 'title'
      // sorter: (a: TCustomer, b: TCustomer): number =>
      //   a.email.localeCompare(b.email)
    },
    {
      title: `${t('description')}`,
      dataIndex: 'description',
      key: 'description'
      // sorter: (a: TCustomer, b: TCustomer): number => a.tg.localeCompare(b.tg)
    },
    {
      title: `${t('image')}`,
      dataIndex: 'image',
      key: 'image',
      render: (image: string, team: TTeams): JSX.Element => {
        return <Image alt='Team image' src={team.image} />
      }
      // sorter: (a: TCustomer, b: TCustomer): number => a.tg.localeCompare(b.tg)
    },
    {
      title: `${t('users-list')}`,
      dataIndex: 'users-list',
      key: 'users-list',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      render: (full_name, team: TTeams): JSX.Element => {
        return (
          <div>
            {team.users.map((user) => {
              return <p key={user.id}>{user.info.full_name}</p>
            })}
          </div>
        )
      }
      // sorter: (a: TCustomer, b: TCustomer): number => a.tg.localeCompare(b.tg)
    },
    {
      title: `${t('actions')}`,
      key: 'actions',
      render: (_: any, team: TTeams): JSX.Element => (
        <div className='flex flex-col gap-1 justify-center'>
          <Button
            type='primary'
            onClick={() =>
              setUpdatingTeamId(team.id)
            }
          >
            {t('update')}
          </Button>
          <Button danger onClick={() => setDeletingTeamId(team.id)}>
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
              {t('customers')}
            </h2>
            <p style={{ marginBottom: '0' }}>{t('your-list-customers')}</p>
          </div>
          <Button
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
        <Table columns={columns} dataSource={teams.map((team) => ({ ...team, key: team.id }))} />
      </div>
      <UpdateTeamModal onCancel={closeModalUpdate} token={token} teamId={updatingTeamId} />
      <DeleteTeamModal onCancel={closeModalDelete} token={token} teamId={deletingTeamId} />
    </>
  )
}

export default Teams
