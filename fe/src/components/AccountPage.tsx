import { ChevronRight, User, Settings as SettingsIcon, Shield, LogOut, ShieldCheck, CreditCard } from 'lucide-react';

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

      {/* Subscription Button */}
      {onOpenSubscription && (
        <button
          onClick={onOpenSubscription}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-4 flex items-center justify-between hover:from-red-700 hover:to-orange-700 transition-colors mb-4 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-medium">Đăng ký gói sử dụng</span>
          </div>
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      )}

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
