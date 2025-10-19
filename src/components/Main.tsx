"use client"
import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { fetchJobs } from "@/lib/data/jobsRepository";

const MainContent = () => {
    const [jobs, setJobs] = useState<Job[]>([]);

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
                    jobs.map((job:Job, index) => (
                        <JobCard key={index}/>
                    ))
                ) : null
            }
        </div>
    );
};

export default MainContent;