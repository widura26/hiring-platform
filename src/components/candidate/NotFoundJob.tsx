"use client"
import React from 'react';
import Image from "next/image";
import artwork from '@/assets/artwork.png';
import { useModal } from '@/context/CreateJobModalContext';

const NotFoundJob = () => {

    return (
        <div className="flex flex-col h-full justify-center items-center gap-4">
            <Image src={artwork} alt="hero section" />
            <div className="flex flex-col gap-1">
                <h1 className='text-[#404040] text-center font-bold text-xl'>No job openings available</h1>
                <p className='text-[#404040] text-base text-center'>Create a job opening now and start the candidate process.</p>
            </div>
        </div>
    );
};

export default NotFoundJob;