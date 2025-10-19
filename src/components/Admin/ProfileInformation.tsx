'use client'
import React, { useState } from 'react';
import OptionToggle from './OptionToggle';
const ProfileInformation = () => {
    const [status, setStatus] = useState("Mandatory");
    return (
        <div className="flex flex-col gap-4 p-4 border mt-4 border-[#EDEDED] rounded-lg">
            <h1 className='text-[#404040] text-sm font-bold'>Minimum Profile Information Required</h1>
            <div className="flex flex-col p-2">
                <div className="flex items-center gap-4 border-b border-[#E0E0E0] px-2 py-3">
                    <div className="flex-1">
                        <h1 className='text-[#404040] text-sm'>Full name</h1>
                    </div>
                    <OptionToggle value={status} onChange={setStatus} />
                </div>
            </div>
        </div>
    );
};

export default ProfileInformation;