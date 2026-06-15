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

let cachedPrograms: FlagshipProgram[] = [];
let cachedMessages: Message[] = [];
let cachedSettings: SystemSettings = {
  orgName: '',
  supportEmail: '',
  supportPhone: '',
  supportAddress: '',
};
let cachedQuotes: Quote[] = [];
let cachedEvents: MinistryEvent[] = [];
let cachedTestimonials: Testimonial[] = [];
let cachedComments: Comment[] = [];
let cachedGallery: GalleryItem[] = [];

let publicRealtimeInitPromise: Promise<void> | null = null;

function clearLegacyPublicCache() {
  if (typeof window === 'undefined') {
    return;
  }

  [
    'via_public_programs',
    'via_public_messages',
    'via_public_settings',
    'via_public_quotes',
    'via_public_events',
    'via_public_testimonials',
    'via_public_comments',
    'via_public_gallery',
  ].forEach((key) => window.localStorage.removeItem(key));
}

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
      dispatchUpdate();
    }, (err) => handleFirestoreError(err, OperationType.GET, 'programs'));

    onSnapshot(collection(db, 'messages'), (snap) => {
      cachedMessages = snap.docs.map((entry) => entry.data() as Message);
      dispatchUpdate();
    }, (err) => handleFirestoreError(err, OperationType.GET, 'messages'));

    onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists()) {
        cachedSettings = snap.data() as SystemSettings;
      } else {
        cachedSettings = {
          orgName: '',
          supportEmail: '',
          supportPhone: '',
          supportAddress: '',
        };
      }
      dispatchUpdate();
    }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/general'));

    onSnapshot(collection(db, 'quotes'), (snap) => {
      cachedQuotes = snap.docs.map((entry) => entry.data() as Quote);
      dispatchUpdate();
    }, (err) => handleFirestoreError(err, OperationType.GET, 'quotes'));

    onSnapshot(collection(db, 'events'), (snap) => {
      cachedEvents = snap.docs.map((entry) => entry.data() as MinistryEvent);
      dispatchUpdate();
    }, (err) => handleFirestoreError(err, OperationType.GET, 'events'));

    onSnapshot(collection(db, 'testimonials'), (snap) => {
      cachedTestimonials = snap.docs.map((entry) => entry.data() as Testimonial);
      dispatchUpdate();
    }, (err) => handleFirestoreError(err, OperationType.GET, 'testimonials'));

    onSnapshot(collection(db, 'comments'), (snap) => {
      cachedComments = snap.docs.map((entry) => entry.data() as Comment);
      dispatchUpdate();
    }, (err) => handleFirestoreError(err, OperationType.GET, 'comments'));

    onSnapshot(collection(db, 'gallery'), (snap) => {
      cachedGallery = snap.docs.map((entry) => entry.data() as GalleryItem);
      dispatchUpdate();
    }, (err) => handleFirestoreError(err, OperationType.GET, 'gallery'));
  })();

  return publicRealtimeInitPromise;
}

if (typeof window !== 'undefined') {
  clearLegacyPublicCache();
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
