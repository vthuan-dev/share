import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileText, Lightbulb } from 'lucide-react';

export default function InfoTabs() {
  return (
    <div className="mt-6">
      <h2 className="mb-3">Thông tin dành riêng cho bạn</h2>
      
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full bg-gray-100 rounded-2xl p-1 h-auto">
          <TabsTrigger value="info" className="flex-1 rounded-xl data-[state=active]:bg-white">
            <FileText className="w-4 h-4 mr-1" />
            Thông tin
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex-1 rounded-xl data-[state=active]:bg-white">
            <Lightbulb className="w-4 h-4 mr-1" />
            Gợi ý
          </TabsTrigger>
        </TabsList>
        
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
