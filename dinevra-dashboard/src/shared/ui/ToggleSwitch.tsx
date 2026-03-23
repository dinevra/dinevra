import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export default function ToggleSwitch({ checked, onChange, label, description, disabled = false }: ToggleSwitchProps) {
  return (
    <label className={`flex items-start cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="relative flex-shrink-0 mt-1">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
      </div>
      {(label || description) && (
        <div className="ml-3">
          {label && <span className="text-sm font-medium text-gray-900">{label}</span>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      )}
    </label>
  );
}
