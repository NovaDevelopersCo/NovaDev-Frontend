import React, { FC, useState } from 'react'
import { Segmented } from 'antd'
import { SegmentedValue } from 'antd/es/segmented'
import EditUserInfo from '../../components/edit-user-info/edit-user-info'
import ViewUserInfo from '../../components/view-user-info/view-user-info'

interface IUserInfo {
    token: string
    t: (arg0: string) => string
}

const UserInfo: FC<IUserInfo> = ({ token, t }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const handleChangeState = (value: SegmentedValue): void => {
        setIsEditing(value === 'Edit')
    }
    return (
        <div>
            <div className='flex gap-6 justify-center'>
                <Segmented options={['View', 'Edit']} value={isEditing ? 'Edit' : 'View'} onChange={handleChangeState}/>
            </div>
            { isEditing ? (
                <EditUserInfo token={token} t={t} />
            ) : (
                <ViewUserInfo token={token} t={t} />
            )
        }
        </div>
    )
}

export default UserInfo
