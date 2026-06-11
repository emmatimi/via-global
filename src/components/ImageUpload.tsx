import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (url: string) => void;
  defaultImage?: string;
}

export function ImageUpload({ onImageSelected, defaultImage }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = React.useState<string | null>(defaultImage || null);
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPreview(defaultImage || null);
  }, [defaultImage]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Define max safe visual dimension
        const MAX_DIM = 640;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG with medium-high quality to produce an ultra-small, highly-optimized persistent string (usually 15-30KB)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setPreview(compressedBase64);
          onImageSelected(compressedBase64);
        } else {
          // Context fallback
          const rawBase64 = reader.result as string;
          setPreview(rawBase64);
          onImageSelected(rawBase64);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors ${
        dragActive ? 'border-gold-500 bg-gold-500/5' : 'border-white/20 bg-white/5 hover:border-white/40'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input 
        ref={inputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleChange}
      />
      {preview ? (
        <div className="w-full h-32 relative rounded-md overflow-hidden bg-black/20 group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs font-bold uppercase tracking-widest text-white">Click or Drop to change</span>
          </div>
        </div>
      ) : (
        <div className="py-4 flex flex-col items-center gap-2 text-white/50 cursor-pointer">
          <UploadCloud className="w-8 h-8 mb-2" />
          <p className="text-xs font-bold uppercase tracking-widest">Drop image here</p>
          <p className="text-[10px]">or click to browse</p>
        </div>
      )}
    </div>
  );
}
