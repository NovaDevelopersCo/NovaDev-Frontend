import { Popconfirm, Form, Button, Input, DatePicker } from 'antd'
import React, { FC, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import * as projectAPI from '../../../utils/api/project-api'
import { NotificationContext } from '../../notification-provider/notification-provider'
import clsx from 'clsx'
import { TProject } from '../../../utils/typesFromBackend'

interface IProjectUpdate {
  pathRest: string
  token: string
  t: (arg0: string) => string
  dark: boolean
  style: object
}

const ProjectUpdate: FC<IProjectUpdate> = ({ token, pathRest, t, dark }) => {
  const { openNotification } = useContext(NotificationContext)
  const [projects] = useState<any>(null)
  const [project, setProject] = React.useState<TProject>({} as TProject)
  const [form] = Form.useForm()
  const history = useHistory()
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
  }
  const [formData, setFormData] = React.useState(() => {
    const storedFormDataString = localStorage.getItem('formDataProject')
    return storedFormDataString ? JSON.parse(storedFormDataString) : null
  })

  const handleFormChange = (): void => {
    const allValues = form.getFieldsValue()
    const updateallValues = { ...allValues, _id: project.id }
    setFormData(updateallValues)
  }

  React.useEffect(() => {
    if (project.id) {
      const values = formData || project
      form.setFieldsValue({
        title: values.title,
        technologies: values.technologies,
        server: values.server,
        documentation: values.documentation
      })
    }
  }, [project, formData])

  React.useEffect(() => {
    const storedFormDataString = localStorage.getItem('formDataProject')
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
        server: parsedFormData.server
      })
      form.setFieldsValue({
        documentation: parsedFormData.documentation
      })
    } else {
      form.setFieldsValue({
        title: project.title
      })
      form.setFieldsValue({
        technologies: project.technologies
      })
      form.setFieldsValue({
        server: project.server
      })
      form.setFieldsValue({
        documentation: project.documentation
      })
    }
  }, [project])
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
      .deleteProject(token, projects.id.toString())
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
