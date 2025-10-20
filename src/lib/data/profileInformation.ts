import jobconfig from "@/mock/job_configuration.json"
import { supabase } from '@/utils/supabase/client';

export const fetchProfileInformation = async (): Promise<ProfileInformation> => {
    if (process.env.NEXT_PUBLIC_SUPABASE_ENABLED !== 'true') {
        return jobconfig.application_form.sections[0] as ProfileInformation;
    }
    try {        
        const { data, error } = await supabase.from('jobs').select('*').single()
        if (error || !data) throw error
        return data
    } catch (error) {
        return jobconfig.application_form.sections[0] as ProfileInformation;

    }
};