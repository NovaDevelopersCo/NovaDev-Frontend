import { FC, useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Form,
  Input,
  Button,
  Modal,
  DatePicker,
  Select,
  Popconfirm,
  Segmented
} from 'antd'
import { NotificationContext } from '../../../components/notification-provider/notification-provider'
import * as projectAPI from '../../../utils/api/project-api'
import * as userAPI from '../../../utils/api/user-api'
import clsx from 'clsx'
import { TUser } from '../../../utils/typesFromBackend'

interface IEditorPage {
  pathRest: string
  token: string
  t: (key: string) => string
  dark: boolean
  style: object
}

const Project: FC<IEditorPage> = ({ token, pathRest, t, dark }) => {
  const { openNotification } = useContext(NotificationContext)
  const [form] = Form.useForm()
  const history = useHistory()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [project] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<string>(t('project'))
  const [users, setUsers] = useState<TUser[]>([])

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
  }
  const onFinish = (values: any): void => {
    const updateProject = {
      name: values.name,
      technologies: values.technologies,
      server: values.server,
      documentation: values.documentation,
      client: values.client,
      users: values.users,
      dateEnd: values['date-end']?.format('YYYY-MM-DD')
    }

    projectAPI
      .updateProject(token, updateProject)
      .then(() => history.push(`/${pathRest}/project`))
      .catch((e) => openNotification(e.message, 'topRight'))
  }

  const handleModalClose = (): void => {
    setIsModalVisible(false)
  }

  const confirm = (): void => {
    projectAPI
      .deleteProject(token, project.id.toString())
      .then(() => history.push(`/${pathRest}/project`))
      .catch((e) => openNotification(e, 'topRight'))
  }

  const theme = clsx(dark ? 'black' : 'white')

  useEffect(() => {
    userAPI
      .getUsers(token)
      .then((res: TUser[]) => setUsers(res))
      .catch((e) => openNotification(e.message, 'topRight'))
  }, [token, openNotification])

  return (
    <>
      <Modal
        className={theme}
        title={t('alert')}
        open={isModalVisible}
        footer={
          <Button key='ok' type='primary' onClick={handleModalClose}>
            {t('close')}
          </Button>
        }
      >
        {t('field_must_not_empty')}
      </Modal>
      <h4
        className={theme}
        style={{
          marginBottom: '15px',
          marginTop: '0',
          fontSize: '1.75rem',
          fontWeight: '600',
          padding: '15px'
        }}
      >
        {t('info-project')}
      </h4>
      <Segmented
        block
        options={[
          t('project'),
          t('add-delete-executors'),
          t('add-delete-clients')
        ]}
        value={activeTab}
        onChange={(value) => setActiveTab(value.toString())}
      />
      <>
        {activeTab === t('project') && (
          <Form
            form={form}
            onFinish={onFinish}
            layout='vertical'
            style={{
              marginTop: '20px',
              maxWidth: '50%'
            }}
          >
            <Form.Item label={t('project-name')} name='name'>
              <Input />
            </Form.Item>
            <Form.Item label={t('technologies')} name='technologies'>
              <Input />
            </Form.Item>
            <Form.Item label={t('server')} name='server'>
              <Input />
            </Form.Item>
            <Form.Item label={t('documentation')} name='documentation'>
              <Input />
            </Form.Item>
            <Form.Item label={t('date-end')} name='date-end'>
              <DatePicker />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
              <Button type='primary' htmlType='submit'>
                {t('save')}
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
              <Popconfirm
                title={t('you-sure-want-delete')}
                onConfirm={confirm}
                okText={t('yes')}
                cancelText={t('no')}
              >
                <Button danger className={theme} htmlType='button'>
                  {t('delete')}
                </Button>
              </Popconfirm>
            </Form.Item>
          </Form>
        )}
        {activeTab === t('add-delete-executors') && (
          <Form
            style={{
              marginTop: '20px',
              maxWidth: '50%'
            }}
          >
            <Form.Item label={t('add-executors')} name='add-executors'>
              <Select placeholder={t('select-executors')}>
                {users.map((user: TUser, index: number) => (
                  <Select.Option value={user.id} key={index}>
                    {user.info.full_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label={t('delete-executors')} name='delete-executors'>
              <Select placeholder={t('select-executors')}>
                {users.map((user: TUser, index: number) => (
                  <Select.Option value={user.id} key={index}>
                    {user.info.full_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
              <Button type='primary' htmlType='submit'>
                {t('save')}
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
              <Popconfirm
                title={t('you-sure-want-delete')}
                onConfirm={confirm}
                okText={t('yes')}
                cancelText={t('no')}
              >
                <Button danger className={theme} htmlType='button'>
                  {t('delete')}
                </Button>
              </Popconfirm>
            </Form.Item>
          </Form>
        )}
        {activeTab === t('add-delete-clients') && (
          <Form
            style={{
              marginTop: '20px',
              maxWidth: '50%'
            }}
          >
            <Form.Item label={t('client')} name='client'>
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
              <Button type='primary' htmlType='submit'>
                {t('save')}
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
              <Popconfirm
                title={t('you-sure-want-delete-client')}
                onConfirm={confirm}
                okText={t('yes')}
                cancelText={t('no')}
              >
                <Button danger className={theme} htmlType='button'>
                  {t('delete-client')}
                </Button>
              </Popconfirm>
            </Form.Item>
          </Form>
        )}
      </>
    </>
  )
}

export default Project
