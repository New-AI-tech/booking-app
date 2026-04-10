import React from 'react';
import { Dress } from '../types';
import { AvailabilityChecker } from './AvailabilityChecker';
import { Tag } from 'lucide-react';

interface Props {
  dress: Dress;
}

export const DressCard: React.FC<Props> = ({ dress }) => {
  return (
    <div className="luxury-card overflow-hidden flex flex-col md:flex-row h-full">
      <div className="md:w-1/3 relative h-64 md:h-auto">
        <img
          src={dress.imageUrl || `https://picsum.photos/seed/${dress.name}/600/800`}
          alt={dress.name}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] uppercase tracking-widest font-bold shadow-sm">
            {dress.category}
          </span>
        </div>
      </div>
      
      <div className="md:w-2/3 p-6 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl serif font-medium text-stone-900">{dress.name}</h3>
          <div className="text-right">
            <span className="text-xl font-serif font-semibold">${dress.basePrice}</span>
            <span className="text-xs text-stone-500 block">/ day</span>
          </div>
        </div>
        
        <p className="text-stone-600 text-sm mb-6 line-clamp-2">{dress.description}</p>
        
        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Tag className="w-3 h-3" />
            <span>{dress.cleaningBufferDays} day cleaning buffer included</span>
          </div>
          
          <div className="pt-4 border-t border-stone-100">
            <AvailabilityChecker dress={dress} />
          </div>
        </div>
      </div>
    </div>
  );
}
