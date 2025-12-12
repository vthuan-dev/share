import { useState, useEffect } from 'react';
import { X, CheckCircle, Clock } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { Button } from './ui/button';

interface Plan {
  id: string;
  name: string;
  duration: number;
  price: number;
  priceFormatted: string;
}

interface SubscriptionPurchaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchaseSuccess?: () => void;
}

export default function SubscriptionPurchase({ open, onOpenChange, onPurchaseSuccess }: SubscriptionPurchaseProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  // Payment config (giống Register.tsx)
  const bankCode = 'vib';
  const accountNumber = '081409781';
  const accountName = 'PHAN NGOC CHUNG';

  useEffect(() => {
    if (open) {
      fetchPlans();
      fetchSubscriptionStatus();
    }
  }, [open]);

  const fetchPlans = async () => {
    try {
      const result = await api.getSubscriptionPlans();
      setPlans(result.plans || []);
    } catch (err: any) {
      toast.error(err.message || 'Không thể tải danh sách gói');
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const status = await api.getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (err) {
      // Ignore error
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowQR(true);
  };

  const handleConfirmPaid = async () => {
    if (!selectedPlan) return;

    try {
      setLoading(true);
      const paymentNote = `GOI ${selectedPlan.name.toUpperCase()} WEB SHARE`;
      await api.purchasePlan(selectedPlan.id as '6months' | '12months', paymentNote);
      
      toast.success(`Đã gửi yêu cầu đăng ký ${selectedPlan.name}!`, {
        description: 'Vui lòng chờ admin xác nhận thanh toán',
      });

      setShowQR(false);
      setSelectedPlan(null);
      onOpenChange(false);
      
      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra khi đăng ký gói');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const paymentNote = selectedPlan 
    ? `GOI ${selectedPlan.name.toUpperCase()} WEB SHARE`
    : 'GOI DANG KY WEB SHARE';
  
  const qrSrc = selectedPlan
    ? `https://img.vietqr.io/image/${bankCode}-${accountNumber}-print.png?amount=${selectedPlan.price}&addInfo=${encodeURIComponent(paymentNote)}&accountName=${encodeURIComponent(accountName)}`
    : '';

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Main Modal */}
      {!showQR ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[430px] bg-white rounded-[32px] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="relative px-6 py-4 bg-red-600">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Đăng ký gói sử dụng</h2>
                <button
                  onClick={() => onOpenChange(false)}
                  className="text-2xl text-white hover:opacity-80"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-4">
              {/* Subscription Status */}
              {subscriptionStatus && (
                <div className={`rounded-2xl p-4 ${
                  subscriptionStatus.hasActiveSubscription 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {subscriptionStatus.hasActiveSubscription ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-900">Đang có gói active</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <span className="font-medium text-yellow-900">Chưa có gói</span>
                      </>
                    )}
                  </div>
                  {subscriptionStatus.hasActiveSubscription && subscriptionStatus.subscriptionExpiresAt && (
                    <p className="text-sm text-green-700">
                      Hết hạn: {new Date(subscriptionStatus.subscriptionExpiresAt).toLocaleDateString('vi-VN')}
                    </p>
                  )}
                  {!subscriptionStatus.hasActiveSubscription && (
                    <p className="text-sm text-yellow-700">
                      {subscriptionStatus.hasUsedFreeShare 
                        ? 'Bạn đã dùng lần share miễn phí. Vui lòng đăng ký gói để tiếp tục.'
                        : 'Bạn có 1 lần share miễn phí. Sau đó cần đăng ký gói.'}
                    </p>
                  )}
                </div>
              )}

              {/* Plans List */}
              <div className="space-y-3">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan)}
                    className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-red-500 hover:bg-red-50 transition-all text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{plan.name}</h3>
                      <span className="text-2xl font-bold text-red-600">{plan.priceFormatted}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Thời hạn: {plan.duration} tháng
                    </p>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 text-center">
                  Sau khi thanh toán, vui lòng xác nhận để kích hoạt gói
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* QR Payment Modal */
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[430px] bg-white rounded-[32px] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="relative px-6 py-4 bg-red-600">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white leading-tight">
                  {selectedPlan?.name || 'Gói đăng ký'}
                </h2>
                <button
                  onClick={() => {
                    setShowQR(false);
                    setSelectedPlan(null);
                  }}
                  className="text-2xl text-white hover:opacity-80"
                >
                  ×
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-800"></div>
            </div>

            {/* QR Content */}
            <div className="px-6 py-5 space-y-5 bg-white">
              {/* QR Code */}
              <div className="rounded-3xl overflow-hidden bg-white p-4 shadow-md border border-gray-100">
                <img
                  src={qrSrc}
                  alt="QR thanh toán"
                  className="w-full h-auto"
                />
              </div>

              {/* Plan Info */}
              {selectedPlan && (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Gói đăng ký:</span>
                    <span className="font-bold text-gray-900">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Số tiền:</span>
                    <span className="text-xl font-bold text-red-600">{selectedPlan.priceFormatted}</span>
                  </div>
                </div>
              )}

              {/* Bank Info */}
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                <p className="text-xs text-blue-900 mb-1">
                  <strong>Ngân hàng:</strong> VIB
                </p>
                <p className="text-xs text-blue-900 mb-1">
                  <strong>Số tài khoản:</strong> {accountNumber}
                </p>
                <p className="text-xs text-blue-900">
                  <strong>Chủ tài khoản:</strong> {accountName}
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  <strong>Nội dung:</strong> {paymentNote}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 pt-1 pb-4">
                <Button
                  type="button"
                  className="flex-1 h-11 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-full"
                  onClick={() => {
                    setShowQR(false);
                    setSelectedPlan(null);
                  }}
                  disabled={loading}
                >
                  Quay lại
                </Button>
                <Button
                  type="button"
                  className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white rounded-full shadow"
                  onClick={handleConfirmPaid}
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Tôi đã chuyển khoản'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

