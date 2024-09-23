import { Popconfirm, Form, Button, Input, Upload, UploadFile } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import React, { FC, useContext } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { TTeams } from '../../../utils/typesFromBackend'
import * as teamAPI from '../../../utils/api/teams-api'
import { NotificationContext } from '../../notification-provider/notification-provider'

interface IGroupModifiersForTeam {
  pathRest: string
  token: string
  t: (arg0: string) => string
  style: object
}

const TeamUpdate: FC<IGroupModifiersForTeam> = ({
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
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const roleId = Object.keys(match?.params as string)[0]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [team, setTeam] = React.useState<TTeams>({} as TTeams)
  const [fileList, setFileList] = React.useState<UploadFile[]>([])
  const [formData, setFormData] = React.useState(() => {
    const storedFormDataString = localStorage.getItem('formDataTeam')
    return storedFormDataString ? JSON.parse(storedFormDataString) : null
  })

  const handleFormChange = (): void => {
    const allValues = form.getFieldsValue()
    const updateallValues = { ...allValues, _id: team.id }
    setFormData(updateallValues)
  }

  const handleFilesChange = ({ fileList }: { fileList: UploadFile[] }): void => {
    setFileList(fileList)
    console.log(fileList)
  }

  React.useEffect(() => {
    if (Object.keys(team).length > 0 && formData) {
      if (team.id !== formData._id) {
        localStorage.removeItem('formDataTeam')
      }
    }
    localStorage.setItem('formDataTeam', JSON.stringify(formData))
  }, [formData])

  React.useEffect(() => {
    teamAPI
      .getTeamById(token, roleId)
      .then((res: TTeams) => {
        setTeam(res)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

  React.useEffect(() => {
    const storedFormDataString = localStorage.getItem('formDataTeam')
    const parsedFormData = storedFormDataString
      ? JSON.parse(storedFormDataString)
      : null
    if (parsedFormData && parsedFormData.id === team.id) {
      form.setFieldsValue({
        title: parsedFormData.title
      })
      form.setFieldsValue({
        description: parsedFormData.description
      })
    } else {
      form.setFieldsValue({
        title: team.title
      })
      form.setFieldsValue({
        description: team.description
      })
    }
  }, [team])
  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }
  const onFinish = (values: any): void => {
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('description', values.description)
    //
    if (fileList.length > 0 && fileList[0].originFileObj) {
      const file = fileList[0].originFileObj
      console.log('File to be sent:', file)
      formData.append('image', file)
    } else {
      console.error('No file found in fileList')
    }
    //
    teamAPI
      .editTeam(token, formData, team.id.toString())
      .then((res: TTeams) => {
        localStorage.removeItem('formDataTeam')
        history.push(`/${pathRest}/teams`)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  function confirm(): void {
    teamAPI
      .deleteTeam(token, team.id.toString())
      .then(() => history.push(`/${pathRest}/teams`))
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
        <Input />
      </Form.Item>
      <Form.Item label={t('image')} name='image'>
        <Upload fileList={fileList} onChange={handleFilesChange} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
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
export default TeamUpdate
