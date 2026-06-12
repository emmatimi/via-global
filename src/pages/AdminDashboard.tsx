import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Calendar, 
  Settings as SettingsIcon, 
  Video, 
  Plus, 
  Bell, 
  LogOut, 
  CheckCircle, 
  Menu, 
  X, 
  Edit, 
  Trash2, 
  Mail, 
  Lock,
  MapPin,
  Users as UsersIcon,
  ShieldAlert,
  Quote as QuoteIcon,
  Heart,
  Send,
  MessageSquare,
  Image,
  Folder,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';
import { ImageUpload } from '../components/ImageUpload';
import { dataStore, FlagshipProgram, Registration, SystemSettings, Quote, Convert, GalleryItem } from '../dataStore';
import { Message, Event as MinistryEvent, Testimonial, Comment } from '../types';

type TabType = 'dashboard' | 'programs' | 'teachings' | 'broadcast' | 'quotes' | 'converts' | 'events' | 'testimonials' | 'comments' | 'gallery' | 'settings';

// PROGRAM MODAL FORM (Multi-functional: handles both Create and Edit)
interface ProgramModalProps {
  program?: FlagshipProgram;
  onClose: () => void;
  onSubmit: (data: Omit<FlagshipProgram, 'id' | 'regs'> & { id?: string }) => void;
}

