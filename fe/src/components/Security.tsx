import { useState } from 'react';
import { ChevronLeft, Eye, EyeOff, Shield, Lock, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

interface SecurityProps {
  onBack: () => void;
  onNavigateHome: () => void;
}

export default function Security({ onBack, onNavigateHome }: SecurityProps) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-red-600 text-white px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 -ml-2">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-white">Bảo mật</h1>
            </div>
            <button onClick={onNavigateHome} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6 -mt-4 bg-white rounded-t-[32px]">
          {/* Two-Factor Authentication */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Xác thực hai yếu tố</h3>
                <p className="text-sm text-gray-500">Tăng cường bảo mật tài khoản</p>
              </div>
              <Switch />
            </div>
          </div>

          {/* Biometric */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Sinh trắc học</h3>
                <p className="text-sm text-gray-500">Đăng nhập bằng vân tay hoặc Face ID</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Đổi mật khẩu</h3>
                <p className="text-sm text-gray-500">Cập nhật mật khẩu của bạn</p>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="oldPassword" className="text-gray-700 mb-2 block text-sm">Mật khẩu cũ</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full h-11 rounded-xl border-gray-200 pr-12 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-gray-700 mb-2 block text-sm">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full h-11 rounded-xl border-gray-200 pr-12 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 mb-2 block text-sm">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full h-11 rounded-xl border-gray-200 pr-12 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button className="w-full h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl">
                Cập nhật mật khẩu
              </Button>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="text-gray-900 mb-4">Phiên đăng nhập</h3>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-900">iPhone 12 Pro</p>
                  <p className="text-sm text-gray-500">Ho Chi Minh, Vietnam</p>
                  <p className="text-xs text-gray-400">Hoạt động gần đây</p>
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">Hiện tại</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
