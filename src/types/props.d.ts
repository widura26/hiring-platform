interface CaptureButtonProps {
    setOpenModal: () => void
}

interface OptionToggleProps {
    options?: string[];             
    value?: string;               
    onChange?: (value: string) => void;
}
 
interface JobMock {
  id?: string;
  slug: string;
  title: string;
  status: string;
  salary_range: SalaryRange;
  list_card: Listcard;
}

interface JobsMockReponse {
  data: JobMock[]
}

interface SalaryRange {
  min: number,
  max: number,
  currency: string,
  display_text: string
}

interface Listcard {
  badge: string,
  started_on_text: string,
  cta: string
}

interface Job {
  id?: number;
  name: string;
  type: string;
  description: string;
  number_of_candidate: number;
  minimum_salary: number;
  maximum_salary: number;
  created_at?: string;
}
