   import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { api } from '../utils/api';
import { toast } from 'sonner';

interface User {
  _id: string;
  name: string;
  email: string;
  isApproved: boolean;
  role: string;
  createdAt: string;
  balance: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending'>('pending');

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Luôn lấy tất cả users để tính toán thống kê chính xác
      const allData = await api.getAllUsers();
      setAllUsers(allData);
      
      // Hiển thị theo filter
      const displayData = filter === 'pending' 
        ? allData.filter((u: User) => !u.isApproved)
        : allData;
      setUsers(displayData);
    } catch (err: any) {
      toast.error(err.message || 'Không thể tải danh sách users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      await api.approveUser(userId);
      toast.success('Đã phê duyệt user thành công!');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Không thể phê duyệt user');
    }
  };

  const handleReject = async (userId: string) => {
    if (!confirm('Bạn có chắc muốn từ chối và xóa user này?')) return;
    
    try {
      await api.rejectUser(userId);
      toast.success('Đã từ chối và xóa user');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Không thể xóa user');
    }
  };

  // Tính toán thống kê từ tất cả users, không phụ thuộc vào filter
  const pendingCount = allUsers.filter((u: User) => !u.isApproved).length;
  const approvedCount = allUsers.filter((u: User) => u.isApproved).length;
  const totalUsers = allUsers.length;

  return (
    <AdminLayout userName="Admin">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Tổng số
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalUsers}</h3>
          <p className="text-sm text-gray-600">Người dùng</p>
        </div>

        {/* Pending Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
              Chờ duyệt
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{pendingCount}</h3>
          <p className="text-sm text-gray-600">Đang chờ</p>
        </div>

        {/* Approved Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
              Đã duyệt
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{approvedCount}</h3>
          <p className="text-sm text-gray-600">Đã kích hoạt</p>
        </div>

        {/* Approval Rate */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Tỷ lệ
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {totalUsers > 0 ? Math.round((approvedCount / totalUsers) * 100) : 0}%
          </h3>
          <p className="text-sm text-gray-600">Đã phê duyệt</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter('pending')}
          className={`flex-1 py-4 rounded-2xl font-semibold transition-all text-lg ${
            filter === 'pending'
              ? 'bg-red-600 text-white shadow-lg shadow-red-200'
              : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
          }`}
        >
          <Clock className="w-5 h-5 inline-block mr-2" />
          Chờ duyệt ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-4 rounded-2xl font-semibold transition-all text-lg ${
            filter === 'all'
              ? 'bg-red-600 text-white shadow-lg shadow-red-200'
              : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
          }`}
        >
          <Users className="w-5 h-5 inline-block mr-2" />
          Tất cả ({totalUsers})
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* User List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">
              {filter === 'pending' ? 'Không có user nào chờ duyệt' : 'Không có user nào'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user._id}
                className={`bg-gray-50 rounded-2xl p-4 shadow-sm border-2 ${
                  user.isApproved ? 'border-green-200' : 'border-yellow-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      {user.role === 'admin' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Đăng ký: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    {user.isApproved ? (
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Đã duyệt
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Chờ duyệt
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {!user.isApproved && (
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => handleApprove(user._id)}
                      className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm border-2 border-green-200"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Phê duyệt</span>
                    </button>
                    <button
                      onClick={() => handleReject(user._id)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm border-2 border-red-200"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Từ chối</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
