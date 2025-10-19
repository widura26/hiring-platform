import { useBreadCrumb } from '@/context/BreadCrumbContext';
import React from 'react';

const Navbar = () => {
    return (
        <div className='bg-white px-[22px] py-2.5 shadow-[0_4px_8px_rgba(0,0,0,0.1)] relative z-10'>
            <div className="flex items-center justify-between">
                <ul className='flex items-center gap-2'>
                    <li className={`text-black font-bold text-[18px]`}>Job List</li>
                </ul>
                <div className="w-7 h-7 bg-black rounded-full"></div>
            </div>
        </div>
    );
};

export default Navbar;