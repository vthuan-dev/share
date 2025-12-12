import { X, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface SubscriptionWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: () => void;
}

export default function SubscriptionWarningDialog({ 
  open, 
  onOpenChange, 
  onRegister 
}: SubscriptionWarningDialogProps) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      />

      {/* Dialog Content */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-[95vw] max-w-[380px] bg-white rounded-[32px] shadow-2xl overflow-hidden"
        style={{ animation: 'scaleIn 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Red Background */}
        <div className="relative px-5 py-4 bg-red-600">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Thông báo</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-5 space-y-4">
          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Bạn cần đăng ký gói để tiếp tục chia sẻ
            </h3>
          </div>

          {/* Description */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-1.5 flex-shrink-0"></div>
              <p className="text-sm text-yellow-900 leading-relaxed">
                Lần đầu chia sẻ miễn phí, từ lần 2 cần đăng ký gói.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-1.5 flex-shrink-0"></div>
              <p className="text-sm text-yellow-900 leading-relaxed">
                Vào tab <span className="font-semibold">Tài khoản</span> để đăng ký gói
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button
              onClick={() => {
                onOpenChange(false);
                onRegister();
              }}
              className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-base shadow-lg transition-colors"
            >
              Đăng ký ngay
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
