import { prisma } from './prisma';
import { CreateNoteInput, UpdateNoteInput } from './validations';

export async function getNotesByUserId(userId: string) {
  return await prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function createNote(userId: string, data: CreateNoteInput) {
  return await prisma.note.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function updateNote(userId: string, data: UpdateNoteInput) {
  const note = await prisma.note.findFirst({
    where: { id: data.id, userId },
  });

  if (!note) {
    throw new Error('Note not found or access denied');
  }

  return await prisma.note.update({
    where: { id: data.id },
    data: {
      title: data.title,
      content: data.content,
    },
  });
}

export async function deleteNote(userId: string, noteId: string) {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId },
  });

  if (!note) {
    throw new Error('Note not found or access denied');
  }

  return await prisma.note.delete({
    where: { id: noteId },
  });
}