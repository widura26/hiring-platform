"use client"
import React from 'react';
import Image from "next/image";
import artwork from '@/assets/artwork.png';
import { useModal } from '@/context/CreateJobModalContext';

const NotFoundJob = () => {
    const { openModal } = useModal()

    return (
        <div className="flex flex-col h-full justify-center items-center gap-4">
            <Image src={artwork} alt="hero section" />
            <div className="flex flex-col gap-1">
                <h1 className='text-[#404040] text-center font-bold text-xl'>No job openings available</h1>
                <p className='text-[#404040] text-base text-center'>Create a job opening now and start the candidate process.</p>
            </div>
            <button type='button' onClick={openModal} className='cursor-pointer  rounded-lg bg-[#FBC037] text-[#404040] font-bold py-1.5 px-4 text-base'>Create a new job</button>
        </div>
    );
};

export default NotFoundJob;