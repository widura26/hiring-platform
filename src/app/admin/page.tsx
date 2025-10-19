"use client"
import CandidateListBox from "@/components/Admin/CandidateList";
import MainContent from "@/components/Main";
import CreateJobModal from "@/components/modals/CreateJobModal";
import Navbar2 from "@/components/Navbar2";
import NotFoundJob from "@/components/NotFoundJob";
import RightSidebar2 from "@/components/RightSidebar2";
import SearchBar2 from "@/components/SearchBar2";
import { useBreadCrumb } from "@/context/BreadCrumbContext";
import { fetchJobs } from "@/lib/data/jobsRepository";
import { useEffect, useState } from "react";

export default function Home() {
    const { open } = useBreadCrumb()
    const [jobs, setJobs] = useState<any>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchJobs()
            setJobs(data)
        }
        fetchData()
    }, []);
    
    return (
        <main className='flex flex-col h-screen'>
            <CreateJobModal/>
            <Navbar2/>
            {
                !open ?
                    <div className="bg-white flex h-full overflow-hidden pr-6 pt-4">
                        <div className="flex w-full overflow-y-scroll h-full scrollbar">
                            <div className="flex-1 flex flex-col">
                                <div className="sticky top-0 px-6 bg-white pb-4">
                                    <SearchBar2/>
                                </div>
                                {
                                    jobs.length == 0 ? 
                                    <>
                                        <NotFoundJob/>
                                    </> :
                                    <div className="pb-5 px-6">
                                        <MainContent/>
                                    </div>
                                }
                            </div>
                            <div className="sticky top-0 bg-white w-[350px]">
                                <RightSidebar2/>
                            </div>
                        </div>
                    </div>
                    : 
                    <CandidateListBox/>
            }
        </main>
    );
}
