import { supabase } from '@/utils/supabase/client';
import mockJobs from "@/mock/jobs.json"

export const fetchJobs = async (): Promise<JobMock[]> => {
    if (process.env.NEXT_PUBLIC_SUPABASE_ENABLED !== 'true') {
        return mockJobs.data as JobMock[];
    }
    try {        
        const { data, error } = await supabase.from('jobs').select('*')
        if (error || !data) throw error
        return data
    } catch (error) {
        return mockJobs.data as JobMock[];
    }
};

export const createJobs = async (request:any) => {
    try {        
        const { data, error } = await supabase.from('jobs').insert([request])
        if (error) {
            throw error
        }
        return data
    } catch (error) {
        throw error
    }
}