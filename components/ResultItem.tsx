import React, { useState, useCallback } from 'react';
import { CopyIcon, ChevronDownIcon, SuccessIcon, ErrorIcon } from './Icons';

interface ResultItemProps {
  fileName: string;
  text?: string;
  error?: string;
}

export const ResultItem: React.FC<ResultItemProps> = ({ fileName, text, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopy = useCallback(() => {
    if (text) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [text]);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden transition-all duration-300">
      <button
        className="w-full flex items-center justify-between p-3 text-left bg-slate-50 hover:bg-slate-100 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {text ? <SuccessIcon className="w-5 h-5 text-green-500" /> : <ErrorIcon className="w-5 h-5 text-red-500" />}
          <span className="font-semibold text-slate-700 truncate">{fileName}</span>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 bg-white border-t border-slate-200">
          {text ? (
            <div className="space-y-3">
              <textarea
                readOnly
                value={text}
                className="w-full h-48 p-2 bg-slate-100 border border-slate-200 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#007BFF] rounded-md shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60"
              >
                <CopyIcon className="w-4 h-4"/>
                <span>{isCopied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>
          ) : (
            <p className="text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};