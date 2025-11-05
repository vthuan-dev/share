import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import logoImg from './public/image.png';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToRegister: () => void;
}

export default function Login({ onLogin, onNavigateToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-[430px] bg-white rounded-[32px] shadow-2xl p-8">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-[24px] mx-auto mb-4 overflow-hidden shadow">
            <img src={logoImg} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-gray-900 mb-2">Chào mừng trở lại</h1>
          <p className="text-gray-500">Đăng nhập để tiếp tục</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-gray-700 mb-2 block">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 rounded-xl border-gray-200"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700 mb-2 block">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-xl border-gray-200 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <button type="button" className="text-red-600 text-sm">
              Quên mật khẩu?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl"
          >
            Đăng nhập
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{' '}
            <button
              onClick={onNavigateToRegister}
              className="text-red-600"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
