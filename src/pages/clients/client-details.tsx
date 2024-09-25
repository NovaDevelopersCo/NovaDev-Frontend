/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { Button, Card, Result, Spin, Typography, Row, Col, Space } from 'antd'
import { FC, useEffect, useState, useContext } from 'react'
import { useLocation, useRouteMatch, useHistory } from 'react-router-dom'
import * as customerAPI from '../../utils/api/clients-api'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import clsx from 'clsx'
const { Title, Text } = Typography

interface ICustomer {
  name: string
  phone: string
  tg: string
}

interface ICustomerDetailsProps {
  token: string
  pathRest: string
  t: (arg0: string) => string
  dark: boolean
  style: object
}

const CustomerDetails: FC<ICustomerDetailsProps> = ({
  token,
  pathRest,
  t,
  dark,
  style
}) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const restId = Object.keys(match?.params as string)[0]
  const [customer, setCustomer] = useState<ICustomer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const history = useHistory()
  const theme = clsx(dark ? 'black' : 'white')

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await customerAPI.getCustomer(token, String(restId))
        setCustomer(data)
      } catch (error) {
        const errorMessage =
          (error as Error).message || 'Не удалось загрузить данные о клиенте'
        setError(errorMessage)
        openNotification(errorMessage, 'topRight')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [token, restId, openNotification])

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh'
        }}
      >
        <Spin size='large' />
      </div>
    )
  }

  if (error) {
    return <Result status='error' title='Ошибка' subTitle={error} />
  }

  if (!customer) {
    return <Result status='404' title='Клиент не найден' />
  }

  const handleBack = () => {
    history.goBack()
  }

  return (
    <Row className={theme} justify='center' style={{ padding: '40px 20px' }}>
      <Col>
        <Card
          title={
            <Title level={3} style={{ marginBottom: 0 }}>
              {customer.name}
            </Title>
          }
          hoverable
          bordered={false}
          style={{ width: 400, ...style }}
          headStyle={{ textAlign: 'center' }}
        >
          <Space direction='vertical' size='middle' style={{ width: '100%' }}>
            <Text strong>Phone:</Text>
            <Text>{customer.phone}</Text>

            <Text strong>Telegram:</Text>
            <a
              href={`https://t.me/${customer.tg.replace(/^@/, '')}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              {customer.tg}
            </a>
          </Space>
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Button type='primary' onClick={handleBack}>
              Назад
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  )
}

export default CustomerDetails
