'use client';

import { use } from 'react';
import Document from '@/components/ui/Document';

function DocumentPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);

  return (
    <div className='flex flex-col flex-1 min-h-screen'>
      <Document id={id} />
    </div>
  );
}

export default DocumentPage;
