import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, Calendar, Folder, ArrowLeft, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import { dataStore, GalleryItem } from '../dataStore';

interface GalleryGroup {
  name: string;
  coverImage: string;
  count: number;
  latestDate: string;
}

export function GalleryPage() {
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(() => dataStore.getGallery());
  const [selectedGroupName, setSelectedGroupName] = useState<string | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setGalleryList(dataStore.getGallery());
    };
    window.addEventListener('lumina_store_updated', handleUpdate);
    return () => window.removeEventListener('lumina_store_updated', handleUpdate);
  }, []);

  // Group photos
  const groupsMap: Record<string, GalleryItem[]> = {};
  galleryList.forEach(item => {
    const gName = item.groupName?.trim() || 'General Fellowship';
    if (!groupsMap[gName]) {
      groupsMap[gName] = [];
    }
    groupsMap[gName].push(item);
  });

  // Build the list of groups
  const groupsList: GalleryGroup[] = Object.keys(groupsMap).map(name => {
    const items = groupsMap[name];
    // Sort items by dateAdded descending
    const sortedItems = [...items].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
    const latestItem = sortedItems[0] || { imageUrl: '', dateAdded: '' };
    return {
      name,
      coverImage: latestItem.imageUrl,
      count: items.length,
      latestDate: latestItem.dateAdded
    };
  });

  // If in a detailed group, fetch its photos
  const activeGroupPhotos = selectedGroupName && groupsMap[selectedGroupName]
    ? [...groupsMap[selectedGroupName]].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
    : [];

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null && activeGroupPhotos.length > 0) {
      setActivePhotoIndex((activePhotoIndex + 1) % activeGroupPhotos.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null && activeGroupPhotos.length > 0) {
      setActivePhotoIndex((activePhotoIndex - 1 + activeGroupPhotos.length) % activeGroupPhotos.length);
    }
  };

  return (
    <div id="gallery-page-container" className="py-24 pt-32 bg-transparent relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* AnimatePresence for transitions between Master View and Detail View */}
        <AnimatePresence mode="wait">
          {selectedGroupName === null ? (
            /* ---- MASTER/GROUPS VIEW ---- */
            <motion.div
              key="master-groups-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              id="gallery-groups-parent"
            >
              <div id="gallery-header" className="mb-16 text-center max-w-3xl mx-auto">
                <div className="text-[10px] uppercase tracking-widest font-bold text-gold-500 mb-4 bg-gold-500/5 px-3 py-1 rounded-full border border-gold-500/10 inline-block">
                  Our Memory Albums
                </div>
                <h1 className="text-4xl md:text-5xl font-serif italic text-soft-white mb-6">
                  Sights, Gatherings & Fellowships
                </h1>
                <p className="text-white/60 text-sm leading-relaxed max-w-2xl mx-auto">
                  Explore our community in prayer, worship, flagship programs, and moments of togetherness. Click on any album to view the detailed memories within.
                </p>
              </div>

              {groupsList.length === 0 ? (
                <div id="gallery-empty" className="py-20 text-center bg-white/5 border border-white/10 rounded-xl">
                  <Folder className="w-8 h-8 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">No photos have been added to the gallery yet.</p>
                </div>
              ) : (
                <div id="gallery-groups-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {groupsList.map((group, index) => (
                    <motion.div
                      key={group.name}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedGroupName(group.name)}
                      className="group cursor-pointer bg-[#0c1220]/80 border border-white/10 rounded-2xl overflow-hidden hover:border-gold-500/30 transition-all flex flex-col justify-between shadow-xl"
                    >
                      {/* Album Cover Picture container with dynamic stacked border feel */}
                      <div className="aspect-[4/3] w-full overflow-hidden relative border-b border-white/10 bg-black/40">
                        <img
                          src={group.coverImage}
                          alt={group.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-navy-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="px-4 py-2 bg-gradient-to-tr from-gold-500 to-gold-400 text-navy-900 border border-gold-400 text-[9px] font-bold uppercase tracking-widest rounded-sm shadow-xl flex items-center gap-1.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                            <LayoutGrid className="w-3.5 h-3.5" />
                            Open Album
                          </span>
                        </div>

                        {/* Photo Count Tag */}
                        <span className="absolute top-4 right-4 px-2.5 py-1 bg-navy-950/90 text-gold-500 text-[9px] uppercase tracking-widest font-extrabold rounded-md border border-gold-500/20 shadow-lg flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-gold-500" />
                          {group.count} {group.count === 1 ? 'Photo' : 'Photos'}
                        </span>
                      </div>

                      {/* Album Text details */}
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-serif italic text-soft-white group-hover:text-gold-400 transition-colors line-clamp-1">
                            {group.name}
                          </h3>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mt-1 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-white/30" />
                            Latest addition: {group.latestDate}
                          </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-gold-500/80 group-hover:text-gold-400 transition-colors">
                            View More Details →
                          </span>
                          <span className="text-[9px] text-white/30 uppercase tracking-wider font-mono">
                            ALBUM
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* ---- DETAILS VIEW OF SELECTED GROUP ---- */
            <motion.div
              key="group-details-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              id="gallery-group-details"
            >
              {/* Navigation and Title */}
              <div className="mb-12">
                <button
                  onClick={() => setSelectedGroupName(null)}
                  className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold-400/80 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 border border-white/10 hover:border-white/20 rounded-md cursor-pointer mb-8"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back Alubms / Gallery
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-gold-500 mb-2">
                      Gallery Album Details
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif italic text-soft-white">
                      {selectedGroupName}
                    </h1>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest rounded-md">
                      <ImageIcon className="w-3.5 h-3.5 text-gold-500" />
                      {activeGroupPhotos.length} {activeGroupPhotos.length === 1 ? 'Photo' : 'Photos'} Total
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid of gallery assets inside this group */}
              <div id="gallery-photos-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {activeGroupPhotos.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="group relative cursor-pointer overflow-hidden rounded-xl bg-[#0c1220]/50 border border-white/10 hover:border-white/20 transition-all aspect-square flex flex-col justify-between"
                    onClick={() => openLightbox(index)}
                  >
                    <div className="w-full h-full relative overflow-hidden flex-grow group">
                      <img
                        src={item.imageUrl}
                        alt={item.caption || 'Gallery photo'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />

                      {/* Subtle Elegant Hover Overlay */}
                      <div className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="p-4 text-center">
                          <Maximize2 className="w-6 h-6 text-gold-500 mx-auto mb-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75" />
                          <p className="text-white text-xs font-serif italic max-w-xs line-clamp-2 px-2">
                            {item.caption || 'Click Zoom'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {item.caption && (
                      <div className="p-3 bg-white/[0.02] border-t border-white/5 shrink-0 flex justify-between items-center gap-2">
                        <p className="text-white/70 text-xs truncate italic font-serif">
                          {item.caption}
                        </p>
                        {item.dateAdded && (
                          <span className="text-[8px] text-white/30 uppercase font-bold tracking-wider shrink-0">
                            {item.dateAdded}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhotoIndex !== null && activeGroupPhotos[activePhotoIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="gallery-lightbox"
            className="fixed inset-0 bg-navy-950/98 backdrop-blur-md z-[150] flex flex-col items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Top Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2.5 rounded-full z-15 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Lightbox Body Section */}
            <div 
              className="relative max-w-4xl w-full max-h-[80vh] flex flex-col justify-center items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={activePhotoIndex}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                src={activeGroupPhotos[activePhotoIndex].imageUrl}
                alt={activeGroupPhotos[activePhotoIndex].caption || 'Lightbox View'}
                className="max-h-[70vh] max-w-full object-contain rounded-md shadow-2xl"
                referrerPolicy="no-referrer"
              />

              {/* Navigation Arrows */}
              {activeGroupPhotos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl select-none cursor-pointer"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl select-none cursor-pointer"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Bottom Caption Overlay */}
            <div 
              className="mt-6 text-center max-w-xl px-6"
              onClick={(e) => e.stopPropagation()}
            >
              {activeGroupPhotos[activePhotoIndex].caption && (
                <p className="text-soft-white font-serif italic text-base md:text-lg">
                  "{activeGroupPhotos[activePhotoIndex].caption}"
                </p>
              )}
              <div className="flex items-center justify-center gap-3 mt-2">
                {activeGroupPhotos[activePhotoIndex].groupName && (
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gold-500 bg-white/5 px-2 py-0.5 border border-white/10 rounded-sm">
                    {activeGroupPhotos[activePhotoIndex].groupName}
                  </span>
                )}
                <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                  Added on: {activeGroupPhotos[activePhotoIndex].dateAdded}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
