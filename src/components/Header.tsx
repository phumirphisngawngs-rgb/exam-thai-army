import React from 'react';
import { Landmark, Shield, Award } from 'lucide-react';

interface HeaderProps {
  currentTab: 'registration' | 'examination' | 'confirmation' | 'verification';
  onNavigate: (tab: 'registration' | 'examination' | 'confirmation' | 'verification') => void;
  hasActiveSession: boolean;
  hasSubmission: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  hasActiveSession,
  hasSubmission,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 sm:px-8 md:px-12 h-20 bg-[#110d0c]/95 backdrop-blur-md border-b-2 border-[#f6be39]/20 shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
      {/* Brand & Seal */}
      <div 
        onClick={() => onNavigate('registration')}
        className="flex items-center gap-3 md:gap-4 cursor-pointer group"
      >
        <div className="relative">
          <img
            alt="ATEC Institutional Seal"
            className="h-11 w-11 md:h-12 md:w-12 object-contain filter drop-shadow-[0_0_8px_rgba(246,190,57,0.3)] transition-transform duration-300 group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6BRSfNCwFw3b6b3pjBgrXhe5B5wcDqOiQ20gOrrg5iul499WaefSdjUbD0qAeZoXo1-iFnSiJhdEjpzLJogMRlQXYTqJtVEa-Fe1RbRf7S_rZLLocIwfERFmmj6L53Lg1Dnrg-aFrSsvHAMsU3VzoxrWdpJE-8nA5N0iom2CY2xy79fichgXDfOt5gjuwqM2N5opCKcbXLokCL0frXNZpFIH-lgPU45f73pdVHq7koQu0UjeAwh9adFaz7m7CJ8Kt8J4"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm sm:text-base md:text-xl font-bold font-headline text-[#f6be39] tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            ARMY TRAINING & EDUCATION COMMAND
          </h1>
          <span className="text-[10px] md:text-xs text-[#d3c5ae]/70 font-mono-military tracking-widest uppercase hidden sm:block">
            ยศ.ทบ. • Royal Thai Army Assessment Portal
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8">
        <button
          onClick={() => onNavigate('registration')}
          className={`font-semibold text-sm tracking-wide transition-all pb-1 ${
            currentTab === 'registration'
              ? 'text-[#f6be39] border-b-2 border-[#f6be39] font-bold drop-shadow-[0_0_8px_rgba(246,190,57,0.4)]'
              : 'text-[#d3c5ae] hover:text-[#ffdfa0] hover:bg-[#2e2927]/50 px-2 py-1 rounded'
          }`}
        >
          Registration (ลงทะเบียน)
        </button>

        <button
          onClick={() => {
            if (hasActiveSession) {
              onNavigate('examination');
            } else {
              onNavigate('registration');
            }
          }}
          className={`font-semibold text-sm tracking-wide transition-all pb-1 flex items-center gap-1.5 ${
            currentTab === 'examination'
              ? 'text-[#f6be39] border-b-2 border-[#f6be39] font-bold drop-shadow-[0_0_8px_rgba(246,190,57,0.4)]'
              : 'text-[#d3c5ae] hover:text-[#ffdfa0] hover:bg-[#2e2927]/50 px-2 py-1 rounded'
          }`}
        >
          Examination (การทดสอบ)
          {hasActiveSession && (
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => onNavigate(hasSubmission ? 'confirmation' : 'verification')}
          className={`font-semibold text-sm tracking-wide transition-all pb-1 ${
            currentTab === 'confirmation' || currentTab === 'verification'
              ? 'text-[#f6be39] border-b-2 border-[#f6be39] font-bold drop-shadow-[0_0_8px_rgba(246,190,57,0.4)]'
              : 'text-[#d3c5ae] hover:text-[#ffdfa0] hover:bg-[#2e2927]/50 px-2 py-1 rounded'
          }`}
        >
          Verification (การตรวจสอบ)
        </button>
      </nav>

      {/* Quick Action Icons */}
      <div className="flex items-center gap-3 md:gap-4 text-[#f6be39]">
        <button
          title="สถานะระบบสถาบัน"
          onClick={() => onNavigate('verification')}
          className="p-1.5 rounded hover:bg-[#2e2927] hover:text-[#ffdfa0] transition-colors"
        >
          <Landmark className="w-5 h-5" />
        </button>
        <button
          title="มาตรฐานความปลอดภัยและจรรยาบรรณ"
          onClick={() => onNavigate('verification')}
          className="p-1.5 rounded hover:bg-[#2e2927] hover:text-[#ffdfa0] transition-colors"
        >
          <Shield className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
