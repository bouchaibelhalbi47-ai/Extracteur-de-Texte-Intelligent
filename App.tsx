
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultItem } from './components/ResultItem';
import { extractTextFromFile } from './services/geminiService';
import { LogoIcon, CopyIcon, ZipIcon, TrashIcon } from './components/Icons';
import JSZip from 'jszip';

type ExtractionResult = {
  fileName: string;
  text?: string;
  error?: string;
};

const App: React.FC = () => {
  const [results, setResults] = useState<ExtractionResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleFilesSelect = useCallback(async (selectedFiles: FileList) => {
    const files = Array.from(selectedFiles);
    if (files.length === 0) return;

    setIsLoading(true);
    setResults([]);

    const promises = files.map(file => 
      extractTextFromFile(file)
        .then(text => ({
          fileName: file.name,
          text: text && text.trim() !== '' ? text : undefined,
          error: !text || text.trim() === '' ? 'Aucun texte lisible n\'a été trouvé.' : undefined,
        }))
        .catch(e => ({
          fileName: file.name,
          error: e.message || 'Une erreur inattendue est survenue.',
        }))
    );

    const settledResults = await Promise.all(promises);
    setResults(settledResults);
    setIsLoading(false);
  }, []);

  const handleClear = useCallback(() => {
    setResults([]);
  }, []);
  
  const handleCopyAll = useCallback(() => {
    const allText = results
      .filter(r => r.text)
      .map(r => `--- ${r.fileName} ---\n\n${r.text}`)
      .join('\n\n');

    if (allText) {
      navigator.clipboard.writeText(allText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [results]);

  const handleDownloadAll = useCallback(async () => {
    const zip = new JSZip();
    results
      .filter(r => r.text)
      .forEach(r => {
        const fileName = r.fileName.split('.').slice(0, -1).join('.') + '.txt';
        zip.file(fileName, r.text!);
      });

    if (Object.keys(zip.files).length > 0) {
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'extractions.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [results]);

  const hasResults = results.length > 0;
  const hasSuccesses = results.some(r => r.text);

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col text-slate-800">
      <header className="py-5 px-4 md:px-8 bg-gradient-to-r from-blue-50 via-slate-50 to-gray-100 shadow-sm border-b border-slate-200">
        <div className="container mx-auto flex items-center gap-3">
            <LogoIcon className="h-9 w-9 text-blue-600" />
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                  Extracteur Multi-documents
                </h1>
                <p className="text-sm text-slate-500">Importez vos fichiers et récupérez automatiquement le texte.</p>
            </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-3xl transition-all duration-500">
            
            {isLoading ? (
              <div className="text-center p-8 space-y-4">
                <div className="w-12 h-12 border-4 border-[#007BFF] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-lg font-semibold text-slate-700">Analyse en cours...</p>
                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4 overflow-hidden">
                  <div className="bg-[#007BFF] h-2.5 rounded-full w-full animate-pulse"></div>
                </div>
              </div>
            ) : hasResults ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3 justify-center pb-4 border-b border-slate-200">
                    <button onClick={handleCopyAll} disabled={!hasSuccesses} className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#007BFF] rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60">
                        <CopyIcon className="w-5 h-5"/>
                        <span>{isCopied ? 'Copié !' : 'Tout copier'}</span>
                    </button>
                    <button onClick={handleDownloadAll} disabled={!hasSuccesses} className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-green-500 rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60">
                        <ZipIcon className="w-5 h-5"/>
                        <span>Télécharger (.zip)</span>
                    </button>
                    <button onClick={handleClear} className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                        <TrashIcon className="w-5 h-5"/>
                        <span>Tout effacer</span>
                    </button>
                </div>
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                  {results.map((result, index) => (
                    <ResultItem key={index} {...result} />
                  ))}
                </div>
              </div>
            ) : (
              <FileUpload onFileSelect={handleFilesSelect} isLoading={isLoading} />
            )}
        </div>
      </main>
      
      <footer className="text-center py-5 text-slate-500 text-sm font-light">
        <p>Développé avec Google AI Studio</p>
      </footer>
    </div>
  );
};

export default App;
