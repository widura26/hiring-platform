interface CaptureButtonProps {
    setOpenModal: () => void
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
