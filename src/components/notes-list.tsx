'use client';

import { Note } from '@prisma/client';
import { NoteCard } from './note-card';

interface NotesListProps {
  notes: Note[];
}

export function NotesList({ notes }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No notes yet</h3>
        <p className="text-gray-600">Create your first note to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Your Notes ({notes.length})</h2>
      <div className="grid gap-4">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}