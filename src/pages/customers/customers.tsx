import { Table, Button } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { FC, useContext } from 'react'
import * as customerAPI from '../../utils/api/customers-api'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { TCustomer } from '../../utils/typesFromBackend'

interface ICustomers {
  token: string
  pathRest: string
  t: (arg0: string) => string
  role: string
}

const Customers: FC<ICustomers> = ({ token, pathRest, t, role }) => {
  const { openNotification } = useContext(NotificationContext)
  const [data, setData] = React.useState<TCustomer[]>([])
  const location = useLocation()
  const history = useHistory()

  React.useEffect(() => {
    customerAPI
      .getAllCustomers(token)
      .then((res) => setData(res))
      .catch((e) => openNotification(e, 'topRight'))
  }, [token])

  const handleDelete = (id: string) => {
    if (role !== 'super_admin') {
      openNotification('Access Denied', 'topRight')
      return
    }

    customerAPI
      .deleteCustomer(token, id)
      .then(() =>
        setData((prev) => prev.filter((customer) => customer.id !== id))
      )
      .catch((e) => openNotification(e, 'topRight'))
  }

  const columns: ColumnsType<TCustomer> = [
    {
      title: `${t('name')}`,
      dataIndex: 'name',
      key: 'name',
      render: (name, customer) =>
        role === 'admin' || role === 'super_admin' ? (
          <Link to={`/${pathRest}/customer/${customer.id}`}>{name}</Link>
        ) : (
          name
        ),
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: `${t('email')}`,
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email)
    },
    {
      title: `${t('actions')}`,
      key: 'actions',
      render: (_, customer) => (
        <>
          {role === 'super_admin' && (
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
          )}
        </>
      )
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h2>{t('customers')}</h2>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default Customers
