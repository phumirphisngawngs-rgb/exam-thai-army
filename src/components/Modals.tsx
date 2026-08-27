import React from 'react';
import { X, ShieldAlert, BookOpen, Headphones, Lock } from 'lucide-react';

interface ModalsProps {
  activeModal: 'honor' | 'privacy' | 'support' | null;
  onClose: () => void;
}

export const Modals: React.FC<ModalsProps> = ({ activeModal, onClose }) => {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#26211E] border-2 border-[#f6be39] rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_30px_rgba(0,0,0,0.8)] relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9b8f7a] hover:text-[#f6be39] p-1.5 rounded-lg hover:bg-[#161311] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {activeModal === 'honor' && (
          <div>
            <div className="flex items-center gap-3 text-[#f6be39] mb-4">
              <BookOpen className="w-6 h-6 shrink-0" />
              <h3 className="text-xl font-bold font-headline">
                ประมวลระเบียบเกียรติยศ (Honor Code)
              </h3>
            </div>
            <div className="text-xs sm:text-sm text-[#d3c5ae] space-y-3 leading-relaxed">
              <p>
                ผู้เข้ารับการทดสอบทุกคนของ <strong>กรมยุทธศึกษาทหารบก (ยศ.ทบ.)</strong> จะต้องปฏิบัติตนตามหลักเกียรติยศและความซื่อสัตย์สุจริตขั้นสูงสุด:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#eae1dd]">
                <li>ห้ามมิให้ทำการทุจริต คัดลอก หรือส่งต่อข้อสอบแก่บุคคลภายนอกโดยเด็ดขาด</li>
                <li>คำตอบทุกข้อจะต้องกลั่นกรองมาจากความรู้ความสามารถของผู้เข้าสอบเอง</li>
                <li>การฝ่าฝืนระเบียบจะถูกบันทึกประวัติความประพฤติและตัดสิทธิ์การสอบทุกหลักสูตรของหน่วย</li>
              </ul>
              <div className="pt-2 text-[#f6be39] font-semibold text-xs">
                "เกียรติ วินัย สัตย์ซื่อ ถือชาติมั่น"
              </div>
            </div>
          </div>
        )}

        {activeModal === 'privacy' && (
          <div>
            <div className="flex items-center gap-3 text-[#f6be39] mb-4">
              <Lock className="w-6 h-6 shrink-0" />
              <h3 className="text-xl font-bold font-headline">
                นโยบายความเป็นส่วนตัวของสถาบัน (Institutional Privacy)
              </h3>
            </div>
            <div className="text-xs sm:text-sm text-[#d3c5ae] space-y-3 leading-relaxed">
              <p>
                ข้อมูลส่วนบุคคลและประวัติการสอบของกำลังพลและผู้เข้ารับการอบรมจะได้รับการคุ้มครองภายใต้มาตรฐานความปลอดภัยของ ยศ.ทบ.:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#eae1dd]">
                <li>ข้อมูล Username, Discord ID และผลคะแนน จะถูกนำไปใช้เพื่อการประเมินวิทยฐานะและการออกใบประกาศนียบัตรเท่านั้น</li>
                <li>ระบบจัดเก็บผลสอบผ่านการเข้ารหัส End-to-End Encryption</li>
                <li>ไม่มีการเปิดเผยข้อมูลต่อบุคคลภายนอกที่ไม่ได้รับอนุญาต</li>
              </ul>
            </div>
          </div>
        )}

        {activeModal === 'support' && (
          <div>
            <div className="flex items-center gap-3 text-[#f6be39] mb-4">
              <Headphones className="w-6 h-6 shrink-0" />
              <h3 className="text-xl font-bold font-headline">
                ศูนย์สนับสนุนการทดสอบ (Support Command)
              </h3>
            </div>
            <div className="text-xs sm:text-sm text-[#d3c5ae] space-y-3 leading-relaxed">
              <p>
                หากพบปัญหาทางเทคนิคหรือมีข้อสงสัยเกี่ยวกับการสอบและการประเมินผล สามารถติดต่อเจ้าหน้าที่ฝ่ายอำนวยการได้ดังนี้:
              </p>
              <div className="p-3.5 bg-[#161311] rounded border border-[#4f4634] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#9b8f7a]">หน่วยงาน:</span>
                  <span className="text-[#eae1dd] font-semibold">แผนกอบรมหลักสูตรและประเมินผล ยศ.ทบ.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9b8f7a]">Discord Support:</span>
                  <span className="text-[#f6be39] font-mono-military">discord.gg/atec-command</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9b8f7a]">เวลาทำการ:</span>
                  <span className="text-[#eae1dd]">24/7 ศูนย์ปฏิบัติการส่วนหน้า</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="gold-gradient-btn px-5 py-2 rounded text-xs sm:text-sm font-bold text-[#402d00] uppercase tracking-wider"
          >
            รับทราบและปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
