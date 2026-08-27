import React, { useState } from 'react';
import { Search, ShieldCheck, Clock, CheckCircle2, XCircle, AlertCircle, FileBadge, ArrowLeft, Award, UserCheck } from 'lucide-react';
import { ExamSubmission } from '../types';

interface VerificationViewProps {
  submissions: ExamSubmission[];
  onBackToPortal: () => void;
  onNavigateToAdmin?: () => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  submissions,
  onBackToPortal,
  onNavigateToAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<ExamSubmission | null>(
    submissions.length > 0 ? submissions[0] : null
  );

  const filteredSubmissions = submissions.filter((sub) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      sub.id.toLowerCase().includes(query) ||
      sub.candidate.username.toLowerCase().includes(query) ||
      sub.candidate.discord.toLowerCase().includes(query) ||
      sub.candidate.courseName.toLowerCase().includes(query) ||
      sub.candidate.rank.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-[calc(100vh-140px)] py-10 px-4 sm:px-6 md:px-10 max-w-5xl mx-auto relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <button
            onClick={onBackToPortal}
            className="inline-flex items-center gap-1.5 text-xs text-[#d3c5ae] hover:text-[#f6be39] mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับสู่หน้าหลัก
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-[#f6be39] gold-gradient-text uppercase tracking-wide">
            ระบบตรวจสอบผลการทดสอบ (Verification Portal)
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs sm:text-sm text-[#d3c5ae]/80">
              สถาบันการศึกษาและฝึกอบรม กรมยุทธศึกษาทหารบก (ยศ.ทบ.)
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono-military text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync
            </span>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อ, Discord หรือรหัสสอบ..."
            className="input-tactical w-full px-3.5 py-2 pl-9 text-xs sm:text-sm rounded text-[#eae1dd] placeholder:text-[#9b8f7a]"
          />
          <Search className="w-4 h-4 text-[#f6be39] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Submissions list */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-[#9b8f7a] uppercase tracking-wider mb-2 flex justify-between items-center">
            <span>รายการส่งข้อสอบทั้งหมด ({filteredSubmissions.length})</span>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="bg-[#1f1b19] border border-[#4f4634] rounded-xl p-8 text-center text-sm text-[#9b8f7a]">
              ไม่พบประวัติการส่งข้อสอบที่ตรงกับการค้นหา
            </div>
          ) : (
            filteredSubmissions.map((sub) => {
              const isSelected = selectedSubmission?.id === sub.id;
              const isPassed = sub.status === 'PASSED';
              const isFailed = sub.status === 'FAILED';
              const isPending = sub.status === 'PENDING_REVIEW';

              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubmission(sub)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#26211E] border-[#f6be39] shadow-[0_0_15px_rgba(246,190,57,0.2)]'
                      : 'bg-[#1A1614] border-[#4f4634]/60 hover:border-[#9b8f7a] hover:bg-[#231f1d]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-bold text-sm text-[#eae1dd] font-headline">
                      {sub.candidate.username}
                    </span>
                    <span className="text-[11px] font-mono-military text-[#f6be39] bg-[#110d0c] px-2 py-0.5 rounded border border-[#f6be39]/30">
                      {sub.id}
                    </span>
                  </div>

                  <div className="text-xs text-[#f6be39] font-medium mb-1">
                    {sub.candidate.courseName}
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-[#9b8f7a] mt-2 pt-2 border-t border-[#4f4634]/40">
                    <span>{sub.formattedDate}</span>
                    {isPending && (
                      <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                        <Clock className="w-3 h-3" />
                        รอการตรวจ
                      </span>
                    )}
                    {isPassed && (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        ผ่านการประเมิน
                      </span>
                    )}
                    {isFailed && (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                        <XCircle className="w-3 h-3" />
                        ไม่ผ่านเกณฑ์
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Submission Detail & Certificate Badge */}
        <div className="lg:col-span-7">
          {selectedSubmission ? (
            <div className="bg-[#26211E] border-2 border-[#4f4634] rounded-xl p-6 relative overflow-hidden surface-layer">
              <div className="flex justify-between items-start pb-4 border-b border-[#4f4634] mb-5">
                <div>
                  <span className="text-[11px] font-mono-military text-[#9b8f7a] uppercase tracking-wider block">
                    บันทึกข้อมูลการทดสอบทางราชการ
                  </span>
                  <h2 className="text-xl font-bold text-[#f6be39] font-headline">
                    {selectedSubmission.candidate.username}
                  </h2>
                  <span className="text-xs text-[#d3c5ae]">
                    ยศ: {selectedSubmission.candidate.rank} • Discord: {selectedSubmission.candidate.discord}
                  </span>
                </div>

                <div className="text-right">
                  {selectedSubmission.status === 'PASSED' ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      PASSED (ผ่านเกณฑ์)
                    </span>
                  ) : selectedSubmission.status === 'FAILED' ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-rose-950/80 border border-rose-500 text-rose-300 font-bold">
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      FAILED (ไม่ผ่าน)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[#de9b32]/20 border border-[#de9b32]/40 text-[#ffb951] font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      PENDING REVIEW
                    </span>
                  )}
                </div>
              </div>

              {/* Course Info */}
              <div className="bg-[#1A1614] rounded-lg p-4 border border-[#4f4634] mb-5 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-[#9b8f7a]">หลักสูตร:</span>
                  <span className="font-semibold text-[#f6be39]">
                    {selectedSubmission.candidate.courseName}
                  </span>
                </div>
                {selectedSubmission.timeSpentFormatted && (
                  <div className="flex justify-between">
                    <span className="text-[#9b8f7a]">เวลาที่ใช้สอบ:</span>
                    <span className="text-[#ffdfa0] font-mono-military font-semibold">
                      {selectedSubmission.timeSpentFormatted}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#9b8f7a]">วันเวลาที่ส่ง:</span>
                  <span className="text-[#eae1dd] font-mono-military">
                    {selectedSubmission.formattedDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9b8f7a]">รหัสอ้างอิงระบบ:</span>
                  <span className="text-[#eae1dd] font-mono-military font-bold">
                    {selectedSubmission.id}
                  </span>
                </div>
                {selectedSubmission.score !== undefined && (
                  <div className="flex justify-between pt-2 border-t border-[#4f4634]/60">
                    <span className="text-[#9b8f7a]">คะแนนที่ได้:</span>
                    <span className="text-emerald-400 font-mono-military font-bold">
                      {selectedSubmission.score} / {selectedSubmission.maxScore || 133}
                    </span>
                  </div>
                )}
                {selectedSubmission.evaluatedBy && (
                  <div className="flex justify-between">
                    <span className="text-[#9b8f7a]">ผู้ตรวจประเมิน:</span>
                    <span className="text-[#f6be39] font-medium">
                      {selectedSubmission.evaluatedBy}
                    </span>
                  </div>
                )}
              </div>

              {/* Evaluation Status Protocol */}
              <div className="border border-[#4f4634] rounded-lg p-4 bg-[#161311] mb-5">
                <h3 className="text-xs font-bold text-[#f6be39] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  ขั้นตอนการประเมินผลของแผนกอบรมหลักสูตร ยศ.ทบ.
                </h3>
                <ul className="space-y-2 text-xs text-[#d3c5ae]">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>บันทึกและเข้ารหัสชุดคำตอบลงฐานข้อมูลเรียบร้อยแล้ว</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className={selectedSubmission.status !== 'PENDING_REVIEW' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {selectedSubmission.status !== 'PENDING_REVIEW' ? '✓' : '⏳'}
                    </span>
                    <span>
                      {selectedSubmission.status !== 'PENDING_REVIEW'
                        ? `ตรวจให้คะแนนเรียบร้อยแล้ว (${selectedSubmission.evaluatedAt || 'วันที่ระบุในระบบ'})`
                        : 'รอการตรวจให้คะแนนข้อสอบปรนัย (13 ข้อ) และข้อเขียน (12 ข้อ)'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className={selectedSubmission.status === 'PASSED' ? 'text-emerald-400 font-bold' : 'text-[#9b8f7a]'}>
                      {selectedSubmission.status === 'PASSED' ? '✓' : '○'}
                    </span>
                    <span>ออกใบรับรองคุณวุฒิ (ATEC Official Certificate) และแจ้งผลผ่าน Discord</span>
                  </li>
                </ul>
              </div>

              {/* Evaluator Notes if available */}
              {selectedSubmission.notes && (
                <div className="bg-[#110d0c] p-3.5 rounded border border-[#4f4634] mb-4 text-xs">
                  <div className="text-[#f6be39] font-bold mb-1 font-mono-military">
                    ความเห็นจากคณะกรรมการ:
                  </div>
                  <div className="text-[#eae1dd] italic">
                    "{selectedSubmission.notes}"
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#1f1b19] border border-[#4f4634] rounded-xl p-12 text-center text-sm text-[#9b8f7a]">
              กรุณาเลือกรายการทางซ้ายเพื่อดูรายละเอียด
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
