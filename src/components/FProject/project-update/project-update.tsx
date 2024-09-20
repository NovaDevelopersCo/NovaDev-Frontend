import { Popconfirm, Form, Button, Input, DatePicker } from 'antd'
import { FC, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import * as projectAPI from '../../../utils/api/project-api'
import { NotificationContext } from '../../notification-provider/notification-provider'
import clsx from 'clsx'

interface IProjectUpdate {
  pathRest: string
  token: string
  t: (arg0: string) => string
  dark: boolean
  style: object
}

const ProjectUpdate: FC<IProjectUpdate> = ({ token, pathRest, t, dark }) => {
  const { openNotification } = useContext(NotificationContext)
  const [project] = useState<any>(null)
  const [form] = Form.useForm()
  const history = useHistory()
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
      dateEnd: values['date-end']?.format('YYYY-MM-DD')
    }

    projectAPI
      .updateProject(token, updateProject)
      .then(() => history.push(`/${pathRest}/project`))
      .catch((e) => openNotification(e.message, 'topRight'))
  }

  const confirm = (): void => {
    projectAPI
      .deleteProject(token, project.id.toString())
      .then(() => history.push(`/${pathRest}/project`))
      .catch((e) => openNotification(e, 'topRight'))
  }

  const theme = clsx(dark ? 'black' : 'white')
  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout='vertical'
      style={{
        marginTop: '20px',
        maxWidth: '50%'
      }}
      className={theme}
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
  )
}

export default ProjectUpdate
