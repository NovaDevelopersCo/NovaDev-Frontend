import { Button, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, useContext, useEffect, useState } from 'react'
import * as customerAPI from '../../utils/api/customers-api'
import { Link, useHistory, NavLink } from 'react-router-dom'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { TCustomer } from '../../utils/typesFromBackend'
import clsx from 'clsx'

interface ICustomers {
  token: string
  pathRest: string
  t: (arg0: string) => string
  dark: boolean
  style: object
}

const Customers: FC<ICustomers> = ({ token, pathRest, t, dark, style }) => {
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
  const theme = clsx(dark ? 'black' : 'white')
  const columns: ColumnsType<TCustomer> = [
    {
      title: `${t('name-client')}`,
      dataIndex: 'name-client',
      key: 'name-client',
      render: (name: string, customer: TCustomer): JSX.Element => (
        <Link to={`/${pathRest}/customer/${customer.id}`}>{name}</Link>
      ),
      sorter: (a: TCustomer, b: TCustomer): number =>
        a.name.localeCompare(b.name)
    },
    {
      title: `${t('phone')}`,
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a: TCustomer, b: TCustomer): number =>
        a.phone.localeCompare(b.phone)
    },
    {
      title: `${t('email')}`,
      dataIndex: 'email',
      key: 'email',
      sorter: (a: TCustomer, b: TCustomer): number =>
        a.email.localeCompare(b.email)
    },
    {
      title: `${t('team')}`,
      dataIndex: 'team',
      key: 'team',
      sorter: (a: TCustomer, b: TCustomer): number =>
        a.team.localeCompare(b.team)
    },
    {
      title: `${t('status')}`,
      dataIndex: 'status',
      key: 'status',
      sorter: (a: TCustomer, b: TCustomer): number =>
        a.status.localeCompare(b.status)
    },
    {
      title: `${t('actions')}`,
      key: 'actions',
      render: (_: any, customer: TCustomer): JSX.Element => (
        <>
          <Button
            type='primary'
            onClick={() =>
              history.push(`/${pathRest}/customer/update/${customer.id}`)
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
