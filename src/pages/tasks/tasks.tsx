import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { FC, useContext } from 'react'
import { ECountry, TTask } from '../../utils/typesFromBackend'
import * as taskAPI from '../../utils/api/task-api'
import { Link, useLocation } from 'react-router-dom'
import imageNoPhoto from '../../assets/images/no_photo.png'
import { BASE_URL } from '../../utils/const'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IMenu {
  token: string
  pathRest: string
  t: (arg0: string) => string
  language: ECountry
}

const Tasks: FC<IMenu> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [data, setData] = React.useState<TTask[]>([])
  const location = useLocation()
  React.useEffect(() => {
    taskAPI
      .getTasks(token, +JSON.parse(atob(token.split('.')[1])).id)
      .then((res) => {
        setData(res)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])

  const columns: ColumnsType<TTask> = [
    {
      title: `${t('image')}`,
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <img
          src={`${BASE_URL}/${image}`}
          style={{ width: '100px', height: '100px', objectFit: 'contain' }}
          onError={(e) => {
            e.currentTarget.src = imageNoPhoto
          }}
        />
      )
    },
    {
      title: `${t('name')}`,
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => {
        if (a.title !== undefined && b.title !== undefined) {
          return a.title.localeCompare(b.title)
        }
        return 0
      }
    },
    {
      title: `${t('description')}`,
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <Link to={`/${pathRest}/category/:${description}`}>{description}</Link>
      ),
      sorter: (a, b) => {
        if (a.description !== undefined && b.description !== undefined) {
          return a.description.localeCompare(b.description)
        }
        return 0
      }
    },
    {
      title: `${t('price')}`,
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => <p>{progress}</p>,
      sorter: (a, b) => {
        if (a.progress !== undefined && b.progress !== undefined) {
          return a.progress.localeCompare(b.progress)
        }
        return 0
      }
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
        <div style={{ display: 'block', marginRight: 'auto' }}></div>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}
export default Tasks
