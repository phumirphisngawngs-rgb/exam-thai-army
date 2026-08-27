import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  LogOut,
  FileCheck,
  Clock,
  User,
  Award,
  Shield,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { ExamSubmission } from '../types';
import { OFFICIAL_COURSES } from '../data/examData';

interface AdminDashboardViewProps {
  submissions: ExamSubmission[];
  onSelectSubmissionForGrading: (submission: ExamSubmission) => void;
  onDeleteSubmission: (id: string) => void;
  onLogout: () => void;
  onBackToPortal: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  submissions,
  onSelectSubmissionForGrading,
  onDeleteSubmission,
  onLogout,
  onBackToPortal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'PASSED' | 'FAILED'>('ALL');
  const [courseFilter, setCourseFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'TIME_SPENT'>('NEWEST');

  // Statistics calculation
  const totalSubmissions = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === 'PENDING_REVIEW').length;
  const passedCount = submissions.filter((s) => s.status === 'PASSED').length;
  const failedCount = submissions.filter((s) => s.status === 'FAILED').length;

  // Filtered & Sorted Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions
      .filter((s) => {
        // Search query
        const query = searchQuery.trim().toLowerCase();
        if (query) {
          const matchUser = s.candidate.username.toLowerCase().includes(query);
          const matchDiscord = s.candidate.discord.toLowerCase().includes(query);
          const matchRank = s.candidate.rank.toLowerCase().includes(query);
          const matchId = s.id.toLowerCase().includes(query);
          const matchCourse = s.candidate.courseName.toLowerCase().includes(query);
          if (!matchUser && !matchDiscord && !matchRank && !matchId && !matchCourse) {
            return false;
          }
        }

        // Status filter
        if (statusFilter === 'PENDING' && s.status !== 'PENDING_REVIEW') return false;
        if (statusFilter === 'PASSED' && s.status !== 'PASSED') return false;
        if (statusFilter === 'FAILED' && s.status !== 'FAILED') return false;

        // Course filter
        if (courseFilter !== 'ALL' && s.candidate.courseId !== courseFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'NEWEST') {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
        if (sortBy === 'OLDEST') {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        }
        if (sortBy === 'TIME_SPENT') {
          return (b.timeSpentSeconds || 0) - (a.timeSpentSeconds || 0);
        }
        return 0;
      });
  }, [submissions, searchQuery, statusFilter, courseFilter, sortBy]);

  return (
    <div className="min-h-screen pb-20 pt-4 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto relative z-10">
      {/* Top Header & Admin Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#4f4634]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-[#1f1b19] border border-[#f6be39] flex items-center justify-center text-[#f6be39] shadow-[0_0_12px_rgba(246,190,57,0.25)]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-headline text-[#eae1dd] tracking-wide">
              ระบบตรวจข้อสอบผู้ดูแล (Admin Dashboard)
            </h1>
            <p className="text-xs text-[#9b8f7a]">
              กองการศึกษา กรมยุทธศึกษาทหารบก (ยศ.ทบ.) • ระบบบันทึกและประเมินผล
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToPortal}
            className="text-xs text-[#d3c5ae] hover:text-[#f6be39] bg-[#161311] border border-[#4f4634] hover:border-[#f6be39] px-3.5 py-2 rounded transition-all cursor-pointer"
          >
            หน้าระบบข้อสอบ
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="text-xs text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-900/60 hover:bg-rose-900/50 px-3.5 py-2 rounded transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="surface-layer rounded-xl p-4 sm:p-5 border border-[#4f4634] shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
          <div className="text-xs font-semibold text-[#9b8f7a] uppercase font-mono-military flex items-center justify-between mb-2">
            <span>ผู้ส่งข้อสอบทั้งหมด</span>
            <FileCheck className="w-4 h-4 text-[#f6be39]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-military text-[#eae1dd]">
            {totalSubmissions}
          </div>
          <div className="text-[11px] text-[#9b8f7a] mt-1">รายการที่บันทึกเข้าระบบ</div>
        </div>

        <div className="surface-layer rounded-xl p-4 sm:p-5 border border-amber-800/50 bg-amber-950/10 shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
          <div className="text-xs font-semibold text-amber-400 uppercase font-mono-military flex items-center justify-between mb-2">
            <span>ยังไม่ตรวจ (รอตรวจ)</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-military text-amber-400">
            {pendingCount}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">ต้องตรวจข้อเขียนและให้คะแนน</div>
        </div>

        <div className="surface-layer rounded-xl p-4 sm:p-5 border border-emerald-800/50 bg-emerald-950/10 shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
          <div className="text-xs font-semibold text-emerald-400 uppercase font-mono-military flex items-center justify-between mb-2">
            <span>ตรวจแล้ว (ผ่าน)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-military text-emerald-400">
            {passedCount}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">ผ่านเกณฑ์มาตรฐาน ยศ.ทบ.</div>
        </div>

        <div className="surface-layer rounded-xl p-4 sm:p-5 border border-rose-800/50 bg-rose-950/10 shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
          <div className="text-xs font-semibold text-rose-400 uppercase font-mono-military flex items-center justify-between mb-2">
            <span>ตรวจแล้ว (ไม่ผ่าน)</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-military text-rose-400">
            {failedCount}
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1">คะแนนไม่ถึงเกณฑ์ที่กำหนด</div>
        </div>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="surface-layer rounded-xl p-4 sm:p-5 mb-6 border border-[#4f4634] shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-[#9b8f7a] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อในเกม, Discord, ยศ, รหัสสอบ..."
              className="input-tactical w-full pl-9 pr-4 py-2.5 rounded text-xs sm:text-sm text-[#eae1dd] placeholder:text-[#9b8f7a]/60"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9b8f7a] hover:text-[#eae1dd]"
              >
                ล้าง
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="input-tactical w-full px-3 py-2.5 rounded text-xs sm:text-sm text-[#eae1dd] appearance-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#1f1b19]">สถานะ: ทั้งหมด ({totalSubmissions})</option>
              <option value="PENDING" className="bg-[#1f1b19]">สถานะ: ยังไม่ตรวจ ({pendingCount})</option>
              <option value="PASSED" className="bg-[#1f1b19]">สถานะ: ตรวจแล้ว - ผ่าน ({passedCount})</option>
              <option value="FAILED" className="bg-[#1f1b19]">สถานะ: ตรวจแล้ว - ไม่ผ่าน ({failedCount})</option>
            </select>
          </div>

          {/* Course Filter */}
          <div className="md:col-span-2">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="input-tactical w-full px-3 py-2.5 rounded text-xs sm:text-sm text-[#eae1dd] appearance-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#1f1b19]">โรล: ทั้งหมด</option>
              {OFFICIAL_COURSES.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#1f1b19]">
                  {c.thName}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-tactical w-full px-3 py-2.5 rounded text-xs sm:text-sm text-[#eae1dd] appearance-none cursor-pointer"
            >
              <option value="NEWEST" className="bg-[#1f1b19]">เรียง: ล่าสุด</option>
              <option value="OLDEST" className="bg-[#1f1b19]">เรียง: เก่าสุด</option>
              <option value="TIME_SPENT" className="bg-[#1f1b19]">เรียง: เวลาที่ใช้</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates List / Table View */}
      <div className="surface-layer rounded-xl border border-[#4f4634] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-12 gap-3 p-4 bg-[#110d0c] border-b border-[#4f4634] text-xs font-bold text-[#f6be39] font-mono-military uppercase tracking-wider">
          <div className="col-span-3">ชื่อในเกม / ดิสคอร์ด</div>
          <div className="col-span-2">ยศในเกม</div>
          <div className="col-span-2">โรลหลักสูตรที่มี</div>
          <div className="col-span-2">เวลาที่ใช้สอบ / วันเวลา</div>
          <div className="col-span-2 text-center">สถานะการตรวจ</div>
          <div className="col-span-1 text-right">ดำเนินการ</div>
        </div>

        {/* Candidate Rows */}
        {filteredSubmissions.length > 0 ? (
          <div className="divide-y divide-[#4f4634]/50">
            {filteredSubmissions.map((sub) => {
              const isPending = sub.status === 'PENDING_REVIEW';
              const isPassed = sub.status === 'PASSED';

              return (
                <div
                  key={sub.id}
                  className="p-4 hover:bg-[#1f1b19]/80 transition-colors flex flex-col lg:grid lg:grid-cols-12 gap-3 items-start lg:items-center"
                >
                  {/* Col 1: Username & Discord */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#eae1dd] text-sm sm:text-base">
                        {sub.candidate.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#d3c5ae]/75 font-mono-military mt-0.5">
                      <span className="text-[#5865F2]">#</span>
                      <span>{sub.candidate.discord}</span>
                      <span className="text-[#9b8f7a] text-[11px]">({sub.id})</span>
                    </div>
                  </div>

                  {/* Col 2: Rank */}
                  <div className="lg:col-span-2 flex items-center gap-1.5 text-xs sm:text-sm">
                    <span className="lg:hidden text-[#9b8f7a] font-semibold">ยศในเกม:</span>
                    <span className="text-[#f6be39] font-semibold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-[#f6be39]" />
                      {sub.candidate.rank}
                    </span>
                  </div>

                  {/* Col 3: Course */}
                  <div className="lg:col-span-2 text-xs sm:text-sm">
                    <span className="lg:hidden text-[#9b8f7a] font-semibold mr-1">โรลหลักสูตร:</span>
                    <span className="text-[#eae1dd] bg-[#110d0c] px-2 py-0.5 rounded border border-[#4f4634] text-xs">
                      {sub.candidate.courseName}
                    </span>
                  </div>

                  {/* Col 4: Time Spent */}
                  <div className="lg:col-span-2 text-xs">
                    <div className="flex items-center gap-1.5 text-[#ffdfa0] font-mono-military font-bold">
                      <Clock className="w-3.5 h-3.5 text-[#f6be39]" />
                      <span>{sub.timeSpentFormatted || `${sub.timeSpentSeconds}s`}</span>
                    </div>
                    <div className="text-[11px] text-[#9b8f7a] font-mono-military mt-0.5">
                      {sub.formattedDate || 'เพิ่งส่งข้อสอบ'}
                    </div>
                  </div>

                  {/* Col 5: Status Badge */}
                  <div className="lg:col-span-2 lg:text-center w-full lg:w-auto">
                    {isPending ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-700/60 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        <span>ยังไม่ตรวจ</span>
                      </span>
                    ) : (
                      <span
                        className={`inline-flex flex-col items-center text-xs font-bold px-2.5 py-1 rounded-full border ${
                          isPassed
                            ? 'text-emerald-300 bg-emerald-950/80 border-emerald-700/60 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                            : 'text-rose-300 bg-rose-950/80 border-rose-700/60 shadow-[0_0_8px_rgba(244,63,94,0.2)]'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          {isPassed ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3 h-3 text-rose-400" />
                          )}
                          <span>{isPassed ? 'ตรวจแล้ว (ผ่าน)' : 'ตรวจแล้ว (ไม่ผ่าน)'}</span>
                        </span>
                        {sub.score !== undefined && (
                          <span className="text-[10px] font-mono-military opacity-90">
                            คะแนน: {sub.score}/{sub.maxScore || 133}
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Col 6: Action Button */}
                  <div className="lg:col-span-1 lg:text-right w-full lg:w-auto flex items-center justify-end gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#4f4634]/40">
                    <button
                      type="button"
                      onClick={() => onSelectSubmissionForGrading(sub)}
                      className="gold-gradient-btn px-3 py-1.5 rounded text-[#402d00] font-headline font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
                    >
                      <span>{isPending ? 'ตรวจข้อสอบ' : 'ดูผล/แก้ไข'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`ยืนยันการลบรายการของ ${sub.candidate.username} หรือไม่?`)) {
                          onDeleteSubmission(sub.id);
                        }
                      }}
                      title="ลบรายการ"
                      className="p-1.5 text-[#9b8f7a] hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#1f1b19] border border-[#4f4634] flex items-center justify-center mx-auto mb-3 text-[#9b8f7a]">
              <Search className="w-6 h-6" />
            </div>
            <div className="text-base font-bold text-[#eae1dd]">ไม่พบข้อมูลผู้เข้าสอบที่ตรงกับเงื่อนไข</div>
            <p className="text-xs text-[#9b8f7a] mt-1">
              ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองสถานะ/หลักสูตร
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setCourseFilter('ALL');
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#f6be39] hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>รีเซ็ตตัวกรองทั้งหมด</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
