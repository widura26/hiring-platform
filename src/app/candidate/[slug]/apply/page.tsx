"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import CaptureButton from '@/components/candidate/CaptureButton';
import avatar from '@/assets/avatar.png'
import CaptureModal from '@/components/modals/CaptureModal';
import PhoneNumber from '@/components/PhoneNumber';
import DatePicker from '@/components/DatePicker';
import DomicilePicker from '@/components/DomicilePicker';
import useSWR from 'swr';
import SuccessModal from '@/components/SuccessModal';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const Page = ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = React.use(params)

    const [openModal, setOpenModal] = useState(false);
    const [success, setSuccess] = useState(false);
    const [gender, setGender] = useState<string>("");
    const [dob, setDob] = useState<string>("");

    const { data: job, error, isLoading } = useSWR(`/api/jobs/${slug}/apply`, fetcher, {
        dedupingInterval: 60000,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading jobs</div>;

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        const data = {
            fullName: formData.get('full-name') as string,
            dateOfBirth: formData.get('date-of-birth') as string,
            gender: gender,
            domicile: formData.get('domicile') as string,
            phone: formData.get('phone_number') as string,
            email: formData.get('email') as string,
            Linkedin: formData.get('linkedin') as string,
        };
            
        try {
            const response = await fetch(`/api/jobs/${job.slug}/apply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (response.status == 200) setSuccess(true) 
        } catch (err) {
            console.error('Insert failed:', err)
        }
    }

    return (
        <main className='py-[50px] flex-1 overflow-hidden bg-[#FAFAFA]'>
            {
                openModal && <CaptureModal setOpenModal={() => setOpenModal(!openModal)}/> 
            }
            {
                success && <SuccessModal success={success}/>
            }
            <form onSubmit={submit} className="bg-white border border-[#E0E0E0] w-full flex flex-col h-full mx-auto max-w-[700px]">
                <div className="flex items-center justify-between p-10 pb-6 h-fit">
                    <div className="flex items-center gap-4 justify-between">
                        <Link href='/candidate/'>
                            <button type='button' className='rounded-lg border border-[#E0E0E0] p-1 shadow-[0_1px_2px_rgba(0,0,0,0.12)]' title='button'>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.8333 10H4.16663" stroke="#1D1F20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9.99996 15.8337L4.16663 10.0003L9.99996 4.16699" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </Link>
                        <h2 className="text-[#1D1F20] font-bold text-[18px]">Apply {job.title} at Rakamin</h2>
                    </div>
                    <p className="text-[#404040] cursor-pointer text-sm">ℹ️ This field required to fill</p>
                </div>
                
                <div className="px-10 flex flex-col flex-2 overflow-y-auto scrollbar-hide">
                    <div className="flex flex-col gap-4 px-6 pb-[26px]">
                        <p className='text-[#E11428] font-bold text-xs'>* Required</p>
                        <div>
                            <label className="block text-xs text-[#404040]">Photo Profile</label>
                            <div className="w-32 h-32 mt-2 rounded-full bg-white">
                                <Image id='photo-profile' src={avatar} width={128} height={128} alt='avatar'/>
                            </div>
                            <CaptureButton setOpenModal={() => setOpenModal(!openModal)}/>
                        </div>
                        <div>
                            <label className="block text-xs text-[#404040]">Full name <span className="text-red-500">*</span></label>
                            <input id="full-name" className='text-sm mt-2 w-full focus:outline-none border-2 border-[#E0E0E0] py-2 px-4 rounded-lg text-[#000000]' placeholder="Enter your full name" type="text" name="full-name" />
                        </div>
                        {/* date of birth */}
                        <div>
                            <label className="block text-xs text-[#404040]">Date of birth <span className="text-red-500">*</span></label>
                            <div className="mt-2" id='date-of-birth'>
                                <DatePicker setDob={setDob} styleCalendarBox='w-[376px]' styleInput='border-2 border-[#E0E0E0] py-2 px-4 text-black text-sm rounded-lg' />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-[#404040]">Pronoun (gender) <span className="text-red-500">*</span></label>
                            <div className="flex gap-10 mt-2">
                                <div className="inline-flex items-center">
                                    <label className="relative flex items-center cursor-pointer" htmlFor="female">
                                        <input onChange={(e) => setGender(e.target.value)} name="gender" value="female" type="radio" className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="female"/>
                                        <span className="absolute bg-[#01959F] w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        </span>
                                    </label>
                                    <label className="ml-2 text-slate-600 cursor-pointer text-sm" htmlFor="female">She/her (Female)</label>
                                </div>
                                <div className="inline-flex items-center">
                                    <label className="relative flex items-center cursor-pointer" htmlFor="male">
                                        <input onChange={(e) => setGender(e.target.value)} name="gender" value="male" type="radio" className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" id="male"/>
                                        <span className="absolute bg-[#01959F] w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        </span>
                                    </label>
                                    <label className="ml-2 text-slate-600 cursor-pointer text-sm" htmlFor="male">He/him (Male)</label>
                                </div>
                            </div>
                        </div>
                        {/* domicile */}
                        <div>
                            <label className="block text-xs text-[#404040]">Domicile <span className="text-red-500">*</span></label>
                            <div className="mt-2" id='domicile'>
                                <DomicilePicker styleInput='py-2 px-4 text-sm text-black focus:outline-none border-2 border-[#E0E0E0] rounded-lg'/>
                            </div>
                        </div>
                        {/* phone */}
                        <div>
                            <label  className="block text-xs text-[#404040]">Phone number <span className="text-red-500">*</span></label>
                            <div className="mt-2" id='phone'>
                                <PhoneNumber/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-xs text-[#404040]">Email <span className="text-red-500">*</span></label>
                            <input autoComplete="email" id="email" className='text-sm mt-2 w-full focus:outline-none border-2 border-[#E0E0E0] py-2 px-4 rounded-lg text-[#000000]' placeholder="Enter your email address" type="email" name="email" />
                        </div>
                        <div>
                            <label htmlFor="linkedin" className="block text-xs text-[#404040]">Link Linkedin <span className="text-red-500">*</span></label>
                            <input id="linkedin" className='text-sm mt-2 w-full focus:outline-none border-2 border-[#E0E0E0] py-2 px-4 rounded-lg text-[#000000]' placeholder="https://linkedin.com/in/username" type="text" name="linkedin" />
                        </div>
                    </div>
                </div>
                <div className="h-fit py-6 px-10 flex items-center justify-end border-t border-[#E0E0E0]">
                    <button type='submit' className='bg-[#01959F] shadow-[0_1px_2px_rgba(0,0,0,0.12)] leading-7 cursor-pointer text-white border rounded-lg py-1.5 px-4 w-full font-bold text-base'>Submit</button>
                </div>
            </form>
        </main>
    );
};

export default Page;