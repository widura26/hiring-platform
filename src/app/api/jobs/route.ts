import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";

export const GET = async () => {
    const jobsCol = collection(db, "jobs");
    const jobSnapshot = await getDocs(jobsCol);
    const jobs = jobSnapshot.docs.map(
        doc => ({ id: doc.id, ...doc.data() } as Job)
    );
    return NextResponse.json(jobs);
};

export const POST = async (req: Request) => {
    const job = await req.json()
    const docRef = await addDoc(collection(db, "jobs"), job);
    return NextResponse.json(docRef.id);
}