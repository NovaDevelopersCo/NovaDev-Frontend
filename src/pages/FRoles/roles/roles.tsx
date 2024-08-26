import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { FC, useContext } from 'react'
import { ECountry, TRole } from '../../../utils/typesFromBackend'
import * as roleAPI from '../../../utils/api/role-api'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NotificationContext } from '../../../components/notification-provider/notification-provider'
import clsx from 'clsx'

interface ILevelAccess {
  text: string
  value: string
}

interface IRoles {
  token: string
  pathRest: string
  t: (arg0: string) => string
  language: ECountry
  dark: boolean
}

const Roles: FC<IRoles> = ({ token, pathRest, t, dark }) => {
  const { openNotification } = useContext(NotificationContext)

  const [data, setData] = React.useState<TRole[]>([])
  const [levelAccess, setLevelAccess] = React.useState<ILevelAccess[]>([])
  const location = useLocation()
  React.useEffect(() => {
    roleAPI
      .getRoles(token)
      .then((res) => {
        setData(res)
        const levelsAccessNames: { [key: string]: boolean } = {}
        const resultArrayLevels: ILevelAccess[] = []
        res.forEach((role: TRole) => {
          if (!levelsAccessNames[role.level_access]) {
            levelsAccessNames[role.level_access] = true
          }
        })
        for (const key of Object.keys(levelsAccessNames)) {
          resultArrayLevels.push({ text: key, value: key })
        }
        setLevelAccess(resultArrayLevels)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [])
  const columns: ColumnsType<TRole> = [
    {
      title: `${t('name')}`,
      dataIndex: 'title',
      key: 'title',
      render: (title, role) => (
        <Link to={`/${pathRest}/role/:${role.id}`}>{title}</Link>
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
      render: (title, role) => (
        <Link to={`/${pathRest}/role/:${role.id}`}>{title}</Link>
      )
    },
    {
      title: `${t('level_access')}`,
      dataIndex: 'level_access',
      key: 'level_access',
      render: (title, role) => (
        <Link to={`/${pathRest}/role/:${role.id}`}>{title}</Link>
      ),
      sorter: (a, b) => a.level_access - b.level_access,
      filters: [...levelAccess],
      onFilter: (value: string | number | boolean, record) =>
        // eslint-disable-next-line eqeqeq
        record.level_access == value
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
            {t('categories')}
          </h2>
          <p style={{ marginBottom: '0' }}>{t('your-list-categories')}</p>
        </div>
        <NavLink
          to={`/${pathRest}/add/category`}
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
export default Roles
