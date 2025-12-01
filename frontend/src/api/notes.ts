import { NoteResponse, SaveNoteRequest, DeleteNoteRequest, EncryptedData } from '../types';

const API_BASE = '/api';

/**
 * Fetch a note by name
 */
export const fetchNote = async (noteName: string): Promise<NoteResponse> => {
  const response = await fetch(`${API_BASE}/note/${encodeURIComponent(noteName)}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch note');
  }
  
  return response.json();
};

/**
 * Save (create or update) a note
 */
export const saveNote = async (
  noteName: string,
  data: EncryptedData,
  deleteTokenHash?: string
): Promise<any> => {
  const body: SaveNoteRequest = { data };
  
  if (deleteTokenHash) {
    body.deleteTokenHash = deleteTokenHash;
  }
  
  const response = await fetch(`${API_BASE}/note/${encodeURIComponent(noteName)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    throw new Error('Failed to save note');
  }
  
  return response.json();
};

/**
 * Delete a note
 */
export const deleteNote = async (
  noteName: string,
  deleteToken: string
): Promise<any> => {
  const body: DeleteNoteRequest = { deleteToken };
  
  const response = await fetch(`${API_BASE}/note/${encodeURIComponent(noteName)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete note');
  }
  
  return response.json();
};
