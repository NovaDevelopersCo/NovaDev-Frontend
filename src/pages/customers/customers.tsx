import { Button, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, useContext, useEffect, useState } from 'react'
import * as clientAPI from '../../utils/api/customers-api'
import { Link, useHistory, NavLink } from 'react-router-dom'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { TClient } from '../../utils/typesFromBackend'
import clsx from 'clsx'

interface IClient {
  token: string
  pathRest: string
  t: (arg0: string) => string
  dark: boolean
  style: object
}

const Customers: FC<IClient> = ({ token, pathRest, t, dark, style }) => {
  const { openNotification } = useContext(NotificationContext)
  const [data, setData] = useState<TClient[]>([])
  const history = useHistory()

  useEffect(() => {
    clientAPI
      .getAllClients(token)
      .then((res: TClient[]) => setData(res))
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }, [token, openNotification])

  const handleDelete = (id: string): void => {
    clientAPI
      .deleteClient(token, id)
      .then(() =>
        setData((prev: TClient[]) => prev.filter((client) => client.id !== id))
      )
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }
  const theme = clsx(dark ? 'black' : 'white')
  const columns: ColumnsType<TClient> = [
    {
      title: `${t('name-client')}`,
      dataIndex: 'name',
      key: 'name-client',
      render: (name: string, client: TClient): JSX.Element => (
        <Link to={`/${pathRest}/client/${client.id}`}>{name}</Link>
      ),
      sorter: (a: TClient, b: TClient): number => a.name.localeCompare(b.name)
    },
    {
      title: `${t('phone')}`,
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a: TClient, b: TClient): number => a.email.localeCompare(b.email)
    },
    {
      title: `${t('email')}`,
      dataIndex: 'tg',
      key: 'email',
      sorter: (a: TClient, b: TClient): number => a.email.localeCompare(b.email)
    },
    {
      title: `${t('team')}`,
      dataIndex: 'team',
      key: 'team',
      sorter: (a: TClient, b: TClient): number => a.tg.localeCompare(b.tg)
    },
    {
      title: `${t('status')}`,
      dataIndex: 'status',
      key: 'status',
      sorter: (a: TClient, b: TClient): number => a.email.localeCompare(b.email)
    },
    {
      title: `${t('actions')}`,
      key: 'actions',
      render: (_: any, client: TClient): JSX.Element => (
        <>
          <Button
            type='primary'
            onClick={() =>
              history.push(`/${pathRest}/client/update/${client.id}`)
            }
          >
            {t('update')}
          </Button>
          <Button danger onClick={() => handleDelete(client.id)}>
            {t('delete')}
          </Button>
        </>
      )
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        className={theme}
        style={{
          display: 'flex',
          marginBottom: '1rem',
          alignItems: 'center',
          outline: 'none',
          padding: '0'
        }}
      >
        <div
          className={theme}
          style={{ display: 'block', marginRight: 'auto' }}
        >
          <h2 style={{ fontWeight: 600, marginBottom: '0' }}>
            {t('customers')}
          </h2>
          <p style={{ marginBottom: '0' }}>{t('your-list-customers')}</p>
        </div>
        <NavLink
          className={theme}
          to={`/${pathRest}/add/customer`}
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

export default Customers
