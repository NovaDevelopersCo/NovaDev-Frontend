import { FC, useContext, useEffect, useState } from 'react'
import { Image, Upload } from 'antd'
import { NotificationContext } from '../../components/notification-provider/notification-provider'
import { TProfileData } from '../../utils/typesFromBackend'
import './profile.css'

interface IProfile {
  token: string
  pathRest: string
  t: (arg0: string) => string
}

const Profile: FC<IProfile> = ({ token, pathRest, t }) => {
  const { openNotification } = useContext(NotificationContext)
  const [data, setData] = useState<TProfileData[]>([])
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${pathRest}/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const res: TProfileData[] = await response.json()
        return res
      })
      .then((res) => setData(res))
      .catch((e: Error) => openNotification(e.message, 'topRight'))
  }, [pathRest, token, openNotification])

  const handleImageUpload = (info: any): void => {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        setProfileImage(e.target.result as string)
      }
    }
    reader.readAsDataURL(info.file.originFileObj)
  }

  return (
    <div className='flex flex-col items-center p-6'>
      <Upload
        accept='image/*'
        showUploadList={false}
        onChange={handleImageUpload}
      >
        <div className='image-box'>
          {profileImage ? (
            <Image
              src={profileImage}
              className='w-full h-full object-cover'
              preview={false}
            />
          ) : (
            <div className='image'>{t('upload-photo')}</div>
          )}
          <div className='add-image'>{t('upload-photo')}</div>
        </div>
      </Upload>

      <div className='w-full max-w-md'>
        <div className='item'>
          <h2 className='title'>{t('nickname')}</h2>
          <p>{data[0]?.name ?? 'N/A'}</p>
        </div>

        <div className='item'>
          <h2 className='title'>GitHub</h2>
          <p>{data[0]?.github ?? 'N/A'}</p>
        </div>

        <div className='item'>
          <h2 className='title'>{t('team')}</h2>
          <p>{data[0]?.team ?? 'N/A'}</p>
        </div>

        <div className='item'>
          <h2 className='title'>{t('project')}</h2>
          <p>{data[0]?.project ?? 'N/A'}</p>
        </div>
        <button className='button'>{t('change-information-about-me')}</button>
      </div>
    </div>
  )
}

export default Profile
