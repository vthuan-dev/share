import { ChevronDown, Coins } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
}

export default function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <Coins className="w-5 h-5 text-red-600" />
          </div>
          <span className="text-lg">{balance.toLocaleString()} đ</span>
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}
