import React from 'react';
import Image from 'next/image';

const JobCard = () => {
    return (
        <div className="py-3 flex flex-col gap-2 px-4 border-2 border-[#01777F] bg-[#F7FEFF] rounded-lg">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white border border-[#E0E0E0] rounded-[4px]"></div>
                <div>
                    <h1 className='text-[#404040] font-bold text-base'>UX Designer</h1>
                    <p className='text-[#404040] text-sm'>Rakamin</p>
                </div>
            </div>
            <hr className="border-t border-dashed border-gray-300" />
            <div className="">
                <div className="flex items-center gap-1">
                    <Image width={16} height={16} src='/u_location-point.svg' alt='location' />
                    <p className='text-[#616161] text-xs'>Jakarta</p>
                </div>
                <div className="flex items-center mt-2 gap-1">
                    <Image width={16} height={16} src='/u_money-bill.svg' alt='salary' />
                    <p className='text-[#616161] text-xs'>
                        <span>Rp7.000.000</span> - <span>Rp15.000.000</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JobCard;