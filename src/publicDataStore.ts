import type { Comment, Event as MinistryEvent, Message, Testimonial } from './types';

export interface Convert {
  id: string;
  fullName: string;
  email: string;
  dateAdded: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption?: string;
  dateAdded: string;
  programId?: string;
  groupName?: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
}

export interface FlagshipProgram {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  date: string;
  time?: string;
  venue?: string;
  regs?: number;
  isDone?: boolean;
}

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  programId: string;
  status: 'Confirmed' | 'Pending';
  dateAdded: string;
}

export interface SystemSettings {
  orgName: string;
  supportEmail: string;
  supportPhone: string;
  supportAddress: string;
}

function readCachedValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function persistCachedValue<T>(key: string, value: T) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write issues and keep runtime cache in memory.
  }
}

let cachedPrograms: FlagshipProgram[] = readCachedValue('via_public_programs', []);
let cachedMessages: Message[] = readCachedValue('via_public_messages', []);
let cachedSettings: SystemSettings = readCachedValue('via_public_settings', {
  orgName: '',
  supportEmail: '',
  supportPhone: '',
  supportAddress: '',
});
let cachedQuotes: Quote[] = readCachedValue('via_public_quotes', []);
let cachedEvents: MinistryEvent[] = readCachedValue('via_public_events', []);
let cachedTestimonials: Testimonial[] = readCachedValue('via_public_testimonials', []);
let cachedComments: Comment[] = readCachedValue('via_public_comments', []);
let cachedGallery: GalleryItem[] = readCachedValue('via_public_gallery', []);

let publicRealtimeInitPromise: Promise<void> | null = null;

function dispatchUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('lumina_store_updated'));
  }
}

async function initPublicRealtime() {
  if (typeof window === 'undefined') {
    return;
  }
  if (publicRealtimeInitPromise) {
    return publicRealtimeInitPromise;
  }

  publicRealtimeInitPromise = (async () => {
    const [{ db, handleFirestoreError, OperationType }, firestore] = await Promise.all([
      import('./firebase'),
      import('firebase/firestore'),
    ]);

    const { collection, doc, onSnapshot } = firestore;

    onSnapshot(collection(db, 'programs'), (snap) => {
      cachedPrograms = snap.docs.map((entry) => entry.data() as FlagshipProgram);
      persistCachedValue('via_public_programs', cachedPrograms);
      dispatchUpdate();
    }, (err) => handleFirestoreError(err, OperationType.GET, 'programs'));

    onSnapshot(collection(db, 'messages'), (snap) => {
      cachedMessages = snap.docs.map((entry) => entry.data() as Message);
      persistCachedValue('via_public_messages', cachedMessages);
      dispatchUpdate();
    }, (err) => handleFirestoreError(err, OperationType.GET, 'messages'));

    onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists()) {
        cachedSettings = snap.data() as SystemSettings;
        persistCachedValue('via_public_settings', cachedSettings);
        dispatchUpdate();
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/general'));

    onSnapshot(collection(db, 'quotes'), (snap) => {
      cachedQuotes = snap.docs.map((entry) => entry.data() as Quote);
      persistCachedValue('via_public_quotes', cachedQuotes);
      dispatchUpdate();
    }, (err) => handleFirestoreError(err, OperationType.GET, 'quotes'));

    onSnapshot(collection(db, 'events'), (snap) => {
      cachedEvents = snap.docs.map((entry) => entry.data() as MinistryEvent);
      persistCachedValue('via_public_events', cachedEvents);
      dispatchUpdate();
    }, (err) => handleFirestoreError(err, OperationType.GET, 'events'));

    onSnapshot(collection(db, 'testimonials'), (snap) => {
      cachedTestimonials = snap.docs.map((entry) => entry.data() as Testimonial);
      persistCachedValue('via_public_testimonials', cachedTestimonials);
      dispatchUpdate();
    }, (err) => handleFirestoreError(err, OperationType.GET, 'testimonials'));

    onSnapshot(collection(db, 'comments'), (snap) => {
      cachedComments = snap.docs.map((entry) => entry.data() as Comment);
      persistCachedValue('via_public_comments', cachedComments);
      dispatchUpdate();
    }, (err) => handleFirestoreError(err, OperationType.GET, 'comments'));

    onSnapshot(collection(db, 'gallery'), (snap) => {
      cachedGallery = snap.docs.map((entry) => entry.data() as GalleryItem);
      persistCachedValue('via_public_gallery', cachedGallery);
      dispatchUpdate();
    }, (err) => handleFirestoreError(err, OperationType.GET, 'gallery'));
  })();

  return publicRealtimeInitPromise;
}

if (typeof window !== 'undefined') {
  void initPublicRealtime();
}

async function writeDocument<T>(collectionName: string, id: string, payload: T) {
  const [{ db, handleFirestoreError, OperationType }, firestore] = await Promise.all([
    import('./firebase'),
    import('firebase/firestore'),
  ]);

  const { doc, setDoc } = firestore;

  return setDoc(doc(db, collectionName, id), payload).catch((err) =>
    handleFirestoreError(err, OperationType.WRITE, `${collectionName}/${id}`)
  );
}

export const publicDataStore = {
  getFlagshipPrograms(): FlagshipProgram[] {
    return cachedPrograms.filter((program) => !program.isDone);
  },

  getQuotes(): Quote[] {
    return cachedQuotes;
  },

  getEvents(): MinistryEvent[] {
    return cachedEvents;
  },

  getTestimonials(): Testimonial[] {
    return cachedTestimonials;
  },

  getSettings(): SystemSettings {
    return cachedSettings;
  },

  addConvert(fullName: string, email: string): Convert {
    const id = `c-${Date.now().toString()}`;
    const newConvert: Convert = {
      id,
      fullName,
      email,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    void writeDocument('converts', id, newConvert);
    return newConvert;
  }
};
