import { useBreadCrumb } from '@/context/BreadCrumbContext';
import Link from 'next/link';
import React from 'react';

const JobCard = (props:{ job:Job }) => {
    const { openDetail } = useBreadCrumb()
    const { job } = props;
    
    return (
        <div className="rounded-2xl flex flex-col gap-3 p-6 shadow-[0_4px_8px_rgba(0,0,0,0.1)] bg-white">
            <div className="flex items-center gap-4">
                <span className='bg-[#F8FBF9] border border-[#B8DBCA] rounded-[8px] py-1 px-4 text-[#43936C] text-sm font-bold'>{job.status == 'active' ? 'Active' : 'Nonactive' }</span>
                <span className='border border-[#E0E0E0] py-1 px-4 bg-white text font-normal text-[#404040] rounded-[4px] text-sm'>started on 2 Oct 2025</span>
            </div>
            <div className="">
                <h1 className='text-black font-bold text-[18px] mb-2'>{job.title}</h1>
                <div className="flex items-center justify-between">
                    <p className='text-[#616161]'>{job.salary_range.display_text}</p>
                    <Link href={`/admin/${job.slug}/candidates`}>
                        <button type='button' onClick={openDetail} className='bg-[#01959F] cursor-pointer rounded-[8px] py-2 px-4 text-xs font-bold'>Manage Job</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default JobCard;