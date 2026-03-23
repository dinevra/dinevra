import React from 'react';
import { MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { Location } from '../../../features/locations/locationsApi';
import { useNavigate } from 'react-router-dom';

interface LocationCardProps {
  location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/admin/locations/${location.id}`)}
      className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition tracking-tight">
            {location.name}
          </h3>
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">{location.code || 'NO CODE'}</span>
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${
          location.status === 'active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-50 text-gray-500 border border-gray-100'
        }`}>
          {location.status}
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={14} className="text-gray-400" />
          <span className="truncate">{location.city}, {location.country}</span>
        </div>
        {location.contact_phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={14} className="text-gray-400" />
            <span>{location.contact_phone}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex gap-1.5">
          {location.supports_pickup && <div className="w-2 h-2 rounded-full bg-blue-400" title="Pickup" />}
          {location.supports_delivery && <div className="w-2 h-2 rounded-full bg-purple-400" title="Delivery" />}
          {location.supports_dine_in && <div className="w-2 h-2 rounded-full bg-orange-400" title="Dine-in" />}
        </div>
        <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-400 transition transform group-hover:translate-x-1" />
      </div>
    </div>
  );
}
