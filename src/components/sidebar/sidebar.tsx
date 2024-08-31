import { Dispatch, FC, SetStateAction } from 'react'
import { Menu, Button } from 'antd'
import {
  ReadOutlined,
  LogoutOutlined,
  SolutionOutlined,
  UserOutlined,
  ContactsOutlined,
  TeamOutlined,
  ApartmentOutlined,
  ProductOutlined
} from '@ant-design/icons'
import { useHistory } from 'react-router'

interface ISidebar {
  collapse: boolean
  style: Object
  pathRest: string
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
  t: (arg0: string) => string
}

const Sidebar: FC<ISidebar> = ({
  collapse,
  style,
  setIsLoggedIn,
  pathRest,
  t
}) => {
  const history = useHistory()

  const handleRolesClick = (): void => {
    history.push(`/${pathRest}/roles`)
  }
  const handleCustomersClick = (): void => {
    history.push(`/${pathRest}/customers`)
  }
  const handleUsersClick = (): void => {
    history.push(`/${pathRest}/users`)
  }
  const handleInstructionClick = (): void => {
    history.push(`/${pathRest}/blog`)
  }

  const handleUserInfoClick = (): void => {
    history.push(`/${pathRest}/user`)
  }
  const handleTeamsClick = (): void => {
    history.push(`/${pathRest}/teams`)
  }
  const handleProjectsClick = (): void => {
    history.push(`/${pathRest}/projects`)
  }

  const handleLogout = (): void => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    history.push(`/${pathRest}/autorization`)
  }

  return (
    <>
      <div
        className='h-8 m-4 text-xl text-center relative z-10 rounded'
        style={style}
      >
        {!collapse ? (
          <p>
            <a href='https://github.com/NovaDevelopersCo'>Bynarys</a>{' '}
            <span className='font-medium'>Dev</span>
          </p>
        ) : (
          <a className='font-medium' href='https://github.com/NovaDevelopersCo'>
            ByDEV
          </a>
        )}
      </div>
      <Menu
        theme='light'
        mode='inline'
        style={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          ...style
        }}
        defaultSelectedKeys={['1']}
      >
        <Menu.Item key='2' onClick={handleRolesClick}>
          <SolutionOutlined />
          <span>{t('roles')}</span>
        </Menu.Item>
        <Menu.Item key='3' onClick={handleUsersClick}>
          <TeamOutlined />
          <span>{t('users')}</span>
        </Menu.Item>
        <Menu.Item key='4' onClick={handleTeamsClick}>
          <ApartmentOutlined />
          <span>{t('teams')}</span>
        </Menu.Item>
        <Menu.Item key='5' onClick={handleProjectsClick}>
          <ProductOutlined />
          <span>{t('projects')}</span>
        </Menu.Item>
        <Menu.Item key='6' onClick={handleCustomersClick}>
          <ContactsOutlined />
          <span>{t('customers')}</span>
        </Menu.Item>
        <Menu.Item key='7' onClick={handleInstructionClick}>
          <ReadOutlined />
          <span>{t('manual')}</span>
        </Menu.Item>
        <Menu.Item key='8' onClick={handleUserInfoClick}>
          <UserOutlined />
          <span> {t('user-info')}</span>
        </Menu.Item>
      </Menu>
      <Button
        type='primary'
        onClick={handleLogout}
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '75%',
          backgroundColor: '#2d2d30',
          margin: '1rem auto'
        }}
      >
        <LogoutOutlined />
      </Button>
    </>
  )
}

export default Sidebar
