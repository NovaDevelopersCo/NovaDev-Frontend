import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import * as projectAPI from '../../../utils/api/project-api'
import { FC, useContext, useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { NotificationContext } from '../../../components/notification-provider/notification-provider'
import { TProject, TProjectUser } from '../../../utils/typesFromBackend' // Используем ваши типы
import clsx from 'clsx'

interface IProjects {
  token: string
  pathRest: string
  t: (arg0: string) => string
  dark: boolean
  style: object
}

const Projects: FC<IProjects> = ({ token, pathRest, t, dark }) => {
  const { openNotification } = useContext(NotificationContext)
  const [data, setData] = useState<TProject[]>([])

  useEffect(() => {
    projectAPI
      .getAllProjects(token)
      .then((res: TProject[]) => setData(res))
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }, [token, openNotification])

  const columns: ColumnsType<TProject> = [
    {
      title: `${t('title')}`,
      dataIndex: 'title',
      key: 'title',
      render: (title: string, project: TProject) => (
        <Link to={`/${pathRest}/project/${project.id}`}>{title}</Link>
      ),
      sorter: (a: TProject, b: TProject) => {
        try {
          return (a.title ?? '').localeCompare(b.title ?? '')
        } catch (error: any) {
          openNotification(error.message, 'topRight')
          return 0
        }
      }
    },
    {
      title: `${t('technologies')}`,
      dataIndex: 'technologies',
      key: 'technologies',
      render: (technologies: string[]) => technologies.join(', '),
      sorter: (a: TProject, b: TProject) => {
        const techA = a.technologies.join(', ')
        const techB = b.technologies.join(', ')
        return techA.localeCompare(techB)
      }
    },
    {
      title: `${t('server')}`,
      dataIndex: 'server',
      key: 'server',
      render: (server: string) => (
        <Link href={server} target='_blank' rel='noopener noreferrer' to={''}>
          {server}
        </Link>
      )
    },
    {
      title: `${t('documentation')}`,
      dataIndex: 'documentation',
      key: 'documentation',
      render: (documentation: string) => (
        <Link
          href={documentation}
          target='_blank'
          rel='noopener noreferrer'
          to={''}
        >
          {documentation}
        </Link>
      )
    },
    {
      title: `${t('deadline')}`,
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline: string) => {
        const deadlineDate = new Date(deadline)
        const currentDate = new Date()
        const formattedDate = deadlineDate.toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })

        return (
          <span>
            {formattedDate}{' '}
            {deadlineDate < currentDate && (
              <span style={{ color: 'red' }}>({t('expired')})</span>
            )}
          </span>
        )
      },
      sorter: (a: TProject, b: TProject) => {
        const dateA = new Date(a.deadline).getTime()
        const dateB = new Date(b.deadline).getTime()
        return dateA - dateB
      }
    },
    {
      title: `${t('client')}`,
      dataIndex: 'clientId',
      key: 'clientId',
      render: (clientId: number | string) => clientId,
      sorter: (a: TProject, b: TProject) => {
        const idA = a.clientId ?? ''
        const idB = b.clientId ?? ''
        if (typeof idA === 'number' && typeof idB === 'number') {
          return idA - idB
        } else {
          return (idA.toString() ?? '').localeCompare(idB.toString() ?? '')
        }
      }
    },
    {
      title: `${t('users')}`,
      dataIndex: 'users',
      key: 'users',
      render: (users: TProjectUser[]) => {
        if (users.length === 0) return 'No users'
        const userNames = users
          .map((user) => user.user.info.full_name)
          .join(', ')
        return userNames
      },
      sorter: (a: TProject, b: TProject) => {
        const aUser = a.users.length > 0 ? a.users[0].user.info.full_name : ''
        const bUser = b.users.length > 0 ? b.users[0].user.info.full_name : ''
        return aUser.localeCompare(bUser)
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
            {t('projects')}
          </h2>
          <p style={{ marginBottom: '0' }}>{t('full-list-projects')}</p>
        </div>
        <NavLink
          to={`/${pathRest}/add/project`}
          style={{
            color: '#fff',
            backgroundColor: '#2bc155',
            borderColor: '#2bc155',
            width: '145px',
            height: '61px',
            borderRadius: '0.375rem',
            fontWeight: 500,
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

export default Projects
