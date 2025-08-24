'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { createNote, updateNote, deleteNote } from '@/lib/notes';
import { createNoteSchema, updateNoteSchema, deleteNoteSchema } from '@/lib/validations';

export async function createNoteAction(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  const validatedData = createNoteSchema.parse({ title, content });

  try {
    await createNote(userId, validatedData);
    revalidatePath('/notes');
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create note' 
    };
  }
}

export async function updateNoteAction(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  const validatedData = updateNoteSchema.parse({ id, title, content });

  try {
    await updateNote(userId, validatedData);
    revalidatePath('/notes');
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update note' 
    };
  }
}

export async function deleteNoteAction(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const id = formData.get('id') as string;

  const validatedData = deleteNoteSchema.parse({ id });

  try {
    await deleteNote(userId, validatedData.id);
    revalidatePath('/notes');
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete note' 
    };
  }
}