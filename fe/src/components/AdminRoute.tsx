import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPage from './AdminPage';
import { api } from '../utils/api';
import { toast } from 'sonner';

export default function AdminRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const user = await api.me();
      console.log('User data:', user); // Debug
      
      if (user.role === 'admin') {
        setIsAdmin(true);
        setIsLoading(false);
        return; // ← QUAN TRỌNG: Dừng ở đây nếu là admin
      } else {
        setIsLoading(false);
        toast.error('Tài khoản này không phải admin. Vui lòng đăng nhập với tài khoản admin@example.com');
        setTimeout(() => {
          localStorage.removeItem('token');
          window.location.href = '/';
        }, 2000);
      }
    } catch (err) {
      setIsLoading(false);
      toast.error('Vui lòng đăng nhập với tài khoản admin');
      setTimeout(() => {
        localStorage.removeItem('token');
        window.location.href = '/';
      }, 1500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-600 rounded-[24px] mx-auto mb-4 flex items-center justify-center animate-pulse">
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h2>
          <p className="text-gray-600 mb-4">
            Trang này chỉ dành cho quản trị viên
          </p>
          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-medium text-blue-900 mb-2">Đăng nhập với tài khoản admin:</p>
            <div className="space-y-1 text-sm text-blue-700">
              <p>📧 Email: <code className="bg-blue-100 px-2 py-0.5 rounded">admin@example.com</code></p>
              <p>🔑 Password: <code className="bg-blue-100 px-2 py-0.5 rounded">admin123456</code></p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-colors"
          >
            Đăng nhập lại
          </button>
        </div>
      </div>
    );
  }

  return <AdminPage />;
}
