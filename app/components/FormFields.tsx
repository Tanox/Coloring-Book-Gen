// File: /workspace/app/components/FormFields.tsx v1.1.2
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormSelectFieldProps {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: any) => void;
  options: { value: string; label: string }[];
}

export const FormSelectField: React.FC<FormSelectFieldProps> = ({ id, icon: Icon, label, value, onChange, options }) => {
  const inputClasses = "w-full px-5 py-4 bg-orange-50/50 border-2 border-orange-100 rounded-2xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all text-lg font-medium placeholder:text-orange-200/70 text-slate-700";
  const labelClasses = "flex items-center gap-2 text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide";

  return (
    <div>
      <label htmlFor={id} className={labelClasses}>
        <Icon className="w-5 h-5 text-orange-400" />
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClasses} appearance-none cursor-pointer`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-orange-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

interface FormInputFieldProps {
  id: string;
  icon: LucideIcon;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export const FormInputField: React.FC<FormInputFieldProps> = ({ id, icon: Icon, label, placeholder, value, onChange }) => {
  const inputClasses = "w-full px-5 py-4 bg-orange-50/50 border-2 border-orange-100 rounded-2xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all text-lg font-medium placeholder:text-orange-200/70 text-slate-700";
  const labelClasses = "flex items-center gap-2 text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide";

  return (
    <div>
      <label htmlFor={id} className={labelClasses}>
        <Icon className="w-5 h-5 text-orange-400" />
        {label}
      </label>
      <input
        type="text"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className={inputClasses}
      />
    </div>
  );
};
