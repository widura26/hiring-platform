"use client"

import NoCandidatesFound from '@/components/Admin/NoCandidatesFound';
import TableCandidate from '@/components/Admin/TableCandidate';
import { fetchJobBySlug } from '@/lib/data/firebase/jobsRepository';
import useSWR from "swr";
import React from 'react';
import { useParams } from 'next/navigation';

const CandidateListBox = () => {
    function useJobBySlug(slug: string) {
        const { data, error, isLoading } = useSWR(slug ? ["job", slug] : null, () => fetchJobBySlug(slug), {
            revalidateOnFocus: false,
            dedupingInterval: 1000 * 60 * 5,
        })

        return {
            job: data,
            isLoading,
            isError: error,
        }
    }
    const { slug } = useParams()
    const { job, isLoading, isError } = useJobBySlug(slug as string)

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Failed to load job data.</p>
    if (!job) return <p>Job not found.</p>
    
    return (
        <div className="bg-white flex h-full overflow-hidden p-6">
            <div className="flex flex-col gap-6 flex-1 w-full overflow-y-auto scrollbar-hide">
                <h1 className='text-[18px] font-bold'>{job.title}</h1>
                <div className="rounded-lg border h-full border-[#E0E0E0] p-6">
                    <TableCandidate/>
                    {/* <NoCandidatesFound/> */}
                </div>
            </div>
        </div>
    );
};

export default CandidateListBox