import { useState, useEffect } from 'react';
import { ExternalLink, Copy, Check, Clock, Calendar } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner';

interface SharePost {
  id: string;
  postLink: string;
  groupCount: number;
  groups: Array<{ id: string; name: string; region?: string; province?: string }>;
  isFreeShare: boolean;
  createdAt: string;
}

export default function SharePostsPanel() {
  const [posts, setPosts] = useState<SharePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const result = await api.getSharePosts();
      setPosts(result.posts || []);
    } catch (err: any) {
      toast.error(err.message || 'Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLink = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async (link: string, postId: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(postId);
      toast.success('Đã sao chép link!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Không thể sao chép link');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="pt-4">
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="mb-0">Panel bài viết đã chia sẻ</h2>
        <button
          onClick={fetchPosts}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Làm mới
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">Chưa có bài viết nào được chia sẻ</p>
          <p className="text-sm text-gray-500">
            Các bài viết bạn chia sẻ sẽ hiển thị ở đây
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatDate(post.createdAt)}
                    </span>
                    {post.isFreeShare && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        Miễn phí
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Đã chia sẻ vào <span className="font-medium">{post.groupCount}</span> nhóm
                  </p>
                </div>
              </div>

              {/* Link */}
              <div className="bg-gray-50 rounded-xl p-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Link bài viết:</p>
                    <p className="text-sm text-blue-600 truncate font-medium">
                      {post.postLink}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenLink(post.postLink)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Mở link</span>
                </button>
                <button
                  onClick={() => handleCopyLink(post.postLink, post.id)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors flex items-center justify-center"
                >
                  {copiedId === post.id ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Groups list (optional - có thể ẩn nếu quá nhiều) */}
              {post.groups && post.groups.length > 0 && post.groups.length <= 5 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Các nhóm đã chia sẻ:</p>
                  <div className="flex flex-wrap gap-1">
                    {post.groups.map((group, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                      >
                        {group.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

