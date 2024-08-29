import { Modal, Button } from 'antd'
import { FC, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as TeamsAPI from '../../utils/api/teams-api'
import { NotificationContext } from '../notification-provider/notification-provider'
import { TTeams } from '../../utils/typesFromBackend'

interface IDeleteUserModalProps {
    onCancel: () => void
    token: string
    teamId: number | null
}

const DeleteTeamModal: FC<IDeleteUserModalProps> = ({ onCancel, token, teamId }) => {
    const { t } = useTranslation()
    const { openNotification } = useContext(NotificationContext)
    const [, setTeams] = useState<TTeams[]>([])

    const handleDelete = (userId: number): void => {
        TeamsAPI
          .deleteTeam(token, userId)
          .then(() => {
              setTeams((prev: TTeams[]) =>
                prev.filter((team) => team.id !== teamId)
              )
              openNotification('Team deleted succesfully!', 'topRight')
            }
          )
          .catch((e: Error) => openNotification(e.message, 'topRight'))
    }

    return <Modal title="User delete Modal" open={!!teamId} onCancel={onCancel} footer={[<Button key="cancel" onClick={onCancel}>{t('cancel')}</Button>]}>
        <div className='flex flex-col justify-center items-center gap-4'>
            <h1 className='text-2xl font-semibold'>{t('team-delete-title')}</h1>
            <div>
                <h4 className='text-base'>{t('confirm-team-delete')}</h4>
            </div>
            <div>
                <Button danger onClick={() => {
                  if (teamId !== null) {
                    handleDelete(teamId)
                  }
                }}>
                  {t('delete')}
                </Button>
            </div>
        </div>
  </Modal>
}

export default DeleteTeamModal
