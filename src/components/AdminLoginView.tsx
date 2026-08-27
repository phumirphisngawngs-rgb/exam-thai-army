import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, ArrowRight, Sparkles, KeyRound, AlertCircle, ArrowLeft } from 'lucide-react';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
  onBackToPortal: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onLoginSuccess,
  onBackToPortal,
}) => {
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Accepted Admin Passwords
  const VALID_ADMIN_PASSWORDS = ['ATEC_ADMIN_2024', 'ADMIN2024', 'ATEC_ADMIN'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmed = adminPassword.trim();
    if (!trimmed) {
      setErrorMessage('กรุณากรอกรหัสผ่านผู้ดูแลระบบ');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (VALID_ADMIN_PASSWORDS.includes(trimmed) || trimmed.toUpperCase() === 'ATEC_ADMIN_2024') {
        // Save session
        sessionStorage.setItem('atec_admin_auth', 'true');
        onLoginSuccess();
      } else {
        setErrorMessage('รหัสผ่านผู้ดูแลระบบไม่ถูกต้อง กรุณาตรวจสอบรหัสผ่านอีกครั้ง (รหัสเริ่มต้น: ATEC_ADMIN_2024)');
      }
      setIsSubmitting(false);
    }, 350);
  };

  const handleQuickFill = () => {
    setAdminPassword('ATEC_ADMIN_2024');
    setErrorMessage('');
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-10 px-4 sm:px-6 relative z-10">
      {/* Background Graphic Watermark */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 overflow-hidden">
        <Shield className="w-[500px] h-[500px] text-[#f6be39]" />
      </div>

      <div className="w-full max-w-md surface-layer rounded-xl p-6 sm:p-8 border-2 border-[#f6be39]/40 shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative z-20">
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#4f4634]/60">
          <button
            type="button"
            onClick={onBackToPortal}
            className="text-xs text-[#d3c5ae]/80 hover:text-[#f6be39] flex items-center gap-1.5 transition-colors py-1 px-2 rounded hover:bg-[#231f1d]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้าหลัก</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-[#f6be39] font-mono-military bg-[#110d0c] px-2.5 py-1 rounded border border-[#f6be39]/30">
            <Lock className="w-3.5 h-3.5 text-[#f6be39]" />
            <span>SECURE ADMIN ACCESS</span>
          </div>
        </div>

        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#1f1b19] border-2 border-[#f6be39] flex items-center justify-center mx-auto mb-3 shadow-[0_0_16px_rgba(246,190,57,0.3)]">
            <KeyRound className="w-7 h-7 text-[#f6be39]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-[#eae1dd] tracking-wide">
            เข้าสู่ระบบผู้ดูแล (Admin)
          </h1>
          <p className="text-xs sm:text-sm text-[#9b8f7a] mt-1.5">
            สำหรับคณะกรรมการและเจ้าหน้าที่ตรวจข้อสอบ กรมยุทธศึกษาทหารบก
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="adminPass"
              className="block text-xs sm:text-sm font-semibold text-[#eae1dd] mb-1.5"
            >
              รหัสผ่านผู้ดูแลระบบ (Admin Password) <span className="text-[#f6be39]">*</span>
            </label>
            <div className="relative">
              <input
                id="adminPass"
                type={showPassword ? 'text' : 'password'}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านผู้ดูแล..."
                autoFocus
                className="input-tactical w-full px-4 py-3 text-[#eae1dd] rounded font-mono-military text-sm sm:text-base pr-12 focus:border-[#f6be39] focus:ring-1 focus:ring-[#f6be39]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9b8f7a] hover:text-[#eae1dd] transition-colors p-1"
                title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[11px] text-[#9b8f7a] mt-1.5">
              * รหัสผ่านผู้ดูแลแยกต่างหากจากรหัสเข้าสอบของผู้เข้าสอบ
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-[#93000a]/40 border border-[#ffb4ab]/60 text-[#ffdad6] text-xs sm:text-sm px-3.5 py-2.5 rounded text-center animate-shake font-medium flex items-center gap-2 justify-center">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="gold-gradient-btn w-full py-3.5 rounded text-[#402d00] font-headline font-bold text-base sm:text-lg uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform shadow-[0_4px_16px_rgba(246,190,57,0.3)] disabled:opacity-75"
          >
            {isSubmitting ? (
              <span>กำลังตรวจสอบสิทธิ์...</span>
            ) : (
              <>
                <span>เข้าสู่ระบบตรวจข้อสอบ</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Demo Autofill */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleQuickFill}
              className="inline-flex items-center gap-1.5 text-xs text-[#d3c5ae]/75 hover:text-[#f6be39] transition-colors py-1 px-3 rounded border border-[#4f4634]/60 bg-[#161311]/50 hover:bg-[#231f1d]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f6be39]" />
              คลิกเพื่อเติมรหัสแอดมินตัวอย่าง (ATEC_ADMIN_2024)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
