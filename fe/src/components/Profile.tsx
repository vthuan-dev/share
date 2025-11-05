import { useState } from 'react';
import { ChevronLeft, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ProfileProps {
  onBack: () => void;
  onNavigateHome: () => void;
  userName: string;
}

export default function Profile({ onBack, onNavigateHome, userName }: ProfileProps) {
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState('phong@email.com');
  const [phone, setPhone] = useState('0987654321');

  const handleSave = () => {
    alert('Đã lưu thông tin!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-red-600 text-white px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 -ml-2">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-white">Thông tin cá nhân</h1>
            </div>
            <button onClick={onNavigateHome} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6 -mt-4 bg-white rounded-t-[32px]">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Avatar" />
                <AvatarFallback>PV</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="mt-3 text-gray-500 text-sm">Thay đổi ảnh đại diện</p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-gray-700 mb-2 block">Họ và tên</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 rounded-xl border-gray-200"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 mb-2 block">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-xl border-gray-200"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-700 mb-2 block">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-12 rounded-xl border-gray-200"
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-gray-700 mb-2 block">Địa chỉ</Label>
              <Input
                id="address"
                type="text"
                placeholder="Nhập địa chỉ của bạn"
                className="w-full h-12 rounded-xl border-gray-200"
              />
            </div>

            <Button
              onClick={handleSave}
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl mt-6"
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
