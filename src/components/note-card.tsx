'use client';

import { useState } from 'react';
import { Note } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { updateNoteAction, deleteNoteAction } from '@/app/notes/actions';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdate(formData: FormData) {
    setIsLoading(true);
    try {
      const result = await updateNoteAction(formData);
      if (result.success) {
        setIsEditing(false);
        toast.success('Note updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update note');
      }
    } catch (_error) {
      toast.error('Failed to update note');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('id', note.id);
      const result = await deleteNoteAction(formData);
      if (result.success) {
        toast.success('Note deleted successfully!');
      } else {
        toast.error(result.error || 'Failed to delete note');
      }
    } catch (_error) {
      toast.error('Failed to delete note');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        {isEditing ? (
          <div className="flex-1 mr-4">
            <form action={handleUpdate}>
              <input type="hidden" name="id" value={note.id} />
              <Input
                name="title"
                defaultValue={note.title}
                className="mb-3"
                disabled={isLoading}
                required
              />
              <Textarea
                name="content"
                defaultValue={note.content}
                rows={4}
                className="mb-3"
                disabled={isLoading}
                required
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-1" />
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
              <CardContent className="p-0">
                <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                <div className="mt-4 text-sm text-gray-500">
                  Last updated: {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              </CardContent>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardHeader>
    </Card>
  );
}