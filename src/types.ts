export interface CandidateInfo {
  username: string;
  discord: string;
  rank: string;
  courseId: string;
  courseName: string;
  passcode: string;
}

export interface ChoiceOption {
  id: string;
  label: string;
  text: string;
}

export interface Question {
  id: number;
  part: 1 | 2;
  partTitle: string;
  code: string;
  title: string;
  scenario?: string;
  options?: ChoiceOption[];
  minWords?: number;
  maxWords?: number;
  correctOptionId?: string; // Correct answer key for multiple choice
  modelAnswerKey?: string; // Standard guidance for essay grading
}

export interface ExamAnswers {
  choices: Record<number, string>;
  essays: Record<number, string>;
}

export interface ExamSubmission {
  id: string;
  candidate: CandidateInfo;
  timestamp: string;
  formattedDate: string;
  timeSpentSeconds: number;
  timeSpentFormatted: string;
  answers: ExamAnswers;
  status: 'PENDING_REVIEW' | 'PASSED' | 'FAILED';
  evaluatedBy?: string;
  evaluatedAt?: string;
  score?: number;
  maxScore?: number;
  choiceScore?: number;
  essayScore?: number;
  essayScores?: Record<number, number>;
  essayFeedbacks?: Record<number, string>;
  notes?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  thName: string;
  durationMinutes: number;
  description: string;
  badgeCode: string;
}

