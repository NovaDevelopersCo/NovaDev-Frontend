import { Popconfirm, Select, Form, Button, Input } from 'antd'
import React, { FC, useContext } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { ELevelAccess, TAdmin } from '../../../utils/typesFromBackend'
import * as roleAPI from '../../../utils/api/role-api'
import { NotificationContext } from '../../notification-provider/notification-provider'

interface IGroupModifiersForDish {
  pathRest: string
  token: string
  t: (arg0: string) => string
}

const RoleUpdate: FC<IGroupModifiersForDish> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [form] = Form.useForm()
  const history = useHistory()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }
  // eslint-disable-next-line prefer-regex-literals
  // const { roleId } = useParams<{ roleId: string }>()
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const roleId = Object.keys(match?.params as string)[0]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [admin, setAdmin] = React.useState<TAdmin>({} as TAdmin)
  const [formData, setFormData] = React.useState(() => {
    const storedFormDataString = localStorage.getItem('formDataAdmin')
    return storedFormDataString ? JSON.parse(storedFormDataString) : null
  })

  const handleFormChange = (): void => {
    const allValues = form.getFieldsValue()
    const updateallValues = { ...allValues, _id: admin._id }
    setFormData(updateallValues)
  }

  React.useEffect(() => {
    if (Object.keys(admin).length > 0 && formData) {
      if (admin._id !== formData._id) {
        localStorage.removeItem('formDataAdmin')
      }
    }
    localStorage.setItem('formDataAdmin', JSON.stringify(formData))
  }, [formData])

  React.useEffect(() => {
    roleAPI
      .getRole(token, roleId)
      .then((res: TAdmin) => {
        setAdmin(res)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

  React.useEffect(() => {
    const storedFormDataString = localStorage.getItem('formDataAdmin')
    const parsedFormData = storedFormDataString
      ? JSON.parse(storedFormDataString)
      : null
    if (parsedFormData && parsedFormData._id === admin._id) {
      form.setFieldsValue({
        nickname: parsedFormData.nickname
      })
      form.setFieldsValue({
        level_access: parsedFormData.level_access
      })
      form.setFieldsValue({
        rest_id: parsedFormData.rest_id
      })
    } else {
      form.setFieldsValue({
        nickname: admin.nickname
      })
      form.setFieldsValue({
        level_access: admin.level_access
      })
    }
  }, [admin])
  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }
  const onFinish = (values: any): void => {
    const newLanguageRest: any = {
      _id: admin._id,
      nickname: values.nickname,
      level_access: Number(values.level_access)
    }
    roleAPI
      .updateRole(token, newLanguageRest)
      .then((res: TAdmin) => {
        localStorage.removeItem('formDataAdmin')
        history.push(`/${pathRest}/roles`)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  function confirm(): void {
    roleAPI
      .deleteRole(token, admin._id)
      .then(() => history.push(`/${pathRest}/roles`))
      .catch((e) => openNotification(e, 'topRight'))
  }
  return (
    <Form
      {...layout}
      onFinish={onFinish}
      validateMessages={validateMessages}
      name='role'
      form={form}
      style={{ paddingTop: '1.5rem' }}
      onValuesChange={handleFormChange}
    >
      <Form.Item label={t('title')} name='title'>
        <Input />
      </Form.Item>
      <Form.Item label={t('description')} name='description'>
        <Input />
      </Form.Item>
      <Form.Item label={t('level_access')} name='level_access'>
        <Select>
          {Object.values(ELevelAccess).map((levelAccess: ELevelAccess) => (
            <Select.Option value={levelAccess} key={levelAccess}>
              {levelAccess}
            </Select.Option>
          ))}
        </Select>
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
export default RoleUpdate
