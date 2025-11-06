import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import logoImg from './public/image.png';

interface RegisterProps {
  onRegister: (name: string, email: string, password: string) => void;
  onNavigateToLogin: () => void;
}

export default function Register({ onRegister, onNavigateToLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Keep a snapshot of credentials until payment is confirmed
  const [pendingName, setPendingName] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingPassword, setPendingPassword] = useState('');

  // Payment config
  const bankCode = 'vib';
  const accountNumber = '081409781';
  const accountName = 'PHAN NGOC CHUNG';
  const amount = 200000; // VND

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    // Defer actual registration until payment is confirmed
    setPendingName(name);
    setPendingEmail(email);
    setPendingPassword(password);
    setShowPayment(true);
  };

  const handleConfirmPaid = () => {
    setShowPayment(false);
    onRegister(pendingName, pendingEmail, pendingPassword);
  };

  const paymentNote = `GOI DANG KY WEB SHARE ${(pendingEmail || email) || ''}`.trim();
  const qrSrc = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-print.png?amount=${amount}&addInfo=${encodeURIComponent(paymentNote)}&accountName=${encodeURIComponent(accountName)}`;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-[430px] bg-white rounded-[32px] shadow-2xl p-8 relative">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-[24px] mx-auto mb-4 overflow-hidden shadow">
            <img src={logoImg} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-gray-900 mb-2">Tạo tài khoản mới</h1>
          <p className="text-gray-500">Đăng ký để bắt đầu</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name" className="text-gray-700 mb-2 block">Họ và tên</Label>
            <Input
              id="name"
              type="text"
              placeholder=""
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 rounded-xl border-gray-200"
              required
            />
          </div>

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

          <div>
            <Label htmlFor="confirmPassword" className="text-gray-700 mb-2 block">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 rounded-xl border-gray-200 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl"
          >
            Đăng ký
          </Button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Đã có tài khoản?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-red-600"
            >
              Đăng nhập
            </button>
          </p>
        </div>
        
        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-[430px] rounded-[32px] shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative px-6 py-4 bg-red-600 shadow-lg" style={{backgroundColor: '#dc2626'}}>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-base font-bold leading-tight flex-1 tracking-wide" style={{color: '#ffffff'}}>
                    Gói đăng ký sử dụng web share bài viết
                  </h2>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="text-2xl leading-none font-light flex-shrink-0 transition-opacity hover:opacity-80"
                    style={{color: '#ffffff'}}
                  >
                    ×
                  </button>
                </div>
                {/* Decorative bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-800" style={{backgroundColor: '#991b1b'}}></div>
              </div>
              <div className="px-6 py-5 space-y-5 bg-white rounded-b-[32px]">
                {/* QR image (VietQR dynamic) - All info included in QR */}
                <div className="rounded-3xl overflow-hidden bg-white p-4 shadow-md border border-gray-100">
                  <img
                    src={qrSrc}
                    alt="QR thanh toán"
                    className="w-full h-auto"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-1 pb-4">
                  <Button
                    type="button"
                    className="flex-1 h-11 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-full"
                    onClick={() => setShowPayment(false)}
                  >
                    Để sau
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white rounded-full shadow"
                    onClick={handleConfirmPaid}
                  >
                    Tôi đã chuyển khoản
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
