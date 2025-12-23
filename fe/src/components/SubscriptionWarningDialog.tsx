import { X, AlertCircle, ArrowRight } from 'lucide-react';

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
        className="fixed inset-0 z-[9999] backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog Container */}
      <div
        className="fixed top-1/2 left-1/2 z-[10000] w-[92vw] max-w-[440px] bg-white overflow-hidden"
        style={{
          transform: 'translate(-50%, -50%)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Red Gradient with improved design */}
        <div
          className="relative px-6 py-6"
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px'
          }}
        >
          {/* Close Button - More elegant */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center transition-all"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
            }}
          >
            <X className="w-5 h-5 text-white" strokeWidth={2} />
          </button>

          {/* Icon and Title - Centered and elegant */}
          <div className="flex flex-col items-center text-center">
            <div
              className="w-14 h-14 flex items-center justify-center mb-3"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                borderRadius: '50%',
                backdropFilter: 'blur(10px)'
              }}
            >
              <AlertCircle className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-white">
              Thông báo
            </h2>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 py-6">
          {/* Main Message */}
          <div className="mb-4 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Bạn cần đăng ký gói để tiếp tục chia sẻ
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lần đầu chia sẻ miễn phí. Từ lần thứ 2, vui lòng đăng ký gói.
            </p>
          </div>

          {/* Info Box - More elegant */}
          <div
            className="p-4 mb-5"
            style={{
              background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}
          >
            <p className="text-sm text-gray-700 text-center leading-relaxed">
              Mở tab <span className="font-bold text-red-600">Tài khoản</span> để chọn gói và tiếp tục chia sẻ.
            </p>
          </div>

          {/* Action Buttons - Improved spacing and design */}
          <div className="flex gap-3">
            {/* Secondary Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all active:scale-95"
              style={{ borderRadius: '12px' }}
            >
              Để sau
            </button>

            {/* Primary Button - Red with enhanced design */}
            <button
              onClick={() => {
                onOpenChange(false);
                onRegister();
              }}
              className="flex-1 h-12 px-5 text-white font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.4)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Đăng ký</span>
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
