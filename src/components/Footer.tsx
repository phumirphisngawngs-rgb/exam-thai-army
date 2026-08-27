import React from 'react';

interface FooterProps {
  onOpenModal: (type: 'honor' | 'privacy' | 'support') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModal }) => {
  return (
    <footer className="w-full py-5 px-4 sm:px-8 md:px-12 flex flex-col md:flex-row justify-between items-center bg-[#110d0c]/95 border-t-2 border-[#f6be39]/20 shadow-[0_-4px_20px_rgba(0,0,0,0.6)] z-20 text-xs md:text-sm">
      <div className="font-semibold text-[#f6be39] tracking-wider mb-3 md:mb-0 text-center md:text-left font-mono-military">
        © ROYAL THAI ARMY TRAINING & EDUCATION COMMAND. ALL RIGHTS RESERVED.
      </div>
      <nav className="flex items-center gap-6">
        <button
          onClick={() => onOpenModal('honor')}
          className="text-[#d3c5ae] hover:text-[#f6be39] transition-colors font-semibold underline-offset-4 hover:underline"
        >
          Honor Code
        </button>
        <button
          onClick={() => onOpenModal('privacy')}
          className="text-[#d3c5ae] hover:text-[#f6be39] transition-colors font-semibold underline-offset-4 hover:underline"
        >
          Institutional Privacy
        </button>
        <button
          onClick={() => onOpenModal('support')}
          className="text-[#d3c5ae] hover:text-[#f6be39] transition-colors font-semibold underline-offset-4 hover:underline"
        >
          Support Command
        </button>
      </nav>
    </footer>
  );
};
