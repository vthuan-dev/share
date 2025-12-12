   import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, Users, Link2, ExternalLink, Copy, Check, Calendar, Filter, CreditCard } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { api } from '../utils/api';
import { toast } from 'sonner';

interface User {
  _id: string;
  name: string;
  email: string;
  isApproved: boolean;
  role: string;
  createdAt: string;
  balance: number;
}

interface SharePost {
  id: string;
  postLink: string;
  groupCount: number;
  groups: Array<{ id: string; name?: string; region?: string; province?: string }>;
  isFreeShare: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [sharePosts, setSharePosts] = useState<SharePost[]>([]);
  const [allSharePosts, setAllSharePosts] = useState<SharePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending'>('pending');
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'subscriptions'>('users');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('all');
  const [subscriptionRequests, setSubscriptionRequests] = useState<any[]>([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'posts') {
      fetchSharePosts();
      // Load users list when switching to posts tab to populate filter dropdown
      if (allUsers.length === 0) {
        fetchUsersForFilter();
      }
    } else if (activeTab === 'subscriptions') {
      fetchSubscriptionRequests();
    }
  }, [filter, activeTab]);

  useEffect(() => {
    // Filter share posts when user selection changes
    if (selectedUserId === 'all') {
      setSharePosts(allSharePosts);
    } else {
      setSharePosts(allSharePosts.filter(post => post.user?.id === selectedUserId));
    }
  }, [selectedUserId, allSharePosts]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Luôn lấy tất cả users để tính toán thống kê chính xác
      const allData = await api.getAllUsers();
      setAllUsers(allData);
      
      // Hiển thị theo filter
      const displayData = filter === 'pending' 
        ? allData.filter((u: User) => !u.isApproved)
        : allData;
      setUsers(displayData);
    } catch (err: any) {
      toast.error(err.message || 'Không thể tải danh sách users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      await api.approveUser(userId);
      toast.success('Đã phê duyệt user thành công!');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Không thể phê duyệt user');
    }
  };

  const handleReject = async (userId: string) => {
    if (!confirm('Bạn có chắc muốn từ chối và xóa user này?')) return;
    
    try {
      await api.rejectUser(userId);
      toast.success('Đã từ chối và xóa user');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Không thể xóa user');
    }
  };

  const fetchUsersForFilter = async () => {
    try {
      const allData = await api.getAllUsers();
      setAllUsers(allData);
    } catch (err: any) {
      // Silent fail, just don't show filter
    }
  };

  const fetchSharePosts = async () => {
    try {
      setPostsLoading(true);
      const result = await api.getAllSharePosts();
      const posts = result.posts || [];
      setAllSharePosts(posts);
      // Apply current filter
      if (selectedUserId === 'all') {
        setSharePosts(posts);
      } else {
        setSharePosts(posts.filter((post: SharePost) => post.user?.id === selectedUserId));
      }
    } catch (err: any) {
      toast.error(err.message || 'Không thể tải danh sách bài viết');
    } finally {
      setPostsLoading(false);
    }
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

  const handleOpenLink = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const fetchSubscriptionRequests = async () => {
    try {
      setSubscriptionsLoading(true);
      const result = await api.getPendingSubscriptionRequests();
      setSubscriptionRequests(result.requests || []);
    } catch (err: any) {
      toast.error(err.message || 'Không thể tải danh sách yêu cầu đăng ký');
    } finally {
      setSubscriptionsLoading(false);
    }
  };

  const handleApproveSubscription = async (requestId: string) => {
    try {
      await api.approveSubscriptionRequest(requestId);
      toast.success('Đã xác nhận đăng ký gói thành công!');
      fetchSubscriptionRequests();
    } catch (err: any) {
      toast.error(err.message || 'Không thể xác nhận đăng ký gói');
    }
  };

  const handleRejectSubscription = async (requestId: string) => {
    if (!confirm('Bạn có chắc muốn từ chối yêu cầu đăng ký này?')) return;
    
    try {
      await api.rejectSubscriptionRequest(requestId);
      toast.success('Đã từ chối yêu cầu đăng ký');
      fetchSubscriptionRequests();
    } catch (err: any) {
      toast.error(err.message || 'Không thể từ chối yêu cầu');
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

  const formatPrice = (price: number) => {
    return `${(price / 1000).toFixed(0)}k`;
  };

  // Tính toán thống kê từ tất cả users, không phụ thuộc vào filter
  const pendingCount = allUsers.filter((u: User) => !u.isApproved).length;
  const approvedCount = allUsers.filter((u: User) => u.isApproved).length;
  const totalUsers = allUsers.length;

  return (
    <AdminLayout userName="Admin">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Tổng số
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalUsers}</h3>
          <p className="text-sm text-gray-600">Người dùng</p>
        </div>

        {/* Pending Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
              Chờ duyệt
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{pendingCount}</h3>
          <p className="text-sm text-gray-600">Đang chờ</p>
        </div>

        {/* Approved Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
              Đã duyệt
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{approvedCount}</h3>
          <p className="text-sm text-gray-600">Đã kích hoạt</p>
        </div>

        {/* Approval Rate */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Tỷ lệ
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {totalUsers > 0 ? Math.round((approvedCount / totalUsers) * 100) : 0}%
          </h3>
          <p className="text-sm text-gray-600">Đã phê duyệt</p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-4 rounded-2xl font-semibold transition-all text-lg ${
            activeTab === 'users'
              ? 'bg-red-600 text-white shadow-lg shadow-red-200'
              : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
          }`}
        >
          <Users className="w-5 h-5 inline-block mr-2" />
          Người dùng
        </button>
        <button
          onClick={() => {
            setActiveTab('posts');
            setSelectedUserId('all'); // Reset filter when switching to posts tab
          }}
          className={`flex-1 py-4 rounded-2xl font-semibold transition-all text-lg ${
            activeTab === 'posts'
              ? 'bg-red-600 text-white shadow-lg shadow-red-200'
              : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
          }`}
        >
          <Link2 className="w-5 h-5 inline-block mr-2" />
          Bài viết ({allSharePosts.length})
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`flex-1 py-4 rounded-2xl font-semibold transition-all text-lg ${
            activeTab === 'subscriptions'
              ? 'bg-red-600 text-white shadow-lg shadow-red-200'
              : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
          }`}
        >
          <CreditCard className="w-5 h-5 inline-block mr-2" />
          Đăng ký gói ({subscriptionRequests.length})
        </button>
      </div>

      {/* Filter Tabs - Only show for users tab */}
      {activeTab === 'users' && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 py-4 rounded-2xl font-semibold transition-all text-lg ${
              filter === 'pending'
                ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <Clock className="w-5 h-5 inline-block mr-2" />
            Chờ duyệt ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-4 rounded-2xl font-semibold transition-all text-lg ${
              filter === 'all'
                ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <Users className="w-5 h-5 inline-block mr-2" />
            Tất cả ({totalUsers})
          </button>
        </div>
      )}

      {/* User Filter - Only show for posts tab */}
      {activeTab === 'posts' && (
        <div className="mb-6">
          <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Lọc theo người dùng:</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-colors bg-white text-gray-900 font-medium"
              >
                <option value="all">Tất cả người dùng</option>
                {allUsers
                  .filter(user => allSharePosts.some((post: SharePost) => post.user?.id === user._id))
                  .map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {activeTab === 'users' ? (
          /* User List */
          loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">
              {filter === 'pending' ? 'Không có user nào chờ duyệt' : 'Không có user nào'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user._id}
                className={`bg-gray-50 rounded-2xl p-4 shadow-sm border-2 ${
                  user.isApproved ? 'border-green-200' : 'border-yellow-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      {user.role === 'admin' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Đăng ký: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    {user.isApproved ? (
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Đã duyệt
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Chờ duyệt
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {!user.isApproved && (
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => handleApprove(user._id)}
                      className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm border-2 border-green-200"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Phê duyệt</span>
                    </button>
                    <button
                      onClick={() => handleReject(user._id)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm border-2 border-red-200"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Từ chối</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
        ) : activeTab === 'posts' ? (
          /* Share Posts List */
          postsLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          ) : sharePosts.length === 0 ? (
            <div className="text-center py-12">
              <Link2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">
                {selectedUserId === 'all' 
                  ? 'Chưa có bài viết nào được chia sẻ'
                  : 'Không có bài viết nào của người dùng này'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sharePosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-50 rounded-2xl p-4 shadow-sm border-2 border-gray-200 hover:border-red-200 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {post.user && (
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                          <span className="text-xs text-gray-500">({post.user.email})</span>
                        </div>
                      )}
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
                  <div className="bg-white rounded-xl p-3 mb-3 border border-gray-200">
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
                            {group.name || group.id}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          /* Subscription Requests List */
          subscriptionsLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          ) : subscriptionRequests.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Không có yêu cầu đăng ký nào chờ xác nhận</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptionRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-gray-50 rounded-2xl p-4 shadow-sm border-2 border-yellow-200 hover:border-yellow-300 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {request.user && (
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{request.user.name}</h3>
                          <span className="text-xs text-gray-500">({request.user.email})</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {formatDate(request.createdAt)}
                        </span>
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                          Chờ xác nhận
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Plan Info */}
                  <div className="bg-white rounded-xl p-3 mb-3 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Gói đăng ký:</span>
                      <span className="font-bold text-gray-900">{request.planName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Số tiền:</span>
                      <span className="text-xl font-bold text-red-600">{formatPrice(request.price)}</span>
                    </div>
                    {request.paymentNote && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Nội dung chuyển khoản:</p>
                        <p className="text-sm text-gray-700 font-medium">{request.paymentNote}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApproveSubscription(request.id)}
                      className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm border-2 border-green-200"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Xác nhận</span>
                    </button>
                    <button
                      onClick={() => handleRejectSubscription(request.id)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm border-2 border-red-200"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Từ chối</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </AdminLayout>
  );
}
