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
      title: `${t('name')}`,
      dataIndex: 'name',
      key: 'name',
      render: (name, project) => (
        <Link to={`/${pathRest}/project/${project.id}`}>{name}</Link>
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
      title: `${t('project-description')}`,
      dataIndex: 'description',
      key: 'description',
      sorter: (a: TProject, b: TProject): number =>
        a.description.localeCompare(b.description)
    },
    {
      title: `${t('date-start')}`,
      dataIndex: 'dateStart',
      key: 'date-start',
      sorter: (a: TProject, b: TProject): number => a.date.localeCompare(b.date)
    },
    {
      title: `${t('date-end')}`,
      dataIndex: 'dateEnd',
      key: 'date-end',
      sorter: (a: TProject, b: TProject): number => a.date.localeCompare(b.date)
    },
    {
      title: `${t('team-executor')}`,
      dataIndex: 'team-executor',
      key: 'team-executor',
      sorter: (a: TProject, b: TProject): number =>
        a.teamExecutor.localeCompare(b.teamExecutor)
    },
    {
      title: `${t('status')}`,
      dataIndex: 'status',
      key: 'status',
      sorter: (a: TProject, b: TProject): number =>
        a.status.localeCompare(b.status)
    },
    {
      title: `${t('progress')}`,
      dataIndex: 'progress',
      key: 'progress',
      sorter: (a: TProject, b: TProject): number =>
        a.progress.localeCompare(b.progress)
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
