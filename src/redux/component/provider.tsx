'use client'
import React, { useState, useEffect } from 'react'
import store from '../store'
import { setUser } from '../reducer/UserReduce'

import { ApiCheckLogin } from '@/api/user'
import Image from 'next/image'

type Props = {
    children: React.ReactNode
}

const Provider = ({ children }: Props) => {

    const [currentRefresh, setCurrentRefresh] = useState<number>(store.getState().refresh)
    const update = () => {

        store.subscribe(() => setCurrentRefresh(store.getState().refresh))

    }
    useEffect(() => {
        update()
    })

    const [loading, setLoading] = useState<boolean>(true)
    const checkLogin = async () => {
        const result = await ApiCheckLogin()
        if (result.success) {
            store.dispatch(setUser(result.data))
            setTimeout(() => {
                setLoading(false)
            }, 5000)
        } else {
            setTimeout(() => {
                setLoading(false)
            }, 5000)
        }
    }

    useEffect(() => {
        checkLogin()
    }, [currentRefresh])

    return (
        loading ?
            <div className='w-full h-screen flex flex-col justify-center text-center'>
                <div className='w-full max-w-sm text-left m-auto'>
                    <div className='font-bold text-lg mb-2 '>EXPO 2025 大阪ウィーク～秋～</div>
                    <div className='font-bold text-xl'>「OSAKAから地域共生の未来をつくる」プロジェクト</div>
                    <div className="h-6"></div>
                    <div className=' text-2xl font-bold text-sky-700'>大阪府民生委員・児童委員の皆さんでつくる作品画像<br></br>投稿サイト</div>

                    <div className='absolute bottom-0 left-0 w-full'>
                        <Image src={"/image/logo.png"} width={500} height={500} className='w-72 m-auto' alt='logo' />
                    </div>
                </div>
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