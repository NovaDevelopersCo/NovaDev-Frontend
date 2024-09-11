import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, useContext, useEffect, useState } from 'react'
import * as projectAPI from '../../../utils/api/project-api'
import { Link, NavLink } from 'react-router-dom'
import { NotificationContext } from '../../../components/notification-provider/notification-provider'
import { TProject } from '../../../utils/typesFromBackend'
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
      render: (title, project) => (
        <Link to={`/${pathRest}/project/${project.id}`}>{title}</Link>
      ),
      sorter: (a, b) => {
        if (a.title !== undefined && b.title !== undefined) {
          try {
            return a.title.localeCompare(b.title)
          } catch (error: any) {
            openNotification(error.message, 'topRight')
          }
        }
        return 0
      }
    },
    {
      title: `${t('technologies')}`,
      dataIndex: 'technologies',
      key: 'technologies',
      render: (technologies: string[]) => technologies.join(', '),
      sorter: (a: TProject, b: TProject): number =>
        a.technologies.localeCompare(b.technologies)
    },
    {
      title: `${t('server')}`,
      dataIndex: 'server',
      key: 'server',
      render: (server) => (
        <a href={server} target='_blank' rel='noopener noreferrer'>
          {server}
        </a>
      ),
      sorter: (a: TProject, b: TProject): number =>
        a.server.localeCompare(b.server)
    },
    {
      title: `${t('documentation')}`,
      dataIndex: 'documentation',
      key: 'documentation',
      render: (documentation) => (
        <a href={documentation} target='_blank' rel='noopener noreferrer'>
          {documentation}
        </a>
      ),
      sorter: (a: TProject, b: TProject): number =>
        a.documentation.localeCompare(b.documentation)
    },
    {
      title: `${t('deadline')}`,
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline) => {
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
      sorter: (a: TProject, b: TProject): number =>
        a.deadline.localeCompare(b.deadline)
    },
    {
      title: `${t('client')}`,
      dataIndex: 'client',
      key: 'client',
      sorter: (a: TProject, b: TProject): number =>
        a.client.localeCompare(b.client)
    },
    {
      title: `${t('users')}`,
      dataIndex: 'executors',
      key: 'users',
      sorter: (a: TProject, b: TProject): number =>
        a.users.localeCompare(b.users)
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
          <p style={{ marginBottom: '0' }}>{t('your-list-projects')}</p>
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
