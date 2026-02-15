import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDb } from '../firebase/config';

interface PartnerFormData {
  salonName: string;
  ownerName: string;
  phone: string;
  address: string;
  bookingUrl?: string;
  message?: string;
}

export async function submitPartnerApplication(data: PartnerFormData): Promise<string> {
  const db = getDb();
  if (!db) {
    // Firebase 미설정 시 로컬 저장으로 fallback
    const applications = JSON.parse(localStorage.getItem('cutine_partner_applications') || '[]');
    const id = `local_${Date.now()}`;
    applications.push({ id, ...data, status: 'pending', createdAt: new Date().toISOString() });
    localStorage.setItem('cutine_partner_applications', JSON.stringify(applications));
    return id;
  }

  const docRef = await addDoc(collection(db, 'partnerApplications'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
