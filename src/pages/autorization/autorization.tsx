/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button, Form, Input } from 'antd'
import { Dispatch, FC, SetStateAction, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import * as autorizationApi from '../../utils/api/autorization-api'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import * as validateTokenApi from '../../utils/api/validate-token-api'
import { useTelegram } from '../../services/hooks/use-telegram'
import clsx from 'clsx'

interface IAutorization {
  style: Object
  dark: boolean
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
  setToken: (token: any) => void
  t: (arg0: string) => string
}

const Autorization: FC<IAutorization> = ({
  setIsLoggedIn,
  t,
  setToken,
  dark,
  style
}) => {
  const storedInitialRoute = localStorage.getItem('initialRoute')
  const { openNotification } = useContext(NotificationContext)
  const history = useHistory()
  const { tg } = useTelegram()

  useEffect(() => {
    const tokenDetailsString = localStorage.getItem('token')
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
    autorizationApi
      .autorization(values)
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
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  const tailLayout = {
    wrapperCol: { span: 24 },
    style: { display: 'flex', justifyContent: 'center' }
  }
  const theme = clsx(dark ? 'black' : 'white')

  return (
    <Form
      {...layout}
      style={style}
      name='basic'
      className={clsx(theme, 'max-w-[600px] flex justify-center flex-col')}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete='off'
    >
      <Form.Item
        label={t('email')}
        name='private_nickname'
        rules={[{ required: true, message: t('enter-your-username') }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t('password')}
        name='password'
        rules={[{ required: true, message: t('enter-your-password') }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type='primary' htmlType='submit'>
          {t('send')}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Autorization
