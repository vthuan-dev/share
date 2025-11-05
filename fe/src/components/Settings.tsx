import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Switch } from './ui/switch';

interface SettingsProps {
  onBack: () => void;
  onNavigateHome: () => void;
}

export default function Settings({ onBack, onNavigateHome }: SettingsProps) {
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
              <h1 className="text-white">Cài đặt</h1>
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
          <div className="space-y-1">
            {/* Thông báo */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <h3 className="mb-4 text-gray-900">Thông báo</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">Thông báo đẩy</p>
                    <p className="text-sm text-gray-500">Nhận thông báo từ ứng dụng</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">Thông báo email</p>
                    <p className="text-sm text-gray-500">Nhận thông báo qua email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">Thông báo SMS</p>
                    <p className="text-sm text-gray-500">Nhận thông báo qua SMS</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            {/* Ngôn ngữ & Vùng */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <h3 className="mb-4 text-gray-900">Ngôn ngữ & Vùng</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-gray-900">Ngôn ngữ</p>
                    <p className="text-sm text-gray-500">Tiếng Việt</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-gray-900">Múi giờ</p>
                    <p className="text-sm text-gray-500">GMT+7 Bangkok, Hanoi</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Hiển thị */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <h3 className="mb-4 text-gray-900">Hiển thị</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">Chế độ tối</p>
                    <p className="text-sm text-gray-500">Tự động theo hệ thống</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            {/* Khác */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="mb-4 text-gray-900">Khác</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between">
                  <p className="text-gray-900">Điều khoản sử dụng</p>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between">
                  <p className="text-gray-900">Chính sách bảo mật</p>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between">
                  <p className="text-gray-900">Về chúng tôi</p>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
