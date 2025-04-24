'use client'
import { Suspense } from "react"
import { ApiCreateItem, ApiItemUser, ApiUploadFile } from "@/api/user"
import { UserType } from "@/redux/reducer/UserReduce"
import store from "@/redux/store"
import LoginCard from "@/tool/card/loginCard"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import { useSearchParams } from "next/navigation"
import { Button, UploadButton } from "@/tool/button/button"
import { TextArea } from "@/tool/input/textarea"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import LockResetIcon from '@mui/icons-material/LockReset';
import { IconDivider } from "@/tool/icon/icon"
import { setRefresh } from "@/redux/reducer/RefreshReduce"
import CloseIcon from '@mui/icons-material/Close';
export type PostType = {
  archive: string,
  content: string,
  host: {
    username: string
  }
  image: {
    name: string
  }
  createdAt: Date
}
const Modal = ({ set_refresh }: { set_refresh: () => void }) => {
  const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)
  const update = () => {
    store.subscribe(() => setCurrentUser(store.getState().user))

  }
  useEffect(() => {
    update()
  })
  const useSearch = useSearchParams()
  const post = useSearch?.get("post") || ""

  const [_newContent, set_newContent] = useState<string>("")
  const [_isuploading, set_isuploading] = useState<boolean>(false)


  const [_imageId, set_imageId] = useState<number>(0)
  const [_imagePreview, set_imagePreview] = useState<string>("")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFile = async (e: any) => {
    set_isuploading(true)
    const files = e.target.files;
    // files.map((file: File | undefined) => {
    const file: File | undefined = files ? files[0] : undefined
    const reader: FileReader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = async function () {
        const result = await ApiUploadFile({ position: currentUser.position, archive: "image", file })
        if (result.success) {
          set_isuploading(false)
          set_imageId(result.data.id)
          set_imagePreview(result.data.name)
        }
      }

    }
  }

  const toPage = useRouter()
  const body = {
    content: _newContent,
    hostId: currentUser.id,
    imageId: _imageId,

  }

  const createPost = async (body: {
    content: string;
    hostId: number;
    imageId: number;
  }) => {
    const result = await ApiCreateItem({ position: currentUser.position, archive: "post" }, body)
    if (result.success) {
      toPage.push("/")
      set_imagePreview("")
      set_refresh()
    }
  }
  return (
    post === "news" ?
      <div className="fixed w-full h-screen backdrop-brightness-50 top-0 left-0 z-[2] backdrop-blur-sm flex flex-col justify-center">
        <div className="w-11/12 max-w-md m-auto bg-white rounded p-2">
          <div className="w-full h-60 relative">
            <CloseIcon className="!w-12 !h-12 p-2 absolute right-0 top-0 bg-main text-white rounded cursor-pointer" onClick={() => toPage.push("/")} />
            {_imagePreview ? <Image src={process.env.ftp_url + _imagePreview} fill className="object-contain" alt="preview" /> : null}
          </div>
          <TextArea onChange={(v) => set_newContent(v)} value={""} name="写真を投稿する" sx="h-12" />
          <div className="h-12 flex flex-col justify-center">{currentUser.username}</div>
          <div className="flex justify-between">
            {_isuploading ? <LockResetIcon className="!w-12 !h-12 p-2 text-main rounded" /> : <UploadButton name={<AddPhotoAlternateIcon className="!w-6 !h-6 " />} sx="bg-main w-max  rounded-lg shadow cursor-pointer " onClick={(e) => getFile(e)} />}
            <Button name="投稿" sx="bg-main text-center w-max  rounded-lg shadow font-bold px-10 cursor-pointer " onClick={() => createPost(body)} disable={_newContent == "" || _imageId == 0} />
          </div>
        </div>
      </div> : null
  )
}
export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)
  const update = () => {
    store.subscribe(() => setCurrentUser(store.getState().user))

  }
  useEffect(() => {
    update()
  })
  const [_posts, set_posts] = useState<PostType[]>([])
  const [_refresh, set_refresh] = useState<number>(0)
  const getImage = async (position: string, archive: string) => {
    const result = await ApiItemUser({ position, archive })

    if (result.success) {
      set_posts(result.data)
    }
  }

  useEffect(() => {
    getImage(currentUser.position, "post")
  }, [_refresh, currentUser.position])

  const toPage = useRouter()
  return (
    currentUser.id ?
      <Suspense>
        {_posts.length ?
          <div className="bg-slate-200 flex flex-col gap-4 p-4 min-h-screen ">
            <Modal set_refresh={() => set_refresh(n => n + 1)} />

            <div className="w-full max-w-md flex gap-2 m-auto">

              <div className="w-12 h-max bg-white sticky top-4 rounded z-1">
                {currentUser.position === "viewer" ? null : <AddIcon className="!w-12 !h-12 p-2 text-main cursor-pointer" onClick={() => toPage.push("?post=news")} />}
                <div className="w-full h-[2px] bg-slate-200"></div>
                <IconDivider icon={<PersonIcon className="!w-full !h-full  text-main cursor-pointer" />} data={[{ name: "ログアウト", func: () => { localStorage.clear(); store.dispatch(setRefresh()); window.location.reload() } }]} />
              </div>
              <div className="w-full h-max flex flex-col gap-4">
                {
                  _posts.map((post, index) =>
                    <div className="w-full  m-auto bg-white min-h-92 shadow rounded-md flex flex-col justify-between overflow-hidden " key={index}>
                      <div className="w-full aspect-[3/2] relative border-b border-slate-200 ">
                        <Image src={process.env.ftp_url + post.image.name} fill alt="image" className="object-contain" />
                      </div>
                      <div className="p-2">
                        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
                        <div>{post.host.username}</div>
                      </div>
                      <div className="h-6"></div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
          : <div className='w-full h-screen flex flex-col justify-center text-center'>
            <div className='w-full max-w-sm text-left m-auto'>
              <div className='font-bold text-lg mb-2 '>大阪ウィーク～秋～</div>
              <div className='font-bold text-xl'>「OSAKAから地域共生の未来をつくる」プロジェクト</div>
              <div className="h-6"></div>
              <div className=' text-2xl font-bold text-sky-700'>大阪府民生委員・児童委員の皆さんでつくる作品画像<br></br>投稿サイト</div>

              <div className='absolute bottom-0 left-0 w-full'>
                <Image src={"/image/logo.png"} width={500} height={500} className='w-72 m-auto' alt='logo' />
              </div>
            </div>
          </div>}
      </Suspense>
      :
      <div className="bg-slate-200 flex flex-col gap-4 p-4 h-screen">
        <LoginCard />

      </div >
  );
}


