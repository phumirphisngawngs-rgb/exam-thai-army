import React, { useState, useEffect } from 'react';
import { Header, AppTab } from './components/Header';
import { Footer } from './components/Footer';
import { RegistrationView } from './components/RegistrationView';
import { ExaminationView } from './components/ExaminationView';
import { ConfirmationView } from './components/ConfirmationView';
import { VerificationView } from './components/VerificationView';
import { AdminLoginView } from './components/AdminLoginView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AdminGradingView } from './components/AdminGradingView';
import { Modals } from './components/Modals';
import { CandidateInfo, ExamAnswers, ExamSubmission } from './types';
import { INITIAL_SUBMISSIONS } from './data/examData';
import {
  subscribeToSubmissions,
  saveSubmissionToCloud,
  updateSubmissionInCloud,
  deleteSubmissionFromCloud,
  seedInitialDataIfNeeded,
} from './lib/firebase';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('registration');
  const [activeCandidate, setActiveCandidate] = useState<CandidateInfo | null>(null);
  const [currentSubmission, setCurrentSubmission] = useState<ExamSubmission | null>(null);
  const [selectedGradingSubmission, setSelectedGradingSubmission] = useState<ExamSubmission | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('atec_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [submissions, setSubmissions] = useState<ExamSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('atec_exam_submissions');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SUBMISSIONS;
  });

  const [activeModal, setActiveModal] = useState<'honor' | 'privacy' | 'support' | null>(null);

  // Real-time Cloud Firestore synchronization across all devices
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    try {
      unsubscribe = subscribeToSubmissions(
        (cloudSubmissions) => {
          setIsCloudConnected(true);
          if (cloudSubmissions && cloudSubmissions.length > 0) {
            setSubmissions(cloudSubmissions);
            try {
              localStorage.setItem('atec_exam_submissions', JSON.stringify(cloudSubmissions));
            } catch (err) {
              console.error(err);
            }
          }
        },
        (error) => {
          console.warn('Firebase sync warning, falling back to local storage:', error);
          setIsCloudConnected(false);
        }
      );
    } catch (err) {
      console.error('Failed to initialize Firebase real-time listener:', err);
      setIsCloudConnected(false);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // Format date like: "27 ส.ค. 2026, 02:34:37 GMT+7"
  const formatTimestamp = (d: Date) => {
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    const day = d.getDate();
    const month = thaiMonths[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds} GMT+7`;
  };

  const handleStartExam = (candidate: CandidateInfo) => {
    setActiveCandidate(candidate);
    setCurrentTab('examination');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitExam = async (
    answers: ExamAnswers,
    timeSeconds?: number,
    timeFormatted?: string
  ) => {
    if (!activeCandidate) return;

    const now = new Date();
    const subId = `ATC-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newSub: ExamSubmission = {
      id: subId,
      candidate: activeCandidate,
      timestamp: now.toISOString(),
      formattedDate: formatTimestamp(now),
      timeSpentSeconds: timeSeconds ?? 0,
      timeSpentFormatted: timeFormatted ?? '00:00 นาที',
      answers,
      status: 'PENDING_REVIEW',
      notes: 'บันทึกเข้าระบบ ยศ.ทบ. เรียบร้อย รอคณะกรรมการตรวจประเมิน',
    };

    // Update local state immediately for responsive feedback
    setSubmissions((prev) => [newSub, ...prev.filter((item) => item.id !== newSub.id)]);
    setCurrentSubmission(newSub);
    setActiveCandidate(null);
    setCurrentTab('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Save to Cloud Firestore in real-time
    try {
      await saveSubmissionToCloud(newSub);
      console.log('Submission uploaded to cloud Firestore successfully:', subId);
    } catch (error) {
      console.error('Failed to upload submission to cloud Firestore:', error);
    }
  };

  const handleCancelExam = () => {
    if (window.confirm('คุณต้องการยกเลิกการสอบและกลับสู่หน้าลงทะเบียนหรือไม่?')) {
      setActiveCandidate(null);
      setCurrentTab('registration');
    }
  };

  const handleRetakeExam = () => {
    setActiveCandidate(null);
    setCurrentSubmission(null);
    setCurrentTab('registration');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Handlers
  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setCurrentTab('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('atec_admin_auth');
    setIsAdminAuthenticated(false);
    setSelectedGradingSubmission(null);
    setCurrentTab('admin-login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSubmissionForGrading = (sub: ExamSubmission) => {
    setSelectedGradingSubmission(sub);
    setCurrentTab('admin-grading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveEvaluation = async (updatedSubmission: ExamSubmission) => {
    // Update local state immediately
    setSubmissions((prev) =>
      prev.map((item) => (item.id === updatedSubmission.id ? updatedSubmission : item))
    );
    setSelectedGradingSubmission(updatedSubmission);
    if (currentSubmission && currentSubmission.id === updatedSubmission.id) {
      setCurrentSubmission(updatedSubmission);
    }

    // Persist to Cloud Firestore so all other devices see it live
    try {
      await updateSubmissionInCloud(updatedSubmission.id, updatedSubmission);
      console.log('Evaluation saved and synced to cloud Firestore:', updatedSubmission.id);
    } catch (error) {
      console.error('Failed to sync evaluation to cloud Firestore:', error);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    // Update local state
    setSubmissions((prev) => prev.filter((item) => item.id !== id));
    if (selectedGradingSubmission?.id === id) {
      setSelectedGradingSubmission(null);
      setCurrentTab('admin-dashboard');
    }
    if (currentSubmission?.id === id) {
      setCurrentSubmission(null);
    }

    // Delete from Cloud Firestore
    try {
      await deleteSubmissionFromCloud(id);
      console.log('Submission deleted from cloud Firestore:', id);
    } catch (error) {
      console.error('Failed to delete submission from cloud Firestore:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0D0C] text-[#eae1dd] flex flex-col justify-between selection:bg-[#f6be39]/30 selection:text-[#ffdfa0]">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        hasActiveSession={!!activeCandidate}
        hasSubmission={!!currentSubmission}
        isAdminAuthenticated={isAdminAuthenticated}
        isCloudConnected={isCloudConnected}
      />

      {/* Main Content View Switcher */}
      <div className="flex-grow pt-20">
        {currentTab === 'registration' && (
          <RegistrationView
            onStartExam={handleStartExam}
            onNavigateToAdmin={() => {
              if (isAdminAuthenticated) {
                setCurrentTab('admin-dashboard');
              } else {
                setCurrentTab('admin-login');
              }
            }}
          />
        )}

        {currentTab === 'examination' && activeCandidate && (
          <ExaminationView
            candidate={activeCandidate}
            onSubmitExam={handleSubmitExam}
            onCancelExam={handleCancelExam}
          />
        )}

        {currentTab === 'confirmation' && currentSubmission && (
          <ConfirmationView
            submission={currentSubmission}
            onRetakeExam={handleRetakeExam}
            onViewVerification={() => setCurrentTab('verification')}
          />
        )}

        {currentTab === 'verification' && (
          <VerificationView
            submissions={submissions}
            onBackToPortal={() => setCurrentTab('registration')}
          />
        )}

        {currentTab === 'admin-login' && (
          <AdminLoginView
            onLoginSuccess={handleAdminLoginSuccess}
            onBackToPortal={() => setCurrentTab('registration')}
          />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboardView
            submissions={submissions}
            onSelectSubmissionForGrading={handleSelectSubmissionForGrading}
            onDeleteSubmission={handleDeleteSubmission}
            onLogout={handleAdminLogout}
            onBackToPortal={() => setCurrentTab('registration')}
          />
        )}

        {currentTab === 'admin-grading' && selectedGradingSubmission && (
          <AdminGradingView
            submission={selectedGradingSubmission}
            onSaveEvaluation={handleSaveEvaluation}
            onBackToDashboard={() => setCurrentTab('admin-dashboard')}
          />
        )}
      </div>

      {/* Official Footer */}
      <Footer onOpenModal={setActiveModal} />

      {/* Information Modals */}
      <Modals activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
