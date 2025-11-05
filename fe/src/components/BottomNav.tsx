import { Home, Users, PlusCircle, UserCircle, Menu } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const navItems = [
    {
      id: 'overview',
      label: 'Tổng quan',
      icon: Home
    },
    {
      id: 'groups',
      label: 'Nhóm chia sẻ',
      icon: Users
    },
    {
      id: 'share',
      label: 'Chia sẻ bài viết',
      icon: PlusCircle,
      isSpecial: true
    },
    {
      id: 'customers',
      label: 'Khách hàng',
      icon: UserCircle
    },
    {
      id: 'account',
      label: 'Tài khoản',
      icon: Menu
    }
  ];

  const handleNavClick = (itemId: string) => {
    if (itemId === 'share') {
      // Open Facebook login
      window.open('https://www.facebook.com/login/', '_blank');
    } else {
      setActiveTab(itemId);
    }
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200">
      <div className="flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="flex items-center justify-center relative -mt-6 min-w-0"
              >
                <div className="w-[52px] h-[52px] bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </button>
            );
          }
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-1 min-w-0 transition-colors ${
                isActive ? 'text-black' : 'text-gray-400'
              }`}
            >
              <Icon className={`w-[22px] h-[22px] ${isActive ? 'text-black' : 'text-gray-400'}`} />
              <span className="text-[10px] leading-none whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
