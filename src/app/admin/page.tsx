"use client"
import CandidateListBox from "@/components/Admin/CandidateList";
import MainContent from "@/components/Main";
import Navbar from "@/components/Navbar";
import Navbar2 from "@/components/Navbar2";
import RightSidebar2 from "@/components/RightSidebar2";
import SearchBar2 from "@/components/SearchBar2";
import { BreadCrumbProvider, useBreadCrumb } from "@/context/BreadCrumbContext";
import { ModalProvider } from "@/context/CreateJobModalContext";

export default function Home() {
    const { open } = useBreadCrumb()
    
    return (
        <main className='flex flex-col h-screen'>
            <Navbar2/>
            {
                !open ?
                    <div className="bg-white flex overflow-hidden pr-6 pt-4">
                        <div className="flex w-full overflow-y-scroll h-full scrollbar">
                            <div className="flex-1 flex flex-col">
                                <div className="sticky top-0 px-6 bg-white pb-4">
                                    <SearchBar2/>
                                </div>
                                {/* <>
                                    <NotFoundJob/>
                                    <CreateJobModal/>
                                </> */}
                                <div className="pb-5 px-6">
                                    <MainContent/>
                                </div>
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
