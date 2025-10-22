"use client"
import Image from 'next/image';
import React from 'react';
import successImage from '@/assets/success.png'

const SuccessModal = (props:any) => {
    return (
        <div className={`${props.success == true ? 'flex' : 'hidden'} fixed inset-0 bg-white items-center justify-center z-50`}>
            <div className="flex flex-col gap-4 items-center justify-center max-w-[606px]">
                <Image src={successImage} alt='success-image'/>
                <div className="">
                    <h1 className='text-2xl font-bold text-center text-[#404040] leading-[28px]'>🎉 Your application was sent!</h1>
                    <p className='text-base text-center text-[#404040] leading-[28px]'>Congratulations! You've taken the first step towards a rewarding career at Rakamin. We look forward to learning more about you during the application process.</p>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;