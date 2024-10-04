import React, { FC, useContext } from 'react'
import { Button, Modal, Segmented } from 'antd'
import ProjectUpdate from '../../../components/FProject/project-update/project-update'
import ProjectExecutor from '../../../components/FProject/project-executor/project-executor'
import ProjectClient from '../../../components/FProject/project-client/project-client'
import clsx from 'clsx'
import { TProject } from '../../../utils/typesFromBackend'
import * as projectAPI from '../../../utils/api/project-api'
import { useLocation, useRouteMatch } from 'react-router-dom'
import { NotificationContext } from '../../../components/notification-provider/notification-provider'

interface IEditorPage {
  pathRest: string
  token: string
  t: (key: string) => string
  dark: boolean
  style: object
}

const Project: FC<IEditorPage> = ({ token, pathRest, t, dark, style }) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const restId = Object.keys(match?.params as string)[0]
  const [project, setProject] = React.useState<TProject>({} as TProject)
  const [isProject, setIsProject] = React.useState(false)
  const [value, setValue] = React.useState<string | number>(t('project'))
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const theme = clsx(dark ? 'black' : 'white')
  React.useEffect(() => {
    projectAPI
      .getProjectById(token, restId)
      .then((res: TProject) => {
        setIsProject(true)
        setProject(res)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

  const handleModalClose = (): void => {
    setIsModalVisible(false)
  }
  return (
    <>
      <h4
        style={{
          marginBottom: '15px',
          marginTop: '0',
          fontSize: '1.75rem',
          fontWeight: '600',
          padding: '15px'
        }}
      >
        {project?.title ? project.title : ''}
      </h4>
      <Segmented
        block
        options={[t('project'), t('executors'), t('clients')]}
        value={value}
        className={theme}
        onChange={setValue}
      />{' '}
      {isProject ? (
        value === t('project') ? (
          <ProjectUpdate
            token={token}
            pathRest={pathRest}
            t={t}
            style={style}
            theme={theme}
          />
        ) : (
          ''
        )
      ) : (
        ''
      )}
      {isProject ? (
        value === t('executors') ? (
          <ProjectExecutor
            token={token}
            pathRest={pathRest}
            t={t}
            style={style}
            theme={theme}
          />
        ) : (
          ''
        )
      ) : (
        ''
      )}
      {isProject ? (
        value === t('clients') ? (
          <ProjectClient
            token={token}
            pathRest={pathRest}
            t={t}
            style={style}
            theme={theme}
          />
        ) : (
          ''
        )
      ) : (
        ''
      )}
      {
        <Modal
          title={t('alert')}
          open={isModalVisible}
          closable={false}
          footer={
            <Button key='ok' type='primary' onClick={handleModalClose}>
              {t('close')}
            </Button>
          }
        >
          {t('field_must_not_empty')}
        </Modal>
      }
    </>
  )
}

export default Project
