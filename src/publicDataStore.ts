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

const DEFAULT_PROGRAMS: FlagshipProgram[] = [
  {
    id: 'fan-to-flame',
    title: '5 Hours Prayer Retreat',
    subtitle: 'Fan to Flame',
    description: 'A prayer retreat set to rekindle your spiritual fire, revive your passion for God, and stir your heart powerfully toward prayer and purpose. This is not just another gathering. It is a moment of ignition, alignment, and fresh encounter with God. Come ready to be stirred. Come ready to be set ablaze.',
    image: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    date: 'Oct 24, 2026',
    time: '10:00 AM - 3:00 PM',
    venue: 'Main Auditorium, VIA Global Center'
  },
  {
    id: 'believers-meeting',
    title: "Believer's Meeting",
    subtitle: 'Growing in the knowledge of Christ',
    description: 'We all have questions about "THIS OUR GOD". We have questions about His Christ. Let\'s learn him together from the very basics. Join us as we learn CHRIST together, and grow in the knowledge of him together. See you all at Believers\' Meeting.',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    date: 'Nov 02, 2026',
    time: '5:00 PM',
    venue: 'Fellowship Hall & Online Zoom'
  }
];

const DEFAULT_MESSAGES: Message[] = [
  {
    id: '1',
    title: 'The Posture of Purpose',
    speaker: 'Ministry Leadership',
    date: 'March 15, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    duration: '45 MIN',
    type: 'video',
    youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: '2',
    title: 'Awakening the Inner Light',
    speaker: 'Guest Minister',
    date: 'February 28, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'article',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    id: '3',
    title: 'Navigating Seasons of Faith',
    speaker: 'Ministry Leadership',
    date: 'February 10, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    duration: '38 MIN',
    type: 'video',
    youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
];

const DEFAULT_SETTINGS: SystemSettings = {
  orgName: 'VIA Global',
  supportEmail: 'viaglobal@gmail.com',
  supportPhone: '+1 (800) 555-LIFE',
  supportAddress: '123 Horizon Avenue, Suite 400, New York, NY 10001',
};

const DEFAULT_QUOTES: Quote[] = [
  { id: 'q-1', text: "The cross represents the perfect replacement of our guilt with His purity, our sickness with His vitality, and our death with His life.", author: "Ministry Leadership" },
  { id: 'q-2', text: "Grace is not a license to sin; it is the empowering presence of God that frees us from the gravity of sin entirely.", author: "Apostle of Grace" },
  { id: 'q-3', text: "Religion asks what you can do for God, but the Gospel reveals what Jesus Christ has already done for you.", author: "Martin Luther" }
];

const DEFAULT_EVENTS: MinistryEvent[] = [
  {
    id: 'e-1',
    title: 'Annual Vision Conference',
    date: 'April 20-22, 2026',
    time: '9:00 AM - 4:00 PM',
    location: 'Downtown Center & Online',
    type: 'In-person',
    joinLink: 'https://whatsapp.com/channel/0029VaDP7Wy652Y0F5a9zU3V'
  },
  {
    id: 'e-2',
    title: 'Global Prayer Watch',
    date: 'Fridays',
    time: '8:00 PM EST',
    location: 'Online Broadcast',
    type: 'Online',
    joinLink: 'https://t.me/placeholder_telegram_group'
  },
  {
    id: 'e-3',
    title: 'Community Outreach Day',
    date: 'May 15, 2026',
    time: '10:00 AM - 2:00 PM',
    location: 'City Square',
    type: 'In-person',
    joinLink: 'https://whatsapp.com/channel/0029VaDP7Wy652Y0F5a9zU3V'
  }
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Sarah J.',
    quote: "Being part of this community has completely shifted my perspective on my calling. I've found genuine connection and deep spiritual growth here.",
    role: 'Young Adult Leader',
    avatar: '',
    approved: true
  },
  {
    id: 't-2',
    name: 'David & Maria',
    quote: 'The teachings have been an anchor for our family during transitional seasons. We are so grateful for the consistent, truth-filled messages.',
    role: 'Partners',
    avatar: '',
    approved: true
  },
  {
    id: 't-3',
    name: 'Michael T.',
    quote: 'The prayer gatherings are electric. You can truly sense a shift happening. It is more than just an event; it is a movement.',
    role: 'Volunteer',
    avatar: '',
    approved: true
  }
];

const DEFAULT_COMMENTS: Comment[] = [
  {
    id: 'c-1',
    teachingId: '1',
    userName: 'Brother Timothy',
    text: 'This message truly blessed me. Seeking alignment over activity is such an important posture!',
    date: '2026-06-05'
  },
  {
    id: 'c-2',
    teachingId: '2',
    userName: 'Sister Evelyn',
    text: 'What a refreshing article on awakening our inner light. Looking forward to more written teachings like this.',
    date: '2026-06-07'
  }
];

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'g-1',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    caption: 'Believers joined together in fellowship and prayer',
    dateAdded: '2026-06-01'
  },
  {
    id: 'g-2',
    imageUrl: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    caption: 'Moments of earnest worship and connection in active ministry',
    dateAdded: '2026-06-05'
  },
  {
    id: 'g-3',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    caption: 'Youth Outreach and Fellowship Platform',
    dateAdded: '2026-06-08'
  }
];

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
      if (!snap.empty) {
        cachedPrograms = snap.docs.map((entry) => entry.data() as FlagshipProgram);
        persistCachedValue('via_public_programs', cachedPrograms);
        dispatchUpdate();
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'programs'));

    onSnapshot(collection(db, 'messages'), (snap) => {
      if (!snap.empty) {
        cachedMessages = snap.docs.map((entry) => entry.data() as Message);
        persistCachedValue('via_public_messages', cachedMessages);
        dispatchUpdate();
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'messages'));

    onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists()) {
        cachedSettings = snap.data() as SystemSettings;
        persistCachedValue('via_public_settings', cachedSettings);
        dispatchUpdate();
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/general'));

    onSnapshot(collection(db, 'quotes'), (snap) => {
      if (!snap.empty) {
        cachedQuotes = snap.docs.map((entry) => entry.data() as Quote);
        persistCachedValue('via_public_quotes', cachedQuotes);
        dispatchUpdate();
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'quotes'));

    onSnapshot(collection(db, 'events'), (snap) => {
      if (!snap.empty) {
        cachedEvents = snap.docs.map((entry) => entry.data() as MinistryEvent);
        persistCachedValue('via_public_events', cachedEvents);
        dispatchUpdate();
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'events'));

    onSnapshot(collection(db, 'testimonials'), (snap) => {
      if (!snap.empty) {
        cachedTestimonials = snap.docs.map((entry) => entry.data() as Testimonial);
        persistCachedValue('via_public_testimonials', cachedTestimonials);
        dispatchUpdate();
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'testimonials'));

    onSnapshot(collection(db, 'comments'), (snap) => {
      if (!snap.empty) {
        cachedComments = snap.docs.map((entry) => entry.data() as Comment);
        persistCachedValue('via_public_comments', cachedComments);
        dispatchUpdate();
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'comments'));

    onSnapshot(collection(db, 'gallery'), (snap) => {
      if (!snap.empty) {
        cachedGallery = snap.docs.map((entry) => entry.data() as GalleryItem);
        persistCachedValue('via_public_gallery', cachedGallery);
        dispatchUpdate();
      }
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
