import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Award,
  Shield,
  Save,
  Printer,
  Sparkles,
  FileText,
  AlertTriangle,
  HelpCircle,
  MessageSquare,
  Check,
} from 'lucide-react';
import { ExamSubmission, Question } from '../types';
import { EXAM_QUESTIONS } from '../data/examData';

interface AdminGradingViewProps {
  submission: ExamSubmission;
  onSaveEvaluation: (updatedSubmission: ExamSubmission) => void;
  onBackToDashboard: () => void;
}

export const AdminGradingView: React.FC<AdminGradingViewProps> = ({
  submission,
  onSaveEvaluation,
  onBackToDashboard,
}) => {
  const part1Questions = EXAM_QUESTIONS.filter((q) => q.part === 1);
  const part2Questions = EXAM_QUESTIONS.filter((q) => q.part === 2);

  // Calculate Part 1 Multiple-Choice Score automatically
  const calculatePart1Score = () => {
    let correctCount = 0;
    part1Questions.forEach((q) => {
      const candidateChoice = submission.answers.choices[q.id];
      if (candidateChoice && candidateChoice === q.correctOptionId) {
        correctCount += 1;
      }
    });
    return correctCount;
  };

  const initialPart1Score = calculatePart1Score();

  // Essay Scores State (0 to 10 points each)
  const [essayScores, setEssayScores] = useState<Record<number, number>>(() => {
    if (submission.essayScores) {
      return { ...submission.essayScores };
    }
    // Default initial scores
    const initial: Record<number, number> = {};
    part2Questions.forEach((q) => {
      const ans = submission.answers.essays[q.id];
      // If candidate wrote something substantive, prefill a default recommendation or 0
      initial[q.id] = ans && ans.trim().length > 10 ? 8 : 0;
    });
    return initial;
  });

  // Essay Feedback / Notes per question
  const [essayFeedbacks, setEssayFeedbacks] = useState<Record<number, string>>(() => {
    return submission.essayFeedbacks ? { ...submission.essayFeedbacks } : {};
  });

  // Overall Evaluation State
  const [evaluatorName, setEvaluatorName] = useState(
    submission.evaluatedBy || 'พ.อ. ภาคภูมิ พิทักษ์ไทย (นายทหารฝ่ายการศึกษา ยศ.ทบ.)'
  );
  const [evaluatorNote, setEvaluatorNote] = useState(
    submission.notes || 'ผ่านการตรวจสอบความสมบูรณ์ของเนื้อหาและหลักนิยมทางยุทธวิธี'
  );
  const [evaluationStatus, setEvaluationStatus] = useState<'PASSED' | 'FAILED'>(
    submission.status === 'FAILED' ? 'FAILED' : 'PASSED'
  );
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Total Essay Score calculation
  const totalEssayScore: number = Object.keys(essayScores).reduce(
    (sum: number, key: string) => sum + (Number(essayScores[Number(key)]) || 0),
    0
  );
  const maxEssayScore = part2Questions.length * 10; // 120 points
  const totalCombinedScore: number = initialPart1Score + totalEssayScore;
  const maxCombinedScore: number = part1Questions.length + maxEssayScore; // 13 + 120 = 133
  const scorePercentage = Math.round((totalCombinedScore / maxCombinedScore) * 100);

  const handleScoreChange = (questionId: number, score: number) => {
    const clamped = Math.max(0, Math.min(10, score));
    setEssayScores((prev) => ({
      ...prev,
      [questionId]: clamped,
    }));
  };

  const handleFeedbackChange = (questionId: number, text: string) => {
    setEssayFeedbacks((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };

  const handleAutoFillFullScore = () => {
    const full: Record<number, number> = {};
    part2Questions.forEach((q) => {
      full[q.id] = 10;
    });
    setEssayScores(full);
    setEvaluationStatus('PASSED');
  };

  const handleSave = () => {
    const now = new Date();
    const formattedDate = `${now.getDate()} ส.ค. ${now.getFullYear()}, ${String(
      now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} GMT+7`;

    const updated: ExamSubmission = {
      ...submission,
      status: evaluationStatus,
      evaluatedBy: evaluatorName.trim() || 'คณะกรรมการตรวจข้อสอบ ยศ.ทบ.',
      evaluatedAt: formattedDate,
      choiceScore: initialPart1Score,
      essayScore: totalEssayScore,
      score: totalCombinedScore,
      maxScore: maxCombinedScore,
      essayScores,
      essayFeedbacks,
      notes: evaluatorNote.trim(),
    };

    onSaveEvaluation(updated);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const countWords = (text?: string): number => {
    if (!text) return 0;
    const cleaned = text.trim();
    if (!cleaned) return 0;
    return cleaned.split(/\s+/).filter(Boolean).length;
  };

  return (
    <div className="min-h-screen pb-24 pt-4 px-4 sm:px-6 md:px-10 max-w-6xl mx-auto relative z-10">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#4f4634]">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-sm text-[#d3c5ae] hover:text-[#f6be39] bg-[#161311] border border-[#4f4634] hover:border-[#f6be39] px-4 py-2 rounded transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้ารายการผู้เข้าสอบ</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAutoFillFullScore}
            className="inline-flex items-center gap-1.5 text-xs text-[#f6be39] hover:text-[#ffdfa0] bg-[#1f1b19] border border-[#f6be39]/40 hover:bg-[#231f1d] px-3 py-2 rounded transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>เติมคะแนนเต็มตัวอย่าง</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs text-[#eae1dd] bg-[#1f1b19] border border-[#4f4634] hover:border-[#f6be39] px-3 py-2 rounded transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#f6be39]" />
            <span>พิมพ์ใบคะแนน</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="gold-gradient-btn px-5 py-2 rounded text-[#402d00] font-headline font-bold text-sm flex items-center gap-1.5 cursor-pointer shadow-[0_2px_10px_rgba(246,190,57,0.3)] active:scale-95 transition-transform"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกผลการตรวจ</span>
          </button>
        </div>
      </div>

      {/* Save Toast Notification */}
      {isSavedToast && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-900 border-2 border-emerald-500 text-emerald-100 px-5 py-3 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.8)] flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="font-bold text-sm">บันทึกผลการตรวจเรียบร้อยแล้ว</div>
            <div className="text-xs text-emerald-200">อัปเดตสถานะเป็น ตรวจแล้ว และบันทึกคะแนนเข้าระบบ</div>
          </div>
        </div>
      )}

      {/* Candidate Profile Summary Banner */}
      <div className="surface-layer rounded-xl p-5 sm:p-6 mb-8 border border-[#4f4634] shadow-[0_4px_20px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-[#4f4634]/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#1f1b19] border border-[#f6be39] flex items-center justify-center text-[#f6be39] font-bold shadow-[0_0_12px_rgba(246,190,57,0.2)]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-military text-[#f6be39] bg-[#110d0c] px-2 py-0.5 rounded border border-[#4f4634]">
                  รหัสสอบ: {submission.id}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    submission.status === 'PASSED'
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700'
                      : submission.status === 'FAILED'
                      ? 'bg-rose-950/80 text-rose-400 border-rose-700'
                      : 'bg-amber-950/80 text-amber-400 border-amber-700'
                  }`}
                >
                  {submission.status === 'PASSED'
                    ? 'ตรวจแล้ว (ผ่าน)'
                    : submission.status === 'FAILED'
                    ? 'ตรวจแล้ว (ไม่ผ่าน)'
                    : 'ยังไม่ตรวจ (รอการตรวจ)'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-headline text-[#eae1dd] mt-1">
                ตรวจข้อสอบ: {submission.candidate.username}
              </h1>
            </div>
          </div>

          {/* Quick Score Badge */}
          <div className="bg-[#110d0c] border border-[#f6be39]/40 rounded-lg p-3 text-right">
            <div className="text-[11px] text-[#9b8f7a]">คะแนนรวมปัจจุบัน</div>
            <div className="text-xl sm:text-2xl font-bold font-mono-military text-[#f6be39]">
              {totalCombinedScore}{' '}
              <span className="text-xs text-[#d3c5ae]">/ {maxCombinedScore} ({scorePercentage}%)</span>
            </div>
          </div>
        </div>

        {/* 4 Core Metadata Info Items */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
          <div className="bg-[#161311] p-3 rounded border border-[#4f4634]/50">
            <div className="text-[#9b8f7a] text-[11px] flex items-center gap-1 mb-1">
              <User className="w-3.5 h-3.5 text-[#f6be39]" />
              ชื่อในเกม
            </div>
            <div className="font-semibold text-[#eae1dd] truncate">
              {submission.candidate.username}
            </div>
          </div>

          <div className="bg-[#161311] p-3 rounded border border-[#4f4634]/50">
            <div className="text-[#9b8f7a] text-[11px] flex items-center gap-1 mb-1">
              <span className="w-3.5 h-3.5 rounded-full bg-[#5865F2]/30 flex items-center justify-center text-[9px] text-[#5865F2] font-bold">#</span>
              ชื่อดิสคอร์ด
            </div>
            <div className="font-mono-military text-[#eae1dd] truncate">
              {submission.candidate.discord}
            </div>
          </div>

          <div className="bg-[#161311] p-3 rounded border border-[#4f4634]/50">
            <div className="text-[#9b8f7a] text-[11px] flex items-center gap-1 mb-1">
              <Award className="w-3.5 h-3.5 text-[#f6be39]" />
              ยศในเกม / โรล
            </div>
            <div className="font-semibold text-[#f6be39] truncate">
              {submission.candidate.rank} ({submission.candidate.courseName})
            </div>
          </div>

          <div className="bg-[#161311] p-3 rounded border border-[#4f4634]/50">
            <div className="text-[#9b8f7a] text-[11px] flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-[#f6be39]" />
              เวลาที่ใช้สอบ
            </div>
            <div className="font-mono-military text-[#ffdfa0] font-bold">
              {submission.timeSpentFormatted || `${submission.timeSpentSeconds} วินาที`}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Multiple Choice Questions (ข้อกา 13 ข้อ) */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2 border-b-2 border-[#f6be39]/30">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#f6be39] text-[#402d00] font-bold flex items-center justify-center font-headline text-sm">
              1
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-headline text-[#eae1dd]">
              ส่วนที่ 1: ข้อกาเลือกตอบ (13 ข้อ) - ตรวจคำตอบและคิดคะแนนอัตโนมัติ
            </h2>
          </div>
          <div className="text-xs sm:text-sm font-mono-military bg-[#1f1b19] px-3 py-1 rounded border border-[#f6be39]/40 text-[#f6be39]">
            คะแนนส่วนที่ 1: <strong className="text-emerald-400">{initialPart1Score}</strong> / 13 ข้อ (
            {Math.round((initialPart1Score / 13) * 100)}%)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {part1Questions.map((q) => {
            const candidateChoiceId = submission.answers.choices[q.id];
            const candidateChoice = q.options?.find((o) => o.id === candidateChoiceId);
            const correctChoice = q.options?.find((o) => o.id === q.correctOptionId);
            const isCorrect = candidateChoiceId === q.correctOptionId;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-lg border transition-colors ${
                  isCorrect
                    ? 'bg-[#141d17]/80 border-emerald-800/60'
                    : 'bg-[#231516]/80 border-rose-900/70'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-military font-bold text-xs bg-[#110d0c] text-[#f6be39] px-2 py-0.5 rounded border border-[#4f4634]">
                      {q.code}
                    </span>
                    <span className="text-xs font-semibold text-[#eae1dd] line-clamp-1">
                      {q.title}
                    </span>
                  </div>
                  {isCorrect ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700/60 flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ถูกต้อง (+1)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-700/60 flex-shrink-0">
                      <XCircle className="w-3.5 h-3.5" />
                      ตอบผิด (0)
                    </span>
                  )}
                </div>

                {/* Choices comparison */}
                <div className="space-y-2 mt-3 text-xs">
                  <div className="p-2 rounded bg-[#110d0c]/80 border border-[#4f4634]/50">
                    <span className="text-[#9b8f7a] block text-[10px] uppercase font-mono-military mb-0.5">
                      คำตอบของผู้เข้าสอบ:
                    </span>
                    {candidateChoice ? (
                      <div
                        className={`font-medium ${
                          isCorrect ? 'text-emerald-300' : 'text-rose-300 line-through'
                        }`}
                      >
                        {candidateChoice.label} {candidateChoice.text}
                      </div>
                    ) : (
                      <div className="text-rose-400 italic">ไม่ได้ตอบคำถาม</div>
                    )}
                  </div>

                  {!isCorrect && correctChoice && (
                    <div className="p-2 rounded bg-emerald-950/30 border border-emerald-800/40">
                      <span className="text-emerald-400 block text-[10px] uppercase font-mono-military mb-0.5">
                        เฉลยที่ถูกต้อง:
                      </span>
                      <div className="text-emerald-200 font-medium">
                        {correctChoice.label} {correctChoice.text}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Subjective / Essay Questions (ข้อเขียน 12 ข้อ) */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2 border-b-2 border-[#f6be39]/30">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#f6be39] text-[#402d00] font-bold flex items-center justify-center font-headline text-sm">
              2
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-headline text-[#eae1dd]">
                ส่วนที่ 2: ข้อเขียนเชิงยุทธวิธี (12 ข้อ: Q14 - Q25)
              </h2>
              <p className="text-xs text-[#9b8f7a]">
                อ่านคำตอบของผู้เข้าสอบ ให้คะแนนรายข้อ (0-10 คะแนน) และระบุข้อเสนอแนะ
              </p>
            </div>
          </div>
          <div className="text-xs sm:text-sm font-mono-military bg-[#1f1b19] px-3 py-1 rounded border border-[#f6be39]/40 text-[#f6be39]">
            คะแนนข้อเขียนรวม: <strong className="text-[#ffdfa0]">{totalEssayScore}</strong> / {maxEssayScore} คะแนน
          </div>
        </div>

        <div className="space-y-6">
          {part2Questions.map((q, idx) => {
            const candidateText = submission.answers.essays[q.id] || '';
            const words = countWords(candidateText);
            const score = essayScores[q.id] !== undefined ? essayScores[q.id] : 0;
            const feedback = essayFeedbacks[q.id] || '';

            return (
              <div
                key={q.id}
                className="surface-layer rounded-xl p-5 sm:p-6 border border-[#4f4634] shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
              >
                {/* Question Header */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3 pb-2 border-b border-[#4f4634]/50">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-military text-xs font-bold bg-[#110d0c] text-[#f6be39] px-2.5 py-1 rounded border border-[#4f4634]">
                      ข้อที่ {idx + 1} ({q.code})
                    </span>
                    <span className="text-xs text-[#9b8f7a]">
                      เกณฑ์ขั้นต่ำ: {q.minWords} คำ
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-mono-military ${
                        words >= (q.minWords || 30)
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/60'
                          : words > 0
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-700/60'
                          : 'bg-rose-950/70 text-rose-300 border border-rose-700/60'
                      }`}
                    >
                      จำนวนคำ: {words} คำ
                    </span>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[#eae1dd] mb-3 leading-relaxed">
                  {q.title}
                </h3>

                {/* Model Answer Guidance */}
                {q.modelAnswerKey && (
                  <div className="mb-4 p-2.5 rounded bg-[#191512] border border-[#f6be39]/30 text-xs text-[#ffdfa0]">
                    <span className="font-bold text-[#f6be39] mr-1 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 inline" />
                      แนวทางเกณฑ์การให้คะแนน:
                    </span>
                    <span className="text-[#d3c5ae]">{q.modelAnswerKey}</span>
                  </div>
                )}

                {/* Candidate's Submitted Response */}
                <div className="mb-4">
                  <div className="text-xs font-bold text-[#9b8f7a] mb-1.5 uppercase font-mono-military flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#f6be39]" />
                    คำตอบของผู้เข้าสอบ:
                  </div>
                  {candidateText ? (
                    <div className="p-4 rounded-lg bg-[#110d0c] border border-[#4f4634] text-sm sm:text-base text-[#eae1dd] leading-relaxed whitespace-pre-wrap">
                      {candidateText}
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-900/40 text-sm text-rose-300 italic">
                      [ผู้เข้าสอบไม่ได้กรอกคำตอบในข้อนี้]
                    </div>
                  )}
                </div>

                {/* Grading Controls (Score + Feedback) */}
                <div className="pt-3 border-t border-[#4f4634]/60 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Score Selector */}
                  <div className="md:col-span-5 bg-[#161311] p-3 rounded-lg border border-[#4f4634]">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-[#f6be39] font-mono-military">
                        ให้คะแนนข้อนี้ (0 - 10 คะแนน):
                      </label>
                      <span className="text-base font-mono-military font-extrabold text-[#f6be39]">
                        {score} / 10
                      </span>
                    </div>

                    {/* Quick score buttons */}
                    <div className="flex items-center gap-1.5">
                      {[0, 3, 5, 7, 8, 9, 10].map((pt) => (
                        <button
                          key={pt}
                          type="button"
                          onClick={() => handleScoreChange(q.id, pt)}
                          className={`flex-1 py-1.5 rounded text-xs font-mono-military font-bold transition-all ${
                            score === pt
                              ? 'bg-[#f6be39] text-[#402d00] shadow-[0_0_8px_rgba(246,190,57,0.4)] scale-105'
                              : 'bg-[#1f1b19] text-[#d3c5ae] hover:bg-[#2e2927] border border-[#4f4634]'
                          }`}
                        >
                          {pt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment / Note Box */}
                  <div className="md:col-span-7">
                    <div className="relative">
                      <input
                        type="text"
                        value={feedback}
                        onChange={(e) => handleFeedbackChange(q.id, e.target.value)}
                        placeholder="เพิ่มหมายเหตุ / คำแนะนำสำหรับข้อนี้ (ไม่บังคับ)..."
                        className="input-tactical w-full px-3.5 py-2.5 rounded text-xs sm:text-sm text-[#eae1dd] placeholder:text-[#9b8f7a]/60"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OVERALL EVALUATION & SAVE PANEL */}
      <div className="surface-layer rounded-xl p-6 sm:p-8 border-2 border-[#f6be39]/60 shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#f6be39]"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#f6be39]"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#f6be39]"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#f6be39]"></div>

        <h2 className="text-xl font-bold font-headline text-[#f6be39] mb-4 pb-2 border-b border-[#4f4634] uppercase tracking-wider flex items-center gap-2">
          <Award className="w-5 h-5" />
          สรุปผลการประเมินและบันทึกคะแนนทางการ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Score Summary Box */}
          <div className="bg-[#110d0c] p-4 rounded-lg border border-[#4f4634] flex flex-col justify-between">
            <div>
              <div className="text-xs text-[#9b8f7a] font-mono-military uppercase mb-1">
                คะแนนรวมทั้งหมด
              </div>
              <div className="text-3xl font-extrabold font-mono-military text-[#f6be39]">
                {totalCombinedScore}{' '}
                <span className="text-sm font-normal text-[#d3c5ae]">/ {maxCombinedScore}</span>
              </div>
              <div className="text-xs text-[#d3c5ae]/80 mt-1">
                (ข้อกา: {initialPart1Score}/13 + ข้อเขียน: {totalEssayScore}/{maxEssayScore})
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#4f4634]/60 flex items-center justify-between text-xs">
              <span className="text-[#9b8f7a]">ร้อยละผลคะแนน:</span>
              <span className="font-mono-military font-bold text-[#ffdfa0] text-sm">
                {scorePercentage}%
              </span>
            </div>
          </div>

          {/* Status Decision Selector */}
          <div className="bg-[#110d0c] p-4 rounded-lg border border-[#4f4634]">
            <label className="block text-xs font-bold text-[#eae1dd] mb-2 font-mono-military">
              ผลการตัดสิน (FINAL RESULT) <span className="text-[#f6be39]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEvaluationStatus('PASSED')}
                className={`py-3 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                  evaluationStatus === 'PASSED'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500'
                    : 'bg-[#1f1b19] border-[#4f4634] text-[#d3c5ae] hover:border-emerald-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ผ่านการประเมิน (PASSED)</span>
              </button>

              <button
                type="button"
                onClick={() => setEvaluationStatus('FAILED')}
                className={`py-3 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                  evaluationStatus === 'FAILED'
                    ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)] ring-1 ring-rose-500'
                    : 'bg-[#1f1b19] border-[#4f4634] text-[#d3c5ae] hover:border-rose-700'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>ไม่ผ่านเกณฑ์ (FAILED)</span>
              </button>
            </div>
          </div>

          {/* Evaluator Identity Input */}
          <div className="bg-[#110d0c] p-4 rounded-lg border border-[#4f4634]">
            <label className="block text-xs font-bold text-[#eae1dd] mb-1.5">
              ชื่อผู้ตรวจ / กรรมการ ยศ.ทบ.
            </label>
            <input
              type="text"
              value={evaluatorName}
              onChange={(e) => setEvaluatorName(e.target.value)}
              className="input-tactical w-full px-3 py-2 text-xs sm:text-sm text-[#eae1dd] rounded font-medium"
              placeholder="ระบุชื่อผู้ตรวจ..."
            />
          </div>
        </div>

        {/* General Evaluator Remarks */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-[#eae1dd] mb-1.5">
            ความเห็นภาพรวมของคณะกรรมการ (Overall Notes / Remarks)
          </label>
          <textarea
            rows={2}
            value={evaluatorNote}
            onChange={(e) => setEvaluatorNote(e.target.value)}
            className="input-tactical w-full p-3 rounded text-xs sm:text-sm text-[#eae1dd] resize-y"
            placeholder="กรอกความเห็นสรุปสำหรับใบผลการสอบ..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-[#4f4634]/60">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="px-5 py-3 rounded bg-[#1f1b19] border border-[#4f4634] text-[#d3c5ae] hover:text-[#eae1dd] text-sm font-semibold transition-colors cursor-pointer"
          >
            ยกเลิก / กลับสู่แดชบอร์ด
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="gold-gradient-btn px-8 py-3 rounded text-[#402d00] font-headline font-bold text-base uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(246,190,57,0.4)] active:scale-95 transition-transform"
          >
            <Save className="w-5 h-5" />
            <span>บันทึกผลการตรวจ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
