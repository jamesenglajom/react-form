import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
export default function Modal({ children, isOpen, onChange }) {
    useEffect(() => {
        if(isOpen){
            document.body.style.overflow = 'hidden';
        }else{
            document.body.style.overflow = 'auto';
        }
    }, [isOpen])
    
    return (
        <>
        {isOpen && (<div className="modal-backdrop p-[50px] bg-opacity-80 fixed top-0 left-0 w-screen h-screen bg-stone-800 overflow-y-auto z-[9999]">
                <div className="absolute top-[60px] right-[10px]">
                    <Icon icon="fluent:dismiss-16-filled" className="text-stone-200 hover:text-white cursor-pointer" onClick={()=> onChange(false)} />
                </div>
                <div className="bg-white rounded-lg">
                    {children}
                </div>

            </div>
        )
        }</>
    )
}
