"use client"
import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { fetchJobs } from "@/lib/data/jobsRepository";
import { supabase } from "@/utils/supabase/server";
const MainContent = () => {
    const [jobs, setJobs] = useState<any>([]);

    useEffect(() => {
        const fetchTodos = async () => {
            const { data, error } = await supabase
                .from('jobs') 
                .select('*');

            if (error) {
                console.error('Error fetching data:', error);
            } else {
                console.log(data)
                setJobs(data);
            }
        };

        fetchTodos();
    }, []);

    return (
        <div className="text-white grid grid-cols-1 gap-4">
            {
                jobs.map(() => {
                    <JobCard/>
                })
            }
        </div>
    );
};

export default MainContent;