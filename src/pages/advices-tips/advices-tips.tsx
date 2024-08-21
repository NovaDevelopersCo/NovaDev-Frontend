import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, useContext, useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { TAdvice } from '../../utils/typesFromBackend'
import clsx from 'clsx'

interface ICustomers {
  token: string
  pathRest: string
  t: (arg0: string) => string
  dark: boolean
  style: object
}

const AdvicesTips: FC<ICustomers> = ({ token, pathRest, t, dark, style }) => {
  const { openNotification } = useContext(NotificationContext)
  const [data, setData] = useState<TAdvice[]>([])
  const theme = clsx(dark ? 'black' : 'white')
  useEffect(() => {
    fetch(`${pathRest}/customers`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const res: TAdvice[] = await response.json()
        return res
      })
      .then((res) => setData(res))
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }, [pathRest, token, openNotification])

  const columns: ColumnsType<TAdvice> = [
    {
      title: t('name-of-post'),
      dataIndex: 'name-of-post',
      key: 'name-of-post',
      render: (title: string, advice: TAdvice): JSX.Element => (
        <Link to={`/${pathRest}/advice/${advice.id}`}>{title}</Link>
      ),
      sorter: (a: TAdvice, b: TAdvice): number => a.title.localeCompare(b.title)
    },
    {
      title: t('content'),
      dataIndex: 'content',
      key: 'content',
      sorter: (a: TAdvice, b: TAdvice): number =>
        a.content.localeCompare(b.content)
    },
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category',
      sorter: (a: TAdvice, b: TAdvice): number =>
        a.category.localeCompare(b.category)
    },
    {
      title: t('image'),
      dataIndex: 'image',
      key: 'image',
      sorter: (a: TAdvice, b: TAdvice): number => a.image.localeCompare(b.image)
    },
    {
      title: t('date-of-post'),
      dataIndex: 'date-of-post',
      key: 'date-of-post',
      sorter: (a: TAdvice, b: TAdvice): number => a.date.localeCompare(b.date)
    }
  ]

  return (
    <>
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
              {t('advices-tips')}
            </h2>
            <p style={{ marginBottom: '0' }}>
              {t('your-list-advices-and-tips')}
            </p>
          </div>
          <NavLink
            to={`/${pathRest}/add/advice`}
            className={theme}
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
        <Table
          className={theme}
          columns={columns}
          dataSource={data}
          rowKey='id'
        />
      </div>
    </>
  )
}

export default AdvicesTips
