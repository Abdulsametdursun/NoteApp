'use client';

import { db } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDocumentData } from 'react-firebase-hooks/firestore';

function SidebarOption({ href, id }: { href: string; id: string }) {
  const [data, loading, error] = useDocumentData(doc(db, 'documents', id));
  const pathname = usePathname();
  const isActive = href.includes(pathname) && pathname !== '/';

  if (!data) return null;

  return (
    <Link
      href={href}
      style={{
        backgroundColor: isActive ? 'var(--card)' : 'var(--input)',
        color: 'var(--foreground)',
        borderColor: 'var(--border)',
        fontWeight: isActive ? 'bold' : 'normal',
      }}
      className='relative border p-2 rounded-md truncate'
    >
      {data.title}
    </Link>
  );
}

export default SidebarOption;
