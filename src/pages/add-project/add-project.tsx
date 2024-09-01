import { FC, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button, Modal, DatePicker } from 'antd'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import * as projectAPI from '../../utils/api/project-api'
import clsx from 'clsx'

interface IAddProject {
  pathRest: string
  token: string
  t: (arg0: string) => string
  dark: boolean
  style: object
}

const AddProject: FC<IAddProject> = ({ token, pathRest, t, dark }) => {
  const { openNotification } = useContext(NotificationContext)
  const [form] = Form.useForm()
  const history = useHistory()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }
  const theme = clsx(dark ? 'black' : 'white')
  const [isModalVisible, setIsModalVisible] = useState(false)

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }

  const onFinish = (values: any): void => {
    const newProject = {
      name: values.name,
      description: values.description,
      numberUsers: values.numberUsers,
      category: values.category,
      startDate: values['date-start'].format('YYYY-MM-DD'),
      endDate: values['date-end'].format('YYYY-MM-DD')
    }

    projectAPI
      .createProject(token, newProject)
      .then(() => {
        history.push(`/${pathRest}/projects`)
      })
      .catch((e) => openNotification(e.message, 'topRight'))
  }

  const handleModalClose = (): void => {
    setIsModalVisible(false)
  }

  return (
    <>
      <Modal
        className={theme}
        title={t('alert')}
        visible={isModalVisible}
        footer={[
          <Button key='ok' type='primary' onClick={handleModalClose}>
            {t('close')}
          </Button>
        ]}
      >
        {t('field_must_not_empty')}
      </Modal>

      <h4
        className={theme}
        style={{
          marginBottom: '15px',
          marginTop: '0',
          color: '#000',
          fontSize: '1.75rem',
          fontWeight: '600',
          padding: '15px'
        }}
      >
        {t('add-project')}
      </h4>

      <Form
        className={theme}
        {...layout}
        onFinish={onFinish}
        validateMessages={validateMessages}
        name='team'
        form={form}
        style={{ paddingTop: '1.5rem' }}
      >
        <Form.Item
          label={t('project-name')}
          rules={[{ required: true }]}
          name='name'
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('project-description')}
          rules={[{ required: true }]}
          name='description'
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('executors')}
          rules={[{ required: true }]}
          name='number-executors'
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('date-start')}
          rules={[{ required: true }]}
          name='date-start'
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label={t('date-end')}
          rules={[{ required: true }]}
          name='date-end'
        >
          <DatePicker />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
          <Button type='primary' htmlType='submit'>
            {t('save')}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default AddProject
