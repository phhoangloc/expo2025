'use client'
import React, { useState, useEffect } from 'react'
import store from '../store'
import { setUser } from '../reducer/UserReduce'
// import { UserAuthen } from '@/api/UserAuthen'
// import "../../style/theme.css"
import { ApiCheckLogin } from '@/api/user'
import Image from 'next/image'
// import NoticeModal from '@/component/modal/notice.modal'
// import ImageModal from '@/component/modal/imageModal'
// import NoUser from '@/api/noUser'
// import Loading from '@/component/loading'
// import DecideModal from '@/component/modal/decide.modal'
type Props = {
    children: React.ReactNode
}

const Provider = ({ children }: Props) => {
    // const [currentUser, setCurrentUser] = useState<any>(store.getState().user)
    // const [currentTheme, setCurrentTheme] = useState<boolean>(store.getState().theme)
    const [currentRefresh, setCurrentRefresh] = useState<number>(store.getState().refresh)
    const update = () => {
        // store.subscribe(() => setCurrentUser(store.getState().user))
        // store.subscribe(() => setCurrentTheme(store.getState().theme))
        store.subscribe(() => setCurrentRefresh(store.getState().refresh))

    }
    useEffect(() => {
        update()
    })

    const [loading, setLoading] = useState<boolean>(true)
    const checkLogin = async () => {
        // NoUser.getItem({ genre: "category" })
        // NoUser.getItem({ genre: "pic" })
        // setLoading(true)
        const result = await ApiCheckLogin()
        // console.log(result)
        if (result.success) {
            store.dispatch(setUser(result.data))
            setTimeout(() => {
                setLoading(false)
            }, 3000)
        } else {
            // store.dispatch(setUser({}))
            setTimeout(() => {
                setLoading(false)
            }, 3000)
        }
    }

    useEffect(() => {
        checkLogin()
    }, [currentRefresh])

    return (
        loading ? <div className='w-full h-screen flex flex-col justify-center text-center'>
            <Image src={"/image/loading.jpg"} width={500} height={500} alt='loading' className='m-auto' />
        </div> :
            <>
                {/* <NoticeModal />
                <ImageModal />
                <DecideModal /> */}
                {children}
            </>
    )
}

export default Provider