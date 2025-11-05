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

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await api.groups();
        
        // Danh sách ảnh đại diện đẹp cho nhóm BĐS
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
          'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=120&h=120&fit=crop',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=120&h=120&fit=crop',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=120&h=120&fit=crop',
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=120&h=120&fit=crop',
        ];
        
        // Map với ảnh
        const mappedData = data.map((g: any, index: number) => ({
          ...g,
          image: groupImages[index % groupImages.length],
          verified: index % 3 === 0,
          local: index % 2 === 0
        }));
        
        setBackendGroups(mappedData);
      } catch (err: any) {
        toast.error('Không thể tải danh sách nhóm');
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, []);

  // Static groups với ảnh ngay từ đầu
  const staticImages = [
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
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=120&h=120&fit=crop',
  ];

  const groups: { [key: string]: Group[] } = {
    north: [
      { id: 's1', name: 'Mua Bán Bất Động Sản Hà Nội_Không Trung Gian', members: '125K thành viên', image: staticImages[0] },
      { id: 's2', name: 'Bất động sản Hà Nội', members: '98K thành viên', image: staticImages[1] },
      { id: 's3', name: 'Bất Động Sản Hà Nội', members: '87K thành viên', image: staticImages[2] },
      { id: 's4', name: 'Mua Bán Bất Động Sản HÀ NỘI ✅', members: '156K thành viên', image: staticImages[3], verified: true },
      { id: 's5', name: 'MUA BÁN BẤT ĐỘNG SẢN THỔ CƯ HÀ NỘI 🇻🇳', members: '76K thành viên', image: staticImages[4], local: true },
      { id: 's6', name: 'BẤT ĐỘNG SẢN HÀ NỘI ✅', members: '112K thành viên', image: staticImages[5], verified: true },
      { id: 's7', name: 'MUA BÁN BẤT ĐỘNG SẢN HÀ NỘI ✅', members: '134K thành viên', image: staticImages[6], verified: true, local: true },
      { id: 's8', name: 'BẤT ĐỘNG SẢN HÀ NỘI 🏘', members: '89K thành viên', image: staticImages[7] },
      { id: 's9', name: 'Bất động sản Hà Nội', members: '92K thành viên', image: staticImages[8] },
      { id: 's10', name: 'BẤT ĐỘNG SẢN - MUA BÁN NHÀ ĐẤT HÀ NỘI ✅', members: '145K thành viên', image: staticImages[9], verified: true },
      { id: 's11', name: 'Mua bán Bất Động Sản HÀ NỘI ✅', members: '103K thành viên', image: staticImages[10], verified: true },
      { id: 's12', name: 'BẤT ĐỘNG SẢN HÀ NỘI ✅', members: '118K thành viên', image: staticImages[11], verified: true }
    ],
    central: [
      { id: 'sc1', name: 'Bất Động Sản Đà Nẵng', members: '85K thành viên', image: staticImages[12] },
      { id: 'sc2', name: 'Nhà Đất Huế - Thừa Thiên Huế', members: '56K thành viên', image: staticImages[13], verified: true, local: true },
      { id: 'sc3', name: 'BĐS Quảng Nam - Hội An', members: '42K thành viên', image: staticImages[14] },
      { id: 'sc4', name: 'Mua Bán Bất Động Sản Đà Nẵng ✅', members: '67K thành viên', image: staticImages[15], verified: true, local: true },
      { id: 'sc5', name: 'BẤT ĐỘNG SẢN MIỀN TRUNG', members: '78K thành viên', image: staticImages[16] }
    ],
    south: [
      { id: 'ss1', name: 'Bất Động Sản TP.HCM', members: '234K thành viên', image: staticImages[17], verified: true },
      { id: 'ss2', name: 'Mua Bán Nhà Đất Sài Gòn', members: '189K thành viên', image: staticImages[18], local: true },
      { id: 'ss3', name: 'BẤT ĐỘNG SẢN VIỆT NAM ✅', members: '312K thành viên', image: staticImages[19], verified: true },
      { id: 'ss4', name: 'Nhà Đất Bình Dương - Đồng Nai', members: '145K thành viên', image: staticImages[20], verified: true, local: true },
      { id: 'ss5', name: 'BĐS ĐỒNG NAI - BIÊN HÒA', members: '98K thành viên', image: staticImages[21] },
      { id: 'ss6', name: 'Mua Bán BĐS Cần Thơ - ĐBSCL', members: '76K thành viên', image: staticImages[22] }
    ]
  };

  const regions = [
    { id: 'north' as const, label: 'Miền Bắc', color: 'bg-blue-600' },
    { id: 'central' as const, label: 'Miền Trung', color: 'bg-green-600' },
    { id: 'south' as const, label: 'Miền Nam', color: 'bg-orange-600' }
  ];

  // Merge backend groups with static groups
  const allGroups: { [key: string]: Group[] } = {
    north: [...groups.north],
    central: [...groups.central],
    south: [...groups.south]
  };

  // Add backend groups to their regions với ảnh
  backendGroups.forEach((g: any) => {
    const region = g.region?.toLowerCase();
    const groupWithMembers = { 
      ...g, 
      members: g.members || '100K thành viên'
    };
    
    if (region === 'north' || region === 'miền bắc' || region === 'bắc') {
      allGroups.north.push(groupWithMembers);
    } else if (region === 'central' || region === 'miền trung' || region === 'trung') {
      allGroups.central.push(groupWithMembers);
    } else if (region === 'south' || region === 'miền nam' || region === 'nam') {
      allGroups.south.push(groupWithMembers);
    }
  });

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

      {/* Groups List */}
      <div className="space-y-2">
        {allGroups[activeRegion].map((group) => {
          const groupId = String(group.id);
          const isSelected = selectedGroups.includes(groupId);
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
            {group.image ? (
              <div className="relative flex-shrink-0">
                <ImageWithFallback
                  src={group.image}
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
              <div className="text-xs text-gray-500">{group.members}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </div>
        );})}
      </div>
    </div>
  );
}
