/* eslint-disable @typescript-eslint/consistent-type-assertions */
import React, { useState, useEffect, FC } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import fullscreenIcon from '../../assets/images/fullscreen.svg'
import Autorization from '../../pages/autorization/autorization'
import NotFound from '../../pages/not-found/not-found'
import Customers from '../../pages/customers/customers'
import AllUsers from '../../pages/users/users'
import { ECountry } from '../../utils/typesFromBackend'
import { useTranslation } from 'react-i18next'
import { NotificationProvider } from '../notification-provider/notification-provider'
import i18n from '../i18n/i18n'
import ChoiseLanguage from '../choise-language/choise-language'
import ProtectedRoute from '../protected-route/protected-route'
import Sidebar from '../sidebar/sidebar'
import Users from '../../pages/tasks/tasks'
import Admins from '../../pages/categories/categories'
import AddAdmin from '../../pages/add-category/add-category'
import Admin from '../../pages/category/category'
import Dark from '../dark/dark'
import { Footer } from 'antd/es/layout/layout'
import { useTelegram } from '../../services/hooks/use-telegram'
import UserInfo from '../../pages/user-info/user-info'
import AdvicesTips from '../../pages/advices-tips/advices-tips'
import AddPost from '../../pages/add-post/add-post'
import AddCustomer from '../../pages/add-customer/add-customer'
import Roles from '../../pages/FRoles/roles/roles'
import Role from '../../pages/FRoles/role/role'
import AddRole from '../../pages/FRoles/add-role/add-role'
import Profile from '../../pages/profile/profile'

const { Header, Sider, Content } = Layout

interface IMain {
  token: string
  pathRest: string
  setToken: (token: any) => void
}

