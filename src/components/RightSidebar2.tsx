import { useModal } from '@/context/CreateJobModalContext';
import React from 'react';

const RightSidebar2 = () => {
    const { openModal } = useModal()
    return (
        <div className="bg-white pt-5 pr-4 pb-5 text-white">
            <div className="overflow-hidden rounded-2xl w-full h-full p-6 flex flex-col gap-6 bg-[url('/createnewjob.jpg')] bg-cover relative">
                <div className="flex flex-col gap-1 z-10">
                    <p className='font-bold text-[18px]'>Recruit the best candidates</p>
                    <p className='font-bold text-sm'>Create jobs, invite, and hire with ease</p>
                </div>
                <div className="w-full z-10">
                    <button type='button' onClick={openModal} className='bg-[#01959F] cursor-pointer w-full text-white font-bold text-base py-[6px] px-4 rounded-lg'>Create a new job</button>
                </div>
                <div className="absolute z-5 inset-0 bg-black via-transparent to-transparent opacity-[72%]"></div>
            </div>
        </div>
    );
};

export default RightSidebar2;