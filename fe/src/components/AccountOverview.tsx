import { Share2, Users, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

interface AccountOverviewProps {
  isAuthenticated?: boolean;
  onNavigateToLogin?: () => void;
  onNavigateToRegister?: () => void;
}

export default function AccountOverview({ isAuthenticated = false, onNavigateToLogin, onNavigateToRegister }: AccountOverviewProps) {
  useEffect(() => {
    if (isAuthenticated) {
      // Có thể fetch user data ở đây nếu cần
    }
  }, [isAuthenticated]);

  // Nếu chưa đăng nhập, hiển thị banner đăng ký/đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="mt-4">
        <h2 className="mb-4">Tổng quan tài khoản</h2>
        
        {/* Banner đăng ký/đăng nhập */}
        <div className="bg-red-600 rounded-2xl p-6 mb-4">
          <h3 className="text-white text-xl font-bold mb-2">Tham gia nhóm chia sẻ</h3>
          <p className="text-white text-sm mb-4 opacity-90">
            Đăng ký để có thể liên hệ và chia sẻ bài viết lên các nhóm Facebook
          </p>
          <div className="flex gap-3">
            <button
              onClick={onNavigateToRegister}
              className="flex-1 bg-white text-red-600 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Đăng ký thành viên
            </button>
            <button
              onClick={onNavigateToLogin}
              className="flex-1 bg-red-700 text-white py-3 px-4 rounded-xl font-semibold hover:bg-red-800 transition-colors"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Nếu đã đăng nhập, hiển thị các cards như cũ
  return (
    <div className="mt-4">
      <h2 className="mb-4">Tổng quan tài khoản</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Tổng số nhóm đã share */}
        <div className="bg-gray-100 rounded-2xl p-4 h-32 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm">Tin đăng</span>
          </div>
          <div className="mb-2">
            <div className="text-2xl">0 tin</div>
            <div className="text-sm text-gray-500">Đang hiển thị</div>
          </div>
          <button className="text-red-600 text-sm flex items-center gap-1">
            Đăng tin
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Những người đã quan tâm */}
        <div className="bg-gray-100 rounded-2xl p-4 h-32 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm">Liên hệ trong 30 ngày</span>
          </div>
          <div className="mb-2">
            <div className="text-2xl">1 người</div>
            <div className="text-sm text-green-600">+ 0 mới vào hôm nay</div>
          </div>
        </div>
      </div>
    </div>
  );
}
