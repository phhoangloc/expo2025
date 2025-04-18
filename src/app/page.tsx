'use client'

import { ApiItem } from "@/api/client"
import { ApiUploadFile } from "@/api/user"
import { setRefresh } from "@/redux/reducer/RefreshReduce"
import { UserType } from "@/redux/reducer/UserReduce"
import store from "@/redux/store"
import { Button, UploadButton } from "@/tool/button/button"
import moment from "moment"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export type ImageType = {
  archive: string,
  name: string,
  host: {
    username: string
  }
  createdAt: Date
}
export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)
  const update = () => {
    store.subscribe(() => setCurrentUser(store.getState().user))

  }
  useEffect(() => {
    update()
  })
  const [_images, set_images] = useState<ImageType[]>([])
  const [_refresh, set_refresh] = useState<number>(0)
  const getImage = async (archive: string) => {
    const result = await ApiItem({ archive })

    if (result.success) {
      set_images(result.data)
    }
  }

  useEffect(() => {
    getImage("image")
  }, [_refresh])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFile = async (e: any) => {
    const files = e.target.files;
    const file: File | undefined = files ? files[0] : undefined
    const reader: FileReader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = async function () {
        const result = await ApiUploadFile({ position: currentUser.position, archive: "image", file })
        if (result.success) {
          setTimeout(() => {
            set_refresh(n => n + 1)
          }, 2000)
        }
      }
    }

  }

  const toPage = useRouter()

  return (
    <div className="bg-slate-200 flex flex-col gap-4 p-4">
      <div className="w-full max-w-md m-auto bg-white h-12 flex flex-col justify-center px-2 text-center">
        <p>{currentUser.id ? currentUser.username : "ログインされていません。"}
          <span className="mx-4 text-sm text-sub" onClick={() => { localStorage.clear(); store.dispatch(setRefresh()) }}>{currentUser.id ? "log out" : ""}</span>
        </p>

      </div>
      <div className="w-full max-w-md m-auto bg-white aspect-[2] flex flex-col justify-center">
        {
          currentUser.id ?
            <UploadButton name="写真を共有する" sx="bg-main text-center w-max m-auto rounded-lg shadow font-bold" onClick={(e) => getFile(e)} /> :
            <Button name="ログイン" sx="bg-main text-center w-max m-auto rounded-lg shadow font-bold px-10 cursor-pointer" onClick={() => toPage.push("/login")} />

        }
      </div>
      {
        _images.map((img, index) => <div className="w-full max-w-md m-auto bg-white min-h-92 shadow rounded-md flex flex-col justify-between" key={index}>
          <div className="p-2">
            <div className=" flex flex-col justify-center uppercase  font-semibold text-main text-lg">{img.host.username}</div>
            <div className=" flex flex-col justify-center uppercase   pb-2 text-sm opacity-50">{moment(img.createdAt).format("YYYY-MM-DD")}</div>
          </div>
          <div className="w-full aspect-[3/2] relative ">
            <Image src={process.env.ftp_url + img.name} fill alt="image" className="object-contain" />
          </div>
          <div className="h-12 flex">
            <div className="w-full text-center flex flex-col justify-center text-main font-bold">いいね！</div>
            <div className="h-1/2 w-1 bg-slate-200 m-auto"></div>
            <div className="w-full text-center flex flex-col justify-center text-main font-bold">コメント</div>
          </div>
        </div>

        )
      }
    </div >
  );
}
