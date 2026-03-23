import React from 'react';
import { ChefHat, Users, Clock, ArrowRight } from 'lucide-react';
import { Kitchen } from '../../../features/kitchens/kitchensApi';

interface KitchenCardProps {
  kitchen: Kitchen;
  onClick: (id: string) => void;
}

export default function KitchenCard({ kitchen, onClick }: KitchenCardProps) {
  const isInactive = kitchen.status === 'inactive' || kitchen.status === 'deleted';

  return (
    <div 
      onClick={() => onClick(kitchen.id)}
      className={`group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] ${isInactive ? 'opacity-60 grayscale-[0.5]' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${isInactive ? 'bg-gray-100 text-gray-400' : 'bg-indigo-50 text-indigo-600'}`}>
          <ChefHat size={20} />
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
          isInactive ? 'bg-gray-100 text-gray-400' : 'bg-green-50 text-green-600'
        }`}>
          {kitchen.status}
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {kitchen.name}
        </h3>
        <p className="text-xs text-gray-400 font-mono tracking-tighter uppercase">
          {kitchen.code || 'NO-CODE'} • {kitchen.type || 'Standard'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2 text-gray-500">
          <Users size={14} className="text-gray-300" />
          <span className="text-xs font-medium">{kitchen.capacity_per_slot || 0} slots</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Clock size={14} className="text-gray-300" />
          <span className="text-xs font-medium">{kitchen.avg_prep_time_mins || 15}m prep</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs font-bold uppercase tracking-widest">Manage Kitchen</span>
        <ArrowRight size={14} />
      </div>
    </div>
  );
}
