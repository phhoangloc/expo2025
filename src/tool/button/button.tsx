"use client"
import React, { useRef } from 'react'
type Props = {
    onClick: (e: unknown) => void,
    name: React.ReactNode,
    disable?: boolean,
    sx?: string,
}

export const Button = ({ onClick, name, disable, sx }: Props) => {
    return (
        <button
            className={`h-12 w-48 rounded bg-lv-11 text-white font-bold ${disable ? "opacity-25" : " opacity-100"} ${sx} `}
            disabled={disable ? disable : false}
            onClick={(e) => onClick(e)}>
            {name}
        </button>
    )
}

export const UploadButton = ({ name, onClick, sx }: Props) => {
    const IconRef = useRef<HTMLInputElement | null>(null)
    return (
        <div className={`${sx} `}>
            <input ref={IconRef} type="file" style={{ display: "none" }} onChange={(e) => onClick && onClick(e)} multiple={true} />
            <div className=" h-max w-max p-3 flex flex-col justify-center text-center bg-lv-11 text-white rounded cursor-pointer" onClick={() => IconRef.current && IconRef.current.click()}>{name}</div>
        </div>
    )
}

