import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Flame, FileText, Lightbulb, Eye, Users, MoreHorizontal } from 'lucide-react';
import { Badge } from './ui/badge';

export default function InfoTabs() {
  return (
    <div className="mt-6">
      <h2 className="mb-3">Thông tin dành riêng cho bạn</h2>
      
      <Tabs defaultValue="important" className="w-full">
        <TabsList className="w-full bg-gray-100 rounded-2xl p-1 h-auto">
          <TabsTrigger value="important" className="flex-1 rounded-xl data-[state=active]:bg-black data-[state=active]:text-white">
            <Flame className="w-4 h-4 mr-1" />
            Quan trọng
          </TabsTrigger>
          <TabsTrigger value="info" className="flex-1 rounded-xl data-[state=active]:bg-white">
            <FileText className="w-4 h-4 mr-1" />
            Thông tin
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex-1 rounded-xl data-[state=active]:bg-white">
            <Lightbulb className="w-4 h-4 mr-1" />
            Gợi ý
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="important" className="mt-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-600" />
                <span>Quan trọng</span>
              </div>
              <Badge variant="destructive" className="rounded-full">2</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span>Tin đăng</span>
                <span>09/10/2025</span>
              </div>
              
              <h3 className="text-lg">2 bài viết cần tương tác lại</h3>
              
              <p className="text-sm text-gray-600">
                Tin đăng của bạn sẽ hết hạn trong vòng 1 ngày nữa. Bạn đã sẵn sàng đăng chưa?
              </p>
              
              <div className="flex items-center gap-6 pt-3">
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span>255</span>
                  <span className="text-gray-500">Lượt xem tin</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-gray-400" />
                <span>11</span>
                <span className="text-gray-500">Khách hàng quan tâm</span>
              </div>
            </div>
            
            <button className="absolute top-4 right-4">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </TabsContent>
        
        <TabsContent value="info" className="mt-4">
          <div className="bg-white rounded-2xl p-6 text-center">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Chưa có thông tin mới</p>
          </div>
        </TabsContent>
        
        <TabsContent value="suggestions" className="mt-4">
          <div className="bg-white rounded-2xl p-6 text-center">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Chưa có gợi ý nào</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
