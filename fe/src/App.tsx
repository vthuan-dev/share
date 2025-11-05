import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PlusCircle, UserCircle } from 'lucide-react';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import AccountOverview from './components/AccountOverview';
import InfoTabs from './components/InfoTabs';
import GroupsList from './components/GroupsList';
import RegionalGroupsList from './components/RegionalGroupsList';
import AccountPage from './components/AccountPage';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Security from './components/Security';
import AdminRoute from './components/AdminRoute';
import BottomNav from './components/BottomNav';
import { api } from './utils/api';
import { toast } from 'sonner';

type AuthScreen = 'login' | 'register';
type AccountScreen = 'main' | 'profile' | 'settings' | 'security' | 'admin';

function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');
  const [userBalance, setUserBalance] = useState<number>(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [accountScreen, setAccountScreen] = useState<AccountScreen>('main');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await api.me();
          setUserName(user.name);
          const role = user.role || 'user';
          setUserRole(role);
          setUserBalance(Number(user.balance) || 0);
          setIsAuthenticated(true);
          if (role === 'admin') {
            window.location.href = '/admin';
            return;
          }
        } catch (err) {
          // Token invalid or expired
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { user, token } = await api.login(email, password);
      localStorage.setItem('token', token);
      setUserName(user.name);
      const role = user.role || 'user';
      setUserRole(role);
      setUserBalance(Number(user.balance) || 0);
      setIsAuthenticated(true);
      if (role === 'admin') {
        window.location.href = '/admin';
        return;
      }
    } catch (err: any) {
      toast.error(err.message || 'Đăng nhập thất bại');
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const result = await api.register(name, email, password);
      
      // Check if account needs approval
      if (result.pending) {
        toast.success(result.message || 'Đăng ký thành công! Vui lòng đợi admin phê duyệt.');
        setAuthScreen('login');
        return;
      }
      
      // Old flow - auto login (for backward compatibility)
      if (result.token) {
        localStorage.setItem('token', result.token);
        setUserName(result.user.name);
        const role = result.user.role || 'user';
        setUserRole(role);
        setUserBalance(Number(result.user.balance) || 0);
        setIsAuthenticated(true);
        if (role === 'admin') {
          window.location.href = '/admin';
          return;
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Đăng ký thất bại');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthScreen('login');
    setActiveTab('overview');
    setAccountScreen('main');
    localStorage.removeItem('token');
  };

  const handleNavigateHome = () => {
    setActiveTab('overview');
    setAccountScreen('main');
  };

  const handleGroupSelect = (groupId: string, checked: boolean) => {
    setSelectedGroups(prev => {
      if (checked) {
        return [...prev, groupId];
      } else {
        return prev.filter(id => id !== groupId);
      }
    });
  };

  // Loading state
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
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Auth screens
  if (!isAuthenticated) {
    if (authScreen === 'login') {
      return (
        <Login
          onLogin={handleLogin}
          onNavigateToRegister={() => setAuthScreen('register')}
        />
      );
    }
    if (authScreen === 'register') {
      return (
        <Register
          onRegister={handleRegister}
          onNavigateToLogin={() => setAuthScreen('login')}
        />
      );
    }
  }

  // Account sub-screens
  if (activeTab === 'account' && accountScreen !== 'main') {
    if (accountScreen === 'profile') {
      return <Profile onBack={() => setAccountScreen('main')} onNavigateHome={handleNavigateHome} userName={userName} />;
    }
    if (accountScreen === 'settings') {
      return <Settings onBack={() => setAccountScreen('main')} onNavigateHome={handleNavigateHome} />;
    }
    if (accountScreen === 'security') {
      return <Security onBack={() => setAccountScreen('main')} onNavigateHome={handleNavigateHome} />;
    }
    if (accountScreen === 'admin') {
      window.location.href = '/admin';
      return null;
    }
  }

  // Main app
  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-white relative shadow-2xl">
        {/* Header */}
        <Header userName={userName} balance={userBalance} />

        {/* Content */}
        <div className="bg-white rounded-t-[32px] -mt-24 px-4 pt-6 pb-24 min-h-screen">
          {activeTab === 'overview' && (
            <>
              {/* Account Overview */}
              <AccountOverview />

              {/* Info Tabs */}
              <InfoTabs />

              {/* Regional Groups List */}
              <RegionalGroupsList />
            </>
          )}

          {activeTab === 'groups' && (
            <>
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="mb-0">Nhóm Chia Sẻ</h2>
                  {selectedGroups.length > 0 && (
                    <span className="text-sm text-red-600 font-medium">
                      Đã chọn {selectedGroups.length} nhóm
                    </span>
                  )}
                </div>
                <GroupsList 
                  selectedGroups={selectedGroups}
                  onGroupSelect={handleGroupSelect}
                  selectionMode={true}
                />
              </div>
            </>
          )}

          {activeTab === 'share' && (
            <div className="pt-4">
              <h2 className="mb-4">Chia Sẻ Bài Viết</h2>
              
              {selectedGroups.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <PlusCircle className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        Chia sẻ vào {selectedGroups.length} nhóm
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Bài viết sẽ được đăng vào tất cả các nhóm đã chọn
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <label className="block text-sm font-medium mb-2">Nội dung bài viết</label>
                    <textarea
                      placeholder="Nhập nội dung bài viết của bạn..."
                      className="w-full min-h-[150px] p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <label className="block text-sm font-medium mb-2">Thêm ảnh (tùy chọn)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-red-500 transition-colors">
                      <PlusCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Nhấn để thêm ảnh</p>
                    </div>
                  </div>

                  <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-colors">
                    Chia sẻ ngay
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                  <PlusCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">Chưa chọn nhóm nào</p>
                  <p className="text-sm text-gray-500">
                    Vào tab "Nhóm chia sẻ" để chọn nhóm bạn muốn đăng bài
                  </p>
                  <button 
                    onClick={() => setActiveTab('groups')}
                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Chọn nhóm
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="pt-4">
              <h2 className="mb-4">Khách Hàng</h2>
              <div className="bg-gray-50 rounded-2xl p-6 text-center">
                <UserCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Danh sách khách hàng của bạn</p>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="pt-4">
              <AccountPage
                onNavigateToProfile={() => setAccountScreen('profile')}
                onNavigateToSettings={() => setAccountScreen('settings')}
                onNavigateToSecurity={() => setAccountScreen('security')}
                onNavigateToAdmin={userRole === 'admin' ? () => setAccountScreen('admin') : undefined}
                onLogout={handleLogout}
                userRole={userRole}
              />
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/admin" element={<AdminRoute />} />
    </Routes>
  );
}
