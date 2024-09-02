/* eslint-disable multiline-ternary */
import * as teamAPI from '../../../utils/api/teams-api'
import React, { FC, useContext } from 'react'
import { useLocation, useRouteMatch } from 'react-router-dom'
import { TTeams } from '../../../utils/typesFromBackend'
import { Button, Modal, Segmented } from 'antd'
import { NotificationContext } from '../../../components/notification-provider/notification-provider'
import TeamUpdate from '../../../components/FTeam/team-update/team-update'
import TeamUser from '../../../components/FTeam/team-user/team-user'

interface IEditorTeam {
  token: string
  t: (arg0: string) => string
  pathRest: string
  style: object
}

const Team: FC<IEditorTeam> = ({ token, pathRest, t, style }) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const restId = Object.keys(match?.params as string)[0]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [team, setTeam] = React.useState<TTeams>({} as TTeams)
  const [isTeam, setIsTeam] = React.useState(false)
  const [value, setValue] = React.useState<string | number>(t('team'))
  const [isModalVisible, setIsModalVisible] = React.useState(false)

  React.useEffect(() => {
    teamAPI
      .getTeamById(token, restId)
      .then((res: TTeams) => {
        setIsTeam(true)
        setTeam(res)
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
        {team?.title ? team.title : ''}
      </h4>
      <Segmented
        block
        options={[t('team'), t('users')]}
        value={value}
        onChange={setValue}
      />{' '}
      {isTeam ? (
        value === t('team') ? (
          <TeamUpdate token={token} pathRest={pathRest} t={t} style={style} />
        ) : (
          ''
        )
      ) : (
        ''
      )}
      {isTeam ? (
        value === t('users') ? (
          <TeamUser
            token={token}
            pathRest={pathRest}
            t={t}
            style={style}
          ></TeamUser>
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
          footer={[
            <Button key='ok' type='primary' onClick={handleModalClose}>
              {t('close')}
            </Button>
          ]}
        >
          {t('field_must_not_empty')}
        </Modal>
      }
    </>
  )
}
export default Team
