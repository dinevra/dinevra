import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MapPin } from 'lucide-react';
import PageHeader from '../../../shared/ui/PageHeader';
import { locationsApi, Location } from '../../../features/locations/locationsApi';
import LocationCard from './LocationCard';
import { toast } from 'react-hot-toast';

export default function LocationsList() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchLocations();
  }, [statusFilter]);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const data = await locationsApi.list(statusFilter ? { status: statusFilter } : undefined);
      setLocations(data.locations);
    } catch (e) {
      toast.error('Failed to load locations');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(search.toLowerCase()) ||
    loc.city.toLowerCase().includes(search.toLowerCase()) ||
    loc.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Locations" 
          description="Manage your physical regional entities and outlets."
        />
        <button 
          onClick={() => navigate('/admin/locations/new')}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 active:scale-95 whitespace-nowrap"
        >
          <Plus size={18} />
          Add Location
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, city or code..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border-none rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map(loc => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
            <MapPin size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No locations found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
