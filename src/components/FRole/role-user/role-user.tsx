import { Form, Button, Select, Table, Popconfirm } from 'antd'
import React, { FC, useContext } from 'react'
import { Link, useLocation, useRouteMatch } from 'react-router-dom'
import { TRole, TUser } from '../../../utils/typesFromBackend'
import * as userAPI from '../../../utils/api/user-api'
import { NotificationContext } from '../../notification-provider/notification-provider'
import { DeleteTwoTone } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'

interface IGroupModifiersForDish {
  pathRest: string
  token: string
  t: (arg0: string) => string
}

interface ILevelsAccess {
  text: string
  value: string
}

const RoleUser: FC<IGroupModifiersForDish> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const roleId = Object.keys(match?.params as number)[0]
  const [data, setData] = React.useState<TRole[]>([])
  const [users, setUsers] = React.useState<TUser[]>([])
  const [levelsAccess, setLevelsAccess] = React.useState<ILevelsAccess[]>([])
  const [update, setUpdate] = React.useState<boolean>(true)
  const location = useLocation()

  React.useEffect(() => {
    userAPI
      .getUsers(token)
      .then((res) => {
        setUsers(res)
        setData(res)
      })
      .catch((e) => openNotification(e, 'topRight'))
    const currentPath = location.pathname
    window.localStorage.setItem('initialRoute', currentPath)
  }, [roleId, update])

  React.useEffect(() => {
    const levelsAccessNames: { [key: string]: boolean } = {}
    const resultArrayLevels: ILevelsAccess[] = []
    data.forEach((role: TRole) => {
      if (!levelsAccessNames[role.level_access]) {
        levelsAccessNames[role.level_access] = true
      }
    })
    for (const key of Object.keys(levelsAccessNames)) {
      resultArrayLevels.push({ text: key, value: key })
    }
    setLevelsAccess(resultArrayLevels)
  }, [data])
  function handleDeleteModifierFromDish(values: any): void {
    const newLanguageRest: any = {
      roleId: 1
    }
    userAPI
      .updateUser(token, values.id, newLanguageRest)
      .then((res: any) => {
        setUpdate(!update)
      })
      .catch((e: any) => openNotification(e, 'topRight'))
  }

  const columns: ColumnsType<TRole> = [
    {
      title: `${t('title')}`,
      dataIndex: 'title',
      key: 'title',
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      render: (nickname, role) => (
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        <Link to={`/${pathRest}/role/:${role.id}`}>{nickname}</Link>
      )
    },
    {
      title: `${t('level_access')}`,
      dataIndex: 'level_access',
      key: 'level_access',
      render: (levelAccess) => <p>{levelAccess}</p>,
      sorter: (a, b) => a.level_access - b.level_access,
      filters: [...levelsAccess],
      onFilter: (value: string | number | boolean, record) =>
        // eslint-disable-next-line eqeqeq
        record.level_access == value
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record: { id: React.Key }) =>
        data.length >= 1 ? (
          <Popconfirm
            title={t('delete-role-from-restaurant')}
            onConfirm={() => handleDeleteModifierFromDish(record)}
          >
            <DeleteTwoTone />
          </Popconfirm>
        ) : null
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
          roleId: roleId
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
        name='dish'
        form={form}
        validateMessages={validateMessages}
        style={{ paddingTop: '1.5rem' }}
      >
        <Form.Item label={t('add-user')} name='id' rules={[{ required: true }]}>
          <Select>
            {users.map((user, index) => (
              <Select.Option value={user.id} key={index}>
                {user.info.full_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type='primary' htmlType='submit'>
            {t('add-role-to-rest')}
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={data} />
    </>
  )
}
export default RoleUser
