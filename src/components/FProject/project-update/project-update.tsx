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
  const [form] = Form.useForm()
  const history = useHistory()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }
  // eslint-disable-next-line prefer-regex-literals
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const roleId = Object.keys(match?.params as string)[0]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [project, setProject] = React.useState<TProject>({} as TProject)
  const [formData, setFormData] = React.useState(() => {
    const storedFormDataString = localStorage.getItem('formDataTeam')
    return storedFormDataString ? JSON.parse(storedFormDataString) : null
  })

  const handleFormChange = (): void => {
    const allValues = form.getFieldsValue()
    const updateallValues = { ...allValues, _id: project.id }
    setFormData(updateallValues)
  }
  React.useEffect(() => {
    if (Object.keys(project).length > 0 && formData) {
      if (project.id !== formData._id) {
        localStorage.removeItem('formDataAdmin')
      }
    }
    localStorage.setItem('formDataAdmin', JSON.stringify(formData))
  }, [formData])

  React.useEffect(() => {
    projectAPI
      .getProjectById(token, roleId)
      .then((res: TProject) => {
        setProject(res)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])
  React.useEffect(() => {
    const storedFormDataString = localStorage.getItem('formDataAdmin')
    const parsedFormData = storedFormDataString
      ? JSON.parse(storedFormDataString)
      : null
    if (parsedFormData && parsedFormData.id === project.id) {
      form.setFieldsValue({
        title: parsedFormData.title
      })
      form.setFieldsValue({
        technologies: parsedFormData.technologies
      })
      form.setFieldsValue({
        documentation: parsedFormData.documentation
      })
      form.setFieldsValue({
        server: parsedFormData.server
      })
    } else {
      form.setFieldsValue({
        title: project.title
      })
      form.setFieldsValue({
        technologies: project.technologies
      })
      form.setFieldsValue({
        documentation: project.documentation
      })
      form.setFieldsValue({
        server: project.server
      })
    }
  }, [project])
  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }
  const onFinish = (values: any): void => {
    const updateProject: any = {
      name: values.name,
      technologies: values.technologies,
      server: values.server,
      documentation: values.documentation
    }

    projectAPI
      .updateProject(token, updateProject, project.id.toString())
      .then((res: TProject) => {
        localStorage.removeItem('formDataAdmin')
        history.push(`/${pathRest}/roles`)
      })
      .catch((e) => openNotification(e, 'topRight'))
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
      onFinish={onFinish}
      validateMessages={validateMessages}
      name='project'
      form={form}
      className={theme}
      style={{ marginTop: '20px', maxWidth: '50%', ...style }}
      onValuesChange={handleFormChange}
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
