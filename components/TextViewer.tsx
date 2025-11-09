import React, { useState, useEffect } from 'react';
import { CopyIcon, DownloadIcon, TrashIcon } from './Icons';

interface TextViewerProps {
  text: string;
  onClear: () => void;
}

export const TextViewer: React.FC<TextViewerProps> = ({ text, onClear }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
    }
  };

  const handleDownload = () => {
    if (text) {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'texte_extrait.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-grow">
        <textarea
          readOnly
          value={text}
          placeholder="Le texte extrait apparaîtra ici..."
          className="w-full h-full min-h-[300px] md:min-h-[400px] p-4 bg-slate-100 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
        />
      </div>
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        <button
          onClick={handleCopy}
          disabled={!text || isCopied}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#007BFF] rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <CopyIcon className="w-5 h-5"/>
          <span>{isCopied ? 'Copié !' : 'Copier le texte'}</span>
        </button>
        <button
          onClick={handleDownload}
          disabled={!text}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-green-500 rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <DownloadIcon className="w-5 h-5"/>
          <span>Télécharger (.txt)</span>
        </button>
        <button
          onClick={onClear}
          disabled={!text}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <TrashIcon className="w-5 h-5"/>
          <span>Effacer</span>
        </button>
      </div>
    </div>
  );
};