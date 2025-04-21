'use client';

import { FormEvent, useEffect, useState, useTransition } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Editor from './Editor';
import useOwner from '@/lib/useOwner';
import DeleteDocument from './DeleteDocument';
import InviteUser from './InviteUser';
import ManageUsers from './ManegeUsers';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

function Document({ id }: { id: string }) {
  const [data, loading, error] = useDocumentData(doc(db, 'documents', id));
  const [input, setInput] = useState('');
  const [isUpdating, startTransition] = useTransition();
  const isOwner = useOwner();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user?.emailAddresses?.[0]?.emailAddress) return;

    const email = user.emailAddresses[0].emailAddress;
    const roomRef = doc(db, 'users', email, 'rooms', id);

    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (!docSnap.exists()) {
        alert('Your access of this file has been removed!');
        router.replace('/');
      }
    });

    return () => unsubscribe();
  }, [id, user, router]);

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, 'documents', id), {
          title: input,
        });
      });
    }
  };

  return (
    <div className='flex-1 h-full p-5'>
      <div className='flex max-w-6xl mx-auto justify-between pb-5'>
        <form className='flex flex-1 space-x-2' onSubmit={updateTitle}>
          <Input value={input} onChange={(e) => setInput(e.target.value)} />

          <Button disabled={isUpdating} type='submit'>
            {isUpdating ? 'Updating' : 'Update'}
          </Button>

          {isOwner && (
            <>
              <InviteUser />
              <DeleteDocument />
            </>
          )}
        </form>
      </div>

      <div className='flex max-w-6xl mx-auto justify-between items-center mb-5'>
        <ManageUsers />
      </div>

      <Editor />
    </div>
  );
}

export default Document;
