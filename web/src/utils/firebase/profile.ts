import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { EducatorProfile, InstitutionProfile } from '@/types/profile';

const db = getFirestore();
const storage = getStorage();

export async function getProfile(userId: string) {
  const docRef = doc(db, 'profiles', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    // Convert Firestore Timestamps to Dates
    return {
      ...data,
      createdAt: data.createdAt?.toDate(),
      lastActive: data.lastActive?.toDate(),
      credentials: data.credentials?.map((cred: any) => ({
        ...cred,
        issueDate: cred.issueDate?.toDate(),
        expiryDate: cred.expiryDate?.toDate(),
      })),
      experience: data.experience?.map((exp: any) => ({
        ...exp,
        startDate: exp.startDate?.toDate(),
        endDate: exp.endDate?.toDate(),
      })),
      education: data.education?.map((edu: any) => ({
        ...edu,
        graduationDate: edu.graduationDate?.toDate(),
      })),
    };
  }
  return null;
}

export async function updateProfile(userId: string, profileData: Partial<EducatorProfile | InstitutionProfile>) {
  const docRef = doc(db, 'profiles', userId);
  await updateDoc(docRef, profileData);
}

export async function uploadProfileImage(userId: string, file: File): Promise<string> {
  const storageRef = ref(storage, `profile-images/${userId}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function createProfile(userId: string, profileData: EducatorProfile | InstitutionProfile) {
  const docRef = doc(db, 'profiles', userId);
  await setDoc(docRef, {
    ...profileData,
    createdAt: new Date(),
    lastActive: new Date(),
  });
}
