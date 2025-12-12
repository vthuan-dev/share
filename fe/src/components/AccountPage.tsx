import { useEffect, useState } from 'react';
import { ChevronRight, User, Settings as SettingsIcon, Shield, LogOut, ShieldCheck, CreditCard, Package, CheckCircle, Clock } from 'lucide-react';
import { api } from '../utils/api';

interface AccountPageProps {
  onNavigateToProfile: () => void;
  onNavigateToSettings: () => void;
  onNavigateToSecurity: () => void;
  onNavigateToAdmin?: () => void;
  onLogout: () => void;
  userRole?: 'user' | 'admin';
  onOpenSubscription?: () => void;
}

export default function AccountPage({
  onNavigateToProfile,
  onNavigateToSettings,
  onNavigateToSecurity,
  onNavigateToAdmin,
  onLogout,
  userRole = 'user',
  onOpenSubscription
}: AccountPageProps) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const status = await api.getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (err) {
      // Ignore error
    }
  };

  const menuItems = [
    ...(userRole === 'admin' && onNavigateToAdmin ? [{
      icon: ShieldCheck,
      label: 'Quản trị viên',
      onClick: onNavigateToAdmin,
      highlight: true
    }] : []),
    {
      icon: User,
      label: 'Thông tin cá nhân',
      onClick: onNavigateToProfile
    },
    {
      icon: Package,
      label: 'Gói sử dụng dịch vụ',
      onClick: onOpenSubscription || (() => {}),
      highlight: false
    },
    {
      icon: SettingsIcon,
      label: 'Cài đặt',
      onClick: onNavigateToSettings
    },
    {
      icon: Shield,
      label: 'Bảo mật',
      onClick: onNavigateToSecurity
    }
  ];

  return (
    <>
      {/* Title */}
      <h2 className="mb-4 text-gray-900">Tài Khoản</h2>

      {/* Subscription Status Card */}
      {subscriptionStatus && (
        <div className={`rounded-2xl p-4 mb-4 ${
          subscriptionStatus.hasActiveSubscription 
            ? 'bg-green-50 border-2 border-green-200' 
            : subscriptionStatus.pendingRequest
            ? 'bg-yellow-50 border-2 border-yellow-200'
            : 'bg-gray-50 border-2 border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            {subscriptionStatus.hasActiveSubscription ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900">Đã đăng ký gói</h3>
                  {subscriptionStatus.subscriptionExpiresAt && (
                    <p className="text-sm text-green-700">
                      Hết hạn: {new Date(subscriptionStatus.subscriptionExpiresAt).toLocaleDateString('vi-VN')}
                    </p>
                  )}
                </div>
              </>
            ) : subscriptionStatus.pendingRequest ? (
              <>
                <Clock className="w-6 h-6 text-yellow-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900">Đang chờ xác nhận</h3>
                  <p className="text-sm text-yellow-700">
                    Gói {subscriptionStatus.pendingRequest.planName} - Vui lòng chờ admin xác nhận
                  </p>
                </div>
              </>
            ) : (
              <>
                <Clock className="w-6 h-6 text-gray-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Chưa đăng ký gói</h3>
                  <p className="text-sm text-gray-700">
                    {subscriptionStatus.hasUsedFreeShare 
                      ? 'Bạn đã dùng lần share miễn phí. Vui lòng đăng ký gói để tiếp tục.'
                      : 'Bạn có 1 lần share miễn phí. Sau đó cần đăng ký gói.'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-4">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isHighlight = 'highlight' in item && item.highlight;
            return (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full flex items-center justify-between py-3 hover:bg-white rounded-xl px-3 transition-colors ${
                  isHighlight ? 'bg-gradient-to-r from-red-50 to-orange-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isHighlight ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-red-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${isHighlight ? 'text-white' : 'text-red-600'}`} />
                  </div>
                  <div className="text-left">
                    <span className={`font-medium ${isHighlight ? 'text-red-600' : 'text-gray-900'}`}>
                      {item.label}
                    </span>
                    {isHighlight && (
                      <p className="text-xs text-gray-500">Quản lý người dùng & hệ thống</p>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            );
          })}
        </div>
      </div>


      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-600" />
          </div>
          <span className="text-red-600">Đăng xuất</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>

      {/* App Version */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">Phiên bản 1.0.0</p>
      </div>
    </>
  );
}
