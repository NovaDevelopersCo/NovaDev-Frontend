import { FC, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button, Modal } from 'antd'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import * as teamAPI from '../../utils/api/team-api'
import clsx from 'clsx'

interface IAddTeam {
  pathRest: string
  token: string
  t: (arg0: string) => string
  dark: boolean
  style: object
}

const AddTeam: FC<IAddTeam> = ({ token, pathRest, t, dark }) => {
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
    const newTeam = {
      name: values.name,
      description: values.description,
      numberUsers: values.numberUsers,
      category: values.category
    }

    teamAPI
      .createTeam(token, newTeam)
      .then(() => {
        history.push(`/${pathRest}/teams`)
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
        {t('add-team')}
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
          label={t('name-of-team')}
          rules={[{ required: true }]}
          name='name'
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('description')}
          rules={[{ required: true }]}
          name='description'
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('number-user')}
          rules={[{ required: true }]}
          name='number-users'
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('category')}
          rules={[{ required: true }]}
          name='category'
        >
          <Input />
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

export default AddTeam
