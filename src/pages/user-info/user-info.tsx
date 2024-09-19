import React, { FC, useState } from 'react'
import { Segmented } from 'antd'
import { SegmentedValue } from 'antd/es/segmented'
import EditUserInfo from '../../components/edit-user-info/edit-user-info'
import ViewUserInfo from '../../components/view-user-info/view-user-info'

interface IUserInfo {
    token: string
    pathRest: string
    t: (arg0: string) => string
}

const UserInfo: FC<IUserInfo> = ({ token, pathRest, t }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const viewLabel = t('view')
    const editLabel = t('edit')
    const handleChangeState = (value: SegmentedValue): void => {
        setIsEditing(value === editLabel)
    }
    return (
        <div>
            <div className='flex gap-6 justify-center'>
                <Segmented options={[viewLabel, editLabel]} value={isEditing ? editLabel : viewLabel} onChange={handleChangeState}/>
            </div>
            { isEditing ? (
                <EditUserInfo token={token} t={t} />
            ) : (
                <ViewUserInfo token={token} pathRest={pathRest} t={t} />
            )
        }
        </div>
    )
}

export default UserInfo
