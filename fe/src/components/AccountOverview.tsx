import { Share2, Users, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../utils/api';

export default function AccountOverview() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await api.me();
      setBalance(userData.balance || 0);
    } catch (err: any) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

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
