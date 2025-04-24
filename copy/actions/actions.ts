'use server';

import { adminDb } from '@/firebase-admin';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import liveblocks from '@/lib/liveblocks';

export async function deleteDocument(roomId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await clerkClient.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) throw new Error('No email associated with user.');

  console.log('deleteDocument', roomId);

  try {
    // Delete document from main collection
    await adminDb.collection('documents').doc(roomId).delete();

    // Delete references in user rooms
    const query = await adminDb.collectionGroup('rooms').where('roomId', '==', roomId).get();

    const batch = adminDb.batch();
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    // Delete from Liveblocks
    await liveblocks.deleteRoom(roomId);

    return { success: true };
  } catch (error) {
    console.error('🔥 deleteDocument error:', error);
    return { success: false };
  }
}

export async function inviteUserToDocument(roomId: string, email: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await clerkClient.users.getUser(userId);
  const inviterEmail = user.emailAddresses[0]?.emailAddress;
  if (!inviterEmail) throw new Error('No email associated with user.');

  console.log('inviteUserToDocument', roomId, email, 'by', inviterEmail);

  try {
    await adminDb.collection('users').doc(email).collection('rooms').doc(roomId).set({
      userId: email,
      role: 'editor',
      createdAt: new Date(),
      roomId,
    });
    return { success: true };
  } catch (error) {
    console.error('🔥 Firestore invite error:', error);
    return { success: false };
  }
}

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

  return { roomId: docRef.id };
}

export async function removeUserFromDocument(roomId: string, email: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await clerkClient.users.getUser(userId);
  const requesterEmail = user.emailAddresses[0]?.emailAddress;
  if (!requesterEmail) throw new Error('No email associated with user.');

  console.log('removeUserFromDocument', roomId, email, 'by', requesterEmail);

  try {
    await adminDb.collection('users').doc(email).collection('rooms').doc(roomId).delete();

    return { success: true };
  } catch (error) {
    console.error('🔥 Firestore remove error:', error);
    return { success: false };
  }
}
