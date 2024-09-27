import { Popconfirm, Form, Button, Select } from 'antd'
import { FC, useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import * as projectAPI from '../../../utils/api/project-api'
import { NotificationContext } from '../../notification-provider/notification-provider'
import { TUser } from '../../../utils/typesFromBackend'
import Table, { ColumnsType } from 'antd/es/table'

interface IProjectClient {
  pathRest: string
  token: string
  t: (arg0: string) => string
  theme: string
  style: object
}

const ProjectClient: FC<IProjectClient> = ({ token, pathRest, t, theme }) => {
  const { openNotification } = useContext(NotificationContext)
  const history = useHistory()
  const [project] = useState<any>(null)
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
  }

  const confirm = (): void => {
    projectAPI
      .deleteProject(token, project.id.toString())
      .then(() => history.push(`/${pathRest}/project`))
      .catch((e) => openNotification(e, 'topRight'))
  }
  const columns: ColumnsType<TUser> = [
    {
      title: `${t('name')}`,
      key: 'nameActions',
      render: (_: any, user: TUser): JSX.Element => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Link to={`/${pathRest}/user/${user.id}`}>{user.info.full_name}</Link>
          <Popconfirm
            title={t('you-sure-want-delete')}
            onConfirm={confirm}
            okText={t('yes')}
            cancelText={t('no')}
          >
            <Button
              danger
              className={theme}
              htmlType='button'
              size='small'
              style={{ marginLeft: '10px' }}
            >
              {t('delete')}
            </Button>
          </Popconfirm>
        </div>
      )
    }
  ]

  return (
    <Form
      style={{
        marginTop: '20px'
      }}
      className={theme}
    >
      <Form.Item label={t('add-client')} name='client'>
        <Select placeholder={t('select-client')}></Select>
      </Form.Item>
      <Table columns={columns} rowKey='id' />
      <Form.Item
        wrapperCol={{ ...layout.wrapperCol, offset: 6 }}
        style={{ textAlign: 'center' }}
      >
        <Button
          type='primary'
          htmlType='submit'
          style={{
            marginTop: '20px'
          }}
        >
          {t('save')}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ProjectClient
