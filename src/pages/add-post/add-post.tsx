import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { TAdmin, TRest } from '../../utils/typesFromBackend'
import { Form, Input, Button, Modal } from 'antd'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import * as adminAPI from '../../utils/api/category-api'
import * as userAPI from '../../utils/api/task-api'
import clsx from 'clsx'

interface IAddPost {
  pathRest: string
  token: string
  t: (arg0: string) => string
  dark: boolean
  style: object
}

const AddPost: FC<IAddPost> = ({ token, pathRest, t, dark, style }) => {
  const { openNotification } = useContext(NotificationContext)
  const [form] = Form.useForm()
  const history = useHistory()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }
  const theme = clsx(dark ? 'black' : 'white')
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [PathRest, setPathRest] = React.useState<{ [key: string]: string }>({})
  const [, setLogin] = React.useState('')
  const [, setTitle] = React.useState('')
  const [, setContent] = React.useState('')
  function handleChangeContent(e: React.ChangeEvent<HTMLInputElement>): void {
    setContent(e.target.value)
  }

  function handleChangeNickname(e: React.ChangeEvent<HTMLInputElement>): void {
    setLogin(e.target.value)
  }

  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>): void {
    setTitle(e.target.value)
  }

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} ' + `${t('it-is-necessary-to-fill-in')}!`
  }
  React.useEffect(() => {
    userAPI
      .getTasks(token, 1)
      .then((res) => {
        const nameRests: { [key: string]: string } = {}
        res.rests.forEach((rest: TRest) => {
          if (!nameRests[rest.titleRest] && rest.titleRest) {
            nameRests[rest.titleRest] = rest._id
          }
        })
        setPathRest(nameRests)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])
  const onFinish = (values: any): void => {
    const newLanguageRest: any = {
      nickname: values.nickname,
      password: values.password,
      level_access: Number(values.level_access),
      rest_id: PathRest[values.restaurant]
    }
    adminAPI
      .createAdmin(token, newLanguageRest)
      .then((res: TAdmin) => {
        history.push(`/${pathRest}/admins`)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  const handleModalClose = (): void => {
    setIsModalVisible(false)
  }
  return (
    <>
      {
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
      }
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
        {t('add-post')}
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
        <Form.Item
          className={theme}
          label={t('login')}
          rules={[
            { required: true },
            {
              validator: async (_, value) =>
                !value.includes(' ')
                  ? await Promise.resolve()
                  : await Promise.reject(new Error(t('no-spaces-allowed')))
            }
          ]}
          name='nickname'
        >
          <Input
            maxLength={20}
            showCount={true}
            onChange={handleChangeNickname}
          />
        </Form.Item>
        <Form.Item label={t('title')} rules={[{ required: true }]} name='title'>
          <Input onChange={handleChangeTitle} />
        </Form.Item>
        <Form.Item label={t('text')} rules={[{ required: true }]} name='text'>
          <Input onChange={handleChangeContent} />
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
export default AddPost
