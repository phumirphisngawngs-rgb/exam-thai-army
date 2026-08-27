import React, { useState } from 'react';
import { Check, Info, Printer, RefreshCw, Search, Clock, User, Award, Shield } from 'lucide-react';
import { ExamSubmission } from '../types';

interface ConfirmationViewProps {
  submission: ExamSubmission;
  onRetakeExam: () => void;
  onViewVerification: () => void;
}

export const ConfirmationView: React.FC<ConfirmationViewProps> = ({
  submission,
  onRetakeExam,
  onViewVerification,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(submission.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Derive display time spent
  const timeSpentDisplay =
    submission.timeSpentFormatted ||
    (submission.timeSpentSeconds !== undefined
      ? `${Math.floor(submission.timeSpentSeconds / 60)}:${(submission.timeSpentSeconds % 60)
          .toString()
          .padStart(2, '0')} นาที`
      : '00:00 นาที');

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-10 px-4 sm:px-6 relative z-10">
      {/* Background Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <img
          alt="ATEC Honor Seal Watermark"
          className="w-4/5 max-w-2xl opacity-[0.035] filter grayscale brightness-150 select-none transform scale-110"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1Tl92O6IDlJsOBuhPbPmvT5G7HPQz7skSte5OiiYHWbdqr-OyfxSZGsFyLMR9qBg_JTUlxAhXz03fI4INzoaGehxZH0FVX-8zyQq6BKXmrU7whUe87C1AXWyadBz6t0EnvrjpjoBTehr2mJRZcPC4_3Z9zdQC2VkaqYJllYrU1NZRogy7kRATGxh8QSqvnXVTe2cpypzwshvUogvYzNZe0fSeAicowMdkPIgsWStLjdRSsG2sLT2j8Hkj9l-LE-Q6wBY"
        />
      </div>

      {/* Main Content Container */}
      <main className="w-full max-w-2xl z-10 relative">
        <div className="elevated-card rounded-xl p-6 sm:p-10 md:p-12 flex flex-col items-center text-center backdrop-blur-md">
          {/* Success Icon */}
          <div className="mb-6 sm:mb-8 relative">
            <div className="absolute inset-0 bg-[#f6be39]/25 rounded-full blur-2xl animate-pulse"></div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#231f1d] flex items-center justify-center border-2 border-[#f6be39] shadow-[0_0_20px_rgba(246,190,57,0.4)] relative z-10">
              <span
                className="material-symbols-outlined text-[44px] sm:text-[48px] text-[#f6be39]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                task_alt
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="font-headline text-2xl sm:text-3xl md:text-[32px] font-extrabold gold-gradient-text mb-3 uppercase tracking-wide leading-tight">
            ส่งข้อสอบเรียบร้อยแล้ว<br />
            ขอบคุณที่เข้าร่วมการทดสอบ
          </h1>

          <p className="text-sm sm:text-base text-[#d3c5ae] mb-6 sm:mb-8 max-w-md font-normal leading-relaxed">
            ระบบได้ทำการบันทึกข้อมูลการส่งข้อสอบของคุณเรียบร้อยแล้ว
          </p>

          {/* Summary Box displaying ONLY 4 items: ชื่อในเกม, ชื่อดิสคอร์ด, ยศในเกม, เวลาที่ใช้สอบ */}
          <div className="w-full surface-layer rounded-lg p-5 sm:p-6 mb-6 text-left relative overflow-hidden border border-[#4f4634]/60 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            {/* Decorative Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#f6be39]"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#f6be39]"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#f6be39]"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#f6be39]"></div>

            <div className="border-b border-[#4f4634] pb-2.5 mb-4 flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold text-[#f6be39] font-mono-military uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#f6be39]" />
                ข้อมูลผู้เข้าสอบและเวลา
              </h2>
              <span className="text-[11px] text-[#d3c5ae]/70 font-mono-military">
                ID: {submission.id}
              </span>
            </div>

            <dl className="divide-y divide-[#4f4634]/40 text-sm sm:text-base">
              {/* 1. ชื่อในเกม */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2.5">
                <dt className="text-[#9b8f7a] font-semibold text-xs sm:text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-[#f6be39]" />
                  <span>ชื่อในเกม</span>
                </dt>
                <dd className="text-[#eae1dd] font-bold text-sm sm:text-base mt-1 sm:mt-0">
                  {submission.candidate.username}
                </dd>
              </div>

              {/* 2. ชื่อดิสคอร์ด */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2.5">
                <dt className="text-[#9b8f7a] font-semibold text-xs sm:text-sm flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[10px] text-[#5865F2] font-bold">#</span>
                  <span>ชื่อดิสคอร์ด</span>
                </dt>
                <dd className="text-[#eae1dd] font-mono-military text-xs sm:text-sm font-medium mt-1 sm:mt-0">
                  {submission.candidate.discord}
                </dd>
              </div>

              {/* 3. ยศในเกม */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2.5">
                <dt className="text-[#9b8f7a] font-semibold text-xs sm:text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#f6be39]" />
                  <span>ยศในเกม</span>
                </dt>
                <dd className="text-[#f6be39] font-semibold text-sm sm:text-base mt-1 sm:mt-0">
                  {submission.candidate.rank}
                </dd>
              </div>

              {/* 4. เวลาที่ใช้สอบ */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2.5">
                <dt className="text-[#9b8f7a] font-semibold text-xs sm:text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#f6be39]" />
                  <span>เวลาที่ใช้สอบ</span>
                </dt>
                <dd className="text-[#ffdfa0] font-mono-military font-bold text-sm sm:text-base mt-1 sm:mt-0">
                  {timeSpentDisplay}
                </dd>
              </div>
            </dl>
          </div>

          {/* Next Steps Notification Box */}
          <div className="bg-[#2e2927]/60 border border-[#4f4634] rounded-lg p-4 w-full text-center mb-6">
            <span
              className="material-symbols-outlined text-[#ffb951] text-2xl mb-1 block"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              info
            </span>
            <p className="font-semibold text-xs sm:text-sm text-[#eae1dd]">
              กรุณารอผลการตรวจจากเจ้าหน้าที่แผนกอบรมหลักสูตร
            </p>
            <p className="text-[11px] sm:text-xs text-[#d3c5ae]/75 mt-0.5 font-normal">
              (Please await evaluation results from the Course Training Department.)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-5 py-2.5 rounded bg-[#1f1b19] border border-[#4f4634] hover:border-[#f6be39] text-[#eae1dd] hover:text-[#f6be39] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#f6be39]" />
              พิมพ์ / บันทึกใบเสร็จ
            </button>

            <button
              onClick={onViewVerification}
              className="w-full sm:w-auto px-5 py-2.5 rounded bg-[#2e2927] border border-[#f6be39]/50 hover:border-[#f6be39] text-[#f6be39] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_10px_rgba(246,190,57,0.15)]"
            >
              <Search className="w-4 h-4" />
              ตรวจสอบสถานะผลสอบ
            </button>

            <button
              onClick={onRetakeExam}
              className="w-full sm:w-auto px-4 py-2.5 rounded bg-[#161311] text-[#9b8f7a] hover:text-[#eae1dd] text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              ลงทะเบียนใหม่
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

