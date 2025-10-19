import React from 'react';

const RightSidebar2 = () => {
    return (
        <div className="bg-white pt-5 pr-4 pb-5 text-white">
            <div className="rounded-2xl bg-black w-full h-full p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <p className='font-bold text-[18px]'>Recruit the best candidates</p>
                    <p className='font-bold text-sm'>Create jobs, invite, and hire with ease</p>
                </div>
                <div className="w-full">
                    <button className='bg-[#01959F] w-full text-white font-bold text-base py-[6px] px-4 rounded-lg'>Create a new job</button>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar2;