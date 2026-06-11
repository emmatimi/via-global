import { db, handleFirestoreError, OperationType, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Message, Event as MinistryEvent, Testimonial, Comment } from './types';

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

export interface Broadcast {
  id: string;
  subject: string;
  message: string;
  date: string;
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

const DEFAULT_REGISTRATIONS: Registration[] = [
  { id: 'reg-1', fullName: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '+12345678', location: 'New York', programId: 'fan-to-flame', status: 'Confirmed', dateAdded: '2026-06-09' },
  { id: 'reg-2', fullName: 'Michael O.', email: 'm.ola@example.com', phone: '+78543789', location: 'Houston', programId: 'believers-meeting', status: 'Confirmed', dateAdded: '2026-06-08' },
  { id: 'reg-3', fullName: 'Adebayo T.', email: 'ade.t@example.com', phone: '+54611488', location: 'Chicago', programId: 'fan-to-flame', status: 'Pending', dateAdded: '2026-06-09' },
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

// Memory Caches representing current live db state (to serve instantaneous reads)
let cachedPrograms: FlagshipProgram[] = DEFAULT_PROGRAMS;
let cachedMessages: Message[] = DEFAULT_MESSAGES;
let cachedRegistrations: Registration[] = [];
let cachedSettings: SystemSettings = DEFAULT_SETTINGS;
let cachedBroadcasts: Broadcast[] = [];
let cachedQuotes: Quote[] = DEFAULT_QUOTES;
let cachedConverts: Convert[] = [];
let cachedEvents: MinistryEvent[] = DEFAULT_EVENTS;
let cachedTestimonials: Testimonial[] = DEFAULT_TESTIMONIALS;
let cachedComments: Comment[] = DEFAULT_COMMENTS;
let cachedGallery: GalleryItem[] = DEFAULT_GALLERY;

// Avoid double seeding triggers in concurrent runtime
const hasSeedingStarted: Record<string, boolean> = {};

function isAdminUser(email: string | null | undefined): boolean {
  return !!email;
}

function trySeed(collectionName: string, items: any[]) {
  if (hasSeedingStarted[collectionName]) return;
  const user = auth.currentUser;
  if (user && isAdminUser(user.email)) {
    hasSeedingStarted[collectionName] = true;
    items.forEach(item => {
      setDoc(doc(db, collectionName, item.id), item).catch(console.error);
    });
  }
}

// Register Realtime Listeners (Public Read Collections)
onSnapshot(collection(db, 'programs'), (snap) => {
  if (snap.empty) {
    trySeed('programs', DEFAULT_PROGRAMS);
  } else {
    cachedPrograms = snap.docs.map(d => d.data() as FlagshipProgram);
    window.dispatchEvent(new Event('lumina_store_updated'));
  }
}, (err) => handleFirestoreError(err, OperationType.GET, 'programs'));

onSnapshot(collection(db, 'messages'), (snap) => {
  if (snap.empty) {
    trySeed('messages', DEFAULT_MESSAGES);
  } else {
    cachedMessages = snap.docs.map(d => d.data() as Message);
    window.dispatchEvent(new Event('lumina_store_updated'));
  }
}, (err) => handleFirestoreError(err, OperationType.GET, 'messages'));

onSnapshot(doc(db, 'settings', 'general'), (snap) => {
  if (!snap.exists()) {
    const user = auth.currentUser;
    if (user && isAdminUser(user.email)) {
      setDoc(doc(db, 'settings', 'general'), DEFAULT_SETTINGS).catch(console.error);
    }
  } else {
    cachedSettings = snap.data() as SystemSettings;
    window.dispatchEvent(new Event('lumina_store_updated'));
  }
}, (err) => handleFirestoreError(err, OperationType.GET, 'settings/general'));

onSnapshot(collection(db, 'quotes'), (snap) => {
  if (snap.empty) {
    trySeed('quotes', DEFAULT_QUOTES);
  } else {
    cachedQuotes = snap.docs.map(d => d.data() as Quote);
    window.dispatchEvent(new Event('lumina_store_updated'));
  }
}, (err) => handleFirestoreError(err, OperationType.GET, 'quotes'));

onSnapshot(collection(db, 'events'), (snap) => {
  if (snap.empty) {
    trySeed('events', DEFAULT_EVENTS);
  } else {
    cachedEvents = snap.docs.map(d => d.data() as MinistryEvent);
    window.dispatchEvent(new Event('lumina_store_updated'));
  }
}, (err) => handleFirestoreError(err, OperationType.GET, 'events'));

onSnapshot(collection(db, 'testimonials'), (snap) => {
  if (snap.empty) {
    trySeed('testimonials', DEFAULT_TESTIMONIALS);
  } else {
    cachedTestimonials = snap.docs.map(d => d.data() as Testimonial);
    window.dispatchEvent(new Event('lumina_store_updated'));
  }
}, (err) => handleFirestoreError(err, OperationType.GET, 'testimonials'));

onSnapshot(collection(db, 'comments'), (snap) => {
  if (snap.empty) {
    trySeed('comments', DEFAULT_COMMENTS);
  } else {
    cachedComments = snap.docs.map(d => d.data() as Comment);
    window.dispatchEvent(new Event('lumina_store_updated'));
  }
}, (err) => handleFirestoreError(err, OperationType.GET, 'comments'));

onSnapshot(collection(db, 'gallery'), (snap) => {
  if (snap.empty) {
    trySeed('gallery', DEFAULT_GALLERY);
  } else {
    cachedGallery = snap.docs.map(d => d.data() as GalleryItem);
    window.dispatchEvent(new Event('lumina_store_updated'));
  }
}, (err) => handleFirestoreError(err, OperationType.GET, 'gallery'));

// Register Realtime Listeners (Admin-Only Collections, dynamically synced)
let registrationsUnsubscribe: (() => void) | null = null;
let convertsUnsubscribe: (() => void) | null = null;
let broadcastsUnsubscribe: (() => void) | null = null;

onAuthStateChanged(auth, (user) => {
  if (user && isAdminUser(user.email)) {
    if (!registrationsUnsubscribe) {
      registrationsUnsubscribe = onSnapshot(collection(db, 'registrations'), (snap) => {
        if (snap.empty) {
          trySeed('registrations', DEFAULT_REGISTRATIONS);
        } else {
          cachedRegistrations = snap.docs.map(d => d.data() as Registration);
          window.dispatchEvent(new Event('lumina_store_updated'));
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'registrations'));
    }
    if (!convertsUnsubscribe) {
      convertsUnsubscribe = onSnapshot(collection(db, 'converts'), (snap) => {
        if (snap.empty) {
          const initialConvert: Convert = {
            id: 'c-1',
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            dateAdded: '2026-06-09'
          };
          trySeed('converts', [initialConvert]);
        } else {
          cachedConverts = snap.docs.map(d => d.data() as Convert);
          window.dispatchEvent(new Event('lumina_store_updated'));
        }
      }, (err) => handleFirestoreError(err, OperationType.GET, 'converts'));
    }
    if (!broadcastsUnsubscribe) {
      broadcastsUnsubscribe = onSnapshot(collection(db, 'broadcasts'), (snap) => {
        cachedBroadcasts = snap.docs.map(d => d.data() as Broadcast);
        window.dispatchEvent(new Event('lumina_store_updated'));
      }, (err) => handleFirestoreError(err, OperationType.GET, 'broadcasts'));
    }
  } else {
    if (registrationsUnsubscribe) {
      registrationsUnsubscribe();
      registrationsUnsubscribe = null;
    }
    if (convertsUnsubscribe) {
      convertsUnsubscribe();
      convertsUnsubscribe = null;
    }
    if (broadcastsUnsubscribe) {
      broadcastsUnsubscribe();
      broadcastsUnsubscribe = null;
    }
    cachedRegistrations = [];
    cachedConverts = [];
    cachedBroadcasts = [];
    window.dispatchEvent(new Event('lumina_store_updated'));
  }
});


// COLD-START REPLICATOR FOR STORAGE COMPATIBILITY
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('lumina_')) {
      window.dispatchEvent(new Event('lumina_store_updated'));
    }
  });
}


