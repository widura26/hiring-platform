interface CaptureButtonProps {
    setOpenModal: () => void
}

interface OptionToggleProps {
    options?: string[];             
    value?: string;               
    onChange?: (value: string) => void;
    validation: Validation;
    field: Field
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
  id?: string;
  title: string;
  type: string;
  slug: string;
  description: string;
  status: string;
  salary_range: SalaryRange;
  list_card: Listcard;
  number_of_candidate: number;
  minimum_salary: number;
  maximum_salary: number;
  profileInformationField: Field[]
  created_at?: string;
}

interface ProfileInformation {
  title: string
  fields: Field[]
}

interface Field {
  key: string
  validation: Validation
  value?: string;
}

interface Validation {
  required: boolean | null
}
