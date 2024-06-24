import { Button } from 'antd'
import React, { FC } from 'react'
import { SunFilled, MoonOutlined } from '@ant-design/icons'
interface IDark {
  style: Object
  dark: boolean
  setDark: (lng: boolean) => void
}
const Dark: FC<IDark> = ({ style, setDark, dark }) => {
  React.useEffect(() => {
    localStorage.setItem('dark', JSON.stringify(dark))
  }, [dark])
  return (
    <>
      <Button
        style={style}
        className='flex justify-center items-center'
        icon={!dark ? <MoonOutlined /> : <SunFilled />}
        onClick={() => setDark(!dark)}
      />
    </>
  )
}
export default Dark
