'use client'

import React, { useEffect, useState } from 'react'
import { UserType } from '@/redux/reducer/UserReduce'
import store from '@/redux/store'
import LoginCard from '@/tool/card/loginCard'

import { ApiItemUser } from '@/api/user'
import Image from 'next/image'
import FileDownloadIcon from '@mui/icons-material/FileDownload';

type ImageType = {
    name: string
}
const Page = () => {
    const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)
    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))


    }
    useEffect(() => {
        update()
    })

    const [_images, set_images] = useState<ImageType[]>([])
    const getImage = async (position: string, archive: string) => {
        const result = await ApiItemUser({ position, archive })

        if (result.success) {
            set_images(result.data)
        }
    }

    useEffect(() => {
        getImage(currentUser.position, "image")
    }, [currentUser.position])

    const [_index, set_index] = useState<number>(-1)
    const [_url, set_url] = useState<string>("")
    const [_selected, set_selected] = useState<string[]>([])
    const [_key, set_key] = useState<number>(0)
    const [_isSelectAll, set_isSelectAll] = useState<boolean>(false)

    useEffect(() => {
        if (_index > -1) {
            const newArray = _selected
            newArray[_index] = newArray[_index] ? "" : _url
            set_isSelectAll(false)
            set_selected(newArray)
            set_key(k => k + 1)
            set_index(- 1)
            set_url("")
        }
    }, [_index, _selected, _url])

    const downloadAsZip = async () => {
        const response = await fetch("/api/downloadall", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(_selected.filter(s => s !== null)),
        });
        console.log(response)
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "expo2025.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    console.log(currentUser)
    return (
        currentUser.position !== "admin" ?

            <div className='w-full h-screen flex flex-col justify-center bg-slate-200'><LoginCard /></div>
            :
            <div className="w-full  bg-slate-200">
                <div className='flex flex-col gap-1 max-w-2xl m-auto min-h-screen p-1'>
                    <div className='flex ga-1 bg-white w-full h-12 justify-between'>
                        <div className="h-12 aspect-square flex flex-col justify-center">
                            <input
                                type="checkbox"
                                className='w-4 h-4 m-auto'
                                checked={_isSelectAll}
                                onChange={() => {
                                    set_selected(_isSelectAll ? [] : _images.map(img => process.env.ftp_url + img.name))
                                    set_isSelectAll(!_isSelectAll)
                                }}
                            />
                        </div>
                        {_selected.length > 1 ? <div className='flex flex-col justify-center'>
                            <FileDownloadIcon className='!w-12 !h-12 p-3 opacity-50 text-main hover:opacity-100 cursor-pointer' onClick={() => downloadAsZip()} />
                        </div> : null}
                    </div>
                    {_images.map((img, index) =>
                        <div key={index} className='flex ga-1 bg-white w-full'>

                            <div className="h-12 aspect-square flex flex-col justify-center">
                                <input
                                    key={_key + 10}
                                    type="checkbox"
                                    className='w-4 h-4 m-auto'
                                    checked={_selected.includes(process.env.ftp_url + img.name)}
                                    onChange={() => {
                                        set_index(index); set_url(process.env.ftp_url + img.name);
                                    }}
                                />
                            </div>
                            <div className='h-11 aspect-square relative my-auto'>
                                <Image src={process.env.ftp_url + img.name} fill className='object-contain' alt='image' />
                            </div>

                            <div className='flex justify-between w-full pl-2'>
                                <div className='flex flex-col justify-center text-sm opacity-75'>
                                    {img.name}
                                </div>
                                <div className='flex flex-col justify-center'>
                                    <a href={"/api/download?filename=" + img.name} download><FileDownloadIcon className='!w-12 !h-12 p-3 opacity-50 text-main hover:opacity-100 cursor-pointer' /></a>
                                </div>
                            </div>
                        </div>)}
                </div>
            </div>
    )
}

export default Page