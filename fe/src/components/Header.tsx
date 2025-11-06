import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ChevronRight } from 'lucide-react';
import logoImg from './public/image.png';

interface HeaderProps {
  userName?: string;
}

export default function Header({ userName = 'Phạm Văn Phong' }: HeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng ☀️';
    if (hour < 18) return 'Chào buổi chiều 🌤️';
    return 'Chào buổi tối 🌙';
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  const welcomeText = "Chào mừng bạn đến với website share bài viết lên các hội nhóm facebook do batdongsan.com";

  return (
    <div className="bg-red-600 text-white px-4 pt-4 pb-32">
      {/* Hàng 1: Logo và Avatar/Greeting cùng dòng */}
      <div className="flex items-center justify-between mb-3">
        {/* Logo */}
        <div className="w-16 h-16 rounded-[16px] overflow-hidden shadow-lg bg-white">
          <img src={logoImg} alt="Logo" className="w-full h-full object-cover" />
        </div>
        
        {/* Avatar và Greeting */}
        <div className="flex items-center gap-3">
          <Avatar className="w-14 h-14">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Avatar" />
            <AvatarFallback>{getInitials(userName)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-sm font-medium tracking-tight">{getGreeting()}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-base tracking-tight">{userName}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Hàng 2: Thông điệp chào mừng - xuống dưới 1-2 dòng */}
      <div className="mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-white text-[13px] leading-[1.5] font-normal tracking-normal text-center text-justify">
              {welcomeText}
            </p>
          </div>
      </div>
    </div>
  );
}
