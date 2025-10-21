import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const fetchJobs = async (): Promise<Job[]> => {
  const jobsCol = collection(db, "jobs");
  const jobSnapshot = await getDocs(jobsCol);
  const jobList = jobSnapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Job)
  );
  return jobList;
};

export async function createJob(job: Job) {
  const docRef = await addDoc(collection(db, "jobs"), job);
  return docRef.id;
}

export async function fetchJobBySlug(slug: string) {
  const jobsRef = collection(db, "jobs")
  const q = query(jobsRef, where("slug", "==", slug))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() } as Job
}