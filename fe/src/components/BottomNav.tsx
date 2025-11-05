import { useMemo, useState } from 'react';
import { Home, Users, UserCircle, Menu } from 'lucide-react';
import FacebookShareSheet from './FacebookShareSheet';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedGroups?: string[];
  selectedGroupMeta?: Record<string, { id: string; name?: string; region?: string; image?: string }>;
  currentUserName?: string;
}

// Facebook icon component
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function BottomNav({ activeTab, setActiveTab, selectedGroups = [], selectedGroupMeta = {}, currentUserName }: BottomNavProps) {
  const [isFbSheetOpen, setIsFbSheetOpen] = useState(false);
  const selectedGroupObjects = useMemo(() => selectedGroups.map((id) => (selectedGroupMeta[id] ? selectedGroupMeta[id] : { id, name: id })), [selectedGroups, selectedGroupMeta]);
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
      icon: FacebookIcon,
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
      // Open in-app Facebook share/login UI
      setIsFbSheetOpen(true);
    } else {
      setActiveTab(itemId);
    }
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200">
      {/* Facebook Share/Login Sheet */}
      <FacebookShareSheet
        open={isFbSheetOpen}
        onOpenChange={setIsFbSheetOpen}
        selectedGroups={selectedGroupObjects}
        currentUserName={currentUserName}
      />

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
