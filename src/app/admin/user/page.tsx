'use client'
import React from 'react'
import store from '@/redux/store'
import { useState, useEffect } from 'react'
import { UserType } from '@/redux/reducer/UserReduce'
import { ApiCreateItem, ApiItemUser } from '@/api/user'
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/tool/input/input'
import { DividerSelect } from '@/tool/divider/divider'
import { Button } from '@/tool/button/button'
type useTypeInPage = {
    id: number;
    username: string;
    password: string;
    email: string;
    position: string;
}
const Page = () => {
    const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)
    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))


    }
    useEffect(() => {
        update()
    })

    const [_users, set_users] = useState<useTypeInPage[]>([])
    const getImage = async (position: string, archive: string) => {
        const result = await ApiItemUser({ position, archive })

        if (result.success) {
            set_users(result.data)
        }
    }

    useEffect(() => {
        getImage(currentUser.position, "user")
    }, [currentUser.position])
    console.log(_users)
    const useSearch = useSearchParams()
    const post = useSearch?.get("account") || ""

    const toPage = useRouter()

    const [_username, set_username] = useState<string>("")
    const [_password, set_password] = useState<string>("")
    const [_position, set_position] = useState<string>("viewer")
    const body = {
        username: _username,
        password: _password,
        email: "@gmail.com",
        position: _position,
    }
    const createAccount = async (body: {
        username: string;
        password: string;
        email: string;
        position: string;
    }) => {
        console.log(body)
        const result = await ApiCreateItem({ position: currentUser.position, archive: "user" }, body)
        if (result.success) {
            toPage.push("#")
        }
    }
    return (
        <div className="w-full  bg-slate-200">
            {post === "news" ?
                <div className="fixed w-full h-screen backdrop-brightness-50 top-0 left-0 z-[2] backdrop-blur-sm flex flex-col justify-center">
                    <div className="w-11/12 max-w-sm m-auto bg-white rounded p-2">
                        <div className='h-12 flex flex-col justify-center border-b font-bold text-main'>新規アカウント</div>
                        <div className="h-6"></div>
                        <Input onChange={(e) => set_username(e)} name="ユーザ" value={_username} />
                        <Input type='password' onChange={(e) => set_password(e)} name="パスワード" value={_password} />
                        <DividerSelect name="position" data={[{ name: "viewer" }, { name: "user" }, { name: "admin" }]} valueReturn={(v) => set_position(v.name)} />
                        <Button onClick={() => createAccount(body)} name="作成" sx="bg-main block mx-auto my-4 shadow" />
                    </div>
                </div> : null}
            <div className='fixed'></div>
            <div className='flex flex-col gap-1 max-w-2xl m-auto min-h-screen p-1'>
                <div className='flex ga-1 bg-white w-full p-2 cursor-pointer' onClick={() => toPage.push("?account=news")}>
                    <AddIcon className='!w-12 !h-12 p-2 text-main' />
                    <div className="h-12 font-bold text-main flex flex-col justify-center">
                        新規アカウント
                    </div>

                </div>
                {_users.map((user, index) =>
                    <div key={index} className='flex ga-1 bg-white w-full p-2 cursor-pointer'>
                        <PersonIcon className='!w-12 !h-12 p-2' />
                        <div className=' w-full pl-2'>
                            <div className='font-bold'>
                                {user.username}
                            </div>
                            <div className='text-sm'>
                                {user.position}
                            </div>
                        </div>
                    </div>)}
            </div>
        </div>)
}

export default Page