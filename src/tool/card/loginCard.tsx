'use client'
import React, { useState } from 'react'
import { Input } from '../input/input';
import Link from 'next/link';
import { Button } from '..//button/button';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { ApiLogin } from '@/api/client';
import { useRouter } from 'next/navigation';
import { setRefresh } from '@/redux/reducer/RefreshReduce';
import store from '@/redux/store';

// import { ApiLogin } from '@/api/client';
// import store from '@/redux/store';
// import { setRefresh } from '@/redux/reducer/RefreshReduce';
// import { setNotice } from '@/redux/reducer/noticeReducer';


const LoginCard = () => {

    const [_username, set_username] = useState<string>("")
    const [_password, set_password] = useState<string>("")

    const [showPassword, setShowPassword] = useState<boolean>(false)

    const toPage = useRouter()
    const login = async (data: { username: string, password: string }) => {
        const result = await ApiLogin(data)
        if (result.success) {
            localStorage.token = "bearer " + result.result
            store.dispatch(setRefresh())
            toPage.push("/")
        }
    }


    return (
        <div className='bg-white m-auto w-11/12 max-w-[440px] text-center p-10 shadow-md grid gap-1 rounded '>
            <div className="h-12 flex flex-col justify-center text-2xl font-bold text-main">
                <h2>ログイン</h2>
            </div>
            <Input name="ユーザー" onChange={(v) => set_username(v)} value={_username} />
            <Input name="パスワード" type={showPassword ? 'text' : 'password'} onChange={(v) => set_password(v)} value={_password}
                icon1={showPassword ?
                    <RemoveRedEyeIcon className='w-6 h-6 my-auto mx-1 cursor-pointer hover:text-colormain' onClick={() => setShowPassword(false)} /> :
                    <VisibilityOffIcon className='w-6 h-6 my-auto mx-1 cursor-pointer hover:text-colormain' onClick={() => setShowPassword(true)} />} />
            <div className="h-12">
            </div>
            <div className="h-12 flex flex-col justify-center">
                <Link className='opacity-50 hover:opacity-100 hover:text-colormain' href={"signup"}>登録</Link>
            </div>
            <div className="h-12">
            </div>
            <Button name="ログイン" onClick={() => login({ username: _username, password: _password })} sx='!w-2/3 m-auto bg-main' />
        </div>
    )
}

export default LoginCard

