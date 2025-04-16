'use client';
import { useTransition } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { createNewDocument } from '@/actions/actions';
import { useUser } from '@clerk/nextjs';

function NewDocumentButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { user } = useUser();

  const handleCreateNewDocument = () => {
    if (!user?.emailAddresses?.[0]?.emailAddress) return;

    startTransition(async () => {
      const { docId } = await createNewDocument(user.emailAddresses[0].emailAddress);
      router.push(`/doc/${docId}`);
    });
  };

  return (
    <Button onClick={handleCreateNewDocument} disabled={isPending}>
      {isPending ? 'Creating...' : 'New Document'}
    </Button>
  );
}

export default NewDocumentButton;
