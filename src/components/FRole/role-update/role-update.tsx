import { Popconfirm, Select, Form, Button, Input } from 'antd'
import React, { FC, useContext } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { ELevelAccess, TRole } from '../../../utils/typesFromBackend'
import * as roleAPI from '../../../utils/api/role-api'
import { NotificationContext } from '../../notification-provider/notification-provider'
import TextArea from 'antd/es/input/TextArea'

interface IGroupModifiersForDish {
  pathRest: string
  token: string
  t: (arg0: string) => string
  style: object
}

const RoleUpdate: FC<IGroupModifiersForDish> = ({
  token,
  pathRest,
  t,
  style
}) => {
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
  const [role, setAdmin] = React.useState<TRole>({} as TRole)
  const [formData, setFormData] = React.useState(() => {
    const storedFormDataString = localStorage.getItem('formDataAdmin')
    return storedFormDataString ? JSON.parse(storedFormDataString) : null
  })

  const handleFormChange = (): void => {
    const allValues = form.getFieldsValue()
    const updateallValues = { ...allValues, _id: role.id }
    setFormData(updateallValues)
  }

  React.useEffect(() => {
    if (Object.keys(role).length > 0 && formData) {
      if (role.id !== formData._id) {
        localStorage.removeItem('formDataAdmin')
      }
    }
    localStorage.setItem('formDataAdmin', JSON.stringify(formData))
  }, [formData])

  React.useEffect(() => {
    roleAPI
      .getRole(token, roleId)
      .then((res: TRole) => {
        setAdmin(res)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

  React.useEffect(() => {
    const storedFormDataString = localStorage.getItem('formDataAdmin')
    const parsedFormData = storedFormDataString
      ? JSON.parse(storedFormDataString)
      : null
    if (parsedFormData && parsedFormData.id === role.id) {
      form.setFieldsValue({
        title: parsedFormData.title
      })
      form.setFieldsValue({
        description: parsedFormData.description
      })
      form.setFieldsValue({
        level_access: parsedFormData.level_access
      })
    } else {
      form.setFieldsValue({
        title: role.title
      })
      form.setFieldsValue({
        description: role.description
      })
      form.setFieldsValue({
        level_access: role.level_access
      })
    }
  }, [role])
  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }
  const onFinish = (values: any): void => {
    const newLanguageRest: any = {
      title: values.title,
      description: values.description,
      level_access: Number(values.level_access)
    }
    console.log(newLanguageRest)
    roleAPI
      .updateRole(token, newLanguageRest, role.id.toString())
      .then((res: TRole) => {
        localStorage.removeItem('formDataAdmin')
        history.push(`/${pathRest}/roles`)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  function confirm(): void {
    roleAPI
      .deleteRole(token, role.id.toString())
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
      style={{ paddingTop: '1.5rem', ...style }}
      onValuesChange={handleFormChange}
    >
      <Form.Item label={t('title')} name='title'>
        <Input />
      </Form.Item>
      <Form.Item label={t('description')} name='description'>
        <TextArea />
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
