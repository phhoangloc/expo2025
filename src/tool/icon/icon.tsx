import React, { useState, useEffect } from "react"
import { Divider } from "../divider/divider"

import { DividerType } from "../divider/divider"
type Props = {
    icon: React.ReactNode,
    data: DividerType[],
    sx?: string,
    valueReturn?: (v: string | number) => void

}
export const IconDivider = ({ icon, data, sx, valueReturn }: Props) => {
    const [drop, setDrop] = useState<boolean>(false)
    const [_name, set_name] = useState<string>("")
    const [_id, set_id] = useState<number>(0)

    useEffect(() => {
        if (valueReturn) {
            valueReturn(_id || _name)
        }
    }, [_id, _name, valueReturn])
    return (
        <div className={`relative ${sx}`}>
            <div className="h-12 w-12 p-2 ml-auto mr-0" onClick={() => { setDrop(!drop) }}>
                {icon}
            </div>
            <div className={`w-max transition-all duration-100 overflow-hidden absolute z-[2] top-13  bg-white text-main  ${drop ? "shadow" : ""}  rounded `} style={{ height: drop && data?.length ? (data.length) * 48 + "px" : 0 }} >
                {data?.length ? data.map((d: DividerType, index: number) =>
                    <Divider key={index} name={d.name} onClick={() => { set_name(d.name); if (d.id) { set_id(d.id) }; setDrop(!drop); if (d.func) { d.func() } }} sx="w-32 text-center opacity-75 hover:opacity-100" />
                ) : null}
            </div >
        </div>
    )
}