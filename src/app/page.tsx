"use client"
import MainContent from "@/components/Main";
import MainContent2 from "@/components/Main2";
import CreateJobModal from "@/components/modals/CreateJobModal";
import Navbar from "@/components/Navbar";
import NotFoundJob from "@/components/NotFoundJob";
import RightSidebar from "@/components/RightSidebar";
import SearchBar from "@/components/SearchBar";
import { ModalProvider } from "@/context/CreateJobModalContext";

export default function Home() {
  return (
    <ModalProvider>
      <main className='flex flex-col h-screen'>
        <Navbar/>
        <div className="bg-white h-screen flex overflow-hidden">
          <div className="flex-1 flex flex-col gap-4">
            <SearchBar/>
            <>
              <NotFoundJob/>
              <CreateJobModal/>
            </>
            {/* <div className="overflow-y-auto h-full scrollbar-hide px-6 pb-5">
              <MainContent2/>
            </div> */}
          </div>
          <div className="w-[350px]">
            <RightSidebar/>
          </div>
        </div>
      </main>
    </ModalProvider>
  );
}
