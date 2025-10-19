import React from 'react';
import Image from "next/image";
import emptyState from '@/assets/Empty State.png';

const NoCandidatesFound = () => {
    return (
        <div className="flex items-center flex-col h-full justify-center gap-6">
            <Image src={emptyState} alt="hero section" width={276} height={260} />
            <div className="flex flex-col gap-4">
                <p className='text-center text-base font-bold text-black'>No candidates found</p>
                <p className='text-sm text-center text-[#757575]'>Share your job vacancies so that more candidates will apply.</p>
            </div>
        </div>
    );
};

export default NoCandidatesFound;