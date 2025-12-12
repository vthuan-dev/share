import { useState, useEffect } from 'react';
import { Users, ChevronRight, CheckCircle, Home } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Checkbox } from './ui/checkbox';
import checkImg from './public/check.png';

interface Group {
  id: string;
  name: string;
  region?: string;
  province?: string;
  members?: string;
  image?: string;
  verified?: boolean;
  local?: boolean;
}

interface RegionalGroupsListProps {
  selectedGroups?: string[];
  onGroupSelect?: (groupId: string, checked: boolean, meta?: { id: string; name?: string; region?: string; image?: string }) => void;
  selectionMode?: boolean;
}

export default function RegionalGroupsList({ selectedGroups = [], onGroupSelect, selectionMode = false }: RegionalGroupsListProps) {
  const [activeRegion, setActiveRegion] = useState<'north' | 'central' | 'south'>('north');
  const [backendGroups, setBackendGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  const regionLabelMap: Record<'north' | 'central' | 'south', string> = {
    north: 'Bắc',
    central: 'Trung',
    south: 'Nam'
  };

  const imageParams = 'auto=format&fit=crop&w=200&h=200&q=80';
  const groupImages = [
    `https://images.unsplash.com/photo-1560518883-ce09059eeffa?${imageParams}`,
    `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?${imageParams}`,
    `https://images.unsplash.com/photo-1582407947304-fd86f028f716?${imageParams}`,
    `https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?${imageParams}`,
    `https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?${imageParams}`,
    `https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?${imageParams}`,
    `https://images.unsplash.com/photo-1518780664697-55e3ad937233?${imageParams}`,
    `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?${imageParams}`,
    `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?${imageParams}`,
    `https://images.unsplash.com/photo-1460472178825-e5240623afd5?${imageParams}`,
    `https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?${imageParams}`,
    `https://images.unsplash.com/photo-1449844908441-8829872d2607?${imageParams}`,
    `https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?${imageParams}`,
    `https://images.unsplash.com/photo-1541888946425-d81bb19240f5?${imageParams}`,
    `https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?${imageParams}`,
    `https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?${imageParams}`,
    `https://images.unsplash.com/photo-1512917774080-9991f1c4c750?${imageParams}`,
    `https://images.unsplash.com/photo-1505691938895-1758d7feb511?${imageParams}`,
    `https://images.unsplash.com/photo-1497366754035-f200968a6e72?${imageParams}`,
    `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?${imageParams}`,
    `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?${imageParams}`,
    `https://images.unsplash.com/photo-1484154218962-a197022b5858?${imageParams}`,
    `https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?${imageParams}`,
    `https://images.unsplash.com/photo-1529429617124-aee0b0142c0f?${imageParams}`,
    // user-provided real estate images (fallback)
    'https://media.vneconomy.vn/images/upload/2022/11/16/56c99f14-2861-4dc2-ae06-3c04c8b22a63.jpg',
    'https://keenland.com.vn/wp-content/uploads/2024/10/loai-hinh-bat-dong-san-2-keenlandcomvn.jpg',
    'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2020/10/18/846390/Dau-Tu-Bat-Dong-San.jpg',
    'https://cdn.vietnambiz.vn/2019/8/7/1-15651645335071869680987.jpg',
    'https://i.pinimg.com/736x/63/f9/34/63f93438a3fae83d867938cb1adfef4f.jpg',
    'https://images.baodantoc.vn/uploads/2022/Th%C3%A1ng%201/Ng%C3%A0y_19/Nga/vincyty-1645.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg-9aXpZpMGOr7rQQcrm54iJYBAd33ZEmblw&s',
    'https://cdn.thuvienphapluat.vn/uploads/tintuc/2022/03/10/bat-dong-san-la-gi.jpg',
    'https://danviet.ex-cdn.com/files/f1/thumb_w/650/296231569849192448/2022/7/3/vang-16568301719341316800141.jpg',
    'https://i2-vnexpress.vnecdn.net/2024/10/24/dji-20241003102742-0086-d-enha-2745-2359-1729755550.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=bqrjdO10K0-HnjDoNVFg5g',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm7BAV2YbkmMPgwxp-XTNRv_PCzDKlu1n1mQ&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqxxnXzrqsTSxLDfOABAiUPxznMz4JblQpxg&s',
    'https://staticfile.batdongsan.com.vn/images/home/cities1/HCM-web-1.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShSQvXKF7o8tuwSBg1llEWhFGXF7Vkm6Jv9A&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4i6mXdJDM-7qS1EeGdwvW3ghbAtqGl4ZBwA&s',
    'https://media.thuonghieucongluan.vn/uploads/2019_02_08/bat-dong-san-1549590539.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPkbDQlH_XXS7GUSc9dv_sJCTJCLPWnPRRBQ&s',
    'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/5/27/bds-1685191751928452029801.jpg',
    'https://bcp.cdnchinhphu.vn/334894974524682240/2025/1/8/bds-cn-17054593951211988391423-2-17234297639371023957239-1-17363081602221347796039.jpg'
  ];
  const defaultImage = `https://images.unsplash.com/photo-1497366754035-f200968a6e72?${imageParams}`;

  const loadProvinces = async (regionKey: 'north' | 'central' | 'south') => {
    try {
      const region = regionLabelMap[regionKey];
      const res = await api.getProvinces(region);
      setProvinces(res || []);
      setSelectedProvince('');
    } catch (err: any) {
      toast.error('Không thể tải danh sách tỉnh');
      setProvinces([]);
    }
  };

  const loadGroups = async (regionKey: 'north' | 'central' | 'south', province?: string) => {
    try {
      setLoading(true);
      const region = regionLabelMap[regionKey];
      const data = await api.groups(region, province);
      const mappedData = data.map((g: any, index: number) => ({
        ...g,
        // Ưu tiên dùng ảnh từ backend, chỉ fallback khi không có hoặc không hợp lệ
        image: (g.image && g.image.includes('unsplash.com')) 
          ? g.image 
          : groupImages[index % groupImages.length] || defaultImage,
        verified: index % 3 === 0,
        local: index % 2 === 0
      }));
      setBackendGroups(mappedData);
    } catch (err: any) {
      toast.error('Không thể tải danh sách nhóm');
      setBackendGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProvinces(activeRegion);
    loadGroups(activeRegion);
  }, [activeRegion]);

  useEffect(() => {
    loadGroups(activeRegion, selectedProvince || undefined);
  }, [selectedProvince]);

  const regions = [
    { id: 'north' as const, label: 'Miền Bắc', color: 'bg-blue-600' },
    { id: 'central' as const, label: 'Miền Trung', color: 'bg-green-600' },
    { id: 'south' as const, label: 'Miền Nam', color: 'bg-orange-600' }
  ];

  if (loading) {
    return (
      <div className="mt-6 mb-6 text-center py-8">
        <div className="text-gray-500">Đang tải nhóm theo khu vực...</div>
      </div>
    );
  }

  return (
    <div className="mt-6 mb-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => setActiveRegion(region.id)}
            className={`flex-1 py-2.5 px-4 rounded-xl transition-all ${
              activeRegion === region.id
                ? `${region.color} text-white shadow-md`
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {region.label}
          </button>
        ))}
      </div>

      {/* Province filter */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Lọc theo tỉnh thành</span>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
          >
            <option value="">Tất cả tỉnh</option>
            {provinces.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Groups List */}
      <div className="space-y-2">
        {backendGroups.map((group, index) => {
          const groupId = String(group.id);
          const isSelected = selectedGroups.includes(groupId);
          const image = group.image || groupImages[index % groupImages.length];
          return (
          <div
            key={group.id}
            className={`bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${isSelected ? 'ring-2 ring-red-500 bg-red-50' : ''}`}
            onClick={() => {
              if (!selectionMode) return;
              onGroupSelect?.(groupId, !isSelected, { id: groupId, name: group.name, region: group.region, image: group.image });
            }}
            role={selectionMode ? 'button' : undefined}
            aria-pressed={selectionMode ? isSelected : undefined}
          >
            {selectionMode && (
              <>
                {isSelected ? (
                  <div className="w-5 h-5 rounded-full overflow-hidden border-2 border-green-500 flex-shrink-0 ring-2 ring-green-500 ring-offset-2 ring-offset-white">
                    <ImageWithFallback
                      src={checkImg}
                      alt={group.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <Checkbox
                    checked={false}
                    onCheckedChange={(checked: any) => {
                      const nextChecked = checked === true;
                      onGroupSelect?.(groupId, nextChecked, { id: groupId, name: group.name, region: group.region, image: group.image });
                    }}
                    className="flex-shrink-0"
                    onClick={(e: any) => e.stopPropagation()}
                  />
                )}
              </>
            )}
            {image ? (
              <div className="relative flex-shrink-0">
                <ImageWithFallback
                  src={image}
                  alt={group.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                {group.local && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Home className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="text-sm line-clamp-1">{group.name}</div>
                {group.verified && (
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                )}
              </div>
              <div className="text-xs text-gray-500">
                {group.province || ''}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </div>
        );})}
      </div>
    </div>
  );
}
