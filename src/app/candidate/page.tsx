"use client"
import React, { useEffect, useState } from 'react';
import JobCard from '@/components/candidate/JobCard';
import ApplyButton from '@/components/candidate/ApplyButton';
import Navbar from '@/components/candidate/Navbar';
import NotFoundJob from '@/components/candidate/NotFoundJob';
import logogram from '@/assets/logogram.png'
import useSWR from "swr";
import Image from 'next/image';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const CandidatePage = () => {
    const { data: jobs, error, isLoading } = useSWR("/api/jobs", fetcher, {
        dedupingInterval: 60000,
    });

    const [selected, setSelected] = useState<string>()
    const selectedJob = jobs?.find((job: Job) => job.slug === selected)
    useEffect(() => {
        if (jobs && jobs.length > 0) {
            setSelected(jobs[0].slug)
        }
    }, [jobs])

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading jobs</div>;

    return (
        <>  
            <Navbar/>
            <main className='py-10 flex-1 overflow-hidden'>
                {
                    jobs?.length == 0 ? <NotFoundJob/> 
                    : 
                    <div className='flex gap-6 h-full max-w-[1276px] mx-auto'>
                        <div className="flex-1 overflow-y-scroll scrollbar pr-4">
                            <div className="flex flex-col gap-4">
                                { 
                                    jobs.map((job: Job, index:number) => (
                                        <JobCard setSelected={setSelected} job={job} key={index} />
                                    ))
                                }
                            </div>
                        </div>
                        {
                            selectedJob && (
                                <div className={`flex-2 flex flex-col gap-6 bg-white border border-[#E0E0E0] rounded-lg p-6`}>
                                    <div className="flex items-start justify-between gap-6 pb-6 border-[#E0E0E0] border-b">
                                        <div className="flex items-start gap-6">
                                            <div className="relative w-12 h-12 bg-white border border-[#E0E0E0] rounded-[4px]">
                                                <Image src={logogram} fill alt='rakamin' className="object-contain"/>
                                            </div>
                                            <div className=''>
                                                <span className='bg-[#43936C] text-white rounded-sm py-1 px-2 text-xs font-bold'>Full-Time</span>
                                                <div className="mt-2">
                                                    <h1 className='text-[#404040] font-bold text-[18px]'>{selectedJob.title}</h1>
                                                    <p className='text-[#757575] text-sm'>Rakamin</p>
                                                </div>
                                            </div>
                                        </div>
                                        <ApplyButton slug={selectedJob.slug}/>
                                    </div>
                                    <div className="">
                                        <ul className='text-[#404040] text-sm list-disc list-inside space-y-1'>
                                            <li>Develop, test, and maintain responsive, high-performance web applications using modern front-end technologies.</li>
                                            <li>Collaborate with UI/UX designers to translate wireframes and prototypes into functional code.</li>
                                            <li>Integrate front-end components with APIs and backend services.</li>
                                            <li>Ensure cross-browser compatibility and optimize applications for maximum speed and scalability.</li>
                                            <li>Write clean, reusable, and maintainable code following best practices and coding standards.</li>
                                            <li>Participate in code reviews, contributing to continuous improvement and knowledge sharing.</li>
                                            <li>Troubleshoot and debug issues to improve usability and overall application quality.</li>
                                            <li>Stay updated with emerging front-end technologies and propose innovative solutions.</li>
                                            <li>Collaborate in Agile/Scrum ceremonies, contributing to sprint planning, estimation, and retrospectives.</li>
                                        </ul>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                }
            </main>      
        </>
    );
};

export default CandidatePage;