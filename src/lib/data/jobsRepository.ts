import { supabase } from '@/utils/supabase/client';
import mockJobs from "@/mock/jobs.json"

export const fetchJobs = async (): Promise<JobMock[]> => {
    if (process.env.NEXT_PUBLIC_SUPABASE_ENABLED !== 'true') {
        console.log('🔇 Supabase disabled, returning mock data')
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
            console.error('Supabase insert error:', error.message)
            throw error
        }
        console.log('Inserted data:', data)
        return data
    } catch (error) {
        console.error('Unexpected error:', error)
        throw error
    }
}