import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { TAdmin, TRest } from '../../utils/typesFromBackend'
import { Form, Input, Button, Modal, Upload } from 'antd'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import * as adminAPI from '../../utils/api/category-api'
import * as userAPI from '../../utils/api/task-api'
import clsx from 'clsx'
import { UploadOutlined } from '@ant-design/icons'

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
  const [, setCategory] = React.useState('')
  const [, setTitle] = React.useState('')
  const [, setContent] = React.useState('')
  const [, setImage] = React.useState('')

  function handleChangeContent(e: React.ChangeEvent<HTMLInputElement>): void {
    setContent(e.target.value)
  }

  function handleChangeCategory(e: React.ChangeEvent<HTMLInputElement>): void {
    setCategory(e.target.value)
  }

  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>): void {
    setTitle(e.target.value)
  }

  function handleChangeImage(info: any): void {
    if (info.file.status === 'done') {
      setImage(info.file.originFileObj)
    }
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
      rest_id: PathRest[values.restaurant],
      image: values.image
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
          label={t('name-of-post')}
          rules={[{ required: true }]}
          name='title'
        >
          <Input onChange={handleChangeTitle} />
        </Form.Item>
        <Form.Item
          label={t('content')}
          rules={[{ required: true }]}
          name='text'
        >
          <Input onChange={handleChangeContent} />
        </Form.Item>
        <Form.Item
          label={t('category')}
          rules={[{ required: true }]}
          name='category'
        >
          <Input onChange={handleChangeCategory} />
        </Form.Item>
        <Form.Item label={t('image')} name='image'>
          <Upload
            name='image'
            listType='picture'
            beforeUpload={() => false}
            onChange={handleChangeImage}
          >
            <Button icon={<UploadOutlined />}>{t('upload-photo')}</Button>
          </Upload>
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
