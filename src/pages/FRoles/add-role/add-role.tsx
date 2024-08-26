import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { TRole } from '../../../utils/typesFromBackend'
import { Form, Input, Button, Modal, Select } from 'antd'
import { NotificationContext } from '../../../components/notification-provider/notification-provider'
import * as roleAPI from '../../../utils/api/role-api'
import clsx from 'clsx'

interface IAddRole {
  pathRest: string
  token: string
  t: (arg0: string) => string
  dark: boolean
}

const AddRole: FC<IAddRole> = ({ token, pathRest, t, dark }) => {
  const { openNotification } = useContext(NotificationContext)
  const [form] = Form.useForm()
  const history = useHistory()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }
  const theme = clsx(dark ? 'black' : 'white')
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }

  const onFinish = (values: any): void => {
    roleAPI
      .createRole(token, values)
      .then((res: TRole) => {
        history.push(`/${pathRest}/roles`)
      })
      .catch((e) => openNotification(e, 'topRight'))
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
        {t('add-role')}
      </h4>

      <Form
        className={theme}
        {...layout}
        onFinish={onFinish}
        validateMessages={validateMessages}
        name='dish'
        form={form}
        style={{ paddingTop: '1.5rem' }}
      >
        <Form.Item label={t('name')} rules={[{ required: true }]} name='title'>
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
          label={t('level_access')}
          rules={[{ required: true }]}
          name='level_access'
        >
          <Select>
            <Select.Option value='1'>1</Select.Option>
            <Select.Option value='2'>2</Select.Option>
            <Select.Option value='3'>3</Select.Option>
            <Select.Option value='4'>4</Select.Option>
            <Select.Option value='5'>5</Select.Option>
          </Select>
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
export default AddRole
