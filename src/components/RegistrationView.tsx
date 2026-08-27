import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { CandidateInfo } from '../types';
import { OFFICIAL_COURSES } from '../data/examData';

interface RegistrationViewProps {
  onStartExam: (candidate: CandidateInfo) => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({ onStartExam }) => {
  const [username, setUsername] = useState('');
  const [discord, setDiscord] = useState('');
  const [rank, setRank] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick autofill sample data for testing
  const handleAutoFillSample = () => {
    setUsername('จ่าสิบเอก ภาคภูมิ พิทักษ์ไทย');
    setDiscord('phumir.atec#9921');
    setRank('จ่าสิบเอก');
    setSelectedCourseId('course2');
    setPasscode('ATEC2024');
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('กรุณาระบุชื่อในเกม (Username)');
      return;
    }
    if (!discord.trim()) {
      setErrorMessage('กรุณาระบุชื่อ Discord สำหรับติดต่อ');
      return;
    }
    if (!rank.trim()) {
      setErrorMessage('กรุณาระบุยศในเกม');
      return;
    }
    if (!selectedCourseId) {
      setErrorMessage('กรุณาเลือกโรลหลักสูตรที่มี');
      return;
    }

    // Strict Passcode validation: Must be 'ATEC2024' (case-insensitive)
    const normalizedPasscode = passcode.trim().toUpperCase();
    if (!normalizedPasscode) {
      setErrorMessage('กรุณากรอกรหัสเข้าสอบ');
      return;
    }

    if (normalizedPasscode !== 'ATEC2024') {
      setErrorMessage('รหัสเข้าสอบไม่ถูกต้อง กรุณาตรวจสอบรหัสผ่านอีกครั้ง (รหัสทดสอบ: ATEC2024)');
      return;
    }

    setIsSubmitting(true);
    const selectedCourse = OFFICIAL_COURSES.find((c) => c.id === selectedCourseId);
    
    setTimeout(() => {
      onStartExam({
        username: username.trim(),
        discord: discord.trim(),
        rank: rank.trim(),
        courseId: selectedCourseId,
        courseName: selectedCourse?.thName || 'โรงเรียนนายสิบ',
        passcode: passcode.trim(),
      });
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4 sm:px-6 relative z-10">
      {/* Background Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <img
          alt="ATEC Watermark"
          className="w-4/5 max-w-3xl opacity-[0.035] filter grayscale brightness-150 select-none transform scale-110"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1Tl92O6IDlJsOBuhPbPmvT5G7HPQz7skSte5OiiYHWbdqr-OyfxSZGsFyLMR9qBg_JTUlxAhXz03fI4INzoaGehxZH0FVX-8zyQq6BKXmrU7whUe87C1AXWyadBz6t0EnvrjpjoBTehr2mJRZcPC4_3Z9zdQC2VkaqYJllYrU1NZRogy7kRATGxh8QSqvnXVTe2cpypzwshvUogvYzNZe0fSeAicowMdkPIgsWStLjdRSsG2sLT2j8Hkj9l-LE-Q6wBY"
        />
      </div>

      {/* Main Registration Card */}
      <div className="w-full max-w-lg metallic-card rounded-xl p-6 sm:p-10 relative z-10 backdrop-blur-sm">
        {/* Top Header Badge */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-3">
            <div className="absolute inset-0 bg-[#f6be39]/20 rounded-full blur-xl animate-pulse"></div>
            <img
              alt="ATEC Logo"
              className="h-20 w-20 sm:h-24 sm:w-24 mx-auto object-contain relative z-10 filter drop-shadow-[0_4px_12px_rgba(246,190,57,0.35)]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnE6r0cgDWClk4ek2v9pnbAWms6EJgz25Y41JXeaRa3yZQVv6QDD75v0tbbHaH-LIsppvpJgpzZyL0uosiW4u8TqoBGXRQ-QUZ5m-7ChU6g5Pmg6bGyOa92KKRWCs8b1uVeaVMxhWeF6NhBe9LmDUbupdD5Dm8RGrmAipqBML8SiMdpk_wUdB_AqXKtuEOt_t3ihR8G6fJixyTBGBRjaNGVc-N4jcgl-JDg5Dnx1ehmwdWDMFZgNh7OLROakoqYPGO5eM"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-headline text-[#f6be39] uppercase tracking-wider gold-gradient-text">
            EXAMINATION PORTAL
          </h2>
          <p className="text-[#d3c5ae] text-sm sm:text-base font-medium mt-1">
            Official Military Assessment Registration
          </p>
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-0.5 rounded-full bg-[#110d0c]/80 border border-[#4f4634] text-[11px] text-[#f6be39] font-mono-military">
            <ShieldCheck className="w-3.5 h-3.5 text-[#f6be39]" />
            SECURE ENCRYPTED TERMINAL
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="relative flex flex-col-reverse">
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
              className="input-tactical w-full px-4 py-3 text-[#eae1dd] rounded-t font-medium text-sm sm:text-base focus:text-[#ffdfa0]"
            />
            <label
              htmlFor="username"
              className="text-xs sm:text-sm font-semibold text-[#9b8f7a] mb-1 transition-colors"
            >
              ชื่อในเกม (Username) <span className="text-[#f6be39]">*</span>
            </label>
          </div>

          {/* Discord */}
          <div className="relative flex flex-col-reverse">
            <input
              id="discord"
              type="text"
              required
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              placeholder=" "
              className="input-tactical w-full px-4 py-3 text-[#eae1dd] rounded-t font-medium text-sm sm:text-base focus:text-[#ffdfa0]"
            />
            <label
              htmlFor="discord"
              className="text-xs sm:text-sm font-semibold text-[#9b8f7a] mb-1 transition-colors"
            >
              ชื่อ Discord <span className="text-[#f6be39]">*</span>
            </label>
          </div>

          {/* Rank */}
          <div className="relative flex flex-col-reverse">
            <input
              id="rank"
              type="text"
              required
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder=" "
              className="input-tactical w-full px-4 py-3 text-[#eae1dd] rounded-t font-medium text-sm sm:text-base focus:text-[#ffdfa0]"
            />
            <label
              htmlFor="rank"
              className="text-xs sm:text-sm font-semibold text-[#9b8f7a] mb-1 transition-colors"
            >
              ยศในเกม <span className="text-[#f6be39]">*</span>
            </label>
          </div>

          {/* Course Dropdown */}
          <div className="relative flex flex-col-reverse">
            <div className="relative">
              <select
                id="course"
                required
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="input-tactical w-full px-4 py-3 text-[#eae1dd] rounded-t font-medium text-sm sm:text-base appearance-none cursor-pointer pr-10"
              >
                <option value="" disabled className="bg-[#1f1b19] text-[#9b8f7a]">
                  เลือกโรลหลักสูตรที่มี
                </option>
                {OFFICIAL_COURSES.map((course) => (
                  <option key={course.id} value={course.id} className="bg-[#1f1b19] text-[#eae1dd]">
                    {course.thName}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#f6be39]">
                <span className="material-symbols-outlined text-xl">expand_more</span>
              </div>
            </div>
            <label
              htmlFor="course"
              className="text-xs sm:text-sm font-semibold text-[#9b8f7a] mb-1 transition-colors"
            >
              โรลหลักสูตรที่มี <span className="text-[#f6be39]">*</span>
            </label>
          </div>

          {/* Passcode */}
          <div className="relative flex flex-col-reverse">
            <div className="relative">
              <input
                id="passcode"
                type={showPasscode ? 'text' : 'password'}
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder=" "
                className="input-tactical w-full px-4 py-3 text-[#eae1dd] rounded-t font-medium text-sm sm:text-base pr-12 focus:text-[#ffdfa0]"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9b8f7a] hover:text-[#f6be39] transition-colors p-1"
                title={showPasscode ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="passcode"
                className="text-xs sm:text-sm font-semibold text-[#9b8f7a] transition-colors"
              >
                รหัสเข้าสอบ <span className="text-[#f6be39]">*</span>
              </label>
              <span className="text-[11px] text-[#f6be39]/80 font-mono-military">
                (รหัสทดสอบ: ATEC2024)
              </span>
            </div>
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="bg-[#93000a]/40 border border-[#ffb4ab]/60 text-[#ffdad6] text-xs sm:text-sm px-3.5 py-2.5 rounded text-center animate-shake font-medium">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="gold-gradient-btn w-full py-3.5 sm:py-4 rounded text-[#402d00] font-headline font-bold text-lg uppercase tracking-wider mt-6 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform shadow-[0_4px_16px_rgba(246,190,57,0.3)] disabled:opacity-75"
          >
            {isSubmitting ? (
              <span>กำลังตรวจสอบรหัสเข้าสอบ...</span>
            ) : (
              <>
                <span>เข้าสู่บทสอบ</span>
                <ArrowRight className="w-5 h-5 font-bold" />
              </>
            )}
          </button>

          {/* Quick Demo Helper */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleAutoFillSample}
              className="inline-flex items-center gap-1.5 text-xs text-[#d3c5ae]/70 hover:text-[#f6be39] transition-colors py-1 px-2.5 rounded border border-[#4f4634]/60 bg-[#161311]/50 hover:bg-[#231f1d]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f6be39]" />
              คลิกเพื่อเติมข้อมูลตัวอย่าง (Quick Autofill Demo)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

