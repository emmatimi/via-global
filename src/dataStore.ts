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

// Memory caches representing current live db state.
let cachedPrograms: FlagshipProgram[] = [];
let cachedMessages: Message[] = [];
let cachedRegistrations: Registration[] = [];
let cachedSettings: SystemSettings = {
  orgName: '',
  supportEmail: '',
  supportPhone: '',
  supportAddress: '',
};
let cachedBroadcasts: Broadcast[] = [];
let cachedQuotes: Quote[] = [];
let cachedConverts: Convert[] = [];
let cachedEvents: MinistryEvent[] = [];
let cachedTestimonials: Testimonial[] = [];
let cachedComments: Comment[] = [];
let cachedGallery: GalleryItem[] = [];

// Register Realtime Listeners (Public Read Collections)
onSnapshot(collection(db, 'programs'), (snap) => {
  cachedPrograms = snap.docs.map(d => d.data() as FlagshipProgram);
  window.dispatchEvent(new Event('lumina_store_updated'));
}, (err) => handleFirestoreError(err, OperationType.GET, 'programs'));

onSnapshot(collection(db, 'messages'), (snap) => {
  cachedMessages = snap.docs.map(d => d.data() as Message);
  window.dispatchEvent(new Event('lumina_store_updated'));
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
  window.dispatchEvent(new Event('lumina_store_updated'));
}, (err) => handleFirestoreError(err, OperationType.GET, 'settings/general'));

onSnapshot(collection(db, 'quotes'), (snap) => {
  cachedQuotes = snap.docs.map(d => d.data() as Quote);
  window.dispatchEvent(new Event('lumina_store_updated'));
}, (err) => handleFirestoreError(err, OperationType.GET, 'quotes'));

onSnapshot(collection(db, 'events'), (snap) => {
  cachedEvents = snap.docs.map(d => d.data() as MinistryEvent);
  window.dispatchEvent(new Event('lumina_store_updated'));
}, (err) => handleFirestoreError(err, OperationType.GET, 'events'));

onSnapshot(collection(db, 'testimonials'), (snap) => {
  cachedTestimonials = snap.docs.map(d => d.data() as Testimonial);
  window.dispatchEvent(new Event('lumina_store_updated'));
}, (err) => handleFirestoreError(err, OperationType.GET, 'testimonials'));

onSnapshot(collection(db, 'comments'), (snap) => {
  cachedComments = snap.docs.map(d => d.data() as Comment);
  window.dispatchEvent(new Event('lumina_store_updated'));
}, (err) => handleFirestoreError(err, OperationType.GET, 'comments'));

onSnapshot(collection(db, 'gallery'), (snap) => {
  cachedGallery = snap.docs.map(d => d.data() as GalleryItem);
  window.dispatchEvent(new Event('lumina_store_updated'));
}, (err) => handleFirestoreError(err, OperationType.GET, 'gallery'));

// Register Realtime Listeners (Admin-Only Collections, dynamically synced)
let registrationsUnsubscribe: (() => void) | null = null;
let convertsUnsubscribe: (() => void) | null = null;
let broadcastsUnsubscribe: (() => void) | null = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (!registrationsUnsubscribe) {
      registrationsUnsubscribe = onSnapshot(collection(db, 'registrations'), (snap) => {
        cachedRegistrations = snap.docs.map(d => d.data() as Registration);
        window.dispatchEvent(new Event('lumina_store_updated'));
      }, (err) => handleFirestoreError(err, OperationType.GET, 'registrations'));
    }
    if (!convertsUnsubscribe) {
      convertsUnsubscribe = onSnapshot(collection(db, 'converts'), (snap) => {
        cachedConverts = snap.docs.map(d => d.data() as Convert);
        window.dispatchEvent(new Event('lumina_store_updated'));
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
