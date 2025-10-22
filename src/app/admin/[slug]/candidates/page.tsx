"use client"

import NoCandidatesFound from '@/components/Admin/NoCandidatesFound';
import TableCandidate from '@/components/Admin/TableCandidate';
import { fetchJobBySlug } from '@/lib/data/firebase/jobsRepository';
import useSWR from "swr";
import React from 'react';
import { useParams } from 'next/navigation';
import { Spinner } from '@/components/Spinner';

const fetcher = (url: string) => fetch(url).then(res => res.json());
const CandidateListBox = () => {
    const { slug } = useParams()
    const { job, isLoading, isError } = useJobBySlug(slug as string)
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
    
    const { data: candidates, error } = useSWR(`/api/jobs/${slug}/candidates`, fetcher, {
        dedupingInterval: 60000,
    });

    if (isLoading) return <div className='flex-1'><Spinner/></div>;
    if (isError) return <div>Error loading jobs</div>;
    if (!job) return <p>Job not found.</p>
    
    return (
        <div className="bg-white flex h-full overflow-hidden p-6">
            <div className="flex flex-col gap-6 flex-1 w-full overflow-y-auto scrollbar-hide">
                <h1 className='text-[18px] font-bold'>{job.title}</h1>
                <div className="rounded-lg border h-full border-[#E0E0E0] p-6">
                    <TableCandidate slug={slug as string}/>
                    {/* {
                        candidates.length != 0 ? <TableCandidate slug={slug as string}/> : <NoCandidatesFound/>
                    } */}
                </div>
            </div>
        </div>
    );
};

export default CandidateListBox