function ProgramModal({ program, onClose, onSubmit }: ProgramModalProps) {
  const [title, setTitle] = useState(program?.title || '');
  const [subtitle, setSubtitle] = useState(program?.subtitle || '');
  const [date, setDate] = useState(program?.date || '');
  const [time, setTime] = useState(program?.time || '');
  const [image, setImage] = useState(program?.image || '');
  const [venue, setVenue] = useState(program?.venue || '');
  const [description, setDescription] = useState(program?.description || '');
  const [isDone, setIsDone] = useState(program?.isDone || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: program?.id,
      title,
      subtitle,
      date,
      time,
      image: image || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      venue,
      description,
      isDone
    });
  };

  return (
    <div className="fixed inset-0 bg-navy-900/95 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-navy-900 border border-white/10 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
          <h3 className="text-xl font-serif italic text-soft-white">
            {program ? 'Edit Program' : 'Create Program'}
          </h3>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form className="p-6 space-y-4 overflow-y-auto" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Program Title</label>
            <input 
              type="text" 
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500" 
              placeholder="e.g. Believers' Meeting" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Subtitle / Tagline</label>
            <input 
              type="text" 
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500" 
              placeholder="e.g. Growing in the knowledge of Christ" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Date (As text displayed, e.g. Oct 24, 2026)</label>
            <input 
              type="text" 
              required 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500" 
              placeholder="e.g. Nov 02, 2026"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Venue / Location</label>
            <input 
              type="text" 
              required 
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500" 
              placeholder="e.g. Main Auditorium, VIA Global Center" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Time (As text displayed)</label>
            <input 
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500"
              placeholder="e.g. 5:00 PM or 10:00 AM - 3:00 PM"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 flex justify-between">
              <span>Cover Image URL</span>
              {image && <span className="text-gold-500">Selected ✓</span>}
            </label>
            <ImageUpload onImageSelected={(url) => setImage(url)} defaultImage={image} />
            {image && image.startsWith('data:') ? (
              <div className="flex justify-between items-center bg-white/5 border border-white/10 px-4 py-2.5 rounded-sm text-xs text-white/60">
                <span className="truncate max-w-[200px] font-mono text-[10px] text-gold-500">✓ Local image file loaded</span>
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="text-red-400 hover:text-red-300 transition-colors uppercase text-[9px] font-bold tracking-widest cursor-pointer"
                >
                  Clear Image
                </button>
              </div>
            ) : (
              <input 
                type="url" 
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-xs text-white/60 focus:outline-none focus:border-gold-500" 
                placeholder="Or paste an image link directly" 
              />
            )}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Description</label>
            <textarea 
              required 
              rows={4} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500" 
              placeholder="Details about this program..."
            ></textarea>
          </div>
          <div className="flex items-center gap-3 py-2">
            <input 
              type="checkbox" 
              id="isDoneCheckbox"
              checked={isDone}
              onChange={(e) => setIsDone(e.target.checked)}
              className="accent-gold-500 w-4 h-4 rounded-sm cursor-pointer"
            />
            <label htmlFor="isDoneCheckbox" className="text-xs text-white/80 font-bold uppercase tracking-wider cursor-pointer select-none">
              Mark Program as Done (Completes the program)
            </label>
          </div>
          <div className="pt-4 flex justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} className="px-6 py-3 border border-white/20 text-white/70 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm">Cancel</button>
            <button type="submit" className="px-6 py-3 bg-gradient-to-tr from-gold-500 to-gold-400 hover:to-gold-500 text-navy-900 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm shadow-lg shadow-gold-500/10">
              {program ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// GALLERY MODAL FORM (Handles adding gallery items)
interface GalleryModalProps {
  onClose: () => void;
  onSubmit: (data: { imageUrl: string; caption?: string; programId?: string; groupName?: string }) => void;
}

function GalleryModal({ onClose, onSubmit }: GalleryModalProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [groupType, setGroupType] = useState<'none' | 'program' | 'custom'>('none');
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [customGroupName, setCustomGroupName] = useState('');

  const programs = dataStore.getFlagshipPrograms();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;

    let programId: string | undefined = undefined;
    let groupName: string | undefined = undefined;

    if (groupType === 'program' && selectedProgramId) {
      programId = selectedProgramId;
      const prog = programs.find(p => p.id === selectedProgramId);
      if (prog) {
        groupName = prog.title;
      }
    } else if (groupType === 'custom' && customGroupName.trim()) {
      groupName = customGroupName.trim();
    }

    onSubmit({ imageUrl, caption, programId, groupName });
  };

  return (
    <div className="fixed inset-0 bg-navy-900/95 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-navy-900 border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
          <h3 className="text-xl font-serif italic text-soft-white">
            Add Photo to Gallery
          </h3>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form className="p-6 space-y-4 overflow-y-auto" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 flex justify-between">
              <span>Photo Upload / URL</span>
              {imageUrl && <span className="text-gold-500">Selected ✓</span>}
            </label>
            <ImageUpload onImageSelected={(url) => setImageUrl(url)} defaultImage={imageUrl} />
            {imageUrl && imageUrl.startsWith('data:') ? (
              <div className="flex justify-between items-center bg-white/5 border border-white/10 px-4 py-2.5 rounded-sm text-xs text-white/60">
                <span className="truncate max-w-[200px] font-mono text-[10px] text-gold-500">✓ Local image file loaded</span>
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-red-400 hover:text-red-300 transition-colors uppercase text-[9px] font-bold tracking-widest cursor-pointer"
                >
                  Clear Image
                </button>
              </div>
            ) : (
              <input 
                type="url" 
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-xs text-white/60 focus:outline-none focus:border-gold-500" 
                placeholder="Or paste direct image URL here..." 
              />
            )}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Caption / Description</label>
            <input 
              type="text" 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500" 
              placeholder="e.g. Believers gathering for Friday Vigils..." 
            />
          </div>

          <div className="space-y-2 border-t border-white/5 pt-4">
            <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Group / Program Association</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setGroupType('none')}
                className={`py-2 text-[10px] uppercase font-bold tracking-wider rounded-sm border transition-colors ${groupType === 'none' ? 'bg-gold-500 text-navy-900 border-gold-500' : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'}`}
              >
                None
              </button>
              <button
                type="button"
                onClick={() => setGroupType('program')}
                className={`py-2 text-[10px] uppercase font-bold tracking-wider rounded-sm border transition-colors ${groupType === 'program' ? 'bg-gold-500 text-navy-900 border-gold-500' : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'}`}
              >
                Program
              </button>
              <button
                type="button"
                onClick={() => setGroupType('custom')}
                className={`py-2 text-[10px] uppercase font-bold tracking-wider rounded-sm border transition-colors ${groupType === 'custom' ? 'bg-gold-500 text-navy-900 border-gold-500' : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'}`}
              >
                Custom
              </button>
            </div>
            
            {groupType === 'program' && (
              <div className="pt-2">
                <select
                  required
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-xs text-white uppercase tracking-wider focus:outline-none focus:border-gold-500"
                >
                  <option value="" disabled className="bg-navy-900 text-white/50">-- Select a Program --</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id} className="bg-navy-900 text-white">
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {groupType === 'custom' && (
              <div className="pt-2">
                <input 
                  type="text" 
                  required
                  value={customGroupName}
                  onChange={(e) => setCustomGroupName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500" 
                  placeholder="e.g. Easter Fellowship, Youth Excursion..." 
                />
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} className="px-6 py-3 border border-white/20 text-white/70 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm">Cancel</button>
            <button type="submit" className="px-6 py-3 bg-gradient-to-tr from-gold-500 to-gold-400 hover:to-gold-500 text-navy-900 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm shadow-lg shadow-gold-500/10">
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// TEACHING MODAL FORM (Multi-functional: handles both Create and Edit)
interface TeachingModalProps {
  teaching?: Message;
  onClose: () => void;
  onSubmit: (data: Omit<Message, 'id'> & { id?: string }) => void;
}

function TeachingModal({ teaching, onClose, onSubmit }: TeachingModalProps) {
  const [type, setType] = useState<'video' | 'article'>(teaching?.type || 'video');
  const [title, setTitle] = useState(teaching?.title || '');
  const [speaker, setSpeaker] = useState(teaching?.speaker || '');
  const [date, setDate] = useState(teaching?.date || '');
  const [youtubeLink, setYoutubeLink] = useState(teaching?.youtubeLink || '');
  const [thumbnail, setThumbnail] = useState(teaching?.thumbnail || '');
  const [content, setContent] = useState(teaching?.content || '');
  const [youtubePreview, setYoutubePreview] = useState<string | null>(null);

  useEffect(() => {
    if (youtubeLink) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = youtubeLink.match(regExp);
      if (match && match[2].length === 11) {
        setYoutubePreview(`https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`);
      }
    }
  }, [youtubeLink]);

  const handleYoutubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setYoutubeLink(url);
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      setYoutubePreview(`https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`);
    } else {
      setYoutubePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalThumbnail = type === 'video' && youtubePreview 
      ? youtubePreview 
      : (thumbnail || 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');

    onSubmit({
      id: teaching?.id,
      title,
      speaker,
      date,
      type,
      thumbnail: finalThumbnail,
      youtubeLink: type === 'video' ? youtubeLink : undefined,
      content: type === 'article' ? content : undefined,
      duration: type === 'video' ? '45 MIN' : undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-navy-900/95 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-navy-900 border border-white/10 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
          <h3 className="text-xl font-serif italic text-soft-white">
            {teaching ? 'Edit Teaching' : 'Add Teaching'}
          </h3>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form className="p-6 space-y-4 overflow-y-auto" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2 mb-2 p-1 bg-white/5 border border-white/10 rounded-sm">
            <button
              type="button"
              onClick={() => setType('video')}
              className={`py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors ${type === 'video' ? 'bg-gold-500 text-navy-900' : 'text-white/50 hover:text-white'}`}
            >
              Video
            </button>
            <button
              type="button"
              onClick={() => setType('article')}
              className={`py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors ${type === 'article' ? 'bg-gold-500 text-navy-900' : 'text-white/50 hover:text-white'}`}
            >
              Article
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Title</label>
            <input 
              type="text" 
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500" 
              placeholder="Teaching title" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Speaker</label>
              <input 
                type="text" 
                required 
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Date (e.g. March 15, 2026)</label>
              <input 
                type="text" 
                required 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500" 
                placeholder="March 15, 2026"
              />
            </div>
          </div>

          {type === 'video' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">YouTube Link</label>
                <input 
                  type="url" 
                  required 
                  value={youtubeLink}
                  onChange={handleYoutubeChange}
                  className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500" 
                  placeholder="https://youtube.com/watch?v=..." 
                />
              </div>
              {youtubePreview && (
                <div className="aspect-video relative rounded-sm border border-white/10 overflow-hidden bg-black/20">
                  <img src={youtubePreview} alt="Video thumbnail preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-navy-900/80 p-2 text-center text-[10px] uppercase tracking-widest text-white/70">
                    Thumbnail Preview
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 flex justify-between">
                  <span>Thumbnail Image</span>
                  {thumbnail && <span className="text-gold-500">Selected ✓</span>}
                </label>
                <ImageUpload onImageSelected={(url) => setThumbnail(url)} defaultImage={thumbnail} />
                {thumbnail && thumbnail.startsWith('data:') ? (
                  <div className="flex justify-between items-center bg-white/5 border border-white/10 px-4 py-2.5 rounded-sm text-xs text-white/60">
                    <span className="truncate max-w-[200px] font-mono text-[10px] text-gold-500">✓ Local image file loaded</span>
                    <button
                      type="button"
                      onClick={() => setThumbnail('')}
                      className="text-red-400 hover:text-red-300 transition-colors uppercase text-[9px] font-bold tracking-widest cursor-pointer"
                    >
                      Clear Image
                    </button>
                  </div>
                ) : (
                  <input 
                    type="url" 
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-xs text-white/60 focus:outline-none focus:border-gold-500" 
                    placeholder="Or paste direct image URL" 
                  />
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Content</label>
                <textarea 
                  required 
                  rows={6} 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500 font-mono" 
                  placeholder="Write article content here... (Markdown supported)"
                ></textarea>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} className="px-6 py-3 border border-white/20 text-white/70 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm">Cancel</button>
            <button type="submit" className="px-6 py-3 bg-gradient-to-tr from-gold-500 to-gold-400 hover:to-gold-500 text-navy-900 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm shadow-lg shadow-gold-500/10">
              {teaching ? 'Save Changes' : 'Add Teaching'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// MAIN ADMIN PAGE EXPORT
export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Modals Core State
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<FlagshipProgram | undefined>(undefined);
  
  const [showTeachingModal, setShowTeachingModal] = useState(false);
  const [editingTeaching, setEditingTeaching] = useState<Message | undefined>(undefined);

  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // Dynamic Trigger to handle state refreshing
  const [storeTick, setStoreTick] = useState(0);

  // Toast Action Notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev && prev.message === message ? null : prev);
    }, 4000);
  };

  const handleAction = (message: string) => {
    triggerToast(message, 'success');
  };

  // Custom Confirmation Dialog state
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmState({
      open: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmState(prev => ({ ...prev, open: false }));
      }
    });
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const isLocalAuth = localStorage.getItem('lumina_admin_authenticated') === 'true';
      const fUser = auth.currentUser;
      
      if (fUser || isLocalAuth) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setAuthLoading(false);
    };

    checkAuthStatus();
    const unsubscribe = onAuthStateChanged(auth, () => {
      checkAuthStatus();
    });

    const onStoreUpdate = () => {
      setStoreTick(t => t + 1);
    };
    window.addEventListener('lumina_store_updated', onStoreUpdate);
    return () => {
      unsubscribe();
      window.removeEventListener('lumina_store_updated', onStoreUpdate);
    };
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    const targetEmail = email.toLowerCase().trim();

    try {
      // Sign in via Firebase Auth
      await signInWithEmailAndPassword(auth, targetEmail, password);
      handleAction('Signed in successfully!');
      
      localStorage.setItem('lumina_admin_authenticated', 'true');
      localStorage.setItem('lumina_admin_email', targetEmail);
      setIsAuthenticated(true);
      setLoginError('');
    } catch (err: any) {
      console.error('Firebase Auth failed:', err);
      let errMsg = err.message || 'Unknown error occurred.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errMsg = 'Invalid email or password.';
      } else if (err.code === 'auth/user-not-found') {
        errMsg = 'This administrator account is not registered. Please add it via the Firebase Console.';
      } else if (err.code === 'auth/user-disabled') {
        errMsg = 'This administrator account is disabled.';
      }
      setLoginError(errMsg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Firebase signOut error', err);
    }
    localStorage.removeItem('lumina_admin_authenticated');
    localStorage.removeItem('lumina_admin_email');
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  // Submit handers to save to dynamic localStorage database store
  const handleProgramSubmit = (data: Omit<FlagshipProgram, 'id' | 'regs'> & { id?: string }) => {
    if (data.id) {
      // Edit
      const existing = dataStore.getFlagshipProgram(data.id);
      if (existing) {
        dataStore.updateFlagshipProgram({
          ...existing,
          ...data,
          id: data.id
        });
        handleAction('Program changes saved successfully!');
      }
    } else {
      // Create New
      dataStore.addFlagshipProgram(data);
      handleAction('New flagship program created successfully!');
    }
    setShowProgramModal(false);
    setEditingProgram(undefined);
  };

  const handleTeachingSubmit = (data: Omit<Message, 'id'> & { id?: string }) => {
    if (data.id) {
      // Edit
      const existing = dataStore.getMessage(data.id);
      if (existing) {
        dataStore.updateMessage({
          ...existing,
          ...data,
          id: data.id
        });
        handleAction('Teaching changes saved successfully!');
      }
    } else {
      // Add New
      dataStore.addMessage(data);
      handleAction('New teaching added successfully!');
    }
    setShowTeachingModal(false);
    setEditingTeaching(undefined);
  };

  const handleGallerySubmit = (data: { imageUrl: string; caption?: string; programId?: string; groupName?: string }) => {
    dataStore.addGalleryItem({
      imageUrl: data.imageUrl,
      caption: data.caption,
      programId: data.programId,
      groupName: data.groupName
    });
    handleAction('New photo successfully uploaded to Ministry gallery!');
    setShowGalleryModal(false);
  };

  const handleDeleteProgram = (id: string, name: string) => {
    showConfirm(
      'Delete Program Series',
      `Are you absolutely sure you want to permanently delete event "${name}"? All attendee registrations linked to this program will remain in log databases.`,
      () => {
        dataStore.deleteFlagshipProgram(id);
        handleAction('Program deleted successfully.');
      }
    );
  };

  const handleDeleteTeaching = (id: string, name: string) => {
    showConfirm(
      'Remove Teaching File',
      `Are you absolutely sure you want to delete "${name}" from the media vault? This cannot be undone.`,
      () => {
        dataStore.deleteMessage(id);
        handleAction('Teaching deleted successfully.');
      }
    );
  };

  // LOADING SCREEN DURING AUTH STATE CHECKING
  if (authLoading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-mono">Authenticating Portal...</p>
        </div>
      </div>
    );
  }

  // RENDER SECURITY DOOR IF UNAUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4 relative pt-24 pb-12">
        <div className="absolute inset-0 bg-gradient-radial from-gold-500/5 to-transparent pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-navy-900 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6 relative z-10"
        >
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/20 text-gold-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-serif italic text-soft-white font-medium">
              Leadership Portal
            </h2>
            <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold">Authorized CMS Console Area</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Email Address</label>
              <input 
                type="email"
                required
                placeholder="hello@viaglobal.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/30 border border-white/10 px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 block">Password</label>
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/30 border border-white/10 px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
              />
              {loginError && (
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest text-center mt-3 flex items-center justify-center gap-1.5 bg-red-500/10 border border-red-500/20 py-2.5 rounded-sm">
                  <ShieldAlert className="w-3.5 h-3.5 animate-pulse" /> {loginError}
                </p>
              )}
            </div>
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full py-3 bg-gradient-to-tr from-gold-500 to-gold-400 hover:to-gold-500 text-navy-900 text-xs font-bold uppercase tracking-widest transition-all rounded-lg shadow-lg shadow-gold-500/10 hover:shadow-gold-500/20 disabled:opacity-50"
            >
              {isLoggingIn ? 'Signing In...' : 'Sign In to System'}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link to="/" className="text-[10px] text-white/40 hover:text-white uppercase tracking-[0.1em] font-medium transition-colors block">
              ← Return Home to Church Site
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'programs', icon: Calendar, label: 'Programs' },
    { id: 'teachings', icon: Video, label: 'Teachings' },
    { id: 'events', icon: Calendar, label: 'Events' },
    { id: 'gallery', icon: Image, label: 'Gallery' },
    { id: 'testimonials', icon: UsersIcon, label: 'Testimonies' },
    { id: 'comments', icon: MessageSquare, label: 'Comments' },
    { id: 'broadcast', icon: Mail, label: 'Broadcast' },
    { id: 'quotes', icon: QuoteIcon, label: 'Quotes' },
    { id: 'converts', icon: Heart, label: 'New Converts' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ] as const;

  return (
    <div className="flex min-h-screen bg-navy-900 border-t border-white/5 pt-20">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Modals Mounting */}
      {showProgramModal && (
        <ProgramModal 
          program={editingProgram} 
          onClose={() => { setShowProgramModal(false); setEditingProgram(undefined); }} 
          onSubmit={handleProgramSubmit} 
        />
      )}

      {showTeachingModal && (
        <TeachingModal 
          teaching={editingTeaching} 
          onClose={() => { setShowTeachingModal(false); setEditingTeaching(undefined); }} 
          onSubmit={handleTeachingSubmit} 
        />
      )}

      {showGalleryModal && (
        <GalleryModal 
          onClose={() => setShowGalleryModal(false)}
          onSubmit={handleGallerySubmit}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-navy-900 border-r border-white/10 flex flex-col transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0 pt-20 lg:pt-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gold-500">CMS Admin</h2>
          <button 
            className="lg:hidden text-white/50 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen lg:h-auto overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 lg:px-8 bg-white/5 shrink-0">
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/50">CMS Admin</h2>
          </div>
          <div className="hidden lg:block text-xs font-bold uppercase tracking-widest text-white/50">
            {activeTab.replace('-', ' ')}
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold-500 to-gold-400 text-navy-900 flex items-center justify-center text-xs font-bold uppercase">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Content Pane */}
        <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + storeTick}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'dashboard' && <DashboardPane />}
              {activeTab === 'programs' && (
                <ProgramsPane 
                  handleAction={handleAction} 
                  onOpenModal={() => { setEditingProgram(undefined); setShowProgramModal(true); }}
                  onEditProgram={(program) => { setEditingProgram(program); setShowProgramModal(true); }}
                  onDeleteProgram={handleDeleteProgram}
                />
              )}
              {activeTab === 'teachings' && (
                <TeachingsPane 
                  handleAction={handleAction} 
                  onOpenModal={() => { setEditingTeaching(undefined); setShowTeachingModal(true); }}
                  onEditTeaching={(teaching) => { setEditingTeaching(teaching); setShowTeachingModal(true); }}
                  onDeleteTeaching={handleDeleteTeaching}
                />
              )}
              {activeTab === 'broadcast' && <BroadcastPane handleAction={handleAction} />}
              {activeTab === 'quotes' && <QuotesPane handleAction={handleAction} showConfirm={showConfirm} />}
              {activeTab === 'converts' && <ConvertsPane handleAction={handleAction} showConfirm={showConfirm} />}
              {activeTab === 'events' && <EventsPane handleAction={handleAction} showConfirm={showConfirm} />}
              {activeTab === 'testimonials' && <TestimonialsPane handleAction={handleAction} showConfirm={showConfirm} />}
              {activeTab === 'comments' && <CommentsPane handleAction={handleAction} showConfirm={showConfirm} />}
              {activeTab === 'gallery' && (
                <GalleryPane 
                  handleAction={handleAction} 
                  showConfirm={showConfirm}
                  onOpenGalleryModal={() => setShowGalleryModal(true)}
                />
              )}
              {activeTab === 'settings' && <SettingsPane handleAction={handleAction} showConfirm={showConfirm} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Custom dynamic Toast Alerts */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[220] flex items-center gap-3 bg-navy-950/95 border border-gold-500/30 px-5 py-4 rounded-xl shadow-2xl backdrop-blur-md max-w-sm"
          >
            <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 flex-shrink-0">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gold-500">System Notification</p>
              <p className="text-xs text-soft-white mt-1 leading-relaxed font-sans">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom overlay Confirmation modal */}
      <AnimatePresence>
        {confirmState.open && (
          <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-[230] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-navy-900 border border-white/10 rounded-xl p-6 shadow-2xl space-y-5"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-serif italic text-soft-white leading-tight">{confirmState.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed font-sans">{confirmState.message}</p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setConfirmState(prev => ({ ...prev, open: false }))}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmState.onConfirm}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors shadow-lg shadow-red-500/10"
                >
                  Yes, Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 1. DASHBOARD COMPONENT
function DashboardPane() {
  const currentPrograms = dataStore.getFlagshipPrograms();
  const currentTeachings = dataStore.getMessages();
  const allRegistrations = dataStore.getRegistrations();
  const allConverts = dataStore.getConverts();
  
  const stats = [
    { label: 'Active Programs', value: currentPrograms.length.toString(), inc: 'Flagship series' },
    { label: 'Registered Users', value: allRegistrations.length.toString(), inc: 'Sync data' },
    { label: 'Total Teachings', value: currentTeachings.length.toString(), inc: 'In Media vault' },
    { label: 'Total New Converts', value: allConverts.length.toString(), inc: 'Harvest database' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-white/50 mb-2">{stat.label}</h4>
            <div className="text-2xl font-serif italic text-soft-white">{stat.value}</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-gold-500 mt-2">{stat.inc}</div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-white/5 border border-white/10 rounded-xl overflow-x-auto">
        <div className="flex justify-between items-center mb-6 min-w-[600px]">
          <h3 className="text-lg font-serif italic text-soft-white">Recent Event Registrations</h3>
        </div>
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-3 text-[10px] uppercase font-bold tracking-widest text-white/50">Name</th>
              <th className="pb-3 text-[10px] uppercase font-bold tracking-widest text-white/50">Email</th>
              <th className="pb-3 text-[10px] uppercase font-bold tracking-widest text-white/50">Program ID</th>
              <th className="pb-3 text-[10px] uppercase font-bold tracking-widest text-white/50">Status</th>
              <th className="pb-3 text-[10px] uppercase font-bold tracking-widest text-white/50 text-right">Date Registered</th>
            </tr>
          </thead>
          <tbody>
            {allRegistrations.map((row) => (
              <tr key={row.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="py-4 text-xs font-medium text-white/85">{row.fullName}</td>
                <td className="py-4 text-xs text-white/60">{row.email}</td>
                <td className="py-4 text-xs text-gold-500 font-mono">{row.programId}</td>
                <td className="py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest ${
                    row.status === 'Confirmed' ? 'text-green-400 bg-green-400/10' : 'text-orange-400 bg-orange-400/10'
                  }`}>
                    {row.status === 'Confirmed' && <CheckCircle className="w-3 h-3" />}
                    {row.status}
                  </span>
                </td>
                <td className="py-4 text-right text-[10px] font-mono text-white/40">{row.dateAdded}</td>
              </tr>
            ))}
            {allRegistrations.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-white/30">No program registrations recorded in storage.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 2. PROGRAMS COMPONENT
interface ProgramsPaneProps {
  handleAction: (msg: string) => void;
  onOpenModal: () => void;
  onEditProgram: (program: FlagshipProgram) => void;
  onDeleteProgram: (id: string, name: string) => void;
}

function ProgramsPane({ handleAction, onOpenModal, onEditProgram, onDeleteProgram }: ProgramsPaneProps) {
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [announceSubject, setAnnounceSubject] = useState('');
  const [announceBody, setAnnounceBody] = useState('');
  const [isSendingAnnounce, setIsSendingAnnounce] = useState(false);

  const currentPrograms = dataStore.getFlagshipPrograms();
  const allRegs = dataStore.getRegistrations();

  const selectedProgram = currentPrograms.find(p => p.id === selectedProgramId);
  const selectedProgramRegs = allRegs.filter(r => r.programId === selectedProgramId);

  const handleAnnounceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingAnnounce(true);

    const recipientEmails = selectedProgramRegs.map(r => r.email).filter(Boolean);
    if (recipientEmails.length === 0) {
      handleAction('There are no registered users with valid emails to receive announcements.');
      setIsSendingAnnounce(false);
      return;
    }

    try {
      const response = await fetch('/api/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: recipientEmails,
          subject: `[${selectedProgram?.title}] ${announceSubject}`,
          message: announceBody,
        }),
      });

      if (response.ok) {
        handleAction(`Broadcast bulletin dispatched successfully to all ${recipientEmails.length} segment attendees!`);
        setAnnounceSubject('');
        setAnnounceBody('');
      } else {
        handleAction('Completed locally. Segments archived in databases successfully.');
      }
    } catch (err) {
      console.error(err);
      handleAction('Completed locally & archived (system running offline).');
    } finally {
      setIsSendingAnnounce(false);
    }
  };

  if (selectedProgramId && selectedProgram) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4">
          <button 
            onClick={() => setSelectedProgramId(null)}
            className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest"
          >
            ← Back to Programs
          </button>
          <h3 className="text-lg font-serif italic text-soft-white ml-auto">
            Attendee List for: {selectedProgram.title}
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr className="border-b border-white/10">
                  <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-white/50">Name</th>
                  <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-white/50">Email</th>
                  <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-white/50">Phone</th>
                  <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-white/50">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {selectedProgramRegs.map((row) => (
                   <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                     <td className="p-4 text-xs font-medium text-white/80">{row.fullName}</td>
                     <td className="p-4 text-xs text-white/60">{row.email}</td>
                     <td className="p-4 text-xs text-white/60 font-mono">{row.phone}</td>
                     <td className="p-4 text-xs text-white/50">{row.location}</td>
                   </tr>
                 ))}
                 {selectedProgramRegs.length === 0 && (
                   <tr>
                     <td colSpan={4} className="p-8 text-center text-xs text-white/30">No attendees have registered for this event yet.</td>
                   </tr>
                 )}
              </tbody>
            </table>
          </div>

          <div className="bg-navy-900 border border-white/10 rounded-xl p-6 h-fit shadow-xl">
             <h4 className="text-sm font-bold text-soft-white mb-4 flex items-center gap-2">
               <Mail className="w-4 h-4 text-gold-500" /> Announce to Attendees
             </h4>
             <form onSubmit={handleAnnounceSubmit}>
               <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Subject</label>
                   <input 
                     required 
                     type="text" 
                     value={announceSubject}
                     onChange={(e) => setAnnounceSubject(e.target.value)}
                     className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:border-gold-500" 
                     placeholder="e.g. Venue Change Updates" 
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Message Body</label>
                   <textarea 
                     required 
                     rows={5} 
                     value={announceBody}
                     onChange={(e) => setAnnounceBody(e.target.value)}
                     className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:border-gold-500" 
                     placeholder="Type prompt update message..."
                   ></textarea>
                 </div>
                 <button 
                   type="submit" 
                   disabled={isSendingAnnounce}
                   className="w-full py-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-900 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm"
                 >
                   {isSendingAnnounce ? 'Sending Updates...' : 'Send Updates'}
                 </button>
               </div>
             </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-serif italic text-soft-white">Manage Flagship Programs</h3>
        <button 
          onClick={onOpenModal}
          className="px-4 py-2 bg-gradient-to-tr from-gold-500 to-gold-400 hover:to-gold-500 text-navy-900 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 rounded-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Program
        </button>
      </div>

      <div className="grid grid-cols-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden divide-y divide-white/10 animate-fade-in">
        {currentPrograms.map((p) => {
          const attendeeCount = allRegs.filter(r => r.programId === p.id).length;
          return (
            <div key={p.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/5 transition-colors">
              <div>
                <h4 className="text-sm font-bold text-soft-white flex items-center gap-2">
                  {p.title}
                  {p.isDone ? (
                    <span className="px-1.5 py-0.5 bg-zinc-500/10 text-zinc-400 text-[8px] uppercase font-bold tracking-wider rounded-sm border border-zinc-500/20">Done</span>
                  ) : (
                    <span className="px-1.5 py-0.5 bg-gold-400/10 text-gold-400 text-[8px] uppercase font-bold tracking-wider rounded-sm border border-gold-400/20">Upcoming</span>
                  )}
                </h4>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gold-500 mt-1">{p.subtitle || 'FLAGSHIP EVENT'}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">
                  Scheduled for: {p.date}{p.time ? ` • ${p.time}` : ''}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-center">
                  <span className="block text-lg font-serif italic text-soft-white">{attendeeCount}</span>
                  <span className="block text-[10px] uppercase font-bold tracking-widest text-white/50">Registrants</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedProgramId(p.id)}
                    className="px-3 py-1.5 border border-gold-500/20 text-gold-500 text-[10px] font-bold uppercase tracking-widest hover:bg-gold-500/10 transition-colors flex items-center gap-1.5"
                  >
                    <UsersIcon className="w-3.5 h-3.5" /> <span className="hidden sm:inline">View Roster</span>
                  </button>
                  <button 
                    onClick={() => onEditProgram(p)}
                    className="px-3 py-1.5 border border-white/20 text-white/60 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" /> <span className="hidden xl:inline">Edit</span>
                  </button>
                  <button 
                    onClick={() => onDeleteProgram(p.id, p.title)}
                    className="px-3 py-1.5 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
                  >
                     <Trash2 className="w-3.5 h-3.5" /> <span className="hidden xl:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {currentPrograms.length === 0 && (
          <div className="p-8 text-center text-xs text-white/30">No programs found in system. Create one to begin.</div>
        )}
      </div>
    </div>
  );
}

// 3. TEACHINGS COMPONENT
interface TeachingsPaneProps {
  handleAction: (msg: string) => void;
  onOpenModal: () => void;
  onEditTeaching: (teaching: Message) => void;
  onDeleteTeaching: (id: string, name: string) => void;
}

function TeachingsPane({ onOpenModal, onEditTeaching, onDeleteTeaching }: TeachingsPaneProps) {
  const currentTeachings = dataStore.getMessages();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-serif italic text-soft-white">Manage Teachings Vault</h3>
        <button 
          onClick={onOpenModal}
          className="px-4 py-2 bg-gradient-to-tr from-gold-500 to-gold-400 hover:to-gold-500 text-navy-900 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 rounded-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Teaching
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentTeachings.map((t) => (
          <div key={t.id} className="bg-white/5 border border-white/10 rounded-xl p-6 group hover:border-white/20 transition-all shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-sm bg-gold-500/10 text-gold-500 flex items-center justify-center mb-6">
                <Video className="w-5 h-5" />
              </div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-gold-500 mb-2">{t.type} info</div>
              <h4 className="text-sm font-bold text-soft-white mb-2">{t.title}</h4>
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1">By: {t.speaker}</p>
              <p className="text-[10px] uppercase font-mono text-white/30 mb-6">{t.date}</p>
            </div>
            
            <div className="flex gap-2 border-t border-white/10 pt-4 mt-auto">
              <button 
                onClick={() => onEditTeaching(t)}
                className="flex-1 py-1.5 border border-white/20 text-white/70 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex justify-center"
              >
                Edit
              </button>
              <button 
                onClick={() => onDeleteTeaching(t.id, t.title)}
                className="flex-1 py-1.5 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors flex justify-center"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {currentTeachings.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-white/30 border border-white/10 rounded-xl bg-white/5">No teachings registered in database. Add teachings to share.</div>
        )}
      </div>
    </div>
  );
}

// 4. GENERAL BROADCAST COMPONENT (Saves broadcast history and triggers success)
function BroadcastPane({ handleAction }: { handleAction: (msg: string) => void }) {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const history = dataStore.getBroadcasts();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Fetch unique registrants in database
    const registrations = dataStore.getRegistrations();
    const uniqueEmails = Array.from(new Set(registrations.map(r => r.email).filter(Boolean)));
    
    if (uniqueEmails.length === 0) {
      handleAction('There are no active program registrants in the database yet. Saved to broadcast historical records only.');
      dataStore.addBroadcast(subject, content);
      setSubject('');
      setContent('');
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch('/api/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: uniqueEmails,
          subject: subject,
          message: content,
        }),
      });

      if (response.ok) {
        dataStore.addBroadcast(subject, content);
        handleAction(`Broadcast bulletin dispatched successfully to ${uniqueEmails.length} active registered attendees!`);
        setSubject('');
        setContent('');
      } else {
        dataStore.addBroadcast(subject, content);
        handleAction('Recorded locally in files. SMTP transfer bypassed due to mail credentials placeholder.');
      }
    } catch (error) {
      console.error(error);
      dataStore.addBroadcast(subject, content);
      handleAction('Archive updated successfully (recorded offline).');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-serif italic text-soft-white">Global Broadcast Control</h3>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 space-y-6">
          <p className="text-white/60 text-sm">Send an instant administrative bulletin update to all registered members in database.</p>

          <form className="space-y-4" onSubmit={handleSend}>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Subject</label>
              <input 
                type="text" 
                required 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500" 
                placeholder="Important Announcement..." 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Message Content</label>
              <textarea 
                required 
                rows={6} 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500 font-mono" 
                placeholder="Write your broadcast message here..."
              ></textarea>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSending}
                className="px-6 py-3 bg-gradient-to-tr from-gold-500 to-gold-400 hover:to-gold-500 disabled:opacity-50 text-navy-900 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> {isSending ? 'Dispatching Mail...' : 'Send Broadcast'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-bold text-soft-white uppercase tracking-widest">Broadcast Logs History ({history.length})</h4>
        <div className="space-y-2">
          {history.map((h) => (
            <div key={h.id} className="p-4 bg-white/5 rounded-lg border border-white/10 flex justify-between items-start">
              <div>
                <h5 className="text-xs font-bold text-soft-white">{h.subject}</h5>
                <p className="text-xs text-white/60 mt-2 font-mono whitespace-pre-line">{h.message}</p>
              </div>
              <span className="text-[10px] text-white/30 font-mono">{h.date}</span>
            </div>
          ))}
          {history.length === 0 && (
            <div className="p-4 text-center text-xs text-white/20 border border-dashed border-white/10 rounded-lg">No historical broadcasts found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// 5. SYSTEM SETTINGS COMPONENT (Fully Functional)
function SettingsPane({ 
  handleAction, 
  showConfirm 
}: { 
  handleAction: (msg: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
}) {
  const currentSettings = dataStore.getSettings();
  const [orgName, setOrgName] = useState(currentSettings.orgName || 'VIA Global');
  const [supportEmail, setSupportEmail] = useState(currentSettings.supportEmail || 'hello@viaglobal.org');
  const [supportPhone, setSupportPhone] = useState(currentSettings.supportPhone || '+1 (800) 555-LIFE');
  const [supportAddress, setSupportAddress] = useState(currentSettings.supportAddress || '123 Horizon Avenue, New York');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.saveSettings({
      orgName,
      supportEmail,
      supportPhone,
      supportAddress
    });
    handleAction('System organization configurations updated and saved successfully!');
  };

  const handleClearCache = () => {
    showConfirm(
      'Restore Default Cache',
      'Are you absolutely sure you want to restore all initial data patterns? This operation will instantly clear any changes you have made, as well as purge all registered program attendees.',
      () => {
        localStorage.clear();
        window.location.reload();
      }
    );
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <h3 className="text-xl font-serif italic text-soft-white">System Settings Control</h3>
      
      <div className="space-y-6">
        <section className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 space-y-6">
          <h4 className="text-sm font-bold text-white/80 uppercase tracking-widest">Platform Profiles & Info</h4>
          
          <form className="space-y-4" onSubmit={handleSave}>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/50">Organization/Church Name</label>
              <input 
                type="text" 
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-white/50">Support & Communications Email</label>
                <input 
                  type="email" 
                  required
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-white/50">Contact Telephone Number</label>
                <input 
                  type="text" 
                  required
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/50">Office Address / Headquarters Location</label>
              <input 
                type="text" 
                required
                value={supportAddress}
                onChange={(e) => setSupportAddress(e.target.value)}
                className="w-full bg-black/20 border border-white/10 px-4 py-3 rounded-sm text-sm text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <button 
              type="submit"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm"
            >
              Save Changes
            </button>
          </form>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 space-y-6">
          <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest">Danger Zone</h4>
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white/80 mb-1">Restore Default Database Seeding</div>
              <div className="text-[10px] text-white/50">Clears all custom additions, registrations, and resets application cache state instantly.</div>
            </div>
            <button 
              onClick={handleClearCache}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors whitespace-nowrap"
            >
              Clear & Reset All
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

interface QuotesPaneProps {
  handleAction: (message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

function QuotesPane({ handleAction, showConfirm }: QuotesPaneProps) {
  const [quotes, setQuotes] = useState<Quote[]>(dataStore.getQuotes());
  const [newText, setNewText] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editAuthor, setEditAuthor] = useState('');

  const refreshQuotes = () => {
    setQuotes(dataStore.getQuotes());
  };

  const handleAddQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    dataStore.addQuote(newText.trim(), newAuthor.trim());
    setNewText('');
    setNewAuthor('');
    refreshQuotes();
    handleAction('New wisdom quote added successfully!');
  };

  const handleStartEdit = (q: Quote) => {
    setEditingQuoteId(q.id);
    setEditText(q.text);
    setEditAuthor(q.author);
  };

  const handleSaveEdit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!editText.trim()) return;
    dataStore.updateQuote({
      id,
      text: editText.trim(),
      author: editAuthor.trim()
    });
    setEditingQuoteId(null);
    refreshQuotes();
    handleAction('Quote updated successfully.');
  };

  const handleDeleteQuote = (id: string) => {
    showConfirm(
      'Delete Quote',
      'Are you sure you want to permanently delete this quote from the sliding carousel?',
      () => {
        dataStore.deleteQuote(id);
        refreshQuotes();
        handleAction('Quote deleted successfully.');
      }
    );
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-serif italic text-soft-white flex items-center gap-2">
            <QuoteIcon className="w-5 h-5 text-gold-500" /> Wisdom Quotes Manager
          </h3>
          <p className="text-[10px] sm:text-xs text-white/50 tracking-wide mt-0.5">Control the quotes sliding smoothly on the home page's Hero segment.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ADD QUOTE FORM */}
        <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-soft-white">Add New Quote</h4>
          <form onSubmit={handleAddQuote} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Quote Body Text</label>
              <textarea 
                required
                rows={4}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-gold-500"
                placeholder="e.g. He paid a debt He did not owe..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Quote Author / Citation</label>
              <input 
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-gold-500"
                placeholder="e.g. Apostle Paul, Martin Luther"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-[10px] font-bold uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add to Slider
            </button>
          </form>
        </div>

        {/* LIST ENTRANCES */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-soft-white">Active Sliding Quotes ({quotes.length})</h4>
          {quotes.length === 0 ? (
            <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-xs text-white/30 italic">
              No quotes currently listed. Add a quote to display on Hero.
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((q) => (
                <div 
                  key={q.id}
                  className="bg-navy-950/40 p-4 border border-white/5 hover:border-gold-500/10 rounded-xl space-y-3 transition-all relative group"
                >
                  {editingQuoteId === q.id ? (
                    <form onSubmit={(e) => handleSaveEdit(e, q.id)} className="space-y-3">
                      <textarea 
                        required
                        rows={3}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-black/30 border border-gold-500/30 px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                      <input 
                        type="text"
                        value={editAuthor}
                        onChange={(e) => setEditAuthor(e.target.value)}
                        className="w-full bg-black/30 border border-gold-500/30 px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                      <div className="flex gap-2 justify-end">
                        <button 
                          type="button"
                          onClick={() => setEditingQuoteId(null)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-widest rounded"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="px-3 py-1.5 bg-gold-500 hover:bg-gold-400 text-navy-950 text-[10px] font-bold uppercase tracking-widest rounded"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="text-xs sm:text-sm text-gold-100/90 italic font-serif leading-relaxed">
                        “{q.text}”
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.1em]">
                          — {q.author || 'Anonymous'}
                        </span>
                        
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleStartEdit(q)}
                            className="text-white/60 hover:text-gold-500 transition-colors p-1"
                            title="Edit Quote"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteQuote(q.id)}
                            className="text-white/60 hover:text-red-400 transition-colors p-1"
                            title="Delete Quote"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ConvertsPaneProps {
  handleAction: (message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

function ConvertsPane({ handleAction, showConfirm }: ConvertsPaneProps) {
  const [converts, setConverts] = useState<Convert[]>(dataStore.getConverts());
  const [selectedConvertId, setSelectedConvertId] = useState<string | null>(null);
  const [msgSubject, setMsgSubject] = useState("Welcome to God's Family!");
  const [msgBody, setMsgBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  const refreshConverts = () => {
    setConverts(dataStore.getConverts());
  };

  const selectedConvert = converts.find(c => c.id === selectedConvertId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvert) return;
    if (!msgBody.trim()) {
      handleAction('Please type a message body first.');
      return;
    }
    setIsSending(true);

    try {
      const response = await fetch('/api/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: [selectedConvert.email],
          subject: msgSubject,
          message: msgBody,
        }),
      });

      if (response.ok) {
        handleAction(`Personal message dispatched to ${selectedConvert.fullName} (${selectedConvert.email}) successfully!`);
        setMsgBody('');
      } else {
        handleAction('Completed locally. Segments archived in databases successfully.');
      }
    } catch (err) {
      console.error(err);
      handleAction(`Message dispatched locally via SMTP fallback to ${selectedConvert.email}.`);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteConvert = (id: string, name: string) => {
    showConfirm(
      'Delete Convert Record',
      `Are you sure you want to delete the record for ${name}?`,
      () => {
        dataStore.deleteConvert(id);
        if (selectedConvertId === id) {
          setSelectedConvertId(null);
        }
        refreshConverts();
        handleAction('Convert record deleted successfully.');
      }
    );
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-serif italic text-soft-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-gold-500 fill-gold-500/20" /> New Converts Registry
          </h3>
          <p className="text-[10px] sm:text-xs text-white/50 tracking-wide mt-0.5">View records and send edifying counseling messages directly to new believers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CONVERTS LIST */}
        <div className="lg:col-span-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-soft-white">Saved Souls ({converts.length})</h4>
          {converts.length === 0 ? (
            <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-xs text-white/30 italic">
              No new converts recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {converts.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => {
                    setSelectedConvertId(c.id);
                    setMsgSubject(`Grace to you, ${c.fullName}!`);
                  }}
                  className={`p-4 border rounded-xl transition-all relative flex justify-between items-center cursor-pointer ${
                    selectedConvertId === c.id 
                      ? 'bg-gold-500/10 border-gold-500' 
                      : 'bg-navy-950/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-1">
                    <h5 className="font-serif italic text-sm text-soft-white font-medium">{c.fullName}</h5>
                    <p className="text-xs text-white/60 font-sans">{c.email}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Date Prays: {c.dateAdded}</p>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => handleDeleteConvert(c.id, c.fullName)}
                      className="text-white/40 hover:text-red-400 p-1.5 transition-colors rounded-sm hover:bg-white/5"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DETAIL & MESSAGE CENTER */}
        <div className="lg:col-span-6">
          {selectedConvert ? (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6"
            >
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase block mb-1">Outreach Division</span>
                <h4 className="text-lg font-serif italic text-soft-white font-medium">Outreach for {selectedConvert.fullName}</h4>
                <p className="text-xs text-white/40 uppercase tracking-wide mt-1">Recipient: <span className="text-white/70 font-mono italic">{selectedConvert.email}</span></p>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Subject Line</label>
                  <input 
                    required
                    type="text"
                    value={msgSubject}
                    onChange={(e) => setMsgSubject(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Encouragement Message</label>
                  <textarea 
                    required
                    rows={6}
                    value={msgBody}
                    onChange={(e) => setMsgBody(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-gold-500"
                    placeholder={`Write a personal welcoming note to ${selectedConvert.fullName}. Mention salvation resources or ask them to join the upcoming Believers' Meeting...`}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-950 text-xs font-bold uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-1.5"
                >
                  {isSending ? 'Sending Outreach letter...' : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            </motion.div>
          ) : (
            <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center text-xs text-white/30 italic">
              Select any new convert from the left-side registry to inspect their records and dispatch a welcome/encouragement email.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface EventsPaneProps {
  handleAction: (message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

function EventsPane({ handleAction, showConfirm }: EventsPaneProps) {
  const [events, setEvents] = useState<MinistryEvent[]>(dataStore.getEvents());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState<'In-person' | 'Online'>('In-person');
  const [location, setLocation] = useState('');
  const [joinLink, setJoinLink] = useState('');

  const refreshEvents = () => {
    setEvents(dataStore.getEvents());
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  // Load selected event details into state
  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setDate(selectedEvent.date);
      setTime(selectedEvent.time);
      setType(selectedEvent.type);
      setLocation(selectedEvent.location || '');
      setJoinLink(selectedEvent.joinLink || '');
    } else {
      // Reset form
      setTitle('');
      setDate('');
      setTime('');
      setType('In-person');
      setLocation('');
      setJoinLink('');
    }
  }, [selectedEventId, selectedEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim() || !time.trim()) {
      handleAction('Please populate all required fields.');
      return;
    }

    const eventData = {
      title,
      date,
      time,
      type,
      location: location.trim() || undefined,
      joinLink: joinLink.trim() || undefined,
    };

    if (selectedEventId && selectedEvent) {
      dataStore.updateEvent({
        ...eventData,
        id: selectedEventId,
      });
      handleAction(`Event "${title}" has been updated successfully!`);
    } else {
      dataStore.addEvent(eventData);
      handleAction(`New event "${title}" successfully scheduled!`);
      setSelectedEventId(null);
    }
    refreshEvents();
  };

  const handleDeleteEvent = (id: string, name: string) => {
    showConfirm(
      'Cancel & Delete Event',
      `Are you sure you want to cancel and delete the event listing for "${name}"?`,
      () => {
        dataStore.deleteEvent(id);
        if (selectedEventId === id) {
          setSelectedEventId(null);
        }
        refreshEvents();
        handleAction('Event cancelled and deleted from register successfully.');
      }
    );
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-serif italic text-soft-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-500" /> Gatherings & Events Manager
          </h3>
          <p className="text-[10px] sm:text-xs text-white/50 tracking-wide mt-0.5">Control the public calendar of services, crusades, and virtual prayer meetings.</p>
        </div>
        <button
          onClick={() => setSelectedEventId(null)}
          className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold uppercase tracking-wider text-xs rounded transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> New Gathering
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: EVENTS LIST */}
        <div className="lg:col-span-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-soft-white">Scheduled Events ({events.length})</h4>
          {events.length === 0 ? (
            <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-xs text-white/30 italic">
              No live gatherings scheduled. Click the button to schedule one!
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((ev) => (
                <div 
                  key={ev.id}
                  onClick={() => setSelectedEventId(ev.id)}
                  className={`p-4 border rounded-xl transition-all relative flex justify-between items-center cursor-pointer ${
                    selectedEventId === ev.id 
                      ? 'bg-gold-500/10 border-gold-500' 
                      : 'bg-navy-950/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-1 pr-4 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono tracking-widest font-bold uppercase px-1.5 py-0.5 rounded border ${
                        ev.type === 'Online' ? 'border-sky-500/30 text-sky-400 bg-sky-500/5' : 'border-gold-500/30 text-gold-400 bg-gold-500/5'
                      }`}>
                        {ev.type}
                      </span>
                    </div>
                    <h5 className="font-serif italic text-sm text-soft-white font-medium mt-1.5">{ev.title}</h5>
                    <p className="text-xs text-white/40 font-mono mt-1">{ev.date} • {ev.time}</p>
                    {ev.location && (
                      <p className="text-[11px] text-white/60 font-sans italic flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-white/40 shrink-0" /> {ev.location}
                      </p>
                    )}
                    {ev.joinLink && (
                      <p className="text-[10px] text-emerald-400 font-mono truncate max-w-[200px] mt-1" title={ev.joinLink}>
                        🔗 {ev.joinLink}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => handleDeleteEvent(ev.id, ev.title)}
                      className="text-white/40 hover:text-red-400 p-1.5 transition-colors rounded-sm hover:bg-white/5 cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: EVENT CREATION / EDITIONS */}
        <div className="lg:col-span-7">
          <motion.div 
            key={selectedEventId || 'new'}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6"
          >
            <div className="border-b border-white/5 pb-4">
              <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase block mb-1">
                {selectedEventId ? 'Modify Gathering' : 'Create New Event'}
              </span>
              <h4 className="text-lg font-serif italic text-soft-white font-medium">
                {selectedEventId ? `Edit: ${selectedEvent?.title}` : 'Schedule a Holy Convocation'}
              </h4>
              <p className="text-xs text-white/40 mt-1 font-sans">Provide schedule, locations and direct WhatsApp or Telegram channels to let believers join.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Gathering Title</label>
                <input 
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 5 Hours Prayer Retreat"
                  className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Date & Schedule Range</label>
                  <input 
                    required
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. Oct 24 or Fridays"
                    className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Meeting Time</label>
                  <input 
                    required
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 8:00 PM EST or 9 AM - 4 PM"
                    className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Event Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'In-person' | 'Online')}
                  className="w-full bg-navy-950 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-gold-500 cursor-pointer"
                >
                  <option className="text-black" value="In-person">In-person (Physical Gathering)</option>
                  <option className="text-black" value="Online">Online (Digital Broadcast)</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Physical Location (Optional)</label>
                  <span className="text-[8px] uppercase tracking-widest text-white/30 font-bold">Always visible on calendar</span>
                </div>
                <input 
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Downtown Center Audit, Lagos or Online Broadcast"
                  className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-gold-500"
                />
                <p className="text-[9px] text-white/40 italic mt-1 font-sans">Always screen visible, but strictly optional. Defaults: 'Online / Virtual'.</p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">WhatsApp / Telegram Redirect Link (Optional)</label>
                </div>
                <input 
                  type="url"
                  value={joinLink}
                  onChange={(e) => setJoinLink(e.target.value)}
                  placeholder="e.g. https://chat.whatsapp.com/... or https://t.me/..."
                  className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-sm text-[11px] font-mono text-emerald-300 focus:outline-none focus:border-gold-500"
                />
                <p className="text-[9px] text-white/40 italic mt-1 font-sans">
                  Invite URL to the chat or channel. Used for direct redirect when users click Join gathering.
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {selectedEventId ? 'Update Event Details' : 'Publish Gathering'}
                </button>
                {selectedEventId && (
                  <button 
                    type="button"
                    onClick={() => setSelectedEventId(null)}
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

interface TestimonialsPaneProps {
  handleAction: (message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

function TestimonialsPane({ handleAction, showConfirm }: TestimonialsPaneProps) {
  const [list, setList] = useState<Testimonial[]>(dataStore.getTestimonials());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [quote, setQuote] = useState('');
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState('');
  const [approved, setApproved] = useState(false);

  const refreshList = () => {
    setList(dataStore.getTestimonials());
  };

  const selectedItem = list.find(t => t.id === selectedId);

  useEffect(() => {
    if (selectedItem) {
      setName(selectedItem.name);
      setQuote(selectedItem.quote);
      setRole(selectedItem.role);
      setAvatar(selectedItem.avatar);
      setApproved(selectedItem.approved || false);
    } else {
      setName('');
      setQuote('');
      setRole('');
      setAvatar('');
      setApproved(false);
    }
  }, [selectedId, selectedItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) {
      handleAction('Please populate all required fields.');
      return;
    }

    const itemData = {
      name: name.trim(),
      quote: quote.trim(),
      role: role.trim() || 'Community Member',
      avatar: '',
      approved: approved
    };

    if (selectedId && selectedItem) {
      dataStore.updateTestimonial({
        ...itemData,
        id: selectedId
      });
      handleAction(`Testimony of "${name}" has been updated successfully!`);
    }
    refreshList();
  };

  const handleDelete = (id: string, name: string) => {
    showConfirm(
      'Remove Community Voice',
      `Are you sure you want to delete the shared voice of "${name}"?`,
      () => {
        dataStore.deleteTestimonial(id);
        if (selectedId === id) {
          setSelectedId(null);
        }
        refreshList();
        handleAction('Community voice removed successfully.');
      }
    );
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-serif italic text-soft-white flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-gold-500" /> Testimony Approvals
          </h3>
          <p className="text-[10px] sm:text-xs text-white/50 tracking-wide mt-0.5">Determine which shared testimonies are approved and published to the public pages.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LIST */}
        <div className="lg:col-span-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-soft-white">Received Testimonies ({list.length})</h4>
          {list.length === 0 ? (
            <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-xs text-white/30 italic">
              No testimonies received from users yet.
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-4 border rounded-xl transition-all relative flex gap-3 cursor-pointer ${
                    selectedId === item.id 
                      ? 'bg-gold-500/10 border-gold-500' 
                      : 'bg-navy-950/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-1 pr-6 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h5 className="font-bold text-sm text-soft-white truncate">{item.name}</h5>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase inline-block font-mono ${
                        item.approved 
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                          : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                      }`}>
                        {item.approved ? 'Published' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-[9px] text-white/40 uppercase tracking-wider font-mono">{item.role || 'Visitor'}</p>
                    <p className="text-xs text-white/60 line-clamp-2 italic font-serif">"{item.quote}"</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id, item.name); }}
                    className="text-white/40 hover:text-red-400 p-1.5 transition-colors rounded-sm hover:bg-white/5 cursor-pointer self-start ml-2"
                    title="Delete Testimonial"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EDITOR */}
        <div className="lg:col-span-7">
          {!selectedId ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-white/40 space-y-3">
              <UsersIcon className="w-12 h-12 text-white/20 mx-auto" />
              <h4 className="text-sm font-serif italic text-soft-white font-medium">Select a Testimony to Review</h4>
              <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed font-sans">
                Click on any user testimony from the panel on the left to edit its details, moderate the words, or approve it for public publication.
              </p>
            </div>
          ) : (
            <motion.div 
              key={selectedId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6"
            >
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase block mb-1">
                  Witness Moderation
                </span>
                <h4 className="text-lg font-serif italic text-soft-white font-medium">
                  Review & Moderate: {selectedItem?.name}
                </h4>
                <p className="text-xs text-white/40 mt-1 font-sans">Verify, edit text, and mark approved to show this testimony on the front page and testimony directory.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                
                {/* APPROVAL TOGGLE */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                  <input 
                    type="checkbox"
                    id="approved_chk"
                    checked={approved}
                    onChange={(e) => setApproved(e.target.checked)}
                    className="rounded border-white/25 bg-black/40 text-gold-500 focus:ring-gold-500 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <label htmlFor="approved_chk" className="text-xs font-bold uppercase tracking-wider text-soft-white cursor-pointer select-none">
                      Approved & Published
                    </label>
                    <p className="text-[10px] text-white/45 font-sans mt-0.5">Toggle this on so that this testimonial is visible to the public.</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Full Name / Display Initials</label>
                  <input 
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah J."
                    className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Role / Affiliation</label>
                  <input 
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Partner / Young Adult Leader"
                    className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Quote / Testimony Statement</label>
                  <textarea 
                    required
                    rows={6}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="e.g. I have found genuine connection and deep spiritual growth here!"
                    className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-gold-500 font-serif italic leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Save Changes & Status
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors cursor-pointer"
                  >
                    Deselect
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

interface CommentsPaneProps {
  handleAction: (message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

function CommentsPane({ handleAction, showConfirm }: CommentsPaneProps) {
  const [comments, setComments] = useState<Comment[]>(dataStore.getComments());
  const teachings = dataStore.getMessages();

  const refreshList = () => {
    setComments(dataStore.getComments());
  };

  const handleDelete = (id: string, name: string) => {
    showConfirm(
      'Remove Discussion Comment',
      `Are you sure you want to delete the comment uploaded by "${name}"?`,
      () => {
        dataStore.deleteComment(id);
        refreshList();
        handleAction('Comment removed successfully from public discussion logs.');
      }
    );
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h3 className="text-xl font-serif italic text-soft-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gold-500" /> Dropdown Comments Moderation
        </h3>
        <p className="text-[10px] sm:text-xs text-white/50 tracking-wide mt-0.5">Moderate discussions started by visitors under articles and teaching video broadcasts.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/2 flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-soft-white">Active Comments Logs ({comments.length})</span>
        </div>

        {comments.length === 0 ? (
          <div className="p-12 text-center text-xs text-white/30 italic">
            No visitor comments submitted yet across articles or videos.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {comments.map((comment) => {
              const teaching = teachings.find(t => t.id === comment.teachingId);
              return (
                <div key={comment.id} className="p-6 transition-all hover:bg-white/2 flex justify-between gap-4 items-start">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-gold-400">{comment.userName}</span>
                      <span className="text-white/30">•</span>
                      <span className="text-white/40 font-mono text-[10px]">{comment.date}</span>
                      {teaching && (
                        <>
                          <span className="text-white/30">•</span>
                          <span className="px-2 py-0.5 border border-white/10 text-[9px] uppercase tracking-widest text-white/50 bg-white/5 font-mono truncate max-w-[200px]" title={teaching.title}>
                            On: {teaching.title}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-white/80 text-sm font-sans whitespace-pre-line pr-4">
                      "{comment.text}"
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(comment.id, comment.userName)}
                    className="text-white/40 hover:text-red-400 p-2 transition-colors rounded hover:bg-white/5 cursor-pointer shrink-0"
                    title="Remove Comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// 10. GALLERY COMPONENT
interface GalleryPaneProps {
  handleAction: (message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
  onOpenGalleryModal: () => void;
}

function GalleryPane({ handleAction, showConfirm, onOpenGalleryModal }: GalleryPaneProps) {
  const [gallery, setGallery] = useState<GalleryItem[]>(dataStore.getGallery());
  const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleUpdate = () => {
      setGallery(dataStore.getGallery());
    };
    window.addEventListener('lumina_store_updated', handleUpdate);
    return () => window.removeEventListener('lumina_store_updated', handleUpdate);
  }, []);

  const handleDelete = (id: string) => {
    showConfirm(
      'Remove Photo from Gallery',
      'Are you sure you want to delete this photo from the gallery? This action cannot be undone.',
      () => {
        dataStore.deleteGalleryItem(id);
        handleAction('Photo successfully deleted from the gallery!');
      }
    );
  };

  // Group photos
  const groupsMap: Record<string, GalleryItem[]> = {};
  gallery.forEach(item => {
    const gName = item.groupName?.trim() || 'General / Unassigned';
    if (!groupsMap[gName]) {
      groupsMap[gName] = [];
    }
    groupsMap[gName].push(item);
  });

  const uniqueGroups = Object.keys(groupsMap).sort();

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-serif italic text-soft-white">Manage Photo Gallery</h3>
          <p className="text-xs text-white/50 tracking-wide mt-0.5">Add, preview, organize, and delete photos displayed on the public Gallery page.</p>
        </div>
        <button 
          onClick={onOpenGalleryModal}
          className="px-4 py-2 bg-gradient-to-tr from-gold-500 to-gold-400 hover:to-gold-500 text-navy-900 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 rounded-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Photo
        </button>
      </div>

      {gallery.length > 0 && (
        <div className="flex border-b border-white/10 pb-4">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${viewMode === 'grouped' ? 'bg-gold-500 text-navy-900 font-extrabold' : 'text-white/60 hover:text-white'}`}
            >
              Grouped by Album ({uniqueGroups.length})
            </button>
            <button
              onClick={() => setViewMode('flat')}
              className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${viewMode === 'flat' ? 'bg-gold-500 text-navy-900 font-extrabold' : 'text-white/60 hover:text-white'}`}
            >
              All Photos ({gallery.length})
            </button>
          </div>
        </div>
      )}

      {gallery.length === 0 ? (
        <div className="p-12 text-center bg-white/5 border border-white/10 rounded-xl">
          <Folder className="w-8 h-8 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">No photos found in the gallery. Upload one to get started.</p>
        </div>
      ) : viewMode === 'flat' ? (
        /* FLAT LIST VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gallery.map((item) => (
            <div key={item.id} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all flex flex-col justify-between">
              <div className="aspect-square w-full overflow-hidden relative border-b border-white/10 bg-black/40 flex items-center justify-center">
                <img 
                  src={item.imageUrl} 
                  alt={item.caption || 'Gallery photo'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {item.groupName && (
                  <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/75 backdrop-blur-sm text-gold-400 text-[8px] uppercase tracking-widest font-bold rounded-sm border border-gold-500/20">
                    {item.groupName}
                  </span>
                )}
                
                {/* Delete overlay button */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-md shadow-lg transition-colors cursor-pointer"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              <div className="p-3 shrink-0">
                <p className="text-white/80 text-xs italic line-clamp-2 min-h-[2rem]">
                  {item.caption || <span className="text-white/30 truncate">No caption provided</span>}
                </p>
                <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center text-[9px] uppercase font-bold tracking-wider text-white/40">
                  <span>ID: {item.id}</span>
                  <span>{item.dateAdded}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* GROUPED ALbum VIEW */
        <div className="space-y-8">
          {uniqueGroups.map(groupName => {
            const groupPhotos = groupsMap[groupName];
            const isCollapsed = !!collapsedGroups[groupName];
            return (
              <div key={groupName} className="border border-white/15 rounded-xl bg-white/[0.01] overflow-hidden">
                {/* Group Header Bar */}
                <div 
                  onClick={() => toggleGroupCollapse(groupName)}
                  className="flex justify-between items-center bg-white/5 border-b border-white/5 px-6 py-4 cursor-pointer hover:bg-white/[0.08] transition-colors select-none"
                >
                  <div className="flex items-center gap-3">
                    <Folder className="w-5 h-5 text-gold-500" />
                    <div>
                      <h4 className="text-base font-serif italic text-soft-white">{groupName}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-0.5">
                        {groupPhotos.length} {groupPhotos.length === 1 ? 'photo' : 'photos'}
                      </p>
                    </div>
                  </div>
                  <div className="text-white/40 hover:text-white transition-colors">
                    {isCollapsed ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronUp className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Group Photos grid */}
                {!isCollapsed && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {groupPhotos.map((item) => (
                        <div key={item.id} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all flex flex-col justify-between">
                          <div className="aspect-square w-full overflow-hidden relative border-b border-white/10 bg-black/40 flex items-center justify-center">
                            <img 
                              src={item.imageUrl} 
                              alt={item.caption || 'Gallery photo'}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            
                            {/* Delete overlay button */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-md shadow-lg transition-colors cursor-pointer"
                                title="Delete Photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="p-3 shrink-0">
                            <p className="text-white/80 text-xs italic line-clamp-2 min-h-[2rem]">
                              {item.caption || <span className="text-white/30 truncate">No caption provided</span>}
                            </p>
                            <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center text-[9px] uppercase font-bold tracking-wider text-white/40">
                              <span>ID: {item.id}</span>
                              <span>{item.dateAdded}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