const Main: FC<IMain> = ({ token, pathRest, setToken }) => {
  // change to TRest
  const { tg } = useTelegram()
  const [language, setLanguage] = useState<ECountry>(
    (localStorage.getItem('language') as ECountry) ?? ECountry.RU
  )
  const [dark, setDark] = useState<boolean>(
    localStorage.getItem('dark') === 'true'
  )
  const [width, setWidth] = useState<boolean>(false)
  const { t } = useTranslation()

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars
  const changeLanguage = (lng: ECountry) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    i18n.changeLanguage(lng)
    setLanguage(lng)
    localStorage.removeItem('formData')
  }
  const style = {
    background: dark ? '#0A0E14' : '#fff',
    color: dark ? '#fff' : '#0A0E14'
  }
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    i18n.changeLanguage(
      tg?.initDataUnsafe?.user?.language_code
        ? tg.initDataUnsafe.user.language_code
        : language
    )
  }, [])

  useEffect(() => {
    if (dark) {
      document.body.style.backgroundColor = '#0A0E14'
      document.body.style.color = '#fff'
    } else {
      document.body.style.backgroundColor = '#fff'
      document.body.style.color = '#0A0E14'
    }
  }, [dark])

  const [collapse, setCollapse] = useState(false)
  let flag = false
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', function resizeHandler() {
      if (window.innerWidth < 768 && !flag) {
        setCollapse(true)
        setWidth(true)
        flag = true
      } else if (window.innerWidth >= 768 && flag) {
        setCollapse(false)
        setWidth(false)
        flag = false
      }
    })
  }
  useEffect(() => {
    setDark(localStorage.getItem('dark') === 'true')
    window.innerWidth <= 768 ? setCollapse(true) : setCollapse(false)
    window.innerWidth <= 768 ? setWidth(true) : setWidth(false)
  }, [])

  const handleToggle = (event: any): void => {
    event.preventDefault()
    if (!width) {
      setCollapse(!collapse)
      localStorage.setItem('collapse', JSON.stringify(collapse))
    }
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    window.innerWidth <= 760 ? setCollapse(true) : setCollapse(false)
  }, [])

  const handleClickFullScreen = (): void => {
    if (document.fullscreenElement != null) {
      void document.exitFullscreen()
    } else {
      void document.body.requestFullscreen()
    }
  }

  return (
    <NotificationProvider>
      <Router>
        <Layout style={style}>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapse}
            style={style}
            width={'17rem'}
          >
            <Sidebar
              style={style}
              collapse={collapse}
              setIsLoggedIn={setIsLoggedIn}
              pathRest={pathRest}
              t={t}
            />
          </Sider>
          <Layout
            style={{
              ...style,
              paddingLeft: '30px',
              paddingRight: '30px'
            }}
          >
            <Header
              className='siteLayoutBackground'
              style={{
                ...style,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {React.createElement(
                collapse ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: 'trigger',
                  onClick: handleToggle,
                  style: style
                }
              )}
              <div style={{ display: 'flex', gap: '30px' }}>
                <Dark dark={dark} style={style} setDark={setDark} />
                <ChoiseLanguage
                  dark={dark}
                  style={style}
                  t={t}
                  changeLanguage={changeLanguage}
                />
              </div>
              <div
                className='fullscreen-btn'
                onClick={handleClickFullScreen}
                title='На весь экран'
                style={{ cursor: 'pointer', ...style }}
              >
                <img src={fullscreenIcon} alt='На весь экран' />
              </div>
            </Header>
            <Content
              style={{
                ...style,
                padding: 24,
                minHeight: 'calc(100vh - 114px)'
              }}
            >
              <Switch>
                <Route path={`/:${pathRest}/autorization`}>
                  <Autorization
                    setIsLoggedIn={setIsLoggedIn}
                    t={t}
                    setToken={setToken}
                    style={style}
                    dark={dark}
                  />
                </Route>
                <ProtectedRoute
                  path={`/:${pathRest}/categories`}
                  exact
                  isLoggedIn={isLoggedIn}
                  pathRest={pathRest}
                >
                  <Admins
                    dark={dark}
                    style={style}
                    token={token}
                    pathRest={pathRest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/category/:categoryId`}
                  exact
                  isLoggedIn={isLoggedIn}
                  pathRest={pathRest}
                >
                  <Admin token={token} pathRest={pathRest} t={t} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/add/category`}
                  exact
                  isLoggedIn={isLoggedIn}
                  pathRest={pathRest}
                >
                  <AddAdmin
                    token={token}
                    pathRest={pathRest}
                    t={t}
                    dark={dark}
                    style={style}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/roles`}
                  exact
                  isLoggedIn={isLoggedIn}
                  pathRest={pathRest}
                >
                  <Roles
                    dark={dark}
                    token={token}
                    pathRest={pathRest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/role/:roleId`}
                  exact
                  isLoggedIn={isLoggedIn}
                  pathRest={pathRest}
                >
                  <Role token={token} pathRest={pathRest} t={t} style={style} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/add/role`}
                  exact
                  isLoggedIn={isLoggedIn}
                  pathRest={pathRest}
                >
                  <AddRole
                    token={token}
                    pathRest={pathRest}
                    t={t}
                    dark={dark}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/${pathRest}/customers`}
                  exact
                  isLoggedIn={isLoggedIn}
                  pathRest={pathRest}
                >
                  <Customers
                    token={token}
                    pathRest={pathRest}
                    t={t}
                    dark={dark}
                    style={style}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/add/customer`}
                  exact
                  isLoggedIn={isLoggedIn}
                  pathRest={pathRest}
                >
                  <AddCustomer
                    token={token}
                    pathRest={pathRest}
                    t={t}
                    dark={dark}
                    style={style}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/${pathRest}/users`}
                  exact
                  isLoggedIn={isLoggedIn}
                  pathRest={pathRest}
                >
                  <AllUsers token={token} pathRest={pathRest} t={t} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/user`}
                  exact
                  isLoggedIn={isLoggedIn}
                  pathRest={pathRest}
                >
                  <Users
                    dark={dark}
                    style={style}
                    token={token}
                    pathRest={pathRest}
                    t={t}
                    language={language}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/blog`}
                  exact
                  isLoggedIn={isLoggedIn}
                  pathRest={pathRest}
                >
                  <AdvicesTips
                    token={token}
                    pathRest={pathRest}
                    t={t}
                    dark={dark}
                    style={style}
                  />
                </ProtectedRoute>

                <ProtectedRoute
                  path={`/:${pathRest}/add/advice`}
                  exact
                  isLoggedIn={isLoggedIn}
                  pathRest={pathRest}
                >
                  <AddPost
                    token={token}
                    pathRest={pathRest}
                    t={t}
                    dark={dark}
                    style={style}
                  />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/user`}
                  exact
                  isLoggedIn={isLoggedIn}
                  pathRest={pathRest}
                >
                  <UserInfo token={token} t={t} language={language} />
                </ProtectedRoute>
                <ProtectedRoute
                  path={`/:${pathRest}/profile`}
                  exact
                  isLoggedIn={isLoggedIn}
                  pathRest={pathRest}
                >
                  <Profile token={token} pathRest={pathRest} t={t} />
                </ProtectedRoute>
                <Route path='*'>
                  <NotFound t={t} />
                </Route>
              </Switch>
            </Content>
          </Layout>
        </Layout>
        <Footer style={style}>
          <div className='border-t flex justify-center text-center'>
            Copyright &copy; {new Date().getFullYear()} Nova Developers. All
            rights reserved.
          </div>
        </Footer>
      </Router>
    </NotificationProvider>
  )
}

export default Main
