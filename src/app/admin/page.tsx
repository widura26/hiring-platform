"use client"
import MainContent from "@/components/Main";
import NotFoundJob from "@/components/NotFoundJob";
import RightSidebar2 from "@/components/RightSidebar2";
import SearchBar2 from "@/components/SearchBar2";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
    const { data: jobs, error, isLoading } = useSWR("/api/jobs", fetcher, {
        dedupingInterval: 60000,
    });
    
    return (
        <div className="bg-white flex h-full overflow-hidden pr-6 pt-4">
            <div className="flex w-full overflow-y-scroll h-full scrollbar">
                <div className="flex-1 flex flex-col">
                    <div className="sticky top-0 px-6 bg-white pb-4">
                        <SearchBar2/>
                    </div>
                    {
                        jobs?.length == 0 ? 
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
    );
}
