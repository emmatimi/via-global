export interface Program {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Message {
  id: string;
  title: string;
  speaker: string;
  date: string;
  thumbnail: string;
  duration?: string;
  type: 'video' | 'article';
  youtubeLink?: string;
  content?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  type: 'In-person' | 'Online';
  joinLink?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  role: string;
  avatar: string;
  approved?: boolean;
}

export interface Comment {
  id: string;
  teachingId: string;
  userName: string;
  text: string;
  date: string;
}
