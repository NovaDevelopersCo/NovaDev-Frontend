import { Form, Input, Modal, Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { FC, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as TeamsAPI from '../../utils/api/teams-api'
import { NotificationContext } from '../notification-provider/notification-provider'
import { TTeams } from '../../utils/typesFromBackend'

interface IUpdateUserModalProps {
    onCancel: () => void
    token: string
    teamId: number | null
}

const UpdateTeamModal: FC<IUpdateUserModalProps> = ({ onCancel, token, teamId }) => {
    const { t } = useTranslation()
    const { openNotification } = useContext(NotificationContext)
    // const [userIdNumber, setUserIdNumber] = useState<number | null>(null)
    const [team, setTeam] = useState<TTeams[]>([])

    // const formProjectData = {
    //     //
    // }

    useEffect(() => {
        return (
            setTeam([])
            // setUserIdNumber(null),
        )
    }, [teamId])

    useEffect(() => {
        if (teamId) {
            TeamsAPI.getTeamById(token, teamId).then(res => {
                console.log(res)
                if (res) {
                    setTeam(res)
                }
            }).catch((e: Error) => openNotification(e.message, 'topRight'))
        }
    }, [token, teamId])

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    //     const { name, value } = e.target
    //     if (name in team) {
    //       setTeam((prevTeam) => ({
    //         ...prevTeam,
    //         info: {
    //           ...prevTeam,
    //           [name]: value
    //         }
    //       }))
    //     }
    // }

    const handleChange = (e: React.ChangeEvent<HTMLFormElement>): void => {
        const { name, value } = e.target
        if (name in team) {
          setTeam((prevTeam) => ({
            ...prevTeam,
            info: {
              ...prevTeam,
              [name]: value
            }
          }))
        }
    }

    const handleUploadChange = (info: any): void => {
        if (info.file.status === 'done') {
          setTeam((prevTeam) => ({
            ...prevTeam,
            info: {
              ...prevTeam,
              image: info.file.response.url
            }
          }))
        }
    }

    return <Modal title="Update Form Modal" open={!!teamId} onCancel={onCancel} footer={[<Button key="cancel" onClick={onCancel}>{t('cancel')}</Button>]}>
    <Form className='mb-8' onChange={handleChange} >
        <Form.Item label={t('team-title')} rules={[{ required: false, message: t('enter-team-title') }]}>
            <Input type="text" name='team_title' />
        </Form.Item>
        <Form.Item label={t('team-description')} rules={[{ required: false, message: t('enter-team-description') }]}>
            <Input type="text" name='team_description' />
        </Form.Item>
        <Form.Item label={t('team-image')} rules={[{ required: false, message: t('enter-your-image') }]}>
            <Upload onChange={handleUploadChange} >
                <Button className='flex items-center'>
                    <UploadOutlined />
                    {t('team-image')}
                </Button>
            </Upload>
         </Form.Item>
        <div className='flex justify-center'>
            <Button className='flex justify-center items-center text-lg w-28 mt-5' htmlType='submit'>
                <h4 className='p-1'>{t('changed-data')}</h4>
            </Button>
        </div>
    </Form>
  </Modal>
}

export default UpdateTeamModal
