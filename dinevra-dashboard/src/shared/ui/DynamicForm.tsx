import React, { useState } from 'react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'number';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
}

interface DynamicFormProps {
  fields: FormField[];
  submitLabel?: string;
  onSubmit: (data: Record<string, any>) => void;
  isLoading?: boolean;
}

export default function DynamicForm({ fields, submitLabel = 'Submit', onSubmit, isLoading }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;
    if (type === 'number') {
      val = value ? parseFloat(value) : 0;
    }
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          
          {field.type === 'textarea' ? (
            <textarea
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          ) : field.type === 'select' ? (
            <select
              name={field.name}
              required={field.required}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              <option value="">{field.placeholder || 'Select an option'}</option>
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          )}
        </div>
      ))}

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
