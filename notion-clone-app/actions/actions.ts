'use server';

import { adminDb } from '@/firebase-admin';

export async function createNewDocument(userEmail: string) {
  if (!userEmail) throw new Error('Unauthorized');

  const docCollectionRef = adminDb.collection('documents');
  const docRef = await docCollectionRef.add({
    title: 'New Document',
  });

  await adminDb.collection('users').doc(userEmail).collection('rooms').doc(docRef.id).set({
    userId: userEmail,
    role: 'owner',
    createdAt: new Date(),
    roomId: docRef.id,
  });

  return { docId: docRef.id };
}
