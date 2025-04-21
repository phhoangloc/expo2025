'use client'
import { UserType } from '@/redux/reducer/UserReduce'
import store from '@/redux/store'
import LoginCard from '@/tool/card/loginCard'
import React, { useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode
}

const AdminLayout = ({ children }: Props) => {
    const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)
    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))


    }
    useEffect(() => {
        update()
    })
    return (
        currentUser.position === "admin" ?
            <div>{children}</div> :
            <div className='w-full h-screen flex flex-col justify-center bg-slate-200'>
                <LoginCard archive='admin' />
            </div>
    )
}

export default AdminLayout