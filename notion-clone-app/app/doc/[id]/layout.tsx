import RoomProvider from '@/components/RoomProvider';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DocLayout(props: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const id = (await props.params).id; // ✅ await the params

  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return <RoomProvider roomId={id}>{props.children}</RoomProvider>;
}
