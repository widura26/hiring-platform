import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";

export async function GET (request: Request,{ params }: { params: Promise<{ slug: string }> } ) {
    try {
        const { slug } = await params;
        const q = query(collection(db, "jobs"), where("slug", "==", slug));
        const docSnap = await getDocs(q);

        if (docSnap.empty) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }
 
        const jobDoc = docSnap.docs[0];

        return NextResponse.json({ id:jobDoc.id, ...jobDoc.data() } as Job);
    } catch (error) {
        console.error("Error fetching job detail:", error);
        return NextResponse.json({ error: 'NGgak ngerti' }, { status: 500 });
    }
}


export async function POST(req: Request) {
    try {
        const body = await req.json();
        await addDoc(collection(db, "applications"), body);
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "error" }, { status: 500 });
    }
}