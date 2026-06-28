import React from 'react';

export const NeoMarkdown = ({ text }) => {
  return (
    <div className="space-y-4 text-left rtl:text-right font-medium text-lg leading-relaxed text-black page-enter">
      {text.split('\n').map((line, i) => {
        // Headers
        if (line.startsWith('#### ')) return <h4 key={i} className="text-xl font-bold text-[var(--accent-coral)] mt-4 mb-2">{line.replace('#### ', '')}</h4>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-2xl font-black bg-[var(--accent-mint)] inline-block px-4 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0_#000] mt-6 mb-2">{line.replace('### ', '')}</h3>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-3xl font-black text-[var(--accent-coral)] mt-8 mb-4 border-b-4 border-black inline-block pb-1">{line.replace('## ', '')}</h2>;
        if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-black mt-8 mb-4">{line.replace('# ', '')}</h1>;
        
        // Lists
        if (line.startsWith('- ') || line.startsWith('* ')) {
          const content = line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong class="font-black border-b-4 border-[var(--accent-peach)]">$1</strong>');
          return (
            <div key={i} className="flex items-start gap-3 ml-2 rtl:mr-2 rtl:ml-0 mt-2 bg-white/50 p-3 rounded-2xl border-2 border-black">
              <div className="w-3 h-3 mt-1.5 rounded-sm bg-black shrink-0 rotate-45"></div>
              <span dangerouslySetInnerHTML={{__html: content}} />
            </div>
          );
        }
        if (line.match(/^\d+\.\s/)) {
          const num = line.match(/^\d+\./)[0];
          const content = line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="font-black bg-[var(--accent-yellow)] px-2 py-0.5 rounded-md border-2 border-black shadow-[2px_2px_0_#000] mx-1 inline-block">$1</strong>');
          return (
            <div key={i} className="flex items-start gap-3 ml-2 rtl:mr-2 rtl:ml-0 mt-3 p-3 bg-[var(--bg-primary)] rounded-2xl border-2 border-black">
              <div className="font-black text-xl text-[var(--accent-lilac)] shrink-0 bg-black text-white w-8 h-8 flex items-center justify-center rounded-full border-2 border-black shadow-[2px_2px_0_#000]">{num.replace('.', '')}</div>
              <span className="mt-0.5" dangerouslySetInnerHTML={{__html: content}} />
            </div>
          );
        }
        
        // Tables (Basic parsing for AI outputs)
        if (line.startsWith('|') && !line.includes('---')) {
          const cells = line.split('|').filter(c => c.trim() !== '');
          return (
            <div key={i} className="flex flex-wrap gap-2 mb-2">
              {cells.map((cell, idx) => (
                 <span key={idx} className="bg-white border-2 border-black px-3 py-1 rounded-lg font-bold shadow-[2px_2px_0_#000]">{cell.trim()}</span>
              ))}
            </div>
          )
        }
        if (line.includes('---') && line.startsWith('|')) return null; // Skip table separators
        
        // Empty lines
        if (line.trim() === '') return <div key={i} className="h-2"></div>;
        
        // Standard paragraph with bold parsing
        return (
          <p key={i} className="mb-2" dangerouslySetInnerHTML={{
            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-black bg-gray-200 px-1 rounded">$1</strong>')
          }} />
        );
      })}
    </div>
  );
};
