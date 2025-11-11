import { useState, useEffect, useMemo } from 'react';
import { X, Eye, EyeOff, Check, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { api } from '../utils/api';
import { toast } from 'sonner';

interface FacebookShareSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Có thể nhận mảng id hoặc mảng đối tượng nhóm tối thiểu có id
  selectedGroups: Array<{ id: string; name?: string; region?: string; image?: string }> | string[];
  currentUserName?: string;
  onShareSuccess?: () => void; // Callback khi share thành công để quay về trang chủ
}

export default function FacebookShareSheet({ open, onOpenChange, selectedGroups, currentUserName, onShareSuccess }: FacebookShareSheetProps) {
  const [step, setStep] = useState<'login' | 'share'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shareGroups, setShareGroups] = useState<Array<{ id: string; name: string; region?: string; image?: string }>>([]);

  // Chuẩn hoá danh sách id
  const selectedIds = useMemo(
    () => (Array.isArray(selectedGroups)
      ? (typeof (selectedGroups as any[])[0] === 'string'
          ? (selectedGroups as string[])
          : (selectedGroups as any[]).map(g => g.id))
      : []),
    [selectedGroups]
  );

  // Tải thông tin nhóm để hiển thị tên + ảnh khi mở sheet
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        // Nếu đã truyền sẵn name/image thì dùng luôn
        const prefilled = Array.isArray(selectedGroups) && typeof (selectedGroups as any[])[0] !== 'string'
          ? (selectedGroups as any[]).filter((g) => g && g.id)
          : [];

        if (prefilled.length > 0) {
          const normalized = prefilled.map((g: any) => ({
            id: String(g.id),
            name: g.name || String(g.id),
            region: g.region,
            image: g.image,
          }));
          if (!cancelled) setShareGroups(normalized);
          return;
        }

        // Nếu chỉ có id: gọi API lấy danh sách, map theo id và thêm ảnh minh hoạ ổn định
        const data = await api.groups();
        const groupImages = [
          'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=120&h=120&fit=crop',
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&h=120&fit=crop',
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=120&h=120&fit=crop',
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&h=120&fit=crop',
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=120&h=120&fit=crop',
          'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=120&h=120&fit=crop',
          'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=120&h=120&fit=crop',
          'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=120&h=120&fit=crop',
          'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=120&h=120&fit=crop',
          'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=120&h=120&fit=crop',
        ];
        const mapById: Record<string, any> = {};
        data.forEach((g: any, idx: number) => {
          mapById[String(g.id)] = { id: String(g.id), name: g.name, region: g.region, image: groupImages[idx % groupImages.length] };
        });
        const finalGroups = selectedIds.map((id) => mapById[String(id)] || { id: String(id), name: String(id) });
        if (!cancelled) setShareGroups(finalGroups);
      } catch {
        const fallback = selectedIds.map((id) => ({ id: String(id), name: String(id) }));
        if (!cancelled) setShareGroups(fallback);
      }
    })();
    return () => { cancelled = true; };
  }, [open, selectedGroups, selectedIds]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      setTimeout(() => {
        setStep('share');
        setIsLoading(false);
      }, 3000);
    }
  };

  const handleShare = async () => {
    if (!postContent.trim()) {
      toast.error('Vui lòng nhập nội dung bài viết');
      return;
    }

    if (shareGroups.length === 0) {
      toast.error('Vui lòng chọn ít nhất một nhóm để chia sẻ');
      return;
    }

    // Hiển thị toast đang share
    const toastId = toast.loading('Đang chia sẻ bài viết...', {
      description: `Đang gửi bài viết lên ${shareGroups.length} nhóm`,
    });

    try {
      // Giả lập quá trình share (2-3 giây)
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Cập nhật shareCount vào database
      await api.incrementShareCount(shareGroups.length);

      // Đóng toast loading
      toast.dismiss(toastId);

      // Hiển thị toast thành công
      toast.success(`Đã chia sẻ thành công lên ${shareGroups.length} nhóm!`, {
        description: 'Bài viết của bạn đã được đăng lên các nhóm Facebook',
        duration: 3000,
      });

      // Đóng modal và reset state
      onOpenChange(false);

      // Reset form sau khi đóng
      setTimeout(() => {
        setStep('login');
        setEmail('');
        setPassword('');
        setPostContent('');
        setIsLoading(false);
      }, 300);

      // Quay về trang chủ sau 1 giây
      setTimeout(() => {
        if (onShareSuccess) {
          onShareSuccess();
        }
      }, 1000);
    } catch (error) {
      // Đóng toast loading
      toast.dismiss(toastId);

      // Hiển thị lỗi
      toast.error('Có lỗi xảy ra khi chia sẻ bài viết');
      console.error('Share error:', error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep('login');
      setEmail('');
      setPassword('');
      setPostContent('');
      setIsLoading(false);
    }, 300);
  };

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-300"
        onClick={handleClose}
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      />
      
      {/* Drawer Content */}
      <div 
        className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] flex flex-col bg-white rounded-t-2xl border-t max-w-[430px] mx-auto"
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* Screen reader titles */}
        <span className="sr-only">
          {step === 'login' ? 'Đăng nhập Facebook' : 'Tạo bài viết Facebook'}
        </span>
        <span className="sr-only">
          {step === 'login' ? 'Nhập thông tin đăng nhập Facebook của bạn' : 'Tạo và chia sẻ bài viết lên các nhóm Facebook đã chọn'}
        </span>

        {/* Handle bar */}
        <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-gray-300" />

        {step === 'login' ? (
          // Facebook Login Screen
          <div className="bg-white flex-1 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
              <div className="w-8" />
              <h2 className="text-base font-medium text-gray-900">Đăng nhập Facebook</h2>
              <button 
                onClick={handleClose} 
                className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
                type="button"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 py-8 overflow-y-auto flex-1">
              {/* Facebook Logo */}
              <div className="flex justify-center mb-6">
                <svg className="w-16 h-16" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="#1877f2"/>
                  <path d="M29.5 15.5H26.5C25.4 15.5 24.5 16.4 24.5 17.5V20.5H29.5L28.8 25.5H24.5V37.5H19.5V25.5H15.5V20.5H19.5V17.5C19.5 14.2 22.2 11.5 25.5 11.5H29.5V15.5Z" fill="white"/>
                </svg>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Email hoặc số điện thoại"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 rounded-lg border border-gray-300 bg-gray-50 px-4 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1877f2] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 rounded-lg border border-gray-300 bg-gray-50 px-4 pr-12 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1877f2] focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-lg font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang đăng nhập...
                    </span>
                  ) : (
                    'Đăng nhập'
                  )}
                </button>

                <div className="text-center">
                  <a href="#" className="text-[#1877f2] text-sm hover:underline">
                    Quên mật khẩu?
                  </a>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">HOẶC</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full h-12 border-2 border-[#1877f2] text-[#1877f2] hover:bg-[#1877f2] hover:text-white rounded-lg font-medium transition-all inline-flex items-center justify-center"
                >
                  Tạo tài khoản mới
                </button>
              </form>

              <div className="mt-8 text-center text-xs text-gray-500">
                <p>Tiếng Việt · English (US) · 中文(台灣)</p>
                <p className="mt-4">Meta © 2025</p>
              </div>
            </div>
          </div>
        ) : (
          // Share to Groups Screen
          <div className="bg-white flex-1 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10 flex-shrink-0">
              <button 
                onClick={handleClose} 
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                type="button"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-base font-medium text-gray-900">Tạo bài viết</h2>
              <button
                onClick={handleShare}
                disabled={!postContent}
                className="h-9 px-6 bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-lg font-medium transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed inline-flex items-center justify-center text-sm"
                type="button"
              >
                Đăng
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1">
              {/* User Info */}
              <div className="px-4 py-3 border-b">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-900">{currentUserName || 'Facebook User'}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="px-2 py-0.5 bg-gray-200 rounded text-xs text-gray-700 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                        </svg>
                        Công khai
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <textarea
                  placeholder="Bạn đang nghĩ gì?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full min-h-[120px] text-base text-gray-900 placeholder-gray-400 resize-none focus:outline-none"
                />
              </div>

              {/* Share to Groups */}
              <div className="px-4 py-3 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium text-gray-900">Chia sẻ đến nhóm</h3>
                  <span className="text-sm text-[#1877f2] font-medium">{selectedGroups.length} nhóm</span>
                </div>

                <div className="space-y-2">
                  {selectedIds.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-sm">Chưa chọn nhóm nào</p>
                      <p className="text-xs mt-1">Vui lòng chọn nhóm trước khi chia sẻ</p>
                    </div>
                  ) : (
                    shareGroups.map((group) => (
                      <div key={group.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#1877f2]">
                          {group.image ? (
                            <ImageWithFallback src={group.image} alt={group.name} className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-6 h-6 text-white m-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium text-gray-900 truncate">{group.name}</p>
                          {group.region && <p className="text-xs text-gray-500">{group.region}</p>}
                        </div>
                        <Check className="w-5 h-5 text-[#1877f2] flex-shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add to post options */}
              <div className="px-4 py-3 border-t">
                <p className="text-sm text-gray-600 mb-3 font-medium">Thêm vào bài viết</p>
                <div className="flex items-center gap-2">
                  <button type="button" className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button type="button" className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button type="button" className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button type="button" className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
