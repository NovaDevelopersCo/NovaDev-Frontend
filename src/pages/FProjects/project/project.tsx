import { FC, useState } from 'react'
import { Button, Modal, Segmented } from 'antd'
import clsx from 'clsx'
import ProjectUpdate from '../../../components/FProject/project-update/project-update'
import ProjectExecutor from '../../../components/FProject/project-executor/project-executor'
import ProjectClient from '../../../components/FProject/project-client/project-client'
import { useParams } from 'react-router-dom'

interface IEditorPage {
  pathRest: string
  token: string
  t: (key: string) => string
  dark: boolean
  style: object
}

const Project: FC<IEditorPage> = ({ token, pathRest, t, dark, style }) => {
  const { projectName } = useParams<{ projectName: string }>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<string>(t('project'))
  const handleModalClose = (): void => {
    setIsModalVisible(false)
  }

  const theme = clsx(dark ? 'black' : 'white')

  return (
    <>
      <Modal
        className={theme}
        title={t('alert')}
        open={isModalVisible}
        footer={
          <Button key='ok' type='primary' onClick={handleModalClose}>
            {t('close')}
          </Button>
        }
      >
        {t('field_must_not_empty')}
      </Modal>
      <h4
        className={theme}
        style={{
          marginBottom: '15px',
          marginTop: '0',
          fontSize: '1.75rem',
          fontWeight: '600',
          padding: '15px'
        }}
      >
        {projectName}
      </h4>
      <Segmented
        block
        options={[t('project'), t('executors'), t('clients')]}
        value={activeTab}
        onChange={(value) => setActiveTab(value.toString())}
      />
      <>
        {activeTab === t('project') && (
          <ProjectUpdate
            token={token}
            pathRest={pathRest}
            t={t}
            dark={dark}
            style={style}
          />
        )}
        {activeTab === t('executors') && (
          <ProjectExecutor
            token={token}
            pathRest={pathRest}
            t={t}
            style={style}
            dark={dark}
          />
        )}
        {activeTab === t('clients') && (
          <ProjectClient
            token={token}
            pathRest={pathRest}
            t={t}
            style={style}
            dark={dark}
          />
        )}
      </>
    </>
  )
}

export default Project
