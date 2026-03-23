import React, { useState } from 'react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'number' | 'checkbox' | 'date';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
}

export interface FormSection {
  title: string;
  fields: FormField[];
}

interface SectionedFormProps {
  sections: FormSection[];
  initialData?: Record<string, any>;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function SectionedForm({ 
  sections, 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  isLoading, 
  submitLabel = 'Save Changes' 
}: SectionedFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {sections.map((section, sIdx) => (
        <div key={sIdx} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{section.title}</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                ) : field.type === 'select' ? (
                  <select
                    name={field.name}
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="">{field.placeholder || 'Select an option'}</option>
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <div className="flex items-center h-10">
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={!!formData[field.name]}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">{field.placeholder || 'Enabled'}</span>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end items-center gap-4 pt-4 pb-12">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-700 font-medium hover:text-gray-900 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-md active:scale-95 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
