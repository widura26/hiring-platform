"use client"
import React, { useState } from 'react';
import { useModal } from '@/context/CreateJobModalContext';
import JobTypeSelect from '../JobTypeSelect';
import { createJob } from '@/lib/data/firebase/jobsRepository';
import ProfileInformation from '../Admin/ProfileInformation';
import { randomBytes } from 'crypto';
import { useProfileInformation } from '@/context/ProfileInformationContext';

const CreateJobModal = () => {
    const { open, closeModal } = useModal()
    const { profileInformationDatas } = useProfileInformation();
    
    if (!open) return null

    const submitJobs = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        const data: Job = {
            title: formData.get('job-name') as string,
            type: formData.get('job-type') as string,
            slug: (formData.get('job-name') as string).toLowerCase().replace(/\s+/g, '-'),
            description: formData.get('job-description') as string,
            number_of_candidate: Number(formData.get('number-of-candidate')),
            minimum_salary: Number(formData.get('minimum-salary')),
            maximum_salary: Number(formData.get('maximum-salary')),  
            status: "active",
            salary_range: {
                min: Number(formData.get('minimum-salary')),
                max: Number(formData.get('maximum-salary')),
                currency: "IDR",
                display_text: `Rp${Number(formData.get('minimum-salary')).toLocaleString()} - Rp${Number(formData.get('maximum-salary')).toLocaleString()}`
            },
            list_card: {
                badge: "Active",
                started_on_text: `started on ${new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })}`,
                cta: "Manage Job"
            },
            profileInformationField: profileInformationDatas,
            created_at: new Date().toISOString()
        };

        try {
            // await createJob(data)
            console.log(data)
        } catch (err) {
            console.error('Insert failed:', err)
        }
    }

    return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 py-10">
                <form onSubmit={submitJobs} className="bg-white rounded-xl shadow-lg w-full flex flex-col h-full max-w-3xl">
                    <div className="flex items-center justify-between p-6 h-fit border-b border-[#E0E0E0]">
                        <h2 className="text-[#1D1F20] font-bold text-[18px]">Job Opening</h2>
                        <button type='button' onClick={closeModal} className="text-[#404040] cursor-pointer font-bold">✕</button>
                    </div>
                    <div className="py-4 px-6 flex flex-col flex-2 overflow-y-auto scrollbar-hide">
                        <div className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="job-name" className="block text-xs font-medium text-[#404040]">Job Name <span className="text-red-500">*</span></label>
                                <input id="job-name" className='text-sm mt-2 w-full focus:outline-none border-2 border-[#E0E0E0] py-2 px-4 rounded-lg text-[#9E9E9E] focus:text-[#404040]' placeholder="Ex. Front End Engineer" type="text" name="job-name" />
                            </div>
                            <div>
                                <label htmlFor="job-type" className="block text-xs font-medium text-[#404040]">Job Type <span className="text-red-500">*</span></label>
                                <div className="w-full mt-2">
                                    <JobTypeSelect/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="job-description" className="block text-xs font-medium text-[#404040]">Job Description <span className="text-red-500">*</span></label>
                                <textarea id="job-description" className='text-sm min-h-[88px] h-auto scrollbar-hide mt-2 w-full focus:outline-none border-2 border-[#E0E0E0] py-2 px-4 rounded-lg text-[#000000]' placeholder="Ex." name="job-description"></textarea>
                            </div>
                            <div>
                                <label htmlFor="number-of-candidate" className="block text-xs font-medium text-[#404040]">Number of Candidate Needed <span className="text-red-500">*</span></label>
                                <input id="number-of-candidate" className='text-sm mt-2 w-full focus:outline-none border-2 border-[#E0E0E0] py-2 px-4 rounded-lg text-[#000000]' placeholder="Ex. 2" type="number" name="number-of-candidate" />
                            </div>
                            <div className="border-t-2 border-dashed border-[#E0E0E0] pt-6">
                                <span className='text-xs text-[#404040]'>Job Salary</span>
                                <div className="flex items-center justify-center gap-4 mt-4">
                                    <div className='flex-1'>
                                        <label htmlFor="maximum-salary" className="block text-xs font-medium text-[#404040]">Minimum Estimated Salary</label>
                                        <input id="maximum-salary" className='text-sm mt-2 w-full focus:outline-none border-2 border-[#E0E0E0] py-2 px-4 rounded-lg text-[#000000]' placeholder="Ex. 2" type="number" name="maximum-salary" />
                                    </div>
                                    <hr className="border h-[1px]"></hr>
                                    <div className='flex-1'>
                                        <label htmlFor="minimum-salary" className="block text-xs font-medium text-[#404040]">Maximum Estimated Salary</label>
                                        <input id="minimum-salary" className='text-sm mt-2 w-full focus:outline-none border-2 border-[#E0E0E0] py-2 px-4 rounded-lg text-[#000000]' placeholder="Ex. 2" type="number" name="minimum-salary" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ProfileInformation />
                    </div>
                    <div className="h-fit p-6 flex items-center justify-end border-t border-[#E0E0E0]">
                        <button type='submit' className='bg-[#EDEDED] text-[#9E9E9E] border rounded-lg py-1 px-4 font-bold text-sm'>Publish Job</button>
                    </div>
                </form>
            </div>
    );
};

export default CreateJobModal;