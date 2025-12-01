export interface Tab {
  id: string;
  name: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface NoteData {
  tabs: Tab[];
  activeTab: number;
  lastSaved: number;
}

export interface EncryptedData {
  version: number;
  salt: string;
  iv: string;
  ciphertext: string;
}

export interface NoteResponse {
  exists: boolean;
  data?: EncryptedData;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveNoteRequest {
  data: EncryptedData;
  deleteTokenHash?: string;
}

export interface DeleteNoteRequest {
  deleteToken: string;
}
