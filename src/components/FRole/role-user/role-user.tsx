import { Form, Button, Select, Table } from 'antd'
import React, { FC, useContext } from 'react'
import { Link, useLocation, useRouteMatch } from 'react-router-dom'
import { TRole, TUser } from '../../../utils/typesFromBackend'
import * as userAPI from '../../../utils/api/user-api'
import { NotificationContext } from '../../notification-provider/notification-provider'
import { ColumnsType } from 'antd/es/table'

interface IGroupModifiersForDish {
  pathRest: string
  token: string
  t: (arg0: string) => string
  style: object
  theme: string
}

interface ILevelsAccess {
  text: string
  value: string
}

const RoleUser: FC<IGroupModifiersForDish> = ({
  token,
  pathRest,
  t,
  style,
  theme
}) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const roleId = Number(Object.keys(match?.params as number)[0])
  const [data, setData] = React.useState<TUser[]>([])
  const [users, setUsers] = React.useState<TUser[]>([])
  const [update, setUpdate] = React.useState<boolean>(true)
  const location = useLocation()

  React.useEffect(() => {
    userAPI
      .getUsers(token)
      .then((res: TUser[]) => {
        const users: TUser[] = []
        const Data: TUser[] = []
        res.forEach((user: TUser) => {
          if (user.roleId === roleId) {
            Data.push(user)
          } else {
            users.push(user)
          }
        })
        setUsers(users)
        setData(Data)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [roleId, update])

  React.useEffect(() => {
    const levelsAccessNames: { [key: string]: boolean } = {}
    const resultArrayLevels: ILevelsAccess[] = []
    for (const key of Object.keys(levelsAccessNames)) {
      resultArrayLevels.push({ text: key, value: key })
    }
  }, [data])
  const columns: ColumnsType<TUser> = [
    {
      title: `${t('name')}`,
      dataIndex: 'info.full_name',
      key: 'info.full_name',
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      render: (nickname, user) => (
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        <Link to={`/${pathRest}/user/:${user.id}`}>{user.info.full_name}</Link>
      )
    }
  ]
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 }
  }
  const [form] = Form.useForm()

  const onFinish = (values: any): void => {
    userAPI
      .getUser(token, values.id)
      .then((res: TRole) => {
        const newLanguageRest: any = {
          roleId
        }
        userAPI
          .updateUser(token, values.id, newLanguageRest)
          .then((res: any) => {
            setUpdate(!update)
          })
          .catch((e: any) => openNotification(e, 'topRight'))
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: t('you-nedd-choose-group-modifier-for-dish')
  }

  return (
    <>
      <Form
        {...layout}
        onFinish={onFinish}
        name='role'
        form={form}
        validateMessages={validateMessages}
        style={{ paddingTop: '1.5rem', ...style }}
      >
        <Form.Item
          label={t('add-user')}
          name='id'
          rules={[{ required: true }]}
          style={style}
        >
          <Select style={style}>
            {users.map((user, index) => (
              <Select.Option value={user.id} key={index} style={style}>
                {user.info.full_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type='primary' htmlType='submit'>
            {t('add-role-to-user')}
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={data} className={theme} />
    </>
  )
}
export default RoleUser
