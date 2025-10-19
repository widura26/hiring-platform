import { supabase } from '@/utils/supabase/client';

export const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs').select('*')

    if (error) throw new Error(error.message);
    return data;
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