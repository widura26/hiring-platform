import { db } from "@/lib/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

export const fetchProfileInformation = async () => {
  const configCol = collection(db, "application_form_config");
  const configSnapshot = await getDocs(configCol);
  const configList = configSnapshot.docs.map((doc) => doc.data());
  return configList[0].application_form.sections[0];
};

export const createJobConfiguration = async (profileInformation:any) => {
    const docRef = await addDoc(collection(db, "profile_information_job"), profileInformation);
    return docRef.id;
}