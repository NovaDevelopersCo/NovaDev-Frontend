import { Button, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, useContext, useEffect, useState } from 'react'
import * as projectAPI from '../../utils/api/project-api'
import { Link, useHistory, NavLink } from 'react-router-dom'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { TProjects } from '../../utils/typesFromBackend'

interface IProjects {
  token: string
  pathRest: string
  t: (arg0: string) => string
  dark: boolean
  style: object
}

const Projects: FC<IProjects> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [data, setData] = useState<TProjects[]>([])
  const history = useHistory()

  useEffect(() => {
    projectAPI
      .getAllProjects(token)
      .then((res: TProjects[]) => setData(res))
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }, [token, openNotification])

  const handleDelete = (id: string): void => {
    projectAPI
      .deleteProject(token, id)
      .then(() =>
        setData((prev: TProjects[]) =>
          prev.filter((project) => project.id !== id)
        )
      )
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }

  const columns: ColumnsType<TProjects> = [
    {
      title: `${t('name')}`,
      dataIndex: 'name',
      key: 'name',
      render: (name: string, project: TProjects): JSX.Element => (
        <Link to={`/${pathRest}/project/${project.id}`}>{name}</Link>
      ),
      sorter: (a: TProjects, b: TProjects): number =>
        a.name.localeCompare(b.name)
    },
    {
      title: `${t('description-project')}`,
      dataIndex: 'description',
      key: 'description',
      sorter: (a: TProjects, b: TProjects): number =>
        a.text.localeCompare(b.text)
    },
    {
      title: `${t('date-start')}`,
      dataIndex: 'date-start',
      key: 'date-start',
      sorter: (a: TProjects, b: TProjects): number =>
        a.date.localeCompare(b.date)
    },
    {
      title: `${t('date-end')}`,
      dataIndex: 'date-end',
      key: 'date-end',
      sorter: (a: TProjects, b: TProjects): number =>
        a.date.localeCompare(b.date)
    },
    {
      title: `${t('executors')}`,
      dataIndex: 'executors',
      key: 'executors',
      sorter: (a: TProjects, b: TProjects): number =>
        a.executor.localeCompare(b.executor)
    },
    {
      title: `${t('status')}`,
      dataIndex: 'status',
      key: 'status',
      sorter: (a: TProjects, b: TProjects): number =>
        a.status.localeCompare(b.status)
    },
    {
      title: `${t('progress')}`,
      dataIndex: 'progress',
      key: 'progress',
      sorter: (a: TProjects, b: TProjects): number =>
        a.progress.localeCompare(b.progress)
    },
    {
      title: `${t('actions')}`,
      key: 'actions',
      render: (_: any, project: TProjects): JSX.Element => (
        <>
          <Button
            type='primary'
            onClick={() =>
              history.push(`/${pathRest}/project/update/${project.id}`)
            }
          >
            {t('update')}
          </Button>
          <Button danger onClick={() => handleDelete(project.id)}>
            {t('delete')}
          </Button>
        </>
      )
    }
  ]

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
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default Projects
