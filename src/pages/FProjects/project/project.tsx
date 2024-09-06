import { FC, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Form,
  Input,
  Button,
  Modal,
  DatePicker,
  Select,
  Popconfirm
} from 'antd'
import { NotificationContext } from '../../../components/notification-provider/notification-provider'
import * as projectAPI from '../../../utils/api/project-api'
import clsx from 'clsx'

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
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }
  const onFinish = (values: any): void => {
    const updateProject = {
      name: values.name,
      description: values.description,
      category: values.category,
      teamExecutor: values.teamExecutor,
      startDate: values['date-start'].format('YYYY-MM-DD'),
      endDate: values['date-end'].format('YYYY-MM-DD')
    }

    projectAPI
      .updateProject(token, updateProject)
      .then(() => history.push(`/${pathRest}/projects`))
      .catch((e) => openNotification(e.message, 'topRight'))
  }

  const handleModalClose = (): void => {
    setIsModalVisible(false)
  }
  const theme = clsx(dark ? 'black' : 'white')
  function confirm(): void {
    projectAPI
      .deleteProject(token, project.id.toString())
      .then(() => history.push(`/${pathRest}/projects`))
      .catch((e) => openNotification(e, 'topRight'))
  }
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

      <Form
        className={theme}
        {...layout}
        onFinish={onFinish}
        validateMessages={validateMessages}
        name='team'
        form={form}
        style={{ paddingTop: '1.5rem' }}
      >
        <Form.Item label={t('project-name')} name='name'>
          <Input />
        </Form.Item>
        <Form.Item label={t('project-description')} name='description'>
          <Input />
        </Form.Item>
        <Form.Item label={t('team-executor')} name='teamExecutor'>
          <Select placeholder={t('select-team-executor')}></Select>
        </Form.Item>
        <Form.Item label={t('date-start')} name='date-start'>
          <DatePicker />
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
            <Button className={theme} htmlType='button'>
              {t('delete')}
            </Button>
          </Popconfirm>
        </Form.Item>
      </Form>
    </>
  )
}

export default Project
