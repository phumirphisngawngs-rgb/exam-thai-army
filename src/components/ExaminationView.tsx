import React, { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle2, Upload, AlertTriangle, User, Award, FileText } from 'lucide-react';
import { CandidateInfo, ExamAnswers } from '../types';
import { EXAM_QUESTIONS } from '../data/examData';

interface ExaminationViewProps {
  candidate: CandidateInfo;
  onSubmitExam: (answers: ExamAnswers, timeSeconds: number, timeFormatted: string) => void;
  onCancelExam: () => void;
}

export const ExaminationView: React.FC<ExaminationViewProps> = ({
  candidate,
  onSubmitExam,
}) => {
  const [answers, setAnswers] = useState<ExamAnswers>({
    choices: {},
    essays: {},
  });

  // Count up timer starting from 00:00 (0 seconds)
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<number>(1);
  const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeSpent = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins === 0) {
      return `${secs} วินาที`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')} นาที`;
  };

  const handleSelectChoice = (questionId: number, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      choices: {
        ...prev.choices,
        [questionId]: optionId,
      },
    }));
  };

  const handleEssayChange = (questionId: number, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      essays: {
        ...prev.essays,
        [questionId]: text,
      },
    }));
  };

  const countWords = (text?: string): number => {
    if (!text) return 0;
    const cleaned = text.trim();
    if (!cleaned) return 0;
    return cleaned.split(/\s+/).filter(Boolean).length;
  };

  const totalQuestions = EXAM_QUESTIONS.length;
  const answeredChoicesCount = Object.keys(answers.choices).length;
  const answeredEssaysCount = Object.values(answers.essays).filter(
    (text: string) => typeof text === 'string' && text.trim().length > 0
  ).length;
  const totalAnswered = answeredChoicesCount + answeredEssaysCount;

  const scrollToQuestion = (id: number) => {
    setActiveQuestionId(id);
    const el = questionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmitDirect = () => {
    const formatted = formatTimeSpent(secondsElapsed);
    onSubmitExam(answers, secondsElapsed, formatted);
  };

  // Quick fill answers helper for fast testing
  const handleQuickFillForTesting = () => {
    const mockChoices: Record<number, string> = {};
    EXAM_QUESTIONS.filter((q) => q.part === 1).forEach((q) => {
      mockChoices[q.id] = q.options ? q.options[0].id : 'a';
    });

    const mockEssays: Record<number, string> = {
      14: 'หน้าที่ของแผนกอบรมหลักสูตรคือการวางแผน ควบคุมมาตรฐานการเรียนการสอน ตรวจสอบระเบียบวินัย และประเมินผลการฝึกอบรมของกำลังพลในสังกัดกรมยุทธศึกษาทหารบก',
      15: 'คำสั่ง :n ใช้ประกาศข้อความทางการเว้นระยะ 30 วินาที, SFL จัดแถวหน้ากระดาน, STS จัดแถวตอนเรียงหนึ่ง, ถอดและสวมหมวกในพิธีการ, :parade ใช้สำหรับเดินสวนสนาม',
      16: 'เมื่อปิดวงฝึกแล้วและมีครูฝึกมาช่วย ให้มอบหมายหน้าที่เป็นผู้ช่วยสังเกตการณ์ ส่วนกรณีแพทย์ขออารักขา ให้แนะนำประสานสารวัตรทหารบกเพื่อไม่ให้รบกวนวงฝึก',
      17: 'ตรวจสอบสิทธิ์และคุณวุฒิตนเอง หากมีสิทธิ์ตามเกณฑ์ให้ฝึกตามแบบแผน หรือหากเกินอำนาจหน้าที่ให้ประสานส่งต่อนักเรียนไปยังครูฝึกอาวุโส',
      18: 'ประสานงานขอครูฝึกท่านอื่นในกรมยุทธศึกษาทหารบกมารับช่วงต่อวงฝึก พร้อมส่งมอบรายชื่อนักเรียน เพื่อให้นักเรียนได้รับการฝึกต่อเนื่องและตนเองสามารถไปทำธุระได้อย่างถูกต้อง',
      19: 'ตรวจสอบจำนวนครูฝึกในเซิร์ฟเวอร์ให้ครบ 3-4 คน ตรวจสอบความพร้อมของสถานที่ และเปิด-ปิดรายงานตัวให้เรียบร้อย',
      20: 'บันทึกรายชื่อผู้เข้าฝึก ยศ หลักสูตร วันเวลา ผลการประเมินแต่ละฐาน แนบภาพหลักฐาน และลงชื่อครูผู้ฝึก',
      21: 'ปฏิบัติตนด้วยความสุภาพ มีวินัย ไม่ใช้อำนาจข่มขู่ ให้เกียรติผู้เรียน และมีน้ำใจช่วยเหลือเพื่อนร่วมงานใน ยศ.ทบ.',
      22: 'พูดคุยและชี้แจงเพื่อนครูฝึกเป็นการส่วนตัวอย่างสุภาพ เพื่อให้ปรับลำดับการฝึกโดยวอร์มร่างกายก่อนเข้าสู่ภาคทฤษฎีตามระเบียบ',
      23: 'ในการฝึกโรงเรียนนายสิบ อนุญาตให้สอบตกได้ไม่เกินเกณฑ์ที่กำหนด (ไม่เกิน 2 ฐาน) หากเกินกว่านั้นต้องเข้ารับการประเมินซ่อมหรือปลดออก',
      24: 'หากผู้เข้าฝึกหลุดจากเซิร์ฟเวอร์ ให้รอประมาณ 3-5 นาที หรือให้โอกาสกลับเข้ามาทดสอบในฐานที่ยังค้างอยู่โดยไม่ตัดสิทธิ์ทันที',
      25: 'พัฒนาสื่อการสอนให้ทันสมัย จัดตารางเวลาอบรมที่แน่นอน และใช้ระบบตรวจสอบผลคะแนนแบบเรียลไทม์เพื่อความโปร่งใส',
    };

    setAnswers({
      choices: mockChoices,
      essays: mockEssays,
    });
  };

  const part1Questions = EXAM_QUESTIONS.filter((q) => q.part === 1);
  const part2Questions = EXAM_QUESTIONS.filter((q) => q.part === 2);

  return (
    <div className="min-h-screen pb-20 pt-6 px-4 sm:px-6 md:px-10 max-w-6xl mx-auto relative z-10">
      {/* Sticky Progress & Status Bar with Count-up Timer */}
      <div className="sticky top-20 z-40 bg-[#161311]/95 backdrop-blur-md border border-[#4f4634] rounded-lg p-3 sm:p-4 mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.6)] flex flex-wrap items-center justify-between gap-4">
        {/* Count-Up Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded font-mono-military text-lg sm:text-xl font-bold tracking-wider bg-[#1f1b19] text-[#f6be39] border border-[#f6be39]/40 shadow-[0_0_12px_rgba(246,190,57,0.15)]">
            <Clock className="w-5 h-5 text-[#f6be39] animate-pulse" />
            <span>{formatTimer(secondsElapsed)}</span>
            <span className="text-xs font-normal text-[#d3c5ae]/75 ml-1">เวลาที่ใช้สอบ</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#d3c5ae] bg-[#231f1d] px-3 py-1.5 rounded border border-[#4f4634]">
            <User className="w-3.5 h-3.5 text-[#f6be39]" />
            <span className="font-semibold text-[#eae1dd]">{candidate.username}</span>
            <span className="text-[#9b8f7a]">|</span>
            <span className="text-[#f6be39] font-medium">{candidate.rank}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4 flex-1 max-w-xs justify-end">
          <div className="text-right">
            <span className="text-xs text-[#d3c5ae] block">ความคืบหน้า</span>
            <span className="text-sm font-bold text-[#f6be39] font-mono-military">
              {totalAnswered} / {totalQuestions}
            </span>
          </div>
          <div className="w-24 sm:w-32 bg-[#1f1b19] h-2.5 rounded-full overflow-hidden border border-[#4f4634]">
            <div
              className="bg-gradient-to-r from-[#d4a017] to-[#f6be39] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(totalAnswered / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Examination Header Box */}
      <div className="bg-[#1f1b19]/90 border-2 border-[#4f4634] rounded-xl p-6 sm:p-8 mb-8 relative overflow-hidden surface-layer">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#f6be39]/5 rounded-bl-full pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono-military text-[#f6be39] bg-[#110d0c] px-3 py-1 rounded border border-[#f6be39]/30 mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>{candidate.courseName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-[#eae1dd] tracking-wide">
              การทดสอบอย่างเป็นทางการ กรมยุทธศึกษาทหารบก (ยศ.ทบ.)
            </h1>
            <p className="text-xs sm:text-sm text-[#d3c5ae]/80 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              ระบบกำลังจับเวลาการทำข้อสอบตั้งแต่ 00:00 (Count-up Timer)
            </p>
          </div>

          <button
            type="button"
            onClick={handleQuickFillForTesting}
            className="text-xs text-[#d3c5ae]/70 hover:text-[#f6be39] bg-[#110d0c]/70 hover:bg-[#231f1d] px-3 py-1.5 rounded border border-[#4f4634] transition-colors"
          >
            [โหมดทดสอบ: เติมคำตอบอัตโนมัติ]
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-[#4f4634]/60 text-xs sm:text-sm text-[#d3c5ae] leading-relaxed">
          <p>
            <strong className="text-[#f6be39]">คำแนะนำ:</strong> กรุณาทำข้อสอบให้ครบทุกส่วน ส่วนที่ 1
            ประกอบด้วยข้อสอบแบบเลือกตอบ (Q01-Q13) และส่วนที่ 2 ข้อเขียนเชิงยุทธวิธี (Q14-Q25 รวม 12 ข้อ)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Main Question Area */}
        <div className="lg:col-span-8 space-y-10">
          {/* SECTION 1: Multiple Choice */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#f6be39] text-[#402d00] font-bold flex items-center justify-center font-headline text-base shadow-[0_0_10px_rgba(246,190,57,0.4)]">
                1
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-headline text-[#eae1dd]">
                ส่วนที่ 1: หลักนิยมทางยุทธวิธี (แบบเลือกตอบ 13 ข้อ)
              </h2>
            </div>

            <div className="space-y-6">
              {part1Questions.map((q) => {
                const isSelected = !!answers.choices[q.id];
                return (
                  <div
                    key={q.id}
                    ref={(el) => { questionRefs.current[q.id] = el; }}
                    className={`bg-[#26211E]/90 border rounded-xl p-5 sm:p-6 transition-all duration-200 ${
                      activeQuestionId === q.id
                        ? 'border-[#f6be39] shadow-[0_0_15px_rgba(246,190,57,0.15)]'
                        : isSelected
                        ? 'border-[#4f4634] bg-[#231f1d]'
                        : 'border-[#4f4634]/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <h3 className="text-base sm:text-lg font-bold text-[#eae1dd] leading-snug">
                        <span className="text-[#f6be39] font-mono-military mr-2">{q.code}.</span>
                        {q.title}
                      </h3>
                      {isSelected && (
                        <span className="shrink-0 text-emerald-400 text-xs px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-800">
                          ตอบแล้ว
                        </span>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      {q.options?.map((opt) => {
                        const checked = answers.choices[q.id] === opt.id;
                        return (
                          <label
                            key={opt.id}
                            onClick={() => handleSelectChoice(q.id, opt.id)}
                            className={`flex items-start gap-3.5 p-3.5 rounded-lg border cursor-pointer transition-all duration-200 select-none ${
                              checked
                                ? 'bg-[#393431] border-[#f6be39] text-[#ffdfa0] shadow-[inset_0_0_8px_rgba(246,190,57,0.15)]'
                                : 'bg-[#1A1614] border-[#4f4634]/60 text-[#d3c5ae] hover:bg-[#231f1d] hover:border-[#9b8f7a]'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                checked
                                  ? 'border-[#f6be39] bg-[#f6be39]'
                                  : 'border-[#9b8f7a] bg-[#110d0c]'
                              }`}
                            >
                              {checked && <div className="w-2 h-2 rounded-full bg-[#110d0c]" />}
                            </div>
                            <div className="text-sm sm:text-base leading-relaxed">
                              <strong className="text-[#f6be39] mr-2">{opt.label}</strong>
                              <span>{opt.text}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: Subjective / Essay (12 Questions) */}
          <div className="pt-4 border-t border-[#4f4634]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#f6be39] text-[#402d00] font-bold flex items-center justify-center font-headline text-base shadow-[0_0_10px_rgba(246,190,57,0.4)]">
                2
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-headline text-[#eae1dd]">
                  ส่วนที่ 2: การวิเคราะห์เชิงยุทธศาสตร์ (ข้อเขียน 12 ข้อ)
                </h2>
                <p className="text-xs sm:text-sm text-[#9b8f7a] mt-0.5">
                  คำถามเชิงยุทธวิธีและการตัดสินใจทางทหาร (Q14 - Q25)
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {part2Questions.map((q, idx) => {
                const textVal = answers.essays[q.id] || '';
                const words = countWords(textVal);
                const isMetMin = q.minWords ? words >= q.minWords : true;

                return (
                  <div
                    key={q.id}
                    ref={(el) => { questionRefs.current[q.id] = el; }}
                    className={`bg-[#26211E]/90 border rounded-xl p-5 sm:p-6 transition-all duration-200 ${
                      activeQuestionId === q.id
                        ? 'border-[#f6be39] shadow-[0_0_15px_rgba(246,190,57,0.15)]'
                        : words > 0
                        ? 'border-[#4f4634] bg-[#231f1d]'
                        : 'border-[#4f4634]/60'
                    }`}
                  >
                    <div className="mb-3">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-mono-military text-[#f6be39] bg-[#110d0c] px-2.5 py-0.5 rounded border border-[#4f4634]">
                          ข้อเขียนที่ {idx + 1} ({q.code})
                        </span>
                        {words > 0 && (
                          <span className="text-emerald-400 text-xs px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-800">
                            บันทึกคำตอบแล้ว
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#eae1dd] leading-snug">
                        {q.title}
                      </h3>
                      {q.minWords && (
                        <div className="mt-1.5 flex items-center gap-2 text-xs">
                          <span className="text-[#9b8f7a]">
                            เกณฑ์ความสมบูรณ์: ขั้นต่ำ {q.minWords} คำ
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="relative mt-4">
                      <textarea
                        rows={5}
                        value={textVal}
                        onChange={(e) => handleEssayChange(q.id, e.target.value)}
                        placeholder="พิมพ์คำตอบเชิงยุทธวิธีของคุณที่นี่..."
                        className="input-tactical w-full p-4 rounded-lg text-[#eae1dd] text-sm sm:text-base leading-relaxed resize-y min-h-[130px] focus:text-[#ffdfa0] placeholder:text-[#9b8f7a]/60"
                      />
                      <div className="flex justify-between items-center mt-2 px-1 text-xs">
                        <span className="text-[#9b8f7a]">
                          ระบบจะบันทึกคำตอบลงในหน่วยความจำชั่วคราวอัตโนมัติ
                        </span>
                        <span
                          className={`font-mono-military font-semibold px-2 py-0.5 rounded ${
                            isMetMin && words > 0
                              ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/60'
                              : words > 0
                              ? 'text-amber-400 bg-amber-950/40 border border-amber-800/60'
                              : 'text-[#9b8f7a] bg-[#110d0c] border border-[#4f4634]'
                          }`}
                        >
                          จำนวนคำ: {words} {q.minWords ? `/ แนะนำ ${q.minWords}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Action Area */}
          <div className="pt-8 text-center">
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="gold-gradient-btn px-8 sm:px-12 py-4 rounded text-[#402d00] font-headline font-bold text-lg uppercase tracking-wider inline-flex items-center gap-3 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(246,190,57,0.35)]"
            >
              <Upload className="w-5 h-5 font-bold" />
              <span>ส่งข้อสอบ</span>
            </button>
            <p className="text-xs text-[#d3c5ae]/70 mt-3 max-w-md mx-auto">
              การส่งข้อสอบถือเป็นการรับรองว่าเป็นผลงานของคุณเองภายใต้ประมวลระเบียบเกียรติยศของ ยศ.ทบ.
            </p>
          </div>
        </div>

        {/* Right Sticky Question Palette Navigator */}
        <div className="lg:col-span-4">
          <div className="sticky top-40 bg-[#1f1b19] border-2 border-[#4f4634] rounded-xl p-5 surface-layer shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#4f4634] mb-4">
              <h3 className="text-sm font-bold text-[#f6be39] font-headline uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" />
                ผังข้อสอบ: ส่วนที่ 1 & 2
              </h3>
              <span className="text-xs font-mono-military text-[#d3c5ae]">
                {totalAnswered}/{totalQuestions}
              </span>
            </div>

            {/* Section 1 Navigator */}
            <div className="text-xs text-[#9b8f7a] mb-2 font-medium">ส่วนที่ 1: แบบเลือกตอบ (Q01-Q13)</div>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {part1Questions.map((q) => {
                const isAnswered = !!answers.choices[q.id];
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => scrollToQuestion(q.id)}
                    className={`h-9 rounded font-mono-military text-xs font-bold transition-all flex items-center justify-center border ${
                      isAnswered
                        ? 'bg-[#d4a017] text-[#402d00] border-[#ffdfa0] shadow-[0_0_8px_rgba(246,190,57,0.3)]'
                        : 'bg-[#161311] text-[#d3c5ae] border-[#4f4634] hover:border-[#f6be39] hover:text-[#f6be39]'
                    }`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>

            {/* Section 2 Navigator (12 questions) */}
            <div className="text-xs text-[#9b8f7a] mb-2 font-medium">ส่วนที่ 2: ข้อเขียน 12 ข้อ (Q14-Q25)</div>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {part2Questions.map((q) => {
                const words = countWords(answers.essays[q.id]);
                const isAnswered = words >= 1;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => scrollToQuestion(q.id)}
                    className={`h-9 rounded font-mono-military text-xs font-bold transition-all flex items-center justify-center border ${
                      isAnswered
                        ? 'bg-[#d4a017] text-[#402d00] border-[#ffdfa0] shadow-[0_0_8px_rgba(246,190,57,0.3)]'
                        : 'bg-[#161311] text-[#d3c5ae] border-[#4f4634] hover:border-[#f6be39] hover:text-[#f6be39]'
                    }`}
                  >
                    Q{q.id}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#4f4634] space-y-2 text-xs text-[#d3c5ae]/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#d4a017] border border-[#ffdfa0] inline-block"></span>
                <span>ตอบแล้วเสร็จ</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#161311] border border-[#4f4634] inline-block"></span>
                <span>ยังไม่ได้ตอบ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#26211E] border-2 border-[#f6be39] rounded-xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-3 text-[#f6be39] mb-4">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-xl font-bold font-headline">ยืนยันการส่งข้อสอบ</h3>
            </div>
            <p className="text-sm text-[#d3c5ae] leading-relaxed mb-4">
              คุณได้ทำข้อสอบแล้ว <strong className="text-[#f6be39]">{totalAnswered}</strong> จากทั้งหมด{' '}
              <strong>{totalQuestions}</strong> ข้อ
            </p>
            <div className="p-3 rounded bg-[#161311] border border-[#4f4634] text-xs text-[#d3c5ae] mb-4">
              เวลาที่ใช้ในการทำข้อสอบ: <span className="text-[#f6be39] font-mono-military font-bold">{formatTimer(secondsElapsed)}</span>
            </div>
            {totalAnswered < totalQuestions && (
              <div className="p-3 rounded bg-[#93000a]/30 border border-[#ffb4ab]/30 text-xs text-[#ffdad6] mb-4">
                คำเตือน: ยังมีข้อสอบที่ยังไม่ได้ตอบอีก {totalQuestions - totalAnswered} ข้อ
                คุณแน่ใจหรือไม่ว่าต้องการส่งข้อสอบในตอนนี้?
              </div>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded text-sm text-[#d3c5ae] bg-[#161311] border border-[#4f4634] hover:bg-[#231f1d] transition-colors"
              >
                กลับไปทำต่อ
              </button>
              <button
                type="button"
                onClick={handleSubmitDirect}
                className="gold-gradient-btn px-6 py-2 rounded text-sm font-bold text-[#402d00] uppercase tracking-wider"
              >
                ยืนยันส่งข้อสอบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

