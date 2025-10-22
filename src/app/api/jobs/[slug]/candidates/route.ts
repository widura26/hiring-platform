import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";

export async function GET (request: Request,{ params }: { params: Promise<{ slug: string }> }) {
    try {        
        const { slug } = await params;
        const jobs = query(collection(db, "jobs"), where("slug", "==", slug));
        const docSnap = await getDocs(jobs);
        const jobDoc = docSnap.docs[0];

        const applicationsCol = query(collection(db, "applications"), where("jobId", "==", jobDoc.id));
        const applicationSnapshot = await getDocs(applicationsCol);
        const applications: Application[] = applicationSnapshot.docs.map(doc => {
            const data = doc.data();
            
            const attributes: Attribute[] = [
                { key: "full_name", label: "Full Name", value: data.fullName, order: 1 },
                { key: "email", label: "Email", value: data.email, order: 2 },
                { key: "phone", label: "Phone", value: data.phone, order: 3 },
                { key: "phone", label: "Phone", value: data.dateOfBirth, order: 3 },
                { key: "domicile", label: "Domicile", value: data.domicile, order: 4 },
                { key: "gender", label: "Gender", value: data.gender, order: 5 },
                { key: "linkedin_link", label: "LinkedIn", value: data.linkedin, order: 6 },
            ];

            return {
                id: doc.id,
                attributes
            };
        });
        return NextResponse.json(applications);
    } catch (error) {
        return NextResponse.json(error);
    }
};