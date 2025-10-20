"use client"

import { useBreadCrumb } from '@/context/BreadCrumbContext';
import React from 'react';

const Navbar2 = () => {
    const { open } = useBreadCrumb()
    return (
        <div className='bg-white px-[20px] py-2.5 shadow-[0_4px_8px_rgba(0,0,0,0.1)] relative z-10'>
            <div className="flex items-center justify-between">
                <ul className='flex items-center gap-2'>
                    <li>
                        <button className={`text-[#1D1F20] font-bold ${open ? 'border border-[#E0E0E0] rounded-lg text-sm px-4 py-1' : 'border border-[#ffffff] rounded-lg text-sm px-4 py-1'}`}>Job List</button>
                    </li>
                    {
                        open && 
                        <li className='flex items-center gap-2'> 
                            <svg className="rtl:rotate-180 w-3 h-3 text-[#1D1F20] mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                            </svg>
                            <button type='button' className='text-[#1D1F20] text-sm bg-[#EDEDED] font-bold border border-[#C2C2C2] px-4 py-1 rounded-lg'>Manage Candidate</button>
                        </li>
                    }
                </ul>
                <div className="w-7 h-7 bg-black rounded-full"></div>
            </div>
        </div>
    );
};

export default Navbar2;