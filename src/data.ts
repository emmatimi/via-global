import { Program, Message, Event, Testimonial } from './types';

export const programs: Program[] = [
  {
    id: '1',
    title: 'Discipleship',
    description: 'Deepen your roots in the Word through guided study and mentorship.',
    icon: 'BookOpen',
  },
  {
    id: '2',
    title: 'Prayer Gatherings',
    description: 'Join us in targeted, spirit-led intercession for our cities and generation.',
    icon: 'Flame',
  },
  {
    id: '3',
    title: 'Outreach Initiatives',
    description: 'Taking the message of hope and practical love to our communities.',
    icon: 'Globe',
  },
  {
    id: '4',
    title: 'Leadership Development',
    description: 'Equipping the next generation of Kingdom builders and visionaries.',
    icon: 'Shield',
  },
  {
    id: '5',
    title: 'Media Ministry',
    description: 'Spreading light through digital content, teaching, and creative arts.',
    icon: 'Video',
  },
  {
    id: '6',
    title: 'Youth Community',
    description: 'A vibrant space for young adults to discover purpose and connect.',
    icon: 'Users',
  },
];

export const messages: Message[] = [
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

export const events: Event[] = [
  {
    id: '1',
    title: 'Annual Vision Conference',
    date: 'April 20-22, 2026',
    time: '9:00 AM - 4:00 PM',
    location: 'Downtown Center & Online',
    type: 'In-person',
  },
  {
    id: '2',
    title: 'Global Prayer Watch',
    date: 'Fridays',
    time: '8:00 PM EST',
    location: 'Online Broadcast',
    type: 'Online',
  },
  {
    id: '3',
    title: 'Community Outreach Day',
    date: 'May 15, 2026',
    time: '10:00 AM - 2:00 PM',
    location: 'City Square',
    type: 'In-person',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah J.',
    quote: "Being part of this community has completely shifted my perspective on my calling. I\'ve found genuine connection and deep spiritual growth here.",
    role: 'Young Adult Leader',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '2',
    name: 'David & Maria',
    quote: 'The teachings have been an anchor for our family during transitional seasons. We are so grateful for the consistent, truth-filled messages.',
    role: 'Partners',
    avatar: 'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '3',
    name: 'Michael T.',
    quote: 'The prayer gatherings are electric. You can truly sense a shift happening. It is more than just an event; it is a movement.',
    role: 'Volunteer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
];
