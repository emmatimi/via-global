import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MessageSquare, Send, User } from 'lucide-react';
import { dataStore } from '../dataStore';
import { Comment } from '../types';
import { motion } from 'motion/react';

function getYoutubeId(url?: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function TeachingDetails() {
  const { id } = useParams<{ id: string }>();
  const teaching = id ? dataStore.getMessage(id) : undefined;

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      setComments(dataStore.getCommentsForTeaching(id));
    }
  }, [id]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim() || !id) return;
    setIsSubmitting(true);

    dataStore.addComment({
      teachingId: id,
      userName: commentName.trim(),
      text: commentText.trim()
    });

    setCommentText('');
    setComments(dataStore.getCommentsForTeaching(id));
    setIsSubmitting(false);
  };

  if (!teaching) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center flex-col text-center px-4">
        <h1 className="text-3xl font-serif italic text-soft-white mb-4">Teaching Not Found</h1>
        <Link to="/teachings" className="text-gold-500 hover:text-gold-400 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Link>
      </div>
    );
  }

  const isVideo = teaching.type === 'video';
  const youtubeId = getYoutubeId(teaching.youtubeLink);

  return (
    <section className="py-24 pt-32 bg-transparent relative min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
        <Link to="/teachings" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Teachings
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-[10px] uppercase tracking-widest font-bold text-gold-500 mb-4">{teaching.type} • {teaching.date}</div>
          <h1 className="text-3xl md:text-5xl font-serif italic text-soft-white mb-4">
            {teaching.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-white/70 mb-10 pb-10 border-b border-white/10">
            <span className="font-medium text-white">{teaching.speaker}</span>
            {teaching.duration && (
              <>
                <span className="text-white/30">•</span>
                <span>{teaching.duration}</span>
              </>
            )}
          </div>

          {isVideo && youtubeId ? (
            <div className="space-y-8">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/50 border border-white/10 shadow-2xl relative">
                <iframe 
                  className="w-full h-full absolute inset-0"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`} 
                  title={teaching.title} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <div className="flex justify-center">
                <a 
                  href={teaching.youtubeLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/5 border border-white/20 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Watch on YouTube
                </a>
              </div>
            </div>
          ) : isVideo ? (
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl flex items-center justify-center">
              <p className="text-white/50">Video unavailable</p>
            </div>
          ) : (
            <div className="prose prose-invert prose-p:text-white/70 prose-headings:font-serif prose-headings:italic prose-headings:text-soft-white max-w-none">
              <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-10 border border-white/10 shadow-xl">
                 <img src={teaching.thumbnail} alt={teaching.title} className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="whitespace-pre-line text-base leading-loose max-w-3xl mx-auto">
                {teaching.content}
              </div>
            </div>
          )}

          {/* COMMENT SECTION */}
          <div className="mt-16 pt-12 border-t border-white/10 max-w-3xl mx-auto space-y-12 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-gold-500" />
              <h3 className="text-xl font-serif italic text-soft-white font-medium">
                Community Discussion ({comments.length})
              </h3>
            </div>

            {/* Leave a Comment form */}
            <form onSubmit={handleAddComment} className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white/80">Leave a Comment</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Your Name</label>
                  <input
                    required
                    type="text"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="e.g. Sister Grace"
                    className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Comment</label>
                <textarea
                  required
                  rows={4}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Drop a faith-filled word, reflection, or question..."
                  className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-gold-500"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold uppercase tracking-wider text-[11px] rounded transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" /> {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>

            {/* List of comments */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-sm text-white/40 italic text-center py-6">
                  No comments yet. Be the first to start the conversation!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="p-5 border border-white/5 bg-white/2 rounded-lg space-y-2 flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/65">
                        <User className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-soft-white tracking-wide">{comment.userName}</span>
                        <span className="text-[10px] text-white/40 font-mono">{comment.date}</span>
                      </div>
                      <p className="text-white/70 text-sm font-sans whitespace-pre-line leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
