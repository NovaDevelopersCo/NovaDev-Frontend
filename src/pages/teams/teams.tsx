import { Button, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, useContext, useEffect, useState } from 'react'
import * as clientAPI from '../../utils/api/customers-api'
import { Link, useHistory, NavLink } from 'react-router-dom'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { TClient } from '../../utils/typesFromBackend'

interface IClient {
  token: string
  pathRest: string
  t: (arg0: string) => string
}

const Clients: FC<IClient> = ({ token, pathRest, t }) => {
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
        setData((prev: TClient[]) =>
          prev.filter((client) => client.id !== id)
        )
      )
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }

  const columns: ColumnsType<TClient> = [
    {
      title: `${t('name')}`,
      dataIndex: 'name',
      key: 'name',
      render: (name: string, client: TClient): JSX.Element => (
        <Link to={`/${pathRest}/customer/${client.id}`}>{name}</Link>
      ),
      sorter: (a: TClient, b: TClient): number =>
        a.name.localeCompare(b.name)
    },
    {
      title: `${t('email')}`,
      dataIndex: 'email',
      key: 'email',
      sorter: (a: TClient, b: TClient): number =>
        a.email.localeCompare(b.email)
    },
    {
      title: `${t('tg')}`,
      dataIndex: 'tg',
      key: 'tg',
      sorter: (a: TClient, b: TClient): number => a.tg.localeCompare(b.tg)
    },
    {
      title: `${t('actions')}`,
      key: 'actions',
      render: (_: any, client: TClient): JSX.Element => (
        <>
          <Button
            type='primary'
            onClick={() =>
              history.push(`/${pathRest}/customer/update/${client.id}`)
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
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default Clients
