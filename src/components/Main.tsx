"use client"
import useSWR from "swr";
import JobCard from "./JobCard";


const fetcher = (url: string) => fetch(url).then(res => res.json());

const MainContent = () => {
    const { data: jobs, error, isLoading } = useSWR("/api/jobs", fetcher, {
        dedupingInterval: 60000,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading jobs</div>;

    return (
        <div className="text-white grid grid-cols-1 gap-4">
            {
                jobs.map((job:Job, index: any) => (
                    <JobCard job={job} key={index}/>
                ))
            }
        </div>
    );
};

export default MainContent;