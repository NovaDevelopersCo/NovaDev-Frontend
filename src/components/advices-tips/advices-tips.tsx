import { Button } from 'antd'
import { Button, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { FC, useContext } from 'react'
import { FC, useContext, useEffect, useState } from 'react'
import * as customerAPI from '../../utils/api/customers-api'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { Link, useHistory, NavLink } from 'react-router-dom'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { TCustomer } from '../../utils/typesFromBackend'

interface ICustomers {
  token: string
  pathRest: string
  t: (arg0: string) => string
  role: string
}
const AdvicesTips: FC<ICustomers> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [data, setData] = React.useState<TCustomer[]>([])
  const location = useLocation()
  const [data, setData] = useState<TCustomer[]>([])
  const history = useHistory()

  React.useEffect(() => {
  useEffect(() => {
    customerAPI
      .getAllCustomers(token)
      .then((res) => setData(res))
      .catch((e) => openNotification(e, 'topRight'))
  }, [token])

  const handleDelete = (id: string): void => {
    customerAPI
      .deleteCustomer(token, id)
      .then(() =>
        setData((prev) => prev.filter((customer) => customer.id !== id))
        setData((prev: TCustomer[]) =>
          prev.filter((customer) => customer.id !== id)
        )
      )
      .catch((e) => openNotification(e, 'topRight'))
      .catch((e: Error) => openNotification(e.message, 'topRight'))
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
      render: (name: string, customer: TCustomer): JSX.Element => (
        <Link to={`/${pathRest}/customer/${customer.id}`}>{name}</Link>
      ),
      sorter: (a: TCustomer, b: TCustomer): number =>
        a.name.localeCompare(b.name)
    },
    {
      title: `${t('email')}`,
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email)
      sorter: (a: TCustomer, b: TCustomer): number =>
        a.email.localeCompare(b.email)
    },
    {
      title: `${t('tg')}`,
      dataIndex: 'tg',
      key: 'tg',
      sorter: (a, b) => a.tg.localeCompare(b.tg)
      sorter: (a: TCustomer, b: TCustomer): number => a.tg.localeCompare(b.tg)
    },
    {
      title: `${t('actions')}`,
      key: 'actions',
      render: (_, customer) => (
      render: (_: any, customer: TCustomer): JSX.Element => (
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

  return <></>
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
export default AdvicesTips