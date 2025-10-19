import { supabase } from '@/utils/supabase/server';

export const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
};