import { Form, Input, Modal, Button } from 'antd'
import { FC, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as UserInfoAPI from '../../utils/api/user-info-api'
import { NotificationContext } from '../notification-provider/notification-provider'

interface IUpdateUserModalProps {
    onCancel: () => void
    token: string
    userId: number | null
}

const UpdateUserModal: FC<IUpdateUserModalProps> = ({ onCancel, token, userId }) => {
    const { t } = useTranslation()
    const { openNotification } = useContext(NotificationContext)
    const [userIdNumber, setUserIdNumber] = useState<number | null>(null)
    const [userRoleTitle, setUserRoleTitle] = useState<string | null>(null)
    const [, setUserProjectsId] = useState<number[]>([])
    const [userProjectsIdInput, setUserProjectsIdInput] = useState<number | null>(null)
    const [userTeamId, setUserTeamId] = useState<number | null>(null)

    const formRoleData = {
        newRole: userRoleTitle
    }

    const formTeamData = {
        teamId: userTeamId,
        userId: userIdNumber
    }

    const formProjectsData = {
        projectId: userProjectsIdInput,
        userId: userIdNumber
    }

    useEffect(() => {
        if (userId) {
            UserInfoAPI.fetchUserById(token, userId).then(res => {
                console.log(res)
                if (res) {
                    setUserIdNumber(res.id)
                    setUserRoleTitle(res.role.title)
                    const projectIds = res.projects.map(project => project.id)
                    setUserProjectsId(projectIds)
                    setUserProjectsIdInput(parseInt(projectIds.join(', ')))
                    setUserTeamId(res.team.id)
                }
            }).catch((e: Error) => openNotification(e.message, 'topRight'))
        }
    }, [token, userId])

    const onChangeUserRole = (e: React.FormEvent<HTMLFormElement>): void => {
        if (userId !== null) {
            UserInfoAPI
                .editUserRole(token, formRoleData, userId)
                .then(() => {
                    openNotification('The user data is saved!', 'topRight')
                })
                .catch((e) => openNotification(e, 'topRight'))
        }
    }

    const changeUserProjects = (): void => {
        if (userId !== null) {
            UserInfoAPI
                .editUserProject(token, formProjectsData)
                .then(() => {
                    openNotification('The user data is saved!', 'topRight')
                })
                .catch((e) => openNotification(e, 'topRight'))
        }
    }

    const deleteUserProjects = (): void => {
        if (userId !== null) {
            UserInfoAPI
                .deleteUserProject(token, formProjectsData)
                .then(() => {
                    openNotification('The user data is saved!', 'topRight')
                })
                .catch((e) => openNotification(e, 'topRight'))
        }
    }

    const changeUserTeam = (): void => {
        if (userId !== null) {
            UserInfoAPI
                .editUserTeam(token, formTeamData)
                .then(() => {
                    openNotification('The user data is saved!', 'topRight')
                })
                .catch((e) => openNotification(e, 'topRight'))
        }
    }

    const deleteUserTeam = (): void => {
        if (userId !== null) {
            UserInfoAPI
                .deleteUserTeam(token, formTeamData)
                .then(() => {
                    openNotification('The user data is saved!', 'topRight')
                })
                .catch((e) => openNotification(e, 'topRight'))
        }
    }

    const handleUserProjectsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value
        setUserProjectsIdInput(value ? Number(value) : null)
    }

    const handleUserTeamChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value
        setUserTeamId(value ? Number(value) : null)
    }

    return <Modal title="Update Form Modal" open={!!userId} onCancel={onCancel} footer={[<Button key="cancel" onClick={onCancel}>{t('cancel')}</Button>]}>
    <Form className='mb-8' onFinish={onChangeUserRole}>
        <Form.Item label={t('user-role-title')} rules={[{ required: false, message: t('enter-user-role-title') }]}>
            <Input type="text" value={userRoleTitle ?? ''} onChange={(e) => setUserRoleTitle(e.target.value)} />
        </Form.Item>
        <div className='flex justify-center'>
            <Button className='flex justify-center items-center text-lg w-28 mt-5' htmlType='submit'>
                <h4 className='p-1'>{t('changed-data')}</h4>
            </Button>
        </div>
    </Form>
    <Form className='mb-8'>
        <Form.Item label={t('user-project-id')} rules={[{ required: false, message: t('enter-user-project-id') }]}>
                <Input type='number' value={userProjectsIdInput ?? ''} onChange={handleUserProjectsChange} />
        </Form.Item>
        <div className='flex justify-center gap-12'>
            <Button className='flex justify-center items-center text-lg w-30 mt-5' type='primary' danger onClick={deleteUserProjects} >
                <h4 className='p-1'>{t('leave-project')}</h4>
            </Button>
            <Button className='flex justify-center items-center text-lg w-30 mt-5' onClick={changeUserProjects} >
                <h4 className='p-1'>{t('changed-project')}</h4>
            </Button>
        </div>
    </Form>
    <Form>
        <Form.Item label={t('user-team-id')} rules={[{ required: false, message: t('enter-user-team-id') }]}>
            <Input type="number" value={userTeamId ?? ''} onChange={handleUserTeamChange} />
        </Form.Item>
        <div className='flex justify-center gap-12'>
            <Button className='flex justify-center items-center text-lg w-30 mt-5' type='primary' danger onClick={deleteUserTeam} >
                <h4 className='p-2'>{t('leave-team')}</h4>
            </Button>
            <Button className='flex justify-center items-center text-lg w-30 mt-5' onClick={changeUserTeam} >
                <h4 className='p-2'>{t('changed-team')}</h4>
            </Button>
        </div>
    </Form>
  </Modal>
}

export default UpdateUserModal
