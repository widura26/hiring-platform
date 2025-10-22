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

// interface Application {
//   id: string;
//   fullName: string; 
//   email: string;          
//   phone: string;      
//   dateOfBirth: string;
//   gender: "male" | "female";
//   domicile: string;      
//   linkedin: string;     
//   jobId: string;          
// }

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

interface Landmark {
    x: number;
    y: number;
    z: number;
}

interface HandResults {
    multiHandLandmarks?: Landmark[][];
    multiHandedness?: Array<{ label: string }>;
    image: HTMLVideoElement;
}

interface GestureData {
    poseName: string;
    landmarks: Landmark[];
    image: string;
    timestamp: number;
}

interface MediaPipeHands {
    setOptions: (options: {
        maxNumHands: number;
        modelComplexity: number;
        minDetectionConfidence: number;
        minTrackingConfidence: number;
    }) => void;
    onResults: (callback: (results: HandResults) => void) => void;
    send: (data: { image: HTMLVideoElement }) => Promise<void>;
    close: () => void;
}

type Attribute = {
  key: string;
  label: string;
  value: string;
  order: number;
};

type Application = {
  id: string;
  attributes: Attribute[];
};
