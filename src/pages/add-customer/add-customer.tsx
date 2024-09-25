import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button, Modal } from 'antd'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import * as customerAPI from '../../utils/api/clients-api'
import clsx from 'clsx'

interface IAddCustomer {
  pathRest: string
  token: string
  t: (arg0: string) => string
  dark: boolean
  style: object
}

const AddCustomer: FC<IAddCustomer> = ({ token, pathRest, t, dark, style }) => {
  const { openNotification } = useContext(NotificationContext)
  const [form] = Form.useForm()
  const history = useHistory()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }
  const theme = clsx(dark ? 'black' : 'white')
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [, setName] = React.useState('')
  const [, setPhone] = React.useState('')
  const [, setTg] = React.useState('')

  function handleChangeName(e: React.ChangeEvent<HTMLInputElement>): void {
    setName(e.target.value)
  }

  function handleChangePhone(e: React.ChangeEvent<HTMLInputElement>): void {
    setPhone(e.target.value)
  }

  function handleChangeEmail(e: React.ChangeEvent<HTMLInputElement>): void {
    setTg(e.target.value)
  }

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }
  const handleModalClose = (): void => {
    setIsModalVisible(false)
  }
  const onFinish = async (values: {
    name: string
    phone: string
    tg: string
  }) => {
    try {
      const response = await customerAPI.createCustomer(token, {
        name: values.name,
        phone: values.phone,
        tg: values.tg
      })
      openNotification(t('Клиент успешно добавлен'), 'topRight')
      history.push('/admin/clients')
    } catch (error) {
      console.error('Error while creating customer:', error)
      openNotification(t('Ошибка добавления клиента 400'), 'topRight')
    }
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
        {t('add-client')}
      </h4>

      <Form
        className={theme}
        {...layout}
        onFinish={onFinish}
        validateMessages={validateMessages}
        form={form}
        style={{ paddingTop: '1.5rem' }}
      >
        <Form.Item
          label={t('nickname')}
          rules={[{ required: true }]}
          name='name'
        >
          <Input onChange={handleChangeName} />
        </Form.Item>
        <Form.Item label={t('phone')} rules={[{ required: true }]} name='phone'>
          <Input onChange={handleChangePhone} />
        </Form.Item>
        <Form.Item label={t('tg')} rules={[{ required: true }]} name='tg'>
          <Input onChange={handleChangeEmail} />
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
export default AddCustomer
