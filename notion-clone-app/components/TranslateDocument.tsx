'use client';

import * as Y from 'yjs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { FormEvent, useEffect, useState, useTransition } from 'react';
import { getTextContentFromYDoc } from '@/lib/getTextFromYDoc';

import { BotIcon, LanguagesIcon } from 'lucide-react';
import { toast } from 'sonner';
import Markdown from 'react-markdown';

type Language =
  | 'english'
  | 'spanish'
  | 'portuguese'
  | 'french'
  | 'german'
  | 'chinese'
  | 'russian'
  | 'japanese'
  | 'turkish';

const languages: Language[] = [
  'english',
  'spanish',
  'portuguese',
  'french',
  'german',
  'chinese',
  'russian',
  'japanese',
  'turkish',
];

function TranslateDocument({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [language, setLanguage] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [shouldRenderSelect, setShouldRenderSelect] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Slight delay to prevent focus recursion
      const timeout = setTimeout(() => setShouldRenderSelect(true), 50);
      return () => clearTimeout(timeout);
    } else {
      setShouldRenderSelect(false);
    }
  }, [isOpen]);

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const documentData = getTextContentFromYDoc(doc);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentData,
          targetLang: language,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data.translated_text);
        toast.success('Translated Summary Successfully!');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant='outline'>
        <DialogTrigger>
          <LanguagesIcon />
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translate the Document</DialogTitle>
          <DialogDescription>
            Select a language to generate a translated summary of the document.
          </DialogDescription>
          <hr className='mt-5' />
        </DialogHeader>

        {summary && (
          <div className='flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100'>
            <div className='flex items-center gap-2'>
              <BotIcon className='w-5 h-5' />
              <p className='font-bold'>GPT {isPending ? 'is thinking...' : 'says:'}</p>
            </div>
            {isPending ? <p>Thinking...</p> : <Markdown>{summary}</Markdown>}
          </div>
        )}

        <form className='flex gap-2 mt-4' onSubmit={handleAskQuestion}>
          {shouldRenderSelect && (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className='w-full p-2 border rounded'
            >
              <option value=''>Select a Language</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          )}
          <Button type='submit' disabled={!language || isPending}>
            {isPending ? 'Translating...' : 'Translate'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TranslateDocument;