// EXPORT SERVICE API
export const dataStore = {
  // Programs
  getFlagshipPrograms(): FlagshipProgram[] {
    const regs = this.getRegistrations();
    return cachedPrograms.map(p => {
      const counts = regs.filter(r => r.programId === p.id).length;
      return { ...p, regs: counts };
    });
  },

  getFlagshipProgram(id: string): FlagshipProgram | undefined {
    return this.getFlagshipPrograms().find(p => p.id === id);
  },

  addFlagshipProgram(p: Omit<FlagshipProgram, 'id' | 'regs'>): FlagshipProgram {
    const id = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const finalId = id || Date.now().toString();
    const newProgram: FlagshipProgram = {
      ...p,
      id: finalId,
      regs: 0
    };
    
    setDoc(doc(db, 'programs', finalId), newProgram)
      .catch(err => handleFirestoreError(err, OperationType.WRITE, 'programs/' + finalId));
    return newProgram;
  },

  updateFlagshipProgram(updated: FlagshipProgram): void {
    setDoc(doc(db, 'programs', updated.id), updated)
      .catch(err => handleFirestoreError(err, OperationType.WRITE, 'programs/' + updated.id));
  },

  deleteFlagshipProgram(id: string): void {
    deleteDoc(doc(db, 'programs', id))
      .catch(err => handleFirestoreError(err, OperationType.DELETE, 'programs/' + id));
  },

  // Teachings (Messages)
  getMessages(): Message[] {
    return cachedMessages;
  },

  getMessage(id: string): Message | undefined {
    return cachedMessages.find(m => m.id === id);
  },

  addMessage(m: Omit<Message, 'id'>): Message {
    const id = Date.now().toString();
    const newMsg: Message = { ...m, id };
    
    setDoc(doc(db, 'messages', id), newMsg)
      .catch(err => handleFirestoreError(err, OperationType.WRITE, 'messages/' + id));
    return newMsg;
  },

  updateMessage(updated: Message): void {
    setDoc(doc(db, 'messages', updated.id), updated)
      .catch(err => handleFirestoreError(err, OperationType.WRITE, 'messages/' + updated.id));
  },

  deleteMessage(id: string): void {
    deleteDoc(doc(db, 'messages', id))
      .catch(err => handleFirestoreError(err, OperationType.DELETE, 'messages/' + id));
  },

  // Registrations
  getRegistrations(): Registration[] {
    return cachedRegistrations;
  },

  addRegistration(r: Omit<Registration, 'id' | 'status' | 'dateAdded'>): Registration {
    const id = 'reg-' + Date.now().toString();
    const newReg: Registration = {
      ...r,
      id,
      status: 'Confirmed',
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    setDoc(doc(db, 'registrations', id), newReg)
      .catch(err => handleFirestoreError(err, OperationType.WRITE, 'registrations/' + id));
    return newReg;
  },

  // Settings
  getSettings(): SystemSettings {
    return cachedSettings;
  },

  saveSettings(settings: SystemSettings): void {
    setDoc(doc(db, 'settings', 'general'), settings)
      .catch(err => handleFirestoreError(err, OperationType.WRITE, 'settings/general'));
  },

  // Broadcasts
  getBroadcasts(): Broadcast[] {
    return cachedBroadcasts;
  },

  addBroadcast(subject: string, message: string): Broadcast {
    const id = 'bc-' + Date.now().toString();
    const newBroadcast: Broadcast = {
      id,
      subject,
      message,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setDoc(doc(db, 'broadcasts', id), newBroadcast)
      .catch(err => handleFirestoreError(err, OperationType.WRITE, 'broadcasts/' + id));
    return newBroadcast;
  },

  // Quotes
  getQuotes(): Quote[] {
    return cachedQuotes;
  },

  addQuote(text: string, author: string): Quote {
    const id = 'q-' + Date.now().toString();
    const newQuote: Quote = {
      id,
      text,
      author: author || 'Anonymous'
    };
    
    setDoc(doc(db, 'quotes', id), newQuote)
      .catch(err => handleFirestoreError(err, OperationType.WRITE, 'quotes/' + id));
    return newQuote;
  },

  updateQuote(updated: Quote): void {
    setDoc(doc(db, 'quotes', updated.id), updated)
      .catch(err => handleFirestoreError(err, OperationType.WRITE, 'quotes/' + updated.id));
  },

  deleteQuote(id: string): void {
    deleteDoc(doc(db, 'quotes', id))
      .catch(err => handleFirestoreError(err, OperationType.DELETE, 'quotes/' + id));
  },

  // Converts
  getConverts(): Convert[] {
    return cachedConverts;
  },

  addConvert(fullName: string, email: string): Convert {
    const id = 'c-' + Date.now().toString();
    const newConvert: Convert = {
      id,
      fullName,
      email,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    setDoc(doc(db, 'converts', id), newConvert)
      .catch(err => handleFirestoreError(err, OperationType.WRITE, 'converts/' + id));
    return newConvert;
  },

  deleteConvert(id: string): void {
    deleteDoc(doc(db, 'converts', id))
      .catch(err => handleFirestoreError(err, OperationType.DELETE, 'converts/' + id));
  },

  // Events
  getEvents(): MinistryEvent[] {
    return cachedEvents;
  },

  addEvent(e: Omit<MinistryEvent, 'id'>): MinistryEvent {
    const id = 'e-' + Date.now().toString();
    const newEvent: MinistryEvent = { ...e, id };
    
    setDoc(doc(db, 'events', id), newEvent)
      .catch(err => handleFirestoreError(err, OperationType.WRITE, 'events/' + id));
    return newEvent;
  },

  updateEvent(updated: MinistryEvent): void {
    setDoc(doc(db, 'events', updated.id), updated)
      .catch(err => handleFirestoreError(err, OperationType.WRITE, 'events/' + updated.id));
  },

  deleteEvent(id: string): void {
    deleteDoc(doc(db, 'events', id))
      .catch(err => handleFirestoreError(err, OperationType.DELETE, 'events/' + id));
  },

  // Testimonials
  getTestimonials(): Testimonial[] {
    return cachedTestimonials;
  },

  addTestimonial(t: Omit<Testimonial, 'id'>): Testimonial {
    const id = 't-' + Date.now().toString();
    const newTestimonial: Testimonial = {
      ...t,
      id,
      approved: t.approved !== undefined ? t.approved : false
    };
    
    setDoc(doc(db, 'testimonials', id), newTestimonial)
      .catch(err => handleFirestoreError(err, OperationType.WRITE, 'testimonials/' + id));
    return newTestimonial;
  },

  updateTestimonial(updated: Testimonial): void {
    setDoc(doc(db, 'testimonials', updated.id), updated)
      .catch(err => handleFirestoreError(err, OperationType.WRITE, 'testimonials/' + updated.id));
  },

  deleteTestimonial(id: string): void {
    deleteDoc(doc(db, 'testimonials', id))
      .catch(err => handleFirestoreError(err, OperationType.DELETE, 'testimonials/' + id));
  },

  // Comments
  getComments(): Comment[] {
    return cachedComments;
  },

  getCommentsForTeaching(teachingId: string): Comment[] {
    return cachedComments.filter(c => c.teachingId === teachingId);
  },

  addComment(c: Omit<Comment, 'id' | 'date'>): Comment {
    const id = 'c-' + Date.now().toString();
    const newComment: Comment = {
      ...c,
      id,
      date: new Date().toISOString().split('T')[0]
    };
    
    setDoc(doc(db, 'comments', id), newComment)
      .catch(err => handleFirestoreError(err, OperationType.WRITE, 'comments/' + id));
    return newComment;
  },

  deleteComment(id: string): void {
    deleteDoc(doc(db, 'comments', id))
      .catch(err => handleFirestoreError(err, OperationType.DELETE, 'comments/' + id));
  },

  // Gallery
  getGallery(): GalleryItem[] {
    return cachedGallery.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
  },

  addGalleryItem(item: Omit<GalleryItem, 'id' | 'dateAdded'>): GalleryItem {
    const id = 'g-' + Date.now().toString();
    const newItem: GalleryItem = {
      ...item,
      id,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setDoc(doc(db, 'gallery', id), newItem)
      .catch(err => handleFirestoreError(err, OperationType.WRITE, 'gallery/' + id));
    return newItem;
  },

  deleteGalleryItem(id: string): void {
    deleteDoc(doc(db, 'gallery', id))
      .catch(err => handleFirestoreError(err, OperationType.DELETE, 'gallery/' + id));
  }
};
