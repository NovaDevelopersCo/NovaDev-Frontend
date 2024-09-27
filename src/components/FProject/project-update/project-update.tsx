import { Popconfirm, Form, Button, Input, DatePicker } from 'antd'
import React, { FC, useContext } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import * as projectAPI from '../../../utils/api/project-api'
import { NotificationContext } from '../../notification-provider/notification-provider'
import { TProject } from '../../../utils/typesFromBackend'

interface IProjectUpdate {
  pathRest: string
  token: string
  t: (arg0: string) => string
  style: object
  theme: string
}

const ProjectUpdate: FC<IProjectUpdate> = ({
  token,
  pathRest,
  t,
  style,
  theme
}) => {
  const { openNotification } = useContext(NotificationContext)
  const [project, setProject] = React.useState<TProject>({} as TProject)
  const [form] = Form.useForm()
  const history = useHistory()
  const pathname = useLocation().pathname
  const match = useRouteMatch<{ id: string }>(pathname)
  const id = match?.params.id
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }
  React.useEffect(() => {
    projectAPI
      .getProject(token, Number(id))
      .then((res: TProject) => {
        setProject(res)
        form.setFieldsValue({
          title: res.title,
          technologies: res.technologies,
          server: res.server,
          documentation: res.documentation
        })
      })
      .catch((e) => openNotification(e.message, 'topRight'))
  }, [token, form, openNotification])

  const onFinish = (values: any): void => {
    const updateProject = {
      name: values.name,
      technologies: values.technologies,
      server: values.server,
      documentation: values.documentation,
      deadline: values['date-end']?.format('YYYY-MM-DD')
    }

    projectAPI
      .updateProject(token, updateProject)
      .then(() => history.push(`/${pathRest}/project`))
      .catch((e) => openNotification(e.message, 'topRight'))
  }

  const confirm = (): void => {
    projectAPI
      .deleteProject(token, project.id)
      .then(() => history.push(`/${pathRest}/project`))
      .catch((e) => openNotification(e, 'topRight'))
  }
  return (
    <Form
      {...layout}
      form={form}
      className={theme}
      onFinish={onFinish}
      layout='vertical'
      style={{ marginTop: '20px', maxWidth: '50%', ...style }}
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
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
        <Button type='primary' htmlType='submit'>
          {t('save')}
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
        <Popconfirm
          title={t('you-sure-want-delete')}
          onConfirm={confirm}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button htmlType='button'>{t('delete')}</Button>
        </Popconfirm>
      </Form.Item>
    </Form>
  )
}

export default ProjectUpdate
