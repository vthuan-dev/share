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

  const welcomeText = "Chào mừng bạn đến với website share bài viết lên hội nhóm face do batdongsan.com";
  const words = welcomeText.split(' ');
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += 4) {
    lines.push(words.slice(i, i + 4).join(' '));
  }

  return (
    <div className="bg-red-600 text-white px-4 pt-4 pb-32">
      {/* Logo */}
      <div className="mb-4">
        <div className="w-16 h-16 rounded-[16px] overflow-hidden shadow-lg bg-white">
          <img src={logoImg} alt="Logo" className="w-full h-full object-cover" />
        </div>
      </div>
      
      {/* Layout 2 cột: Trái - Avatar/Greeting, Phải - Dòng chào mừng */}
      <div className="flex gap-4 items-start">
        {/* Cột trái: Avatar và Greeting */}
        <div className="flex-1">
          <div className="flex items-center mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-14 h-14">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Avatar" />
                <AvatarFallback>{getInitials(userName)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-sm">{getGreeting()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{userName}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Thông điệp chào mừng */}
        <div className="flex-1">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="text-right space-y-1">
              {lines.map((line, index) => (
                <p key={index} className="text-white text-xs leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
