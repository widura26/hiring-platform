"use client"
import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { fetchJobs } from "@/lib/data/jobsRepository";

const MainContent = () => {
    const [jobs, setJobs] = useState<JobMock[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchJobs()
            setJobs(data)
        }
        fetchData()
    }, []);

    return (
        <div className="text-white grid grid-cols-1 gap-4">
            {
                jobs.length > 0 ? (
                    jobs.map((job:JobMock, index) => (
                        <JobCard key={index}/>
                    ))
                ) : null
            }
        </div>
    );
};

export default MainContent;