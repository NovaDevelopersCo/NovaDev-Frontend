import { Form, Input, Modal, Button, Select } from 'antd'
import { FC, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as UserInfoAPI from '../../utils/api/user-info-api'
import * as ProjectsInfoAPI from '../../utils/api/projects-api'
import { NotificationContext } from '../notification-provider/notification-provider'
import { TUserProjects } from '../../utils/typesFromBackend'

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
    // const [allProjects, setAllProjects] = useState<TUserProjects[] | []>([])
    const [allProjects, setAllProjects] = useState<TUserProjects[]>([])
    const [, setProjects] = useState<TUserProjects[]>([])
    const [selectedProject, setSelectedProject] = useState<string[]>([])
    const [userTeamId, setUserTeamId] = useState<number | null>(null)

    const formRoleData = {
        newRole: userRoleTitle
    }

    const formTeamData = {
        teamId: userTeamId,
        userId: userIdNumber
    }

    const formProjectsData = {
        // projectId: selectedProjectId,
        projectId: selectedProject,
        userId: userIdNumber
    }

    useEffect(() => {
        return (
            setUserIdNumber(null),
            setUserRoleTitle(null),
            setUserTeamId(null)
        )
    }, [userId])

    useEffect(() => {
        if (userId) {
            UserInfoAPI.fetchUserById(token, userId).then(res => {
                if (res) {
                    setUserIdNumber(res.id)
                    setUserRoleTitle(res.role.title)
                    setProjects(res.projects)
                    setSelectedProject(res.projects.map(project => project.title))
                    setUserTeamId(res.team.id)
                }
            }).catch((e: Error) => openNotification(e.message, 'topRight'))
        }
    }, [token, userId])

    useEffect(() => {
        if (token) {
            ProjectsInfoAPI.getAllProjects(token).then(res => {
                if (res) {
                    setAllProjects(res)
                }
            }).catch((e: Error) => openNotification(e.message, 'topRight'))
        }
    }, [token])

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

    const handleUserProjectsChange = (value: string[]): void => {
        setSelectedProject(value)
        console.log('Change state:', selectedProject)
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
            <Select id='projects-select-1' mode='multiple' value={selectedProject} onChange={handleUserProjectsChange} >
                {allProjects.length > 0 ? (
                    allProjects.map((project) => (
                        <Select.Option key={project.id} value={project.id}>
                            {project.title}
                        </Select.Option>
                    ))
                ) : (
                    <Select.Option disabled value={0}>
                        Not found
                    </Select.Option>
                )
                }
            </Select>
        </Form.Item>
        <div className='flex justify-center gap-12'>
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
