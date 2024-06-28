/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button, Form, Input } from 'antd'
import { Dispatch, FC, SetStateAction, useContext, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import * as registrationApi from '../../utils/api/registration-api'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import * as validateTokenApi from '../../utils/api/validate-token-api'
import { useTelegram } from '../../services/hooks/use-telegram'

interface IAutorization {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
  setToken: (token: any) => void
  t: (arg0: string) => string
  dark: boolean
  style: React.CSSProperties
}

const Registration: FC<IAutorization> = ({ setIsLoggedIn, t, setToken, dark, style }) => {
  const storedInitialRoute = localStorage.getItem('initialRoute')
  const { openNotification } = useContext(NotificationContext)
  const history = useHistory()
  const { tg } = useTelegram()
  useEffect(() => {
    const tokenDetailsString = localStorage.getItem('token')
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (tokenDetailsString) {
      validateTokenApi
        .validateToken(tokenDetailsString)
        .then((res) => {
          if (res.message === 'valid') {
            setIsLoggedIn(true)
            if (storedInitialRoute) {
              if (storedInitialRoute === '/') {
                history.push('dishes')
              } else {
                history.push(storedInitialRoute)
                localStorage.removeItem('initialRoute')
              }
            } else {
              history.push('dishes')
            }
          } else {
            setIsLoggedIn(true)
            if (storedInitialRoute) {
              history.push(storedInitialRoute)
              localStorage.removeItem('initialRoute')
            } else {
              history.push('dishes')
            }
          }
        })
        .catch((e) => {
          openNotification(e, 'topRight')
        })
    }
  }, [])
  const onFinish = (values: any) => {
    registrationApi
      .registration(values)
      .then((res) => {
        localStorage.setItem('token', res.token)
        setToken(res.token)
        setIsLoggedIn(true)
        tg.sendData(
          JSON.stringify(Object.assign({ operation: 'autorization' }, values))
        )
        if (storedInitialRoute) {
          history.push(storedInitialRoute)
          localStorage.removeItem('initialRoute')
        } else {
          history.push('dishes')
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  const onFinishFailed = (errorInfo: any) => {
    openNotification(t('something-went-wrong'), 'topRight')
  }

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }

  return (
    <Form
      {...layout}
      name='basic'
      className='flex justify-center flex-col'
      style={{ maxWidth: 600, ...style }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete='off'
    >
      <Form.Item
        label={t('login')}
        name='nickname'
        rules={[{ required: true, message: t('enter-your-username') }]}
        style={style} // Применение стиля
      >
        <Input defaultValue={tg?.initDataUnsafe?.user?.username ? tg.initDataUnsafe.user.username : ''} />
      </Form.Item>
      <Form.Item
        label={t('email')}
        name='email'
        rules={[{ required: true, message: t('enter-your-username') }]}
        style={style} // Применение стиля
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={t('password')}
        name='password'
        rules={[{ required: true, message: t('enter-your-password') }]}
        style={style} // Применение стиля
      >
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 4, span: 16 }} style={style}>
        {t('already-have-an-account')}?{' '}
        <Link to={'autorization'} className='text-blue-500'>
          {t('sign-in')}
        </Link>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={style}>
        <Button type='primary' htmlType='submit'>
          {t('send')}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Registration
