import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getNotesByUserId } from '@/lib/notes';
import { NotesList } from '@/components/notes-list';
import { CreateNoteForm } from '@/components/create-note-form';
import { UserButton } from '@clerk/nextjs';

export default async function NotesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const notes = await getNotesByUserId(userId);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
            <UserButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CreateNoteForm />
          </div>
          <div className="lg:col-span-2">
            <NotesList notes={notes} />
          </div>
        </div>
      </main>
    </div>
  );
}