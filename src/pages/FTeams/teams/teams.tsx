import { Table, Image } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { FC, useContext, useEffect } from 'react'
import { ECountry, TTeams } from '../../../utils/typesFromBackend'
import * as teamAPI from '../../../utils/api/teams-api'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NotificationContext } from '../../../components/notification-provider/notification-provider'
import clsx from 'clsx'

interface ITeams {
  token: string
  pathRest: string
  t: (arg0: string) => string
  language: ECountry
  dark: boolean
}

const Teams: FC<ITeams> = ({ token, pathRest, t, dark }) => {
  const { openNotification } = useContext(NotificationContext)

  const [data, setData] = React.useState<TTeams[]>([])
  const location = useLocation()
  useEffect(() => {
    teamAPI
      .getAllTeams(token)
      .then((res: TTeams[]) => setData(res))
      .catch((e: Error) => openNotification(e.message, 'topRight'))
      const currentPath = location.pathname
      window.localStorage.setItem('initialRoute', currentPath)
  }, [token, openNotification])

  const columns: ColumnsType<TTeams> = [
    {
      title: `${t('name')}`,
      dataIndex: 'title',
      key: 'title',
      render: (title: string, team: TTeams) => (
        <Link to={`/${pathRest}/team/:${team.id}`}>{title}</Link>
      ),
      sorter: (a, b) => {
        if (a.title !== undefined && b.title !== undefined) {
          try {
            return a.title.localeCompare(b.title)
          } catch (error: any) {
            openNotification(error, 'topRight')
          }
        }
        return 0
      }
    },
    {
      title: `${t('description')}`,
      dataIndex: 'description',
      key: 'description',
      render: (title: string, team: TTeams) => (
        <Link to={`/${pathRest}/team/:${team.id}`}>{title}</Link>
      )
    },
    {
      title: `${t('image')}`,
      dataIndex: 'image',
      key: 'image',
      render: (image: string, team: TTeams) => (
        <Image alt='Team image' src={image} />
      )
    },
    {
      title: `${t('users')}`,
      dataIndex: 'users',
      key: 'users',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      render: (full_name: string, team: TTeams) => {
        return (
          <div>
            {team.users.map((user) => {
              return <p key={user.id}>{user.info.full_name}</p>
            })}
          </div>
        )
      }
    }
  ]
  const theme = clsx(dark ? 'black' : 'white')
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
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
            {t('teams')}
          </h2>
          <p style={{ marginBottom: '0' }}>{t('your-list-teams')}</p>
        </div>
        <NavLink
          to={`/${pathRest}/add/role`}
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
      <Table columns={columns} dataSource={data.map((team) => ({ ...team, key: team.id }))} className={theme} />
    </div>
  )
}
export default Teams
