import React from 'react';
import TableCandidate from './TableCandidate';
import NoCandidatesFound from './NoCandidatesFound';

const CandidateListBox = () => {
    return (
        <div className="bg-white flex h-full overflow-hidden p-6">
            <div className="flex flex-col gap-6 flex-1 w-full overflow-y-auto scrollbar-hide">
                <h1 className='text-[18px] font-bold'>Frontend Developer</h1>
                <div className="rounded-lg border h-full border-[#E0E0E0] p-6">
                    {/* <TableCandidate/> */}
                    <NoCandidatesFound/>
                </div>
            </div>
        </div>
    );
};

export default CandidateListBox;