import { useEffect, useState } from 'react';
import { CheckCircle, Home } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { Checkbox } from './ui/checkbox';

interface Group {
  id: string;
  name: string;
  region?: string;
  image?: string;
  status?: string;
  verified?: boolean;
  local?: boolean;
}

interface GroupsListProps {
  selectedGroups?: string[];
  onGroupSelect?: (groupId: string, checked: boolean) => void;
  selectionMode?: boolean;
}

export default function GroupsList({ selectedGroups = [], onGroupSelect, selectionMode = false }: GroupsListProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await api.groups();
        
        // Danh sách ảnh đại diện đẹp cho nhóm BĐS
        const groupImages = [
          'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=120&h=120&fit=crop', // Modern buildings
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&h=120&fit=crop', // City skyline
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=120&h=120&fit=crop', // Modern house
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&h=120&fit=crop', // Glass building
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=120&h=120&fit=crop', // Dubai skyline
          'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=120&h=120&fit=crop', // Modern architecture
          'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=120&h=120&fit=crop', // Aerial city
          'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=120&h=120&fit=crop', // City night
          'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=120&h=120&fit=crop', // Buildings
          'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=120&h=120&fit=crop', // Luxury house
          'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=120&h=120&fit=crop', // Villa
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=120&h=120&fit=crop', // Modern interior
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=120&h=120&fit=crop', // Apartment
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=120&h=120&fit=crop', // House exterior
        ];
        
        // Map backend data to frontend format
        const mappedGroups = data.map((g: any, index: number) => ({
          id: g.id,
          name: g.name,
          region: g.region,
          image: groupImages[index % groupImages.length],
          status: 'Hơn 25 bài viết mới',
          verified: index % 3 === 0,
          local: index % 2 === 0
        }));
        setGroups(mappedGroups);
      } catch (err: any) {
        toast.error('Không thể tải danh sách nhóm');
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Đang tải nhóm...</div>
      </div>
    );
  }

  const staticGroups: Group[] = [
    {
      id: '1',
      name: 'Mua Bán Bất Động Sản Hà Nội_Không Trung Gian',
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=60&h=60&fit=crop',
      status: 'Hơn 25 bài viết mới',
      verified: false,
      local: true
    },
    {
      id: '2',
      name: 'Bất động sản Hà Nội',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=60&h=60&fit=crop',
      status: 'Hơn 25 bài viết mới',
      verified: false,
      local: false
    },
    {
      id: '3',
      name: 'Bất Động Sản Hà Nội',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=60&h=60&fit=crop',
      status: 'Hơn 25 bài viết mới',
      verified: false,
      local: false
    },
    {
      id: '4',
      name: 'Mua Bán Bất Động Sản Hà NỘI',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=60&h=60&fit=crop',
      status: 'Hơn 25 bài viết mới',
      verified: true,
      local: true
    },
    {
      id: '5',
      name: 'MUA BÁN BẤT ĐỘNG SẢN THỔ CƯ HÀ NỘI',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=60&h=60&fit=crop',
      status: 'Hơn 25 bài viết mới',
      verified: false,
      local: true
    },
    {
      id: '6',
      name: 'BẤT ĐỘNG SẢN HÀ NỘI',
      image: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=60&h=60&fit=crop',
      status: 'Hơn 25 bài viết mới',
      verified: true,
      local: false
    },
    {
      id: '7',
      name: 'MUA BÁN BẤT ĐỘNG SẢN HÀ NỘI',
      image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=60&h=60&fit=crop',
      status: 'Hơn 25 bài viết mới',
      verified: true,
      local: true
    },
    {
      id: '8',
      name: 'BẤT ĐỘNG SẢN HÀ NỘI 🏘️',
      image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=60&h=60&fit=crop',
      status: 'Hơn 25 bài viết mới',
      verified: false,
      local: false
    },
    {
      id: '9',
      name: 'Bất động sản Hà Nội',
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=60&h=60&fit=crop',
      status: 'Hơn 25 bài viết mới',
      verified: false,
      local: false
    },
    {
      id: '10',
      name: 'BẤT ĐỘNG SẢN - MUA BÁN NHÀ ĐẤT HÀ NỘI',
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=60&h=60&fit=crop',
      status: 'Hơn 25 bài viết mới',
      verified: true,
      local: true
    }
  ];

  const displayGroups = groups.length > 0 ? groups : staticGroups;

  return (
    <div className="space-y-3 pb-4">
      {displayGroups.map((group) => {
        const groupId = String(group.id);
        const isSelected = selectedGroups.includes(groupId);
        
        return (
          <div
            key={group.id}
            className={`bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-all ${
              isSelected ? 'ring-2 ring-red-500 bg-red-50' : ''
            }`}
          >
            {selectionMode && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked: any) => {
                  const nextChecked = checked === true; // normalize from boolean | 'indeterminate'
                  onGroupSelect?.(groupId, nextChecked);
                }}
                className="flex-shrink-0"
              />
            )}
            
            <div className="relative flex-shrink-0">
              <ImageWithFallback
                src={group.image}
                alt={group.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
              {group.local && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Home className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="truncate">{group.name}</h3>
                {group.verified && (
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                <span className={isSelected ? 'text-green-600' : 'text-blue-600'}>{group.status}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
