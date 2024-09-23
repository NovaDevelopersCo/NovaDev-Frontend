import { Form, Button, Select, Table } from 'antd'
import React, { FC, useContext } from 'react'
import { Link, useLocation, useRouteMatch } from 'react-router-dom'
import { TTeams, TUser } from '../../../utils/typesFromBackend'
import * as userAPI from '../../../utils/api/user-api'
import * as userInfoAPI from '../../../utils/api/user-info-api'
import { NotificationContext } from '../../notification-provider/notification-provider'
import { ColumnsType } from 'antd/es/table'

interface IGroupModifiersForUser {
  pathRest: string
  token: string
  t: (arg0: string) => string
  style: object
}

const TeamUser: FC<IGroupModifiersForUser> = ({
  token,
  pathRest,
  t,
  style
}) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const teamId = Number(Object.keys(match?.params as number)[0])
  const [data, setData] = React.useState<TUser[]>([])
  const [users, setUsers] = React.useState<TUser[]>([])
  const [selectedUserId, setSelectedUserId] = React.useState(null)
  const [update, setUpdate] = React.useState<boolean>(true)
  const location = useLocation()

  React.useEffect(() => {
    userAPI
      .getUsers(token)
      .then((res: TUser[]) => {
        const users: TUser[] = []
        const Data: TUser[] = []
        res.forEach((user: TUser) => {
          if (user.teamId === teamId) {
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
  }, [teamId, update])

  const handleSelectChange = (value: any): void => {
    setSelectedUserId(value)
  }

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
      .then((res: TTeams) => {
        const userId = selectedUserId
        const newLanguageRest: any = {
          userId,
          teamId
        }
        userInfoAPI
          .editUserTeam(token, newLanguageRest)
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
        <Form.Item label={t('add-user')} name='id' rules={[{ required: true }]}>
          <Select onChange={handleSelectChange} >
            {users.map((user, index) => (
              <Select.Option value={user.id} key={index}>
                {user.info.full_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type='primary' htmlType='submit'>
            {t('add-user-to-team')}
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={data.map(user => ({ ...user, key: user.id }))} />
    </>
  )
}
export default TeamUser
