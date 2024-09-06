import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, useContext, useEffect, useState } from 'react'
import * as teamAPI from '../../../utils/api/team-api'
import { Link, NavLink } from 'react-router-dom'
import { NotificationContext } from '../../../components/notification-provider/notification-provider'
import { TTeams } from '../../../utils/typesFromBackend'
import clsx from 'clsx'

interface ITeams {
  token: string
  pathRest: string
  t: (arg0: string) => string
  dark: boolean
  style: object
}

const Teams: FC<ITeams> = ({ token, pathRest, t, dark }) => {
  const { openNotification } = useContext(NotificationContext)
  const [data, setData] = useState<TTeams[]>([])
  useEffect(() => {
    teamAPI
      .getAllTeams(token)
      .then((res: TTeams[]) => setData(res))
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }, [token, openNotification])

  const columns: ColumnsType<TTeams> = [
    {
      title: `${t('name')}`,
      dataIndex: 'name',
      key: 'name',
      render: (name, team) => (
        <Link to={`/${pathRest}/team/${team.id}`}>{name}</Link>
      ),
      sorter: (a, b) => {
        if (a.name !== undefined && b.name !== undefined) {
          try {
            return a.name.localeCompare(b.name)
          } catch (error: any) {
            openNotification(error.message, 'topRight')
          }
        }
        return 0
      }
    },
    {
      title: `${t('description')}`,
      dataIndex: 'description',
      key: 'description',
      sorter: (a: TTeams, b: TTeams): number => a.text.localeCompare(b.text)
    },
    {
      title: `${t('number-user')}`,
      dataIndex: 'number-user',
      key: 'number-user',
      sorter: (a: TTeams, b: TTeams): number => a.amount.localeCompare(b.amount)
    },
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category',
      sorter: (a: TTeams, b: TTeams): number =>
        a.category.localeCompare(b.category)
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
          <h2 style={{ fontWeight: 600, marginBottom: '0' }}>{t('teams')}</h2>
          <p style={{ marginBottom: '0' }}>{t('your-list-teams')}</p>
        </div>
        <NavLink
          to={`/${pathRest}/add/team`}
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
      <Table columns={columns} dataSource={data} className={theme} />
    </div>
  )
}

export default Teams
