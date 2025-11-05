import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ChevronRight } from 'lucide-react';

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

  return (
    <div className="bg-red-600 text-white px-4 pt-4 pb-32">
      {/* Top section with avatar and name */}
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
  );
}
