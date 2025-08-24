'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createNoteAction } from '@/app/notes/actions';
import { toast } from 'sonner';

export function CreateNoteForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const result = await createNoteAction(formData);
      if (result.success) {
        const form = document.getElementById('create-note-form') as HTMLFormElement;
        form?.reset();
        toast.success('Note created successfully!');
      } else {
        toast.error(result.error || 'Failed to create note');
      }
    } catch (error) {
      toast.error('Failed to create note');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Note</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="create-note-form" action={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="title"
              placeholder="Note title..."
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Textarea
              name="content"
              placeholder="Write your note here..."
              rows={6}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Note'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}