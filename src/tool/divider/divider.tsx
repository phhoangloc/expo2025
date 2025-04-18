
import React, { useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export type DividerType = {
    id?: number
    name: string,
    func?: () => void
}
type Props = {
    name: React.ReactNode,
    onClick?: () => void,
    data?: DividerType[],
    sx?: string,
    valueReturn?: ({ id, name }: { id: number, name: string }) => void

}
export const Divider = ({ name, onClick, sx }: Props) => {
    return (
        <div className={`h-12 flex flex-col justify-center cursor-pointer py-1 px-2 rounded hover:text-lv-11 ${sx ? sx : ""}`} onClick={() => onClick && onClick()}>{name}</div>
    )
}

export const DividerSelect = ({ data, name, sx, valueReturn }: Props) => {
    const [drop, setDrop] = useState<boolean>(false)
    const [_name, set_name] = useState<string>("")
    const [_id, set_id] = useState<number>(-1)

    useEffect(() => {
        if (valueReturn && _id !== -1) {
            valueReturn({ id: _id, name: _name })
        }
    }, [_id, _name, valueReturn])
    return (
        <div className={`relative ${sx}`}>
            <Divider sx={`border ${_id || _name ? "!border-slate-200" : "border-slate-200"}`} name={<div className='flex justify-between'><p className='flex flex-col justify-center'>{_name || name}</p> <KeyboardArrowDownIcon className='!w-9 !h-9 p-1' /></div>} onClick={() => { setDrop(!drop) }} />
            <div className={`transition-all duration-100 overflow-hidden absolute z-10 top-12 w-full shadow-lg border-slate-200 ${drop ? "border" : ""}  rounded bg-white `} style={{ height: drop && data?.length ? (data.length + 1) * 3 + "rem" : 0 }} >
                <Divider name="---" onClick={() => { set_name(""); set_id(-1); setDrop(!drop) }} />
                {data?.length ? data.map((d: DividerType, index: number) =>
                    <Divider key={index} name={d.name} onClick={() => { set_name(d.name); set_id(index); setDrop(!drop); if (d.func) { d.func() } }} />
                ) : null}
            </div >
        </div>
    )
}