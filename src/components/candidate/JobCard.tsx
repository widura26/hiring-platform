import React from 'react';
import Image from 'next/image';
import logogram from '@/assets/logogram.png'

const JobCard = (props: { job:Job, setSelected: any }) => {
    const { job, setSelected } = props;
    return (
        <div onClick={() => setSelected(job.slug)} className="cursor-pointer py-3 flex flex-col gap-2 px-4 border-2 border-[#01777F] bg-[#F7FEFF] rounded-lg">
            <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 border border-[#E0E0E0] rounded-[4px]">
                    <Image src={logogram} fill alt='rakamin' className="object-contain"/>
                </div>
                <div>
                    <h1 className='text-[#404040] font-bold text-base'>{job.title}</h1>
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
                        <span>{job.salary_range.display_text}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JobCard;