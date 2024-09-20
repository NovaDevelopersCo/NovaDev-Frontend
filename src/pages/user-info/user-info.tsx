import React, { FC, useState } from 'react'
import { Segmented } from 'antd'
import { SegmentedValue } from 'antd/es/segmented'
import EditUserInfo from '../../components/edit-user-info/edit-user-info'
import ViewUserInfo from '../../components/view-user-info/view-user-info'
import clsx from 'clsx'

interface IUserInfo {
    token: string
    pathRest: string
    t: (arg0: string) => string
    dark: boolean
    style: Object
}

const UserInfo: FC<IUserInfo> = ({ token, pathRest, t, dark, style }) => {
    const theme = clsx(dark ? 'black' : 'white')
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const viewLabel = t('view')
    const editLabel = t('edit')
    const handleChangeState = (value: SegmentedValue): void => {
        setIsEditing(value === editLabel)
    }
    return (
        <div>
            <div className={`${theme} flex justify-center`} style={style}>
                <Segmented className={theme} style={style} options={[viewLabel, editLabel]} value={isEditing ? editLabel : viewLabel} onChange={handleChangeState}/>
            </div>
            { isEditing ? (
                <EditUserInfo token={token} t={t} dark={dark} style={style} />
            ) : (
                <ViewUserInfo token={token} pathRest={pathRest} t={t} />
            )
        }
        </div>
    )
}

export default UserInfo
