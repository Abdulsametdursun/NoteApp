import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { adminDb } from '@/firebase-admin';
import liveblocks from '@/lib/liveblocks';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    console.log('⛔ No userId found');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = await clerkClient.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress ?? 'unknown@email.com';
  const fullName = user.firstName ?? 'Anonymous';
  const avatar = user.imageUrl ?? '';

  const { room } = await req.json();
  console.log('Room requested:', room);

  const session = liveblocks.prepareSession(email, {
    userInfo: {
      name: fullName,
      email,
      avatar,
    },
  });

  try {
    const usersInRoom = await adminDb.collectionGroup('rooms').where('userId', '==', email).get();

    const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

    if (userInRoom?.exists) {
      session.allow(room, session.FULL_ACCESS);
      const { body, status } = await session.authorize();
      return new Response(body, { status });
    } else {
      console.log('⛔ Not authorized for room:', room);
      return NextResponse.json({ message: 'You are not in this room' }, { status: 403 });
    }
  } catch (error) {
    console.error('🔥 Error authorizing session:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
