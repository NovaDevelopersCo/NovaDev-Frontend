/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
import { Button, Table, Modal, Input } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, useContext, useEffect, useState } from 'react'
import * as customerAPI from '../../utils/api/clients-api'
import { Link, NavLink } from 'react-router-dom'
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
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [updatedCustomer, setUpdatedCustomer] = useState<TCustomer | null>(null)

  useEffect(() => {
    customerAPI
      .getAllCustomers(token)
      .then((res: TCustomer[]) => setData(res))
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }, [token, openNotification])

  const handleDelete = (id: string): void => {
    const confirmed = window.confirm('Вы точно хотите удалить этого клиента!?')
    if (!confirmed) {
      return
    }
    customerAPI
      .deleteCustomer(token, id)
      .then(() =>
        setData((prev: TCustomer[]) =>
          prev.filter((customer) => customer.id !== id)
        )
      )
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }

  const showUpdateModal = (customer: TCustomer) => {
    setUpdatedCustomer(customer)
    setIsModalVisible(true)
  }

  const handleUpdate = async () => {
    if (!updatedCustomer?.name || !updatedCustomer.phone) {
      openNotification(t('Поля не могут быть пустыми'), 'topRight')
      return
    }

    try {
      await customerAPI.updateCustomer(
        token,
        updatedCustomer,
        Number(updatedCustomer.id)
      )
      openNotification(t('Клиент успешно обновлён'), 'topRight')
      setIsModalVisible(false)

      const updatedData = await customerAPI.getAllCustomers(token)
      setData(updatedData)
    } catch (error: unknown) {
      if (error instanceof Error) {
        openNotification(
          error.message || t('Ошибка обновления клиента'),
          'topRight'
        )
      } else {
        openNotification(t('Неизвестная ошибка'), 'topRight')
      }
    }
  }

  const handleModalClose = () => {
    setIsModalVisible(false)
    setUpdatedCustomer(null)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof TCustomer
  ) => {
    if (updatedCustomer) {
      setUpdatedCustomer({ ...updatedCustomer, [field]: e.target.value })
    }
  }

  const theme = clsx(dark ? 'black' : 'white')
  const columns: ColumnsType<TCustomer> = [
    {
      title: `${t('name')}`,
      dataIndex: 'name',
      key: 'name',
      render: (name: string, customer: TCustomer): JSX.Element => (
        <Link to={`/${pathRest}/clients/:${customer.id}`}>{name}</Link>
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
      title: `${t('Telegram')}`,
      dataIndex: 'tg',
      key: 'tg',
      sorter: (a: TCustomer, b: TCustomer): number => a.tg.localeCompare(b.tg),
      render: (tg: string, customer: TCustomer): JSX.Element => (
        <a
          style={{
            color: '#00BFFF'
          }}
          href={`https://t.me/${customer.tg.replace('@', '')}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          {tg}
        </a>
      )
    },
    {
      title: `${t('actions')}`,
      key: 'actions',
      render: (_: any, customer: TCustomer): JSX.Element => (
        <>
          <Button type='primary' onClick={() => showUpdateModal(customer)}>
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
          <p style={{ marginBottom: '0' }}>{t('list-clients')}</p>
        </div>
        <NavLink
          to={`/${pathRest}/add/clients`}
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
      <Modal
        className={theme}
        title={t('update_clients')}
        visible={isModalVisible}
        onOk={() => handleUpdate()}
        onCancel={handleModalClose}
      >
        <Input
          placeholder={t('name')}
          value={updatedCustomer?.name ?? ''}
          onChange={(e) => handleInputChange(e, 'name')}
        />
        <Input
          placeholder={t('phone')}
          value={updatedCustomer?.phone ?? ''}
          onChange={(e) => handleInputChange(e, 'phone')}
          style={{ marginTop: '1rem' }}
        />
        <Input
          placeholder={t('tg')}
          value={updatedCustomer?.tg ?? ''}
          onChange={(e) => handleInputChange(e, 'tg')}
          style={{ marginTop: '1rem' }}
        />
      </Modal>
    </div>
  )
}

export default Customers
