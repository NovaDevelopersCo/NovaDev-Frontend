import { Button, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, useContext, useEffect, useState } from 'react'
import * as customerAPI from '../../utils/api/clients-api'
import { Link, useHistory, NavLink } from 'react-router-dom'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { TCustomer } from '../../utils/typesFromBackend'

interface ICustomers {
  token: string
  pathRest: string
  t: (arg0: string) => string
}

const Customers: FC<ICustomers> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [data, setData] = useState<TCustomer[]>([])
  const history = useHistory()

  useEffect(() => {
    customerAPI
      .getAllCustomers(token)
      .then((res: TCustomer[]) => setData(res))
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }, [token, openNotification])

  const handleDelete = (id: string): void => {
    customerAPI
      .deleteCustomer(token, id)
      .then(() =>
        setData((prev: TCustomer[]) =>
          prev.filter((customer) => customer.id !== id)
        )
      )
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }

  const columns: ColumnsType<TCustomer> = [
    {
      title: `${t('name')}`,
      dataIndex: 'name',
      key: 'name',
      render: (name: string, customer: TCustomer): JSX.Element => (
        <Link to={`/${pathRest}/clients/${customer.id}`}>{name}</Link>
      ),
      sorter: (a: TCustomer, b: TCustomer): number =>
        a.name.localeCompare(b.name)
    },
    {
      title: `${t('tg')}`,
      dataIndex: 'tg',
      key: 'tg',
      sorter: (a: TCustomer, b: TCustomer): number => a.tg.localeCompare(b.tg)
    },
    {
      title: `${t('actions')}`,
      key: 'actions',
      render: (_: any, customer: TCustomer): JSX.Element => (
        <>
          <Button
            type='primary'
            onClick={() =>
              history.push(`/${pathRest}/clients/update/${customer.id}`)
            }
          >
            {t('update')}
          </Button>
          <Button danger onClick={() => handleDelete(customer.id)}>
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
          <h2 style={{ fontWeight: 600, marginBottom: '0' }}>{t('clients')}</h2>
          <p style={{ marginBottom: '0' }}>{t('your-list-clients')}</p>
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

export default Customers